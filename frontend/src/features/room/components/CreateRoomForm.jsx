import React, { useState } from 'react';
import styled from 'styled-components';

const CreateRoomForm = ({ onRoomCreated }) => {
  const [roomTitle, setRoomTitle] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomTitle.trim() || isCreating) return;

    setIsCreating(true);
    try {
      sessionStorage.setItem('roomHost', true)
      sessionStorage.setItem('roomPassword', password || null);
      await onRoomCreated(roomTitle, isPasswordEnabled ? password : '');
    } catch (error) {
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="방 이름 입력"  
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
        disabled={isCreating}
      />
      <CheckboxContainer>
        <label>
          <input
            type="checkbox"
            checked={isPasswordEnabled}
            onChange={(e) => setIsPasswordEnabled(e.target.checked)}
            disabled={isCreating}
          />
          비밀번호 방
        </label>
      </CheckboxContainer>
      {isPasswordEnabled && (
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          disabled={isCreating}
        />
      )}
      <ButtonGroup>
        <CreateButton type="submit" disabled={isCreating}>
          {isCreating ? '생성 중...' : '방 만들기'}
        </CreateButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default CreateRoomForm;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border-radius: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const CreateButton = styled.button`
  background-color: #2d1810;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
`;
