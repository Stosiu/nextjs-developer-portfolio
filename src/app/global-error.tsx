'use client';

const HEX_DUMP = [
  '0000: 45 76 65 72 79 74 68 69  Everything',
  '0008: 6E 67 20 69 73 20 66 69  ng.is.fi',
  '0010: 6E 65 2E 20 54 68 69 73  ne..This',
  '0018: 20 69 73 20 66 69 6E 65  .is.fine',
];

type Props = {
  error: Error & {digest?: string};
  reset: () => void;
};

export default function GlobalError({reset}: Props) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white font-mono antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-xl">
            <div className="rounded-lg border border-red-500/20 bg-black/80 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-red-500/20 bg-red-500/5">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <span className="ml-2 text-xs text-red-400/60">
                  FATAL — root layout compromised
                </span>
              </div>

              <div className="p-4 text-sm leading-relaxed">
                <p className="text-red-400 font-bold mb-2">
                  !!! CATASTROPHIC FAILURE !!!
                </p>
                <p className="text-white/50 text-xs mb-4">
                  The application has encountered an error so severe that even
                  the error page broke. This is the error page for error pages.
                  We&apos;re not sure how deep this goes.
                </p>

                <div className="bg-black/50 rounded p-3 mb-4 text-xs text-white/30 border border-white/5">
                  <p className="text-white/50 mb-2">Memory dump:</p>
                  {HEX_DUMP.map((line, i) => (
                    <p key={i} className="font-mono">{line}</p>
                  ))}
                </div>

                <p className="text-white/30 text-xs mb-4">
                  Recommended action: remain calm, close your laptop, go outside,
                  touch grass, and try again later.
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={reset}
                    className="px-6 py-2.5 text-sm font-mono border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  >
                    sudo reboot
                  </button>
                  <a
                    href="/"
                    className="px-6 py-2.5 text-sm font-mono border border-white/10 text-white/50 rounded hover:bg-white/5 transition-colors"
                  >
                    cd ~
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
