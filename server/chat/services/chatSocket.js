import conversationService from './conversationService.js';
import chatService from './chatService.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export function registerChatSocket(io) {
  io.on('connection', (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);

    socket.on('CONV_JOIN', async ({ conversationId }) => {
      try {
        console.log('[CONV_JOIN] userId:', userId, 'conversationId:', conversationId);
        const conv = await conversationService.getConversationOrThrow({
          userId,
          conversationId,
        });
        socket.join(`conv:${conv._id}`);
        console.log('[CONV_JOIN] Success - joined conv:', conv._id);
      } catch (error) {
        console.error('[CONV_JOIN] Error:', error.message);
        socket.emit('error', { code: 'CONV_JOIN_FAILED', message: error.message });
      }
    });

    socket.on('CONV_LEAVE', ({ conversationId }) => {
      socket.leave(`conv:${conversationId}`);
    });

    socket.on('MSG_SEND', async (payload, ack) => {
      try {
        const { conversationId, clientMsgId, type = 'text', content } = payload;

        await conversationService.getConversationOrThrow({
          userId,
          conversationId,
        });

        const msg = await Message.create({
          conversationId,
          senderId: userId,
          type,
          content,
        });

        await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessageId: String(msg._id),
            lastMessageAt: msg.createdAt,
            updatedAt: new Date(),
          },
          { new: true }
        ).lean();

        io.to(`conv:${conversationId}`).emit('MSG_NEW', {
          conversationId,
          message: {
            _id: String(msg._id),
            conversationId,
            senderId: userId,
            type: msg.type,
            content: msg.content,
            createdAt: msg.createdAt,
          },
        });

        ack?.({
          ok: true,
          clientMsgId,
          messageId: String(msg._id),
          createdAt: msg.createdAt,
        });
      } catch (e) {
        ack?.({ ok: false, code: 'SEND_FAILED' });
      }
    });

    socket.on('READ_UPDATE', async ({ conversationId, lastReadMessageId }) => {
      try {
        const data = await chatService.updateRead({
          userId,
          conversationId,
          lastReadMessageId,
        });
        socket.to(`conv:${conversationId}`).emit('READ_UPDATED', data);
      } catch {
        // ignore or emit error
      }
    });

    // Optional typing
    socket.on('TYPING', async ({ conversationId, isTyping }) => {
      try {
        await conversationService.getConversationOrThrow({
          userId,
          conversationId,
        });
        socket
          .to(`conv:${conversationId}`)
          .emit('TYPING', { conversationId, userId, isTyping: !!isTyping });
      } catch {}
    });
  });
}
