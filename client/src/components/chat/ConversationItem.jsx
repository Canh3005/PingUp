import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

const ConversationItem = ({ conversation, isActive = false }) => {
  const navigate = useNavigate();

  // Get other user info (for direct chats)
  const getDisplayInfo = () => {
    if (conversation.type === 'group') {
      return {
        name: conversation.title || 'Group Chat',
        avatar: conversation.avatar,
        isGroup: true,
      };
    }
    // For direct chat, show the other user
    // avatarUrl from UserProfile, fallback to imageUrl
    return {
      name: conversation.otherUser?.profile?.name || conversation.otherUser?.userName || 'User',
      avatar: conversation.otherUser?.profile?.avatarUrl || conversation.otherUser?.imageUrl,
      isGroup: false,
    };
  };

  const { name, avatar, isGroup } = getDisplayInfo();
  const lastMessage = conversation.lastMessage?.content?.text || 'No messages yet';
  const timestamp = conversation.lastMessageAt 
    ? formatTimestamp(conversation.lastMessageAt)
    : '';
  const unreadCount = conversation.unreadCount || 0;

  const handleClick = () => {
    navigate(`/message/${conversation._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500'
          : 'hover:bg-gray-50'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
            {isGroup ? (
              <Users className="w-6 h-6" />
            ) : (
              <span className="text-lg font-semibold">
                {name?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
        )}
        {conversation.type === 'direct' && conversation.otherUser?.isOnline && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {name}
          </h3>
          {timestamp && (
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {timestamp}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">
          {conversation.lastMessage?.senderId && conversation.type === 'group' && (
            <span className="font-medium">
              {conversation.lastMessage.senderName}: 
            </span>
          )}
          {lastMessage}
        </p>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-500 text-white text-xs font-semibold rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </div>
      )}
    </div>
  );
};

// Helper function to format timestamp
const formatTimestamp = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now - messageDate;
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default ConversationItem;
