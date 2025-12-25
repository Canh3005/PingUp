import { createClient } from 'redis';
import { env } from './env.js';

export async function createRedisClients() {
  if (!env.redisUrl) return null;

  const pubClient = createClient({ url: env.redisUrl });
  const subClient = pubClient.duplicate();
  await pubClient.connect();
  await subClient.connect();

  console.log('[redis] connected');
  return { pubClient, subClient };
}
