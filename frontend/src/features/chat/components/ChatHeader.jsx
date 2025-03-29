import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const ChatHeader = ({ receiver, onClose }) => {
  return (
    <HeaderContainer>
      <ReceiverName>{receiver}</ReceiverName>
      <CloseButton onClick={onClose}>
        <X size={20} />
      </CloseButton>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(45, 24, 16, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ReceiverName = styled.h2`
  color: white;
  font-size: 1.2rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #ff6b6b;
  }
`;

export default ChatHeader;