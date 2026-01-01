import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, Info, MoreVertical, Smile, Paperclip, Send, User, Users, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chatApi from '../api/chatApi';
import { useAuth } from '../context/authContext';
import { useSocket } from '../context/socketContext';

const ChatBox = ({ conversationId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { connected, joinConversation, leaveConversation, sendMessage, onNewMessage, sendTyping } = useSocket();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadConversation();
      loadMessages();
      
      // Join conversation room via Socket.IO
      if (connected) {
        joinConversation(conversationId);
      }
    }

    return () => {
      // Leave conversation when unmounting
      if (conversationId && connected) {
        leaveConversation(conversationId);
      }
    };
  }, [conversationId, connected]);

  // Listen for new messages
  useEffect(() => {
    if (!connected) return;

    const cleanup = onNewMessage((data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => {
          // Skip if message is from current user (already added via optimistic UI)
          const currentUserId = user._id?.toString() || user.id?.toString();
          const messageSenderId = data.message.senderId?.toString();
          
          if (messageSenderId === currentUserId) {
            // This is our own message, already handled by optimistic UI
            return prev;
          }
          
          // Avoid duplicates for messages from other users
          const exists = prev.some(msg => msg._id === data.message._id);
          if (exists) return prev;
          
          return [...prev, data.message];
        });
      }
    });

    return cleanup;
  }, [conversationId, connected, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    try {
      const data = await chatApi.getConversation(conversationId);
      console.log(data);
      setConversation(data);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await chatApi.getMessages(conversationId);
      setMessages(data.items || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !connected) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic UI update
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      conversationId,
      senderId: user._id,
      type: 'text',
      content: { text: messageText },
      createdAt: new Date(),
      sending: true,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      // Send via Socket.IO
      sendMessage(
        conversationId,
        { type: 'text', content: { text: messageText } },
        (ack) => {
          if (ack?.ok) {
            // Update temp message with real ID
            setMessages((prev) =>
              prev.map((msg) =>
                msg._id === tempMessage._id
                  ? {
                      ...msg,
                      _id: ack.messageId,
                      createdAt: ack.createdAt,
                      sending: false,
                    }
                  : msg
              )
            );
          } else {
            // Remove failed message
            setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
            console.error('Failed to send message');
          }
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
      setNewMessage(messageText);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const getDisplayInfo = () => {
    if (!conversation) return { name: 'Loading...', avatar: null, isOnline: false, isGroup: false };
    
    if (conversation.type === 'group') {
      return {
        name: conversation.title || 'Group Chat',
        avatar: conversation.avatar,
        isOnline: false,
        isGroup: true,
      };
    }
    
    
    // For direct chat, use profile name and avatarUrl with fallbacks
    return {
      name: conversation.otherUser?.profile?.name || conversation.otherUser?.userName || 'User',
      avatar: conversation.otherUser?.profile?.avatarUrl || conversation.otherUser?.imageUrl,
      isOnline: conversation.otherUser?.isOnline || false,
      isGroup: false,
    };
  };

  const { name, avatar, isOnline, isGroup } = getDisplayInfo();

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = (message, index) => {
    const isSent = message.senderId === user._id;
    const showAvatar = !isSent && (index === 0 || messages[index - 1].senderId !== message.senderId);
    const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId;

    return (
      <div
        key={message._id}
        className={`flex items-end gap-2 mb-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar for received messages */}
        {!isSent && (
          <div className="w-7 h-7 flex-shrink-0">
            {showAvatar && (
              avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                  {isGroup ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} max-w-[70%]`}>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isSent
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-900 rounded-tl-sm'
            } ${message.sending ? 'opacity-60' : ''}`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content?.text || ''}
            </p>
          </div>
          {isLastInGroup && (
            <span className={`text-xs text-gray-500 mt-1 ${isSent ? 'mr-2' : 'ml-2'}`}>
              {formatMessageTime(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/message')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
              {isGroup ? (
                <Users className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
          )}

          <div>
            <h2 className="font-semibold text-gray-900">{name}</h2>
            {isOnline && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active now
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-blue-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-blue-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start the conversation
            </h3>
            <p className="text-sm text-gray-500">
              Send a message to {name}
            </p>
          </div>
        ) : (
          <div>
            {messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5 text-blue-600" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <Smile className="w-5 h-5 text-blue-600" />
          </button>

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all flex-shrink-0"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
