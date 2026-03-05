import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import sharp from 'sharp';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSanitize, {defaultSchema} from 'rehype-sanitize';
import type {Root, Element} from 'hast';
import {visit} from 'unist-util-visit';

const THOUGHTS_DIR = path.join(process.cwd(), 'content/thoughts');
const IMAGES_DIR = path.join(process.cwd(), 'public/images/thoughts');

export type ThoughtImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export type ThoughtMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  image: ThoughtImage | null;
  description: string | null;
  imageCaption: string | null;
  tldr: string | null;
  readingTime: number;
  wordCount: number;
  content: string;
};

export type TocEntry = {
  id: string;
  text: string;
  level: number;
};

export type Thought = ThoughtMeta & {
  html: string;
  toc: TocEntry[];
};

function getSlugs(): string[] {
  if (!fs.existsSync(THOUGHTS_DIR)) return [];
  return fs
    .readdirSync(THOUGHTS_DIR, {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

async function generateImageData(slug: string, filename: string): Promise<ThoughtImage | null> {
  const imagePath = path.join(IMAGES_DIR, slug, filename);
  if (!fs.existsSync(imagePath)) return null;

  const buffer = fs.readFileSync(imagePath);
  const metadata = await sharp(buffer).metadata();
  const blurBuffer = await sharp(buffer).resize(20).blur().toBuffer();
  const blurDataURL = `data:image/${metadata.format};base64,${blurBuffer.toString('base64')}`;

  return {
    src: `/images/thoughts/${slug}/${filename}`,
    width: metadata.width ?? 1200,
    height: metadata.height ?? 630,
    blurDataURL,
  };
}

function parseThought(slug: string): Omit<ThoughtMeta, 'image'> & {imageFilename: string | null} | null {
  const filePath = path.join(THOUGHTS_DIR, slug, 'index.md');
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const {data, content} = matter(raw);

  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  return {
    slug,
    title: data.title ?? slug,
    date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date),
    tags: Array.isArray(data.tags) ? data.tags : [],
    imageFilename: data.image ?? null,
    description: data.description ?? null,
    imageCaption: data.imageCaption ?? null,
    tldr: data.tldr ?? null,
    readingTime,
    wordCount,
    content,
  };
}

export async function getAllThoughts(): Promise<ThoughtMeta[]> {
  const slugs = getSlugs();
  const thoughts = await Promise.all(
    slugs.map(async (slug) => {
      const parsed = parseThought(slug);
      if (!parsed) return null;
      const {imageFilename, ...rest} = parsed;
      const image = imageFilename ? await generateImageData(slug, imageFilename) : null;
      return {...rest, image} as ThoughtMeta;
    }),
  );
  return thoughts
    .filter((t): t is ThoughtMeta => t !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getThoughtsCount(): number {
  return getSlugs().length;
}

function rehypeImageFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img' || index === undefined || !parent) return;
      const alt = (node.properties?.alt as string) || '';
      if (!alt) return;
      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          node,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{type: 'text', value: alt}],
          },
        ],
      };
      parent.children[index] = figure;
    });
  };
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'figure', 'figcaption'],
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 ?? []), 'id'],
    h2: [...(defaultSchema.attributes?.h2 ?? []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 ?? []), 'id'],
    h4: [...(defaultSchema.attributes?.h4 ?? []), 'id'],
    h5: [...(defaultSchema.attributes?.h5 ?? []), 'id'],
    h6: [...(defaultSchema.attributes?.h6 ?? []), 'id'],
    a: [...(defaultSchema.attributes?.a ?? []), 'className'],
    img: [...(defaultSchema.attributes?.img ?? []), 'alt'],
  },
};

function extractToc(tree: Root): TocEntry[] {
  const entries: TocEntry[] = [];
  visit(tree, 'element', (node) => {
    const match = node.tagName.match(/^h([2-3])$/);
    if (!match || !node.properties?.id) return;
    const text = node.children
      .filter((c): c is {type: 'text'; value: string} => c.type === 'text')
      .map((c) => c.value)
      .join('');
    if (text) {
      entries.push({id: String(node.properties.id), text, level: Number(match[1])});
    }
  });
  return entries;
}

function rehypeLocalizeLinks(locale: string) {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href as string | undefined;
      if (!href || !href.startsWith('/')) return;
      node.properties!.href = `/${locale}${href}`;
    });
  };
}

async function renderMarkdown(content: string, locale = 'en'): Promise<{html: string; toc: TocEntry[]}> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeImageFigure)
    .use(rehypeLocalizeLinks, locale);

  const mdast = processor.parse(content);
  const hast = await processor.run(mdast);

  const sanitized = await unified()
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .run(hast);

  const toc = extractToc(sanitized as Root);
  const html = unified().use(rehypeStringify).stringify(sanitized as Root);
  return {html, toc};
}

export async function getThoughtBySlug(slug: string, locale = 'en'): Promise<Thought | null> {
  const parsed = parseThought(slug);
  if (!parsed) return null;

  const {imageFilename, ...rest} = parsed;
  const image = imageFilename ? await generateImageData(slug, imageFilename) : null;
  const {html, toc} = await renderMarkdown(rest.content, locale);
  return {...rest, image, html, toc};
}
