
import React from 'react';
import { Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'question' | 'loading';
  content: string;
  timestamp: Date;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.type === 'loading') {
    return (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-700 italic">{message.content}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'question') {
    return (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-800 font-medium">
              {message.content}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'user') {
    return (
      <div className="flex items-start space-x-3 justify-end">
        <div className="flex-1 max-w-xs lg:max-w-md">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
            <div className="whitespace-pre-line text-sm">
              {message.content}
            </div>
            <p className="text-xs text-blue-100 mt-2 text-right">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  // Default bot message
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-700">
            {message.content}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
