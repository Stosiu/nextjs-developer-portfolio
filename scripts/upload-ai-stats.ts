import 'dotenv/config';
import {execSync} from 'node:child_process';
import {uploadToBlob, fetchBlobJson, triggerRevalidation, pc, ora} from './lib/blob-upload';
import {
  aggregate,
  dailyArray,
  mergeDailyHistory,
  fmt,
  type CcusageDailyEntry,
  type CcusageDailyResponse,
  type CcusageSessionResponse,
} from './lib/ai-stats-aggregator';
import type {AiStats} from '../src/data/stats-types';

const AI_BLOB_PATH = 'stats/ai.json';
const DAILY_HISTORY_BLOB_PATH = 'stats/daily-history.json';

// Pinned so cost figures don't drift between runs when ccusage updates its pricing tables.
const CCUSAGE_VERSION = '20.0.4';

// Retry transient failures (registry/network blips when the machine is waking for a
// scheduled run). On final failure we return null and the caller rebuilds from stored
// history instead of losing data.
function runCcusage<T>(subcommand: 'daily' | 'session'): T | null {
  const attempts = 3;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const output = execSync(`npx --yes ccusage@${CCUSAGE_VERSION} ${subcommand} --json`, {
        encoding: 'utf-8',
        timeout: 120_000,
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 64 * 1024 * 1024,
      });
      return JSON.parse(output) as T;
    } catch (err) {
      const reason = (err instanceof Error ? err.message : String(err)).split('\n')[0];
      if (attempt < attempts) {
        ora().warn(pc.yellow(`ccusage ${subcommand} attempt ${attempt}/${attempts} failed: ${reason}`));
        continue;
      }
      ora().fail(pc.red(`ccusage ${subcommand} failed after ${attempts} attempts: ${reason}`));
      return null;
    }
  }
  return null;
}

async function main() {
  console.log();
  console.log(pc.bold('  Claude Code Usage Stats'));
  console.log(pc.dim('  ─────────────────────────'));
  console.log();

  const dailySpinner = ora('Fetching daily usage from ccusage').start();
  const daily = runCcusage<CcusageDailyResponse>('daily');
  const localDaily = daily ? dailyArray(daily) : [];
  if (daily) {
    dailySpinner.succeed('Daily usage fetched');
  } else {
    dailySpinner.warn(pc.yellow('ccusage daily unavailable — rebuilding from stored history (no data lost)'));
  }

  const sessionSpinner = ora('Fetching session count from ccusage').start();
  const sessions = runCcusage<CcusageSessionResponse>('session') ?? [];
  sessionSpinner.succeed('Session count fetched');

  const mergeSpinner = ora('Merging with cumulative history').start();
  const stored = (await fetchBlobJson<CcusageDailyEntry[]>(DAILY_HISTORY_BLOB_PATH)) ?? [];
  const mergedDaily = mergeDailyHistory(stored, localDaily);
  const newDates = mergedDaily.length - stored.length;
  mergeSpinner.succeed(
    `History merged ${pc.dim(`(${mergedDaily.length} days total, +${newDates} new)`)}`,
  );

  // Never publish zeros over good data. If there is genuinely nothing to show
  // (ccusage failed AND no stored history), leave the existing blobs untouched.
  if (mergedDaily.length === 0) {
    ora().warn(pc.yellow('No usage data available (ccusage failed, no stored history). Existing stats left untouched.'));
    return;
  }

  // Only rewrite durable history when we actually fetched fresh local data to add.
  if (localDaily.length > 0) {
    await uploadToBlob(DAILY_HISTORY_BLOB_PATH, mergedDaily);
  }

  const aggregateSpinner = ora('Aggregating stats').start();
  const aggregated = aggregate({daily: mergedDaily, sessions, referenceDate: new Date()});
  aggregateSpinner.succeed('Stats aggregated');

  // Session counts are per-machine and not stored in history. If the live count is
  // unavailable, keep the previously published value so the dashboard doesn't regress
  // to zero sessions while still showing the real token history.
  let totalSessions = aggregated.totalSessions;
  if (totalSessions === 0) {
    const previous = await fetchBlobJson<AiStats>(AI_BLOB_PATH);
    if (previous?.totalSessions) totalSessions = previous.totalSessions;
  }

  const data: AiStats = {
    lastUpdated: new Date().toISOString(),
    ...aggregated,
    totalSessions,
  };

  console.log();
  console.log(`  ${pc.dim('Tokens')}    ${pc.bold(pc.cyan(fmt(data.totalTokens)))} total  ${pc.bold(pc.cyan(fmt(data.tokensLast30d)))} last 30d`);
  console.log(`  ${pc.dim('Cost')}      ${pc.bold(pc.cyan('$' + data.totalCost.toFixed(2)))} total  ${pc.bold(pc.cyan('$' + data.costLast30d.toFixed(2)))} last 30d`);
  console.log(`  ${pc.dim('Sessions')}  ${pc.bold(String(data.totalSessions))}`);
  const totalForPct = data.totalTokens || 1;
  const pct = (n: number) => ((n / totalForPct) * 100).toFixed(1) + '%';
  console.log(`  ${pc.dim('Split')}     ${pc.bold(pct(data.totalCacheReadTokens))} cache read  ${pc.bold(pct(data.totalCacheWriteTokens))} cache write  ${pc.bold(pct(data.totalInputTokens))} input  ${pc.bold(pct(data.totalOutputTokens))} output`);
  console.log(`  ${pc.dim('Busiest')}   ${pc.bold(data.busiestDay)} ${pc.dim('(' + fmt(data.busiestDayAvgTokens) + ' avg)')}`);

  if (data.modelBreakdown.length > 0) {
    console.log(`  ${pc.dim('Models')}    ${data.modelBreakdown.map(m => `${pc.bold(m.model)} ${pc.dim(fmt(m.tokens))}`).join('  ')}`);
  }

  console.log();

  await uploadToBlob(AI_BLOB_PATH, data);
  await triggerRevalidation();

  console.log();
}

main().catch((err: Error) => {
  ora().fail(pc.red(`Failed to upload AI stats: ${err.message}`));
  process.exit(1);
});
