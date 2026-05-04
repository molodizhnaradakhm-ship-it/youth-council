import type { Payload } from 'payload';

import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3Client,
} from '@aws-sdk/client-s3';

function isBucketMissing(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number }; Code?: string };
  return (
    e.name === 'NotFound' ||
    e.Code === 'NoSuchBucket' ||
    e.$metadata?.httpStatusCode === 404
  );
}

function isBucketAlreadyExists(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: string; Code?: string; $metadata?: { httpStatusCode?: number } };
  return (
    e.name === 'BucketAlreadyExists' ||
    e.name === 'BucketAlreadyOwnedByYou' ||
    e.Code === 'BucketAlreadyOwnedByYou' ||
    e.Code === 'BucketAlreadyExists' ||
    e.$metadata?.httpStatusCode === 409
  );
}

/** Creates the media bucket if missing (e.g. fresh MinIO volume). */
export async function ensureS3Bucket(payload: Payload): Promise<void> {
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!bucket || !accessKeyId || !secretAccessKey) return;

  const client = new S3Client({
    credentials: { accessKeyId, secretAccessKey },
    ...(process.env.S3_ENDPOINT
      ? {
          endpoint: process.env.S3_ENDPOINT,
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
        }
      : {}),
    region: process.env.S3_REGION || 'us-east-1',
  });

  let created = false;

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (err: unknown) {
    if (!isBucketMissing(err)) throw err;
    try {
      await client.send(new CreateBucketCommand({ Bucket: bucket }));
      created = true;
    } catch (createErr: unknown) {
      if (!isBucketAlreadyExists(createErr)) throw createErr;
    }
  }

  if (created) {
    payload.logger.info(`S3: ensured bucket "${bucket}" exists.`);
  }

  if (process.env.S3_ACL === 'public-read' && process.env.S3_ENDPOINT) {
    const policy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    });
    try {
      await client.send(new PutBucketPolicyCommand({ Bucket: bucket, Policy: policy }));
    } catch {
      // MinIO may already have a policy; real AWS may reject public policies — uploads still work with object ACL.
    }
  }
}
