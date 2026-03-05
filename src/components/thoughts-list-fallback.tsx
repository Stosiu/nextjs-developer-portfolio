import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {Badge} from '@/components/ui/badge';
import type {ThoughtMeta} from '@/lib/thoughts';

type Props = {
  thoughts: ThoughtMeta[];
};

export function ThoughtsListFallback({thoughts}: Props) {
  return (
    <div>
      <div className="grid gap-4">
        {thoughts.map((thought) => (
          <Link
            key={thought.slug}
            href={`/thoughts/${thought.slug}`}
            className="group block p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex gap-5">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors mb-1">
                  {thought.title}
                </h2>
                {thought.description && (
                  <p className="text-sm text-white/40 mb-2 line-clamp-2">{thought.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
                  <time>{thought.date}</time>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {thought.tags.map((tag) => (
                    <Badge key={tag} variant="sm" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {thought.image && (
                <div className="shrink-0 w-36 rounded-lg overflow-hidden border border-white/[0.06] self-center">
                  <Image
                    src={thought.image.src}
                    alt={thought.title}
                    width={thought.image.width}
                    height={thought.image.height}
                    placeholder="blur"
                    blurDataURL={thought.image.blurDataURL}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
