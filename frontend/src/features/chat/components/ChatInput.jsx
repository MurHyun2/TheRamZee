import React, { useState } from 'react';
import styled from 'styled-components';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <InputContainer onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
      />
      <SendButton type="submit">
        <Send size={20} />
      </SendButton>
    </InputContainer>
  );
};

const InputContainer = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: rgba(45, 24, 16, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SendButton = styled.button`
  background-color: #4a3228;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a4238;
  }
`;

export default ChatInput;