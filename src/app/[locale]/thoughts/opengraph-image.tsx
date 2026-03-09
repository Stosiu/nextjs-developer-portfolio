import {ImageResponse} from 'next/og';
import {getTranslations} from 'next-intl/server';
import {siteConfig} from '@/config/site';
import {getAllThoughts} from '@/lib/thoughts';

export const alt = 'Thoughts on products, technology, and running companies by Aleksander Stós';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function OgImage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'thoughts'});
  const thoughts = await getAllThoughts();

  const recentTitles = thoughts.slice(0, 4).map((th) => th.title);
  const tagSet = new Set(thoughts.flatMap((th) => th.tags));
  const topTags = [...tagSet].slice(0, 6);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        color: '#fff',
        padding: '60px 80px',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Terminal prompt */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: 18,
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '40px',
          position: 'relative',
        }}
      >
        <span style={{color: '#10b981', fontWeight: 700}}>$</span>
        <span>{siteConfig.name}</span>
        <span style={{color: 'rgba(255,255,255,0.15)'}}>~/thoughts</span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          position: 'relative',
        }}
      >
        {t('title')}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 22,
          color: 'rgba(255,255,255,0.4)',
          maxWidth: '700px',
          lineHeight: 1.5,
          marginBottom: '40px',
          position: 'relative',
        }}
      >
        {t('metaDescription')}
      </div>

      {/* Recent articles preview */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          position: 'relative',
        }}
      >
        {recentTitles.map((title) => (
          <div
            key={title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: 16,
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            <span style={{color: '#10b981', fontSize: 12}}>{'>'}</span>
            <span>{title}</span>
          </div>
        ))}
      </div>

      {/* Tags row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: 14,
          position: 'relative',
        }}
      >
        <span style={{color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace'}}>
          {thoughts.length} articles
        </span>
        <span style={{color: 'rgba(255,255,255,0.12)'}}>|</span>
        {topTags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: '3px 10px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              fontSize: 13,
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
          height: '3px',
          background: 'linear-gradient(to right, #10b981 0%, #10b981 30%, transparent 80%)',
        }}
      />
    </div>,
    {...size},
  );
}
