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

function formatTime(timezone: string) {
  return new Date().toLocaleTimeString('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function WorldClock() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const next: Record<string, string> = {};
      for (const city of CITIES) {
        next[city.timezone] = formatTime(city.timezone);
      }
      setTimes(next);
    };
    update();
    const interval = setInterval(update, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-6 sm:gap-10 text-xs font-mono text-white/20">
        {CITIES.map((city) => (
          <div key={city.label} className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[10px] uppercase tracking-widest">{city.label}</span>
            <span className="tabular-nums">--:--</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-6 sm:gap-10 text-xs font-mono text-white/20">
      {CITIES.map((city) => (
        <div key={city.label} className="flex flex-col items-center gap-1">
          <span className="text-white/30 text-[10px] uppercase tracking-widest">{city.label}</span>
          <span className="tabular-nums">{times[city.timezone] ?? '--:--'}</span>
        </div>
      ))}
    </div>
  );
}
