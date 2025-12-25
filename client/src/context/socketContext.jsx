/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Connect socket when user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      setConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  const joinConversation = (conversationId) => {
    if (socket && connected) {
      socket.emit('CONV_JOIN', { conversationId });
      console.log('[Socket] Joined conversation:', conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socket && connected) {
      socket.emit('CONV_LEAVE', { conversationId });
      console.log('[Socket] Left conversation:', conversationId);
    }
  };

  const sendMessage = (conversationId, message, callback) => {
    if (socket && connected) {
      socket.emit('MSG_SEND', {
        conversationId,
        clientMsgId: Date.now().toString(),
        type: message.type || 'text',
        content: message.content,
      }, callback);
    }
  };

  const sendTyping = (conversationId, isTyping) => {
    if (socket && connected) {
      socket.emit('TYPING', { conversationId, isTyping });
    }
  };

  const updateReadStatus = (conversationId, lastReadMessageId) => {
    if (socket && connected) {
      socket.emit('READ_UPDATE', { conversationId, lastReadMessageId });
    }
  };

  const onNewMessage = (callback) => {
    if (socket) {
      socket.on('MSG_NEW', callback);
      return () => socket.off('MSG_NEW', callback);
    }
  };

  const onTyping = (callback) => {
    if (socket) {
      socket.on('TYPING', callback);
      return () => socket.off('TYPING', callback);
    }
  };

  const onReadUpdated = (callback) => {
    if (socket) {
      socket.on('READ_UPDATED', callback);
      return () => socket.off('READ_UPDATED', callback);
    }
  };

  const value = {
    socket,
    connected,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    updateReadStatus,
    onNewMessage,
    onTyping,
    onReadUpdated,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
