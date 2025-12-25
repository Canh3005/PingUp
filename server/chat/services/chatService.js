import conversationService from './conversationService.js';
import ReadState from '../models/ReadState.js';

class ChatService {
  async updateRead({ userId, conversationId, lastReadMessageId }) {
    await conversationService.getConversationOrThrow({
      userId,
      conversationId,
    });
    await ReadState.updateOne(
      { conversationId, userId },
      { $set: { lastReadMessageId, lastReadAt: new Date() } },
      { upsert: true }
    );
    return { conversationId, userId, lastReadMessageId };
  }
}

export default new ChatService();
