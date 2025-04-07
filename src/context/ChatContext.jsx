import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';

const ChatContext = createContext();
const socket = io('http://localhost:5000');

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    if (user) {
      socket.on('message', handleNewMessage);
      return () => socket.off('message', handleNewMessage);
    }
  }, [user]);

  const handleNewMessage = (message) => {
    if (message.discussionId === activeChat?.id) {
      setMessages(prev => [...prev, message]);
    }
  };

  const sendMessage = (content) => {
    if (activeChat) {
      socket.emit('sendMessage', {
        discussionId: activeChat.id,
        content,
        userId: user.id
      });
    }
  };

  const loadDiscussionMessages = async (discussionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/discussions/${discussionId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      activeChat,
      setActiveChat,
      discussions,
      setDiscussions,
      sendMessage,
      loadDiscussionMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}