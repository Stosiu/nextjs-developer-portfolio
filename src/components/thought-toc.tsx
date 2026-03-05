'use client';

import {useState, useEffect, useCallback} from 'react';
import {Link2, Check, ArrowLeft} from 'lucide-react';
import {FaXTwitter, FaLinkedinIn} from 'react-icons/fa6';
import {FaRegCopy} from 'react-icons/fa';
import type {TocEntry} from '@/lib/thoughts';

type Props = {
  entries: TocEntry[];
  title: string;
  backHref: string;
  backLabel: string;
};

export function ThoughtToc({entries, title, backHref, backLabel}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');

  useEffect(() => {
    setShareUrl(encodeURIComponent(window.location.href));
    setShareTitle(encodeURIComponent(title));
  }, [title]);

  useEffect(() => {
    const headings = entries.map((e) => document.getElementById(e.id)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const update = () => {
      let current: string | null = null;
      for (const el of headings) {
        if (el.getBoundingClientRect().top <= 120) {
          current = el.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', update, {passive: true});
    update();
    return () => window.removeEventListener('scroll', update);
  }, [entries]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({top, behavior: 'smooth'});
    }
  }, []);

  const copyAnchor = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, []);

  if (entries.length === 0) return null;

  return (
    <>
      {/* Mobile: static TOC */}
      <nav className="xl:hidden mb-8 p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Contents</p>
        <ul className="space-y-1.5">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                onClick={() => scrollTo(entry.id)}
                className={`block text-sm text-left transition-colors ${
                  entry.level === 3 ? 'pl-4' : ''
                } ${activeId === entry.id ? 'text-brand-400' : 'text-white/40 hover:text-white/70'}`}
              >
                {entry.text}
              </button>
            </li>
          ))}
        </ul>
        <ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} onCopyLink={copyLink} copiedLink={copiedLink} />
      </nav>

      {/* Desktop: floating sidebar */}
      <aside className="hidden xl:block fixed right-[max(1.5rem,calc((100vw-56rem)/2-16rem))] top-28 w-56">
        <a
          href={backHref}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-white/40 bg-white/[0.04] border border-white/[0.08] hover:text-white/70 hover:border-white/[0.15] transition-all mb-5"
        >
          <ArrowLeft className="w-3 h-3" />
          {backLabel}
        </a>

        <nav>
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">Contents</p>
          <ul className="space-y-0.5 border-l border-white/[0.06]">
            {entries.map((entry) => (
              <li key={entry.id} className="relative group">
                <span
                  className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-colors duration-200 ${
                    activeId === entry.id ? 'bg-brand-400' : 'bg-transparent'
                  }`}
                />
                <div className="flex items-center">
                  <button
                    onClick={() => scrollTo(entry.id)}
                    className={`block py-1 text-xs leading-snug transition-colors text-left flex-1 ${
                      entry.level === 3 ? 'pl-5' : 'pl-3'
                    } ${activeId === entry.id ? 'text-brand-400' : 'text-white/30 hover:text-white/55'}`}
                  >
                    {entry.text}
                  </button>
                  <button
                    onClick={(e) => copyAnchor(e, entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-white/25 hover:text-white/60 transition-all shrink-0"
                    title="Copy link to section"
                  >
                    {copiedId === entry.id ? (
                      <Check className="w-3 h-3 text-brand-400" />
                    ) : (
                      <Link2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} onCopyLink={copyLink} copiedLink={copiedLink} />
      </aside>
    </>
  );
}

function ShareButtons({
  shareUrl,
  shareTitle,
  onCopyLink,
  copiedLink,
}: {
  shareUrl: string;
  shareTitle: string;
  onCopyLink: () => void;
  copiedLink: boolean;
}) {
  return (
    <div className="mt-5 pt-4 border-t border-white/[0.06]">
      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Share</p>
      <div className="flex items-center gap-1.5">
        <a
          href={`https://x.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-white/40 bg-white/[0.04] border border-white/[0.08] hover:text-white/70 hover:border-white/[0.15] transition-all"
          aria-label="Share on X"
        >
          <FaXTwitter size={12} />
          <span>Post</span>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-white/40 bg-white/[0.04] border border-white/[0.08] hover:text-white/70 hover:border-white/[0.15] transition-all"
          aria-label="Share on LinkedIn"
        >
          <FaLinkedinIn size={12} />
          <span>Share</span>
        </a>
        <button
          onClick={onCopyLink}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-white/40 bg-white/[0.04] border border-white/[0.08] hover:text-white/70 hover:border-white/[0.15] transition-all"
          aria-label="Copy link"
        >
          {copiedLink ? (
            <>
              <Check className="w-3 h-3 text-brand-400" />
              <span className="text-brand-400">Copied</span>
            </>
          ) : (
            <>
              <FaRegCopy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
