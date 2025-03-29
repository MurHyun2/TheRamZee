import { useState } from 'react';
import styled from 'styled-components';

const AddFriendModal = ({ onClose, onAdd }) => {
  const [friendName, setFriendName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!friendName.trim()) return;
    onAdd(friendName);
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>친구 추가</h3>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="친구 닉네임"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />
          <ButtonGroup>
            <AddButton type="submit">추가</AddButton>
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
  width: 300px;
  color: white;
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
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const AddButton = styled(Button)`
  background: #90EE90;
`;

const CancelButton = styled(Button)`
  background: #FF4444;
  color: white;
`;

export default AddFriendModal;