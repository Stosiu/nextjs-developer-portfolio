'use client';

import {useEffect, useState} from 'react';

const CITIES = [
  {label: 'SFO', timezone: 'America/Los_Angeles'},
  {label: 'NYC', timezone: 'America/New_York'},
  {label: 'LHR', timezone: 'Europe/London'},
  {label: 'WAW', timezone: 'Europe/Warsaw'},
  {label: 'RUH', timezone: 'Asia/Riyadh'},
  {label: 'SYD', timezone: 'Australia/Sydney'},
] as const;

const WAW_TIMEZONE = 'Europe/Warsaw';

function formatTime(timezone: string) {
  return new Date().toLocaleTimeString('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getHourInTimezone(timezone: string): number {
  return Number.parseInt(
    new Date().toLocaleTimeString('en-GB', {timeZone: timezone, hour: '2-digit', hour12: false}),
    10,
  );
}

function getUtcOffsetMinutes(timezone: string): number {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number.parseInt(parts.find((p) => p.type === type)!.value, 10);

  const tzDate = new Date(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  const utcDate = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  );

  return Math.round((tzDate.getTime() - utcDate.getTime()) / 60_000);
}

function getVisitorComment(visitorTz: string): string {
  if (visitorTz === WAW_TIMEZONE || visitorTz === 'Europe/Berlin' || visitorTz === 'Europe/Paris') {
    const wawOffset = getUtcOffsetMinutes(WAW_TIMEZONE);
    const visitorOffset = getUtcOffsetMinutes(visitorTz);
    if (wawOffset === visitorOffset) return "hey neighbor! 👋";
  }

  const wawHour = getHourInTimezone(WAW_TIMEZONE);

  if (wawHour >= 0 && wawHour < 7) return "I'm probably asleep. you're not.";
  if (wawHour >= 23) return "I should be asleep soon";

  const offsetDiff = Math.abs(getUtcOffsetMinutes(visitorTz) - getUtcOffsetMinutes(WAW_TIMEZONE));
  const hourDiff = Math.round(offsetDiff / 60);

  if (hourDiff === 0) return "hey neighbor! 👋";
  if (hourDiff <= 2) return "almost same coffee break";
  if (hourDiff <= 5) return "one of us is having lunch";
  if (hourDiff <= 8) return "when you wake up, I'm winding down";
  if (hourDiff <= 11) return "we live in different days, basically";
  return "peak timezone chaos";
}

export function WorldClock() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [visitor, setVisitor] = useState<{timezone: string; comment: string} | null>(null);

  useEffect(() => {
    setMounted(true);

    const visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const update = () => {
      const next: Record<string, string> = {};
      for (const city of CITIES) {
        next[city.timezone] = formatTime(city.timezone);
      }
      next[visitorTz] = formatTime(visitorTz);
      setTimes(next);
      setVisitor({timezone: visitorTz, comment: getVisitorComment(visitorTz)});
    };
    update();
    const interval = setInterval(update, 10_000);
    return () => clearInterval(interval);
  }, []);

  const cityEntry = (label: string, time: string, variant: 'default' | 'brand' = 'default') => (
    <div key={label} className="flex flex-col items-center gap-1">
      <span className={`text-[10px] uppercase tracking-widest ${variant === 'brand' ? 'text-brand-400' : 'text-white/30'}`}>
        {label}
      </span>
      <span className={`tabular-nums ${variant === 'brand' ? 'text-brand-400/60' : ''}`}>{time}</span>
    </div>
  );

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 justify-items-center gap-y-4 gap-x-6 sm:flex sm:justify-center sm:gap-10 text-xs font-mono text-white/20">
        {CITIES.map((city) => cityEntry(city.label, '--:--'))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-xs font-mono text-white/20">
      <div className="grid grid-cols-3 justify-items-center gap-y-4 gap-x-6 sm:flex sm:justify-center sm:gap-10">
        {CITIES.map((city) => cityEntry(city.label, times[city.timezone] ?? '--:--'))}
        {visitor && (
          <div className="group relative col-span-3 flex flex-col items-center gap-1 sm:col-span-1">
            <span className="text-brand-400 text-[10px] uppercase tracking-widest flex items-center gap-1">
              YOU
              <svg className="hidden sm:block size-2.5 text-brand-500/40" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.75 12h-1.5V7h1.5v5zm0-6.5h-1.5V4h1.5v1.5z" />
              </svg>
            </span>
            <span className="tabular-nums text-brand-400/60">{times[visitor.timezone] ?? '--:--'}</span>
            <span className="text-brand-500/40 text-[9px] italic sm:hidden">{visitor.comment}</span>
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden sm:block whitespace-nowrap rounded bg-white/10 px-2.5 py-1 text-[9px] italic text-brand-400 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
              {visitor.comment}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
