
import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'questions';
  content: string | string[];
  timestamp: Date;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.type === 'questions') {
    return (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-800 mb-3">
              I'd like to ask you a few questions to help fill out your survey:
            </p>
            <div className="space-y-2">
              {Array.isArray(message.content) && message.content.map((question, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-medium text-sm">
                    {index + 1}.
                  </span>
                  <span className="text-gray-700 text-sm">{question}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
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
              {typeof message.content === 'string' ? message.content : message.content.join('\n')}
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

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-700">
            {typeof message.content === 'string' ? message.content : message.content.join('\n')}
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
