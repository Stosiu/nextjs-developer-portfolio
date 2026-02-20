'use client';

import {StatCard} from '@/components/ui/stat-card';

function Pulse({className}: {className?: string}) {
  return <div className={`animate-pulse rounded bg-white/[0.06] ${className ?? ''}`} />;
}

export function HeatmapSkeleton() {
  return (
    <StatCard className="gap-4">
      <div className="flex items-center justify-between">
        <Pulse className="h-5 w-40" />
        <Pulse className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-[repeat(52,1fr)] gap-[3px]">
        {Array.from({length: 364}).map((_, i) => (
          <div key={i} className="aspect-square rounded-[2px] bg-white/[0.04]" />
        ))}
      </div>
      <div className="flex gap-6">
        <Pulse className="h-4 w-28" />
        <Pulse className="h-4 w-28" />
        <Pulse className="h-4 w-28" />
      </div>
    </StatCard>
  );
}

export function SpotifySkeleton() {
  return (
    <StatCard className="justify-center items-center gap-3">
      <Pulse className="h-8 w-8 rounded-full" />
      <Pulse className="h-4 w-20" />
    </StatCard>
  );
}

export function AiTokensSkeleton() {
  return (
    <StatCard className="gap-4">
      <div className="flex items-center justify-between">
        <Pulse className="h-5 w-32" />
        <Pulse className="h-4 w-20" />
      </div>
      <Pulse className="h-8 w-48" />
      <Pulse className="h-24 w-full rounded-lg" />
      <div className="flex gap-4">
        <Pulse className="h-4 w-20" />
        <Pulse className="h-4 w-20" />
      </div>
    </StatCard>
  );
}

export function SmallCardSkeleton() {
  return (
    <StatCard className="gap-3">
      <Pulse className="h-4 w-24" />
      <Pulse className="h-8 w-32" />
      <Pulse className="h-12 w-full rounded-lg" />
    </StatCard>
  );
}

export function LanguagesSkeleton() {
  return (
    <StatCard className="gap-4">
      <Pulse className="h-5 w-36" />
      <Pulse className="h-3 w-full rounded-full" />
      <div className="flex flex-wrap gap-3">
        {Array.from({length: 6}).map((_, i) => (
          <Pulse key={i} className="h-4 w-20" />
        ))}
      </div>
    </StatCard>
  );
}
