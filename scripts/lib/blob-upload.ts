import {put} from '@vercel/blob';

export async function uploadToBlob(path: string, data: unknown): Promise<string> {
  const json = JSON.stringify(data, null, 2);
  const blob = await put(path, json, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function triggerRevalidation(): Promise<void> {
  const siteUrl = process.env.SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!siteUrl || !secret) {
    console.warn('SITE_URL or REVALIDATE_SECRET not set, skipping revalidation');
    return;
  }

  const res = await fetch(`${siteUrl}/api/revalidate`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${secret}`},
  });

  if (!res.ok) {
    console.warn(`Revalidation returned ${res.status}: ${await res.text()}`);
  } else {
    console.log('Cache revalidated');
  }
}
