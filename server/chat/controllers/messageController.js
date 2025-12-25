import messageService from '../services/messageService.js';

class MessageController {
  async list(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { conversationId } = req.params;
      const { limit, before } = req.query;

      const data = await messageService.listMessages({
        userId,
        conversationId,
        limit,
        before,
      });
      res.json({ ok: true, ...data });
    } catch (error) {
      console.error('Error in list messages controller:', error);
      res.status(500).json({
        ok: false,
        message: error.message || 'Failed to list messages',
      });
    }
  }
}

export default new MessageController();
