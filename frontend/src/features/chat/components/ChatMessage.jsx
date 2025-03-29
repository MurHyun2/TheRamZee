import React from 'react';
import styled from 'styled-components';

const ChatMessage = ({ message, isOwn }) => {
  return (
    <MessageContainer $isOwn={isOwn}>
      <MessageBubble $isOwn={isOwn}>
        <SenderName $isOwn={isOwn}>
        </SenderName>
        <MessageContent>{message.content}</MessageContent>
      </MessageBubble>
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
  margin: 1rem 0;
  padding: 0 1rem;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border-bottom-right-radius: ${props => props.$isOwn ? '0.25rem' : '1rem'};
  border-bottom-left-radius: ${props => props.$isOwn ? '1rem' : '0.25rem'};
  background-color: ${props => props.$isOwn ? '#4a3228' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
`;

const SenderName = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
  text-align: ${props => props.$isOwn ? 'right' : 'left'};
`;

const MessageContent = styled.p`
  margin: 0;
  word-wrap: break-word;
`;

export default ChatMessage;