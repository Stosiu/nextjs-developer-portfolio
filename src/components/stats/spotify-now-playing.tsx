'use client';

import {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Image from 'next/image';
import type {SpotifyData} from '@/lib/spotify';
import {FaSpotify} from 'react-icons/fa';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';

function useDebouncedFetching(isFetching: boolean, minVisible = 800) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isFetching) {
      clearTimeout(timerRef.current);
      setVisible(true);
    } else if (visible) {
      timerRef.current = setTimeout(() => setVisible(false), minVisible);
    }
    return () => clearTimeout(timerRef.current);
  }, [isFetching, visible, minVisible]);

  return visible;
}

export function SpotifyNowPlaying({data, isFetching}: {data: SpotifyData; isFetching?: boolean}) {
  const showFetching = useDebouncedFetching(!!isFetching);
  const {nowPlaying, topTracks, topArtist} = data;
  const hasContent = nowPlaying || topTracks.length > 0 || topArtist;

  if (!hasContent) {
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
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="animated-border relative border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 h-full flex flex-col gap-4 overflow-hidden"
    >
      {/* Fetch indicator — shimmer bar with minimum visible time */}
      <div
        className={`absolute top-0 inset-x-0 h-[2px] overflow-hidden transition-opacity duration-700 ease-out ${showFetching ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-[#1DB954] to-transparent animate-[shimmer_1.2s_ease-in-out_infinite]" />
      </div>

      {/* Now Playing / Recently Played */}
      {nowPlaying && (
        <a
          href={nowPlaying.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="flex items-center gap-2 mb-3">
            <FaSpotify className="text-[#1DB954]" size={16} />
            <span className="text-xs text-white/40 uppercase tracking-wider">
              {nowPlaying.isPlaying ? 'Now Playing' : 'Recently Played'}
            </span>
            {nowPlaying.isPlaying && (
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

          <div className="flex items-center gap-3">
            {nowPlaying.albumImageUrl && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <Image
                  src={nowPlaying.albumImageUrl}
                  alt={nowPlaying.album}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-white/90 font-medium truncate group-hover:text-[#1DB954] transition-colors">
                {nowPlaying.title}
              </p>
              <p className="text-xs text-white/50 truncate mt-0.5">{nowPlaying.artist}</p>
            </div>
          </div>
        </a>
      )}

      {/* Top Track */}
      {topTracks[0] && (
        <div>
          {nowPlaying && <div className="border-t border-white/[0.06] mb-3" />}
          <a
            href={topTracks[0].songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group/track"
          >
            {topTracks[0].albumImageUrl && (
              <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <Image
                  src={topTracks[0].albumImageUrl}
                  alt={topTracks[0].title}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Top Song</p>
              <p className="text-xs text-white/70 truncate group-hover/track:text-[#1DB954] transition-colors font-medium">
                {topTracks[0].title}
              </p>
              <p className="text-[10px] text-white/25 truncate">{topTracks[0].artist}</p>
            </div>
          </a>
        </div>
      )}

      {/* Top Artist */}
      {topArtist && (
        <div>
          {(nowPlaying || topTracks.length > 0) && <div className="border-t border-white/[0.06] mb-3" />}
          <a
            href={topArtist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group/artist"
          >
            {topArtist.imageUrl && (
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/10">
                <Image
                  src={topArtist.imageUrl}
                  alt={topArtist.name}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Top Artist</p>
              <p className="text-xs text-white/70 truncate group-hover/artist:text-[#1DB954] transition-colors font-medium">
                {topArtist.name}
              </p>
              {topArtist.genres.length > 0 && (
                <p className="text-[10px] text-white/25 truncate">{topArtist.genres.join(' · ')}</p>
              )}
            </div>
          </a>
        </div>
      )}
    </motion.div>
  );
}
