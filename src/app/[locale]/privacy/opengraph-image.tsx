import {ImageResponse} from 'next/og';
import {getTranslations} from 'next-intl/server';
import {siteConfig} from '@/config/site';

export const alt = 'Privacy Policy — Aleksander Stós';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function OgImage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'privacy'});

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
        <span style={{color: 'rgba(255,255,255,0.15)'}}>~/privacy</span>
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
          {t('title')}
        </div>
      </div>

      {/* Bottom: site URL */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: 18,
          color: 'rgba(255,255,255,0.25)',
          position: 'relative',
          fontFamily: 'monospace',
        }}
      >
        <span>{siteConfig.url.replace('https://', '')}</span>
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
