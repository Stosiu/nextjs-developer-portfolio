import {execFileSync, execSync} from 'node:child_process';
import {existsSync, mkdirSync, unlinkSync, writeFileSync} from 'node:fs';
import {homedir, platform} from 'node:os';
import {join, resolve, dirname} from 'node:path';
import {createInterface} from 'node:readline';
import pc from 'picocolors';
import ora from 'ora';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROJECT_DIR = resolve(dirname(new URL(import.meta.url).pathname), '..');
const HOME = homedir();
const OS = platform();
const ARGS = process.argv.slice(2);

// macOS
const LAUNCHD_LABEL = 'com.stosiu.upload-ai';
const LAUNCHD_PLIST = join(HOME, 'Library', 'LaunchAgents', `${LAUNCHD_LABEL}.plist`);
const LAUNCHD_LOG_DIR = join(HOME, 'Library', 'Logs', 'upload-ai');
const LAUNCHD_GUI = OS === 'darwin'
  ? `gui/${execSync('id -u').toString().trim()}`
  : '';
const SHELL_PATH = process.env.SHELL || '/bin/zsh';

// Linux
const CRON_MARKER = '# upload-ai-stats';

// Windows
const SCHTASK_NAME = 'UploadAIStats';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ask(question: string): Promise<string> {
  const rl = createInterface({input: process.stdin, output: process.stdout});
  return new Promise((r) => {
    rl.question(question, (a) => {
      rl.close();
      r(a.trim());
    });
  });
}

function exec(cmd: string): string {
  return execSync(cmd, {encoding: 'utf-8'}).trim();
}

function tryExec(cmd: string): string | null {
  try {
    return exec(cmd);
  } catch {
    return null;
  }
}

function detectPnpm(): string | null {
  if (OS === 'win32') {
    return tryExec('where pnpm')?.split('\n')[0] ?? null;
  }
  return tryExec('which pnpm') ? 'pnpm' : null;
}

// ---------------------------------------------------------------------------
// macOS — launchd
// ---------------------------------------------------------------------------

function macosIsInstalled(): boolean {
  const list = tryExec('launchctl list');
  return list ? list.includes(LAUNCHD_LABEL) : false;
}

function macosUninstall(): void {
  if (!macosIsInstalled()) return;
  try { execFileSync('launchctl', ['bootout', `${LAUNCHD_GUI}/${LAUNCHD_LABEL}`]); } catch { /* may already be unloaded */ }
  if (existsSync(LAUNCHD_PLIST)) unlinkSync(LAUNCHD_PLIST);
}

