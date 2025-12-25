import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../configs/env.js';
import { registerChatSocket } from '../chat/services/chatSocket.js';

export async function createSocketServer(app, { redisAdapterFactory } = {}) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: env.corsOrigin, credentials: true },
  });

  // Auth middleware for sockets
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) return next(new Error('UNAUTHORIZED'));
      const payload = jwt.verify(token, env.jwtSecret);

      if (!payload?.userId) return next(new Error('UNAUTHORIZED'));
      socket.data.userId = String(payload.userId);
      next();
    } catch {
      next(new Error('UNAUTHORIZED'));
    }
  });

  // Optional redis adapter
  if (redisAdapterFactory) {
    io.adapter(redisAdapterFactory());
  }

  registerChatSocket(io);
  return { server, io };
}
