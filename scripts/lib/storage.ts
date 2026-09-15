import {AwsClient} from 'aws4fetch';
import pc from 'picocolors';
import ora from 'ora';

export {pc, ora};

export type Storage = {
  fetchJson<T>(key: string): Promise<T | null>;
  uploadJson(key: string, data: unknown): Promise<void>;
};

export function createStorage(env: Record<string, string | undefined> = process.env): Storage {
  const {R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET} = env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    throw new Error('R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET must be set');
  }

  const client = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  });
  const bucketUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;

  return {
    async fetchJson<T>(key: string): Promise<T | null> {
      const res = await client.fetch(`${bucketUrl}/${key}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`R2 GET ${key} returned ${res.status}`);
      return (await res.json()) as T;
    },

    async uploadJson(key: string, data: unknown): Promise<void> {
      const spinner = ora(`Uploading ${key} to R2`).start();
      const res = await client.fetch(`${bucketUrl}/${key}`, {
        method: 'PUT',
        body: JSON.stringify(data, null, 2),
        headers: {'content-type': 'application/json', 'cache-control': 'no-cache'},
      });
      if (!res.ok) {
        spinner.fail(pc.red(`Upload of ${key} failed (${res.status})`));
        throw new Error(`R2 PUT ${key} returned ${res.status}`);
      }
      spinner.succeed(`Uploaded ${pc.dim(key)}`);
    },
  };
}

export async function triggerRevalidation(): Promise<void> {
  const siteUrl = process.env.SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!siteUrl || !secret) {
    ora().warn(pc.yellow('SITE_URL or REVALIDATE_SECRET not set, skipping revalidation'));
    return;
  }

  const endpoint = `${siteUrl.replace(/\/+$/, '')}/api/revalidate`;
  const spinner = ora('Revalidating cache').start();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {Authorization: `Bearer ${secret}`},
  });

  if (!res.ok) {
    spinner.fail(pc.red(`Revalidation failed (${res.status})`));
    // Throw rather than warn so the scheduled job's failure notification fires.
    throw new Error(`Revalidation POST ${endpoint} returned ${res.status}`);
  }
  spinner.succeed('Cache revalidated');
}
