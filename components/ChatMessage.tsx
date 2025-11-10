
import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface ChatMessageProps {
  message: ChatMessage;
}

const GovernmentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-1.5 0zM7.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-1.5 0zM10.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-1.5 0zM13.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-1.5 0zM17.625 1.625a.75.75 0 00-1.125 0l-3 3a.75.75 0 000 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 000-1.06l-3-3z" clipRule="evenodd" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === MessageRole.MODEL;
  
  const containerClasses = `flex items-start gap-4 p-4 ${isModel ? '' : 'flex-row-reverse'}`;
  const messageBubbleClasses = `max-w-xl lg:max-w-2xl xl:max-w-3xl px-5 py-3 rounded-2xl shadow-md ${
    isModel
      ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
      : 'bg-blue-600 text-white rounded-br-none'
  }`;

  const markdownToHtml = (text: string) => {
    const rawMarkup = marked(text, { breaks: true, gfm: true });
    return DOMPurify.sanitize(rawMarkup as string);
  };

  return (
    <div className={containerClasses}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isModel ? 'bg-gray-200 dark:bg-gray-600' : 'bg-blue-200 dark:bg-blue-800'}`}>
        {isModel ? <GovernmentIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" /> : <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />}
      </div>
      <div className={messageBubbleClasses}>
        <div 
          className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3" 
          dangerouslySetInnerHTML={{ __html: markdownToHtml(message.text) }}
        />
      </div>
    </div>
  );
};
