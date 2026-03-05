import {ImageResponse} from 'next/og';
import {getThoughtBySlug} from '@/lib/thoughts';
import {siteConfig} from '@/config/site';

export const alt = 'Thought article';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function OgImage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const thought = await getThoughtBySlug(slug);
  if (!thought) {
    return new ImageResponse(
      <div style={{display: 'flex', width: '100%', height: '100%', background: '#000', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 48}}>
        Not found
      </div>,
      {...size},
    );
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: '#000',
        color: '#fff',
        padding: '60px 80px',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Subtle dot grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top: site name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: 18,
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '40px',
        }}
      >
        <span style={{color: '#34d399', fontWeight: 700}}>$</span>
        <span>{siteConfig.name}</span>
        <span style={{color: 'rgba(255,255,255,0.15)'}}>~/thoughts</span>
      </div>

      {/* Title */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            maxWidth: '900px',
          }}
        >
          {thought.title}
        </div>
      </div>

      {/* Bottom: metadata row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: 20,
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <span style={{fontFamily: 'monospace'}}>{thought.date}</span>
        <span style={{color: 'rgba(255,255,255,0.15)'}}>|</span>
        <span>{thought.readingTime} min read</span>
        <span style={{color: 'rgba(255,255,255,0.15)'}}>|</span>
        <span>{thought.wordCount.toLocaleString()} words</span>
        <span style={{color: 'rgba(255,255,255,0.15)'}}>|</span>
        {thought.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(52,211,153,0.3)',
              color: '#34d399',
              fontSize: 16,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(to right, #34d399, #10b981, transparent)',
        }}
      />
    </div>,
    {...size},
  );
}
