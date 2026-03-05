import {ImageResponse} from 'next/og';
import {readFile} from 'fs/promises';
import {join} from 'path';
import {getThoughtBySlug} from '@/lib/thoughts';
import {siteConfig} from '@/config/site';

export const alt = 'Thought article';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

async function getThumbnailBase64(slug: string): Promise<string | null> {
  for (const ext of ['jpg', 'png']) {
    const filePath = join(process.cwd(), 'public/images/thoughts', slug, `thumbnail.${ext}`);
    try {
      const buffer = await readFile(filePath);
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
      return `data:${mime};base64,${buffer.toString('base64')}`;
    } catch {
      continue;
    }
  }
  return null;
}

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

  const thumbnailSrc = await getThumbnailBase64(slug);

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
      {/* Thumbnail background */}
      {thumbnailSrc && (
        <img
          src={thumbnailSrc}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.3,
          }}
        />
      )}
      {/* Gradient overlay to fade thumbnail into background */}
      {thumbnailSrc && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '55%',
            height: '100%',
            background: 'linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.6) 60%, rgba(10,10,10,0.3) 100%)',
          }}
        />
      )}

      {/* Subtle dot grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
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
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            maxWidth: '800px',
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
          gap: '16px',
          fontSize: 18,
          color: 'rgba(255,255,255,0.35)',
          position: 'relative',
        }}
      >
        <span style={{fontFamily: 'monospace'}}>{thought.date}</span>
        <span style={{color: 'rgba(255,255,255,0.12)'}}>|</span>
        <span>{thought.readingTime} min read</span>
        <span style={{color: 'rgba(255,255,255,0.12)'}}>|</span>
        {thought.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 14,
              fontFamily: 'monospace',
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
