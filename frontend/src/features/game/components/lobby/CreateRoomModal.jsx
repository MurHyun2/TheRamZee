import { useState } from 'react';
import styled from 'styled-components';

const CreateRoomModal = ({ onClose, onCreate }) => {
  const [roomData, setRoomData] = useState({
    title: '',
    password: '',
    isPrivate: false,
    maxPlayers: 6
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomData.title) {
      alert('방 제목을 입력해주세요.');
      return;
    }
    if (roomData.isPrivate && !roomData.password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    onCreate(roomData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="방 제목"
            value={roomData.title}
            onChange={(e) => setRoomData({ ...roomData, title: e.target.value })}
          />
          
          <CheckboxGroup>
            <input
              type="checkbox"
              id="isPrivate"
              checked={roomData.isPrivate}
              onChange={(e) => setRoomData({ ...roomData, isPrivate: e.target.checked })}
            />
            <label htmlFor="isPrivate">비공개 방</label>
          </CheckboxGroup>

          {roomData.isPrivate && (
            <Input
              type="password"
              placeholder="비밀번호 (숫자 8자리)"
              maxLength={8}
              value={roomData.password}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setRoomData({ ...roomData, password: value });
              }}
            />
          )}

          <ButtonGroup>
            <SubmitButton type="submit">확인</SubmitButton>
            <CancelButton type="button" onClick={onClose}>취소</CancelButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(139, 69, 19, 0.9);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  background: #90EE90;
`;

const CancelButton = styled(Button)`
  background: #FF4444;
  color: white;
`;

export default CreateRoomModal;