import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ messages }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((message, idx) => (
          <ChatMessage
            key={idx}
            message={message}
            isOwn={message.sender === sessionStorage.getItem('username')}
          />
        ))}
        <div ref={messageEndRef} />
      </MessageList>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: rgba(45, 24, 16, 0.8);

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default ChatWindow;