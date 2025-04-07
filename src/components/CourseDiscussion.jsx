import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDiscussion({ courseId }) {
  const { user } = useAuth();
  const { messages, sendMessage, loadDiscussionMessages } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadDiscussionMessages(courseId);
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Course Discussion</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.userId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.userId === user.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="font-medium text-sm">
                  {message.userId === user.id ? 'You' : message.user.name}
                </span>
                <span className="text-xs ml-2 opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}