function macosInstall(_pnpmPath: string, hour: number, minute: number): void {
  mkdirSync(LAUNCHD_LOG_DIR, {recursive: true});
  macosUninstall();

  // Use a login shell so nvm/fnm/volta/etc. are available — no hardcoded paths.
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${LAUNCHD_LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${SHELL_PATH}</string>
        <string>-l</string>
        <string>-c</string>
        <string>cd "${PROJECT_DIR}" &amp;&amp; pnpm upload:ai</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>${hour}</integer>
        <key>Minute</key>
        <integer>${minute}</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>${LAUNCHD_LOG_DIR}/stdout.log</string>
    <key>StandardErrorPath</key>
    <string>${LAUNCHD_LOG_DIR}/stderr.log</string>
</dict>
</plist>`;

  writeFileSync(LAUNCHD_PLIST, plist);
  execFileSync('launchctl', ['bootstrap', LAUNCHD_GUI, LAUNCHD_PLIST]);
}

function macosPostInstall(): void {
  console.log();
  console.log(pc.dim('  Also runs on login (RunAtLoad)'));
  console.log();
  console.log(pc.bold('  Commands'));
  console.log(`  ${pc.dim('Run now')}     launchctl kickstart ${LAUNCHD_GUI}/${LAUNCHD_LABEL}`);
  console.log(`  ${pc.dim('Status')}      launchctl print ${LAUNCHD_GUI}/${LAUNCHD_LABEL}`);
  console.log(`  ${pc.dim('Logs')}        tail -f ${LAUNCHD_LOG_DIR}/stdout.log`);
  console.log(`  ${pc.dim('Uninstall')}   pnpm setup:cron --uninstall`);
}

// ---------------------------------------------------------------------------
// Linux — crontab
// ---------------------------------------------------------------------------

function linuxIsInstalled(): boolean {
  const crontab = tryExec('crontab -l');
  return crontab ? crontab.includes(CRON_MARKER) : false;
}

function linuxUninstall(): void {
  if (!linuxIsInstalled()) return;
  const crontab = tryExec('crontab -l') ?? '';
  const filtered = crontab
    .split('\n')
    .filter((line) => !line.includes(CRON_MARKER))
    .join('\n')
    .trim();
  if (filtered) {
    execSync(`echo "${filtered}" | crontab -`);
  } else {
    execSync('crontab -r');
  }
}

function linuxInstall(pnpmPath: string, hour: number, minute: number): void {
  linuxUninstall();
  const existing = tryExec('crontab -l') ?? '';
  const entry = `${minute} ${hour} * * * cd "${PROJECT_DIR}" && "${pnpmPath}" upload:ai >> "${HOME}/.local/share/upload-ai/cron.log" 2>&1 ${CRON_MARKER}`;
  const newCrontab = existing ? `${existing}\n${entry}` : entry;

  mkdirSync(join(HOME, '.local', 'share', 'upload-ai'), {recursive: true});
  execSync(`echo "${newCrontab}" | crontab -`);
}

function linuxPostInstall(): void {
  const logPath = join(HOME, '.local', 'share', 'upload-ai', 'cron.log');
  console.log();
  console.log(pc.bold('  Commands'));
  console.log(`  ${pc.dim('Verify')}      crontab -l`);
  console.log(`  ${pc.dim('Logs')}        tail -f ${logPath}`);
  console.log(`  ${pc.dim('Uninstall')}   pnpm setup:cron --uninstall`);
}

// ---------------------------------------------------------------------------
// Windows — Task Scheduler
// ---------------------------------------------------------------------------

function windowsIsInstalled(): boolean {
  const result = tryExec(`schtasks /Query /TN "${SCHTASK_NAME}" /FO LIST`);
  return result !== null;
}

function windowsUninstall(): void {
  if (!windowsIsInstalled()) return;
  tryExec(`schtasks /Delete /TN "${SCHTASK_NAME}" /F`);
}

function windowsInstall(pnpmPath: string, hour: number, minute: number): void {
  windowsUninstall();
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  execSync(
    `schtasks /Create /TN "${SCHTASK_NAME}" /TR "cmd /c cd /d \\"${PROJECT_DIR}\\" && \\"${pnpmPath}\\" upload:ai" /SC DAILY /ST ${time} /F`,
  );
}

function windowsPostInstall(): void {
  console.log();
  console.log(pc.bold('  Commands'));
  console.log(`  ${pc.dim('Run now')}     schtasks /Run /TN "${SCHTASK_NAME}"`);
  console.log(`  ${pc.dim('Status')}      schtasks /Query /TN "${SCHTASK_NAME}" /FO LIST /V`);
  console.log(`  ${pc.dim('Uninstall')}   pnpm setup:cron --uninstall`);
}

// ---------------------------------------------------------------------------
// Platform dispatch
// ---------------------------------------------------------------------------

type PlatformOps = {
  name: string;
  isInstalled: () => boolean;
  install: (pnpmPath: string, hour: number, minute: number) => void;
  uninstall: () => void;
  postInstall: () => void;
  logPath: string;
};

function getPlatform(): PlatformOps {
  switch (OS) {
    case 'darwin':
      return {
        name: 'macOS (launchd)',
        isInstalled: macosIsInstalled,
        install: macosInstall,
        uninstall: macosUninstall,
        postInstall: macosPostInstall,
        logPath: LAUNCHD_LOG_DIR + '/',
      };
    case 'linux':
      return {
        name: 'Linux (crontab)',
        isInstalled: linuxIsInstalled,
        install: linuxInstall,
        uninstall: linuxUninstall,
        postInstall: linuxPostInstall,
        logPath: join(HOME, '.local', 'share', 'upload-ai', 'cron.log'),
      };
    case 'win32':
      return {
        name: 'Windows (Task Scheduler)',
        isInstalled: windowsIsInstalled,
        install: windowsInstall,
        uninstall: windowsUninstall,
        postInstall: windowsPostInstall,
        logPath: 'Event Viewer',
      };
    default:
      console.log(pc.red(`  Unsupported platform: ${OS}`));
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Uninstall
// ---------------------------------------------------------------------------

async function uninstall(plat: PlatformOps) {
  console.log();
  console.log(pc.bold('  Upload AI Stats — Cron Uninstall'));
  console.log();

  if (!plat.isInstalled()) {
    console.log(pc.dim('  No scheduled task found. Nothing to do.'));
    console.log();
    return;
  }

  const confirm = await ask(`  Remove scheduled task? [${pc.green('Y')}/n] `);
  if (confirm !== '' && !/^[Yy]$/.test(confirm)) {
    console.log(pc.dim('  Aborted.'));
    return;
  }

  const spinner = ora('Removing scheduled task').start();
  plat.uninstall();
  spinner.succeed('Scheduled task removed');
  console.log();
}

// ---------------------------------------------------------------------------
// Install
// ---------------------------------------------------------------------------

async function install(plat: PlatformOps) {
  console.log();
  console.log(pc.bold('  Upload AI Stats — Cron Setup'));
  console.log(pc.dim(`  Schedules daily pnpm upload:ai via ${plat.name}`));
  console.log();

  const spinner = ora('Detecting pnpm').start();
  const pnpmPath = detectPnpm();
  if (!pnpmPath) {
    spinner.fail(pc.red('pnpm not found in PATH'));
    process.exit(1);
  }
  spinner.succeed(`pnpm found`);

  // Check existing
  if (plat.isInstalled()) {
    console.log(pc.yellow('  Existing task detected — it will be replaced.'));
  }

  // Schedule
  console.log();
  const hourInput = await ask(`  Hour to run ${pc.dim('(0-23)')} [${pc.cyan('10')}]: `);
  const hour = hourInput === '' ? 10 : parseInt(hourInput, 10);
  if (isNaN(hour) || hour < 0 || hour > 23) {
    console.log(pc.red('  Invalid hour.'));
    process.exit(1);
  }

  const minuteInput = await ask(`  Minute to run ${pc.dim('(0-59)')} [${pc.cyan('0')}]: `);
  const minute = minuteInput === '' ? 0 : parseInt(minuteInput, 10);
  if (isNaN(minute) || minute < 0 || minute > 59) {
    console.log(pc.red('  Invalid minute.'));
    process.exit(1);
  }

  // Summary
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  console.log();
  console.log(pc.bold('  Summary'));
  console.log(`  ${pc.dim('Platform')}   ${plat.name}`);
  console.log(`  ${pc.dim('Schedule')}   daily at ${pc.green(time)}`);
  console.log(`  ${pc.dim('pnpm')}       ${pc.cyan(pnpmPath)}`);
  console.log(`  ${pc.dim('Project')}    ${pc.cyan(PROJECT_DIR)}`);
  console.log(`  ${pc.dim('Logs')}       ${pc.cyan(plat.logPath)}`);
  console.log();

  const confirm = await ask(`  Install? [${pc.green('Y')}/n] `);
  if (confirm !== '' && !/^[Yy]$/.test(confirm)) {
    console.log(pc.dim('  Aborted.'));
    process.exit(0);
  }

  // Install
  const installSpinner = ora('Installing scheduled task').start();
  plat.install(pnpmPath, hour, minute);
  installSpinner.succeed('Scheduled task installed');

  plat.postInstall();
  console.log();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const plat = getPlatform();

if (ARGS.includes('--uninstall')) {
  uninstall(plat);
} else {
  install(plat);
}
