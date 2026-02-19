'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import type {SpotifyTrack} from '@/lib/spotify';
import {FaSpotify} from 'react-icons/fa';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';

export function SpotifyNowPlaying({track}: {track: SpotifyTrack | null}) {
  if (!track) {
    return (
      <AnimatedReveal className="h-full">
        <StatCard className="justify-center items-center gap-3">
          <FaSpotify className="text-white/20" size={32} />
          <p className="text-sm text-white/30">Not playing</p>
        </StatCard>
      </AnimatedReveal>
    );
  }

  return (
    <motion.a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="motion-pre-hidden animated-border block border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 h-full hover:border-transparent transition-all duration-500 group"
    >
      <div className="flex items-center gap-2 mb-4">
        <FaSpotify className="text-[#1DB954]" size={16} />
        <span className="text-xs text-white/40 uppercase tracking-wider">
          {track.isPlaying ? 'Now Playing' : 'Recently Played'}
        </span>
        {track.isPlaying && (
          <span className="flex gap-[2px] items-end h-3 ml-auto">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[3px] bg-[#1DB954] rounded-full animate-pulse"
                style={{
                  height: `${8 + i * 2}px`,
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {track.albumImageUrl && (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
            <Image
              src={track.albumImageUrl}
              alt={track.album}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm text-white/90 font-medium truncate group-hover:text-brand-400 transition-colors">
            {track.title}
          </p>
          <p className="text-xs text-white/50 truncate mt-0.5">{track.artist}</p>
          <p className="text-xs text-white/30 truncate mt-0.5">{track.album}</p>
        </div>
      </div>
    </motion.a>
  );
}
