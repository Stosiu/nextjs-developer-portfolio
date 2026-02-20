import {put} from '@vercel/blob';
import pc from 'picocolors';
import ora from 'ora';

export {pc, ora};

export async function uploadToBlob(path: string, data: unknown): Promise<string> {
  const spinner = ora('Uploading to Vercel Blob').start();
  const json = JSON.stringify(data, null, 2);
  const blob = await put(path, json, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  spinner.succeed(`Uploaded ${pc.dim(blob.url)}`);
  return blob.url;
}

export async function triggerRevalidation(): Promise<void> {
  const siteUrl = process.env.SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!siteUrl || !secret) {
    ora().warn(pc.yellow('SITE_URL or REVALIDATE_SECRET not set, skipping revalidation'));
    return;
  }

  const spinner = ora('Revalidating cache').start();
  const res = await fetch(`${siteUrl}/api/revalidate`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${secret}`},
  });

  if (!res.ok) {
    spinner.fail(pc.red(`Revalidation failed (${res.status})`));
  } else {
    spinner.succeed('Cache revalidated');
  }
}
