import conversationService from '../services/conversationService.js';

class ConversationController {
  async createConversation(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { type, memberIds, title, avatar } = req.body;
      console.log(req.body);
      const conv = await conversationService.createConversation({
        userId,
        type,
        memberIds,
        title,
        avatar,
      });

      res.status(200).json({ ok: true, conversation: conv });
    } catch (error) {
      console.error('Error in createConversation controller:', error);
      res.status(500).json({
        ok: false,
        message: error.message || 'Failed to create conversation',
      });
    }
  }

  async listInbox(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { limit, cursor } = req.query;
      const data = await conversationService.listInbox({
        userId,
        limit,
        cursor,
      });
      res.json({ ok: true, ...data });
    } catch (error) {
      console.error('Error in listInbox controller:', error);
      res.status(500).json({
        ok: false,
        message: error.message || 'Failed to list inbox',
      });
    }
  }

  async getConversation(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { conversationId } = req.params;
      const conv = await conversationService.getConversationOrThrow({
        userId,
        conversationId,
      });
      res.json({ ok: true, conversation: conv });
    } catch (error) {
      console.error('Error in getConversation controller:', error);
      res.status(500).json({
        ok: false,
        message: error.message || 'Failed to get conversation',
      });
    }
  }
}

export default new ConversationController();
