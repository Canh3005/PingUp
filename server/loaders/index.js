import connectDB from "../configs/db.js";
import { env } from "../configs/env.js";
import { createRedisClients } from "../configs/redis.js";
import { createExpressApp } from "./expressLoader.js";
import { createSocketServer } from "./socketLoader.js";

export async function bootstrap() {
  await connectDB();
  const app = createExpressApp();

  let redisAdapterFactory = null;

  if (env.enableRedisAdapter) {
    const clients = await createRedisClients();
    if (clients) {
      const { createAdapter } = await import("@socket.io/redis-adapter");
      const { pubClient, subClient } = clients;
      redisAdapterFactory = () => createAdapter(pubClient, subClient);
    }
  }

  const { server } = await createSocketServer(app, { redisAdapterFactory });

  server.listen(env.port, () => {
    console.log(`[server] listening on :${env.port}`);
  });
}