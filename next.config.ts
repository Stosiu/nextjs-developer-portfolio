import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';
const hasGA = !!process.env.NEXT_PUBLIC_GA_ID;
const gaDomains = hasGA
  ? ' https://www.googletagmanager.com https://www.google-analytics.com'
  : '';
const gaAnalyticsDomains = hasGA
  ? ' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com'
  : '';

const hasSpeedInsights = !!process.env.NEXT_PUBLIC_SPEED_INSIGHTS;
const speedInsightsDomains = hasSpeedInsights ? ' https://va.vercel-scripts.com' : '';
const devDomains = isDev ? ' https://unpkg.com' : '';
const devConnectDomains = isDev ? ' https://www.react-grab.com' : '';
const devStyleDomains = isDev ? ' https://fonts.googleapis.com' : '';
const devFontDomains = isDev ? ' https://fonts.gstatic.com' : '';
const scriptSrc = isDev
  ? `script-src 'self' 'unsafe-inline' 'unsafe-eval'${gaDomains}${devDomains}${speedInsightsDomains}`
  : `script-src 'self' 'unsafe-inline'${gaDomains}${speedInsightsDomains}`;

const securityHeaders = [
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'X-Frame-Options', value: 'DENY'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      scriptSrc,
      `style-src 'self' 'unsafe-inline'${devStyleDomains}`,
      `img-src 'self' data: blob: https://i.scdn.co https://avatars.githubusercontent.com https://img.shields.io${gaDomains}`,
      `font-src 'self'${devFontDomains}`,
      `connect-src 'self' https://cdn.jsdelivr.net${gaAnalyticsDomains}${speedInsightsDomains}${devConnectDomains}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  env: {
    NEXT_PUBLIC_COMMIT_SHA: (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7) || 'dev',
  },
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https' as const,
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  headers: async () => [
    {source: '/(.*)', headers: securityHeaders},
  ],
  rewrites: async () => [],
};

export default withNextIntl(nextConfig);
