import 'dotenv/config';
import {execSync} from 'node:child_process';
import {uploadToBlob, triggerRevalidation, pc, ora} from './lib/blob-upload';
import {
  aggregate,
  emptyAiStats,
  fmt,
  type CcusageDailyResponse,
  type CcusageSessionResponse,
} from './lib/ai-stats-aggregator';
import type {AiStats} from '../src/data/stats-types';

const AI_BLOB_PATH = 'stats/ai.json';

function runCcusage<T>(subcommand: 'daily' | 'session'): T | null {
  try {
    const output = execSync(`npx --yes ccusage ${subcommand} --json`, {
      encoding: 'utf-8',
      timeout: 120_000,
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
    });
    return JSON.parse(output) as T;
  } catch {
    return null;
  }
}

async function main() {
  console.log();
  console.log(pc.bold('  Claude Code Usage Stats'));
  console.log(pc.dim('  ─────────────────────────'));
  console.log();

  const dailySpinner = ora('Fetching daily usage from ccusage').start();
  const daily = runCcusage<CcusageDailyResponse>('daily');
  if (!daily) {
    dailySpinner.fail(pc.red('ccusage daily failed. Uploading empty stats.'));
    const empty: AiStats = {lastUpdated: new Date().toISOString(), ...emptyAiStats()};
    await uploadToBlob(AI_BLOB_PATH, empty);
    return;
  }
  dailySpinner.succeed('Daily usage fetched');

  const sessionSpinner = ora('Fetching session count from ccusage').start();
  const sessions = runCcusage<CcusageSessionResponse>('session') ?? [];
  sessionSpinner.succeed('Session count fetched');

  const aggregateSpinner = ora('Aggregating stats').start();
  const aggregated = aggregate({daily, sessions, referenceDate: new Date()});
  aggregateSpinner.succeed('Stats aggregated');

  const data: AiStats = {
    lastUpdated: new Date().toISOString(),
    ...aggregated,
  };

  console.log();
  console.log(`  ${pc.dim('Tokens')}    ${pc.bold(pc.cyan(fmt(data.totalTokens)))} total  ${pc.bold(pc.cyan(fmt(data.tokensLast30d)))} last 30d`);
  console.log(`  ${pc.dim('Cost')}      ${pc.bold(pc.cyan('$' + data.totalCost.toFixed(2)))} total  ${pc.bold(pc.cyan('$' + data.costLast30d.toFixed(2)))} last 30d`);
  console.log(`  ${pc.dim('Sessions')}  ${pc.bold(String(data.totalSessions))}`);
  console.log(`  ${pc.dim('Split')}     ${pc.bold(data.inputPercentage + '%')} input  ${pc.bold((100 - data.inputPercentage).toFixed(2) + '%')} output`);
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
