import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Plus, Settings, MessageCircle } from 'lucide-react';
import ConversationItem from '../components/chat/ConversationItem';
import NewChatModal from '../components/chat/NewChatModal';
import ChatBox from './ChatBox';
import chatApi from '../api/chatApi';

const Message = () => {
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await chatApi.getConversations();
      setConversations(data.items || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const name = conv.type === 'group' 
      ? conv.title 
      : conv.otherUser?.userName || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowNewChatModal(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No results found' : 'No messages yet'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery 
                  ? 'Try searching for something else' 
                  : 'Start a conversation with your connections'}
              </p>
              {!searchQuery && (
                <button onClick={() => setShowNewChatModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                  Start New Chat
                </button>
              )}
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredConversations
                .filter(conv => conv.lastMessage) // Only show conversations with messages
                .map((conv) => (
                  <ConversationItem
                    key={conv._id}
                    conversation={conv}
                    isActive={conv._id === conversationId}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Chat Box or Empty State */}
      <div className="flex-1 flex flex-col">
        {conversationId ? (
          <ChatBox conversationId={conversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-500">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal 
        isOpen={showNewChatModal} 
        onClose={() => setShowNewChatModal(false)} 
      />
    </div>
  );
};

export default Message;
