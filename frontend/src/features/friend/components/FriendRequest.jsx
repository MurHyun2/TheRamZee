import React, { useState, useContext } from 'react';
import { FriendContext } from '../../../contexts/FriendContext';
import styled from 'styled-components';

const FriendRequest = () => {
  const { friendRequests, sendFriendRequest, acceptFriendRequest } = useContext(FriendContext);
  const [friendNickname, setFriendNickname] = useState('');

  const handleSendRequest = async () => {
    if (!friendNickname.trim()) return;

    const success = await sendFriendRequest(friendNickname);
    if (success) {
      alert('친구 요청 전송 완료!');
      setFriendNickname('');
    }
  };

  const handleAcceptRequest = async (senderNickname) => {
    const success = await acceptFriendRequest(senderNickname);
    if (success) {
      alert(`${senderNickname}님의 친구 요청을 수락했습니다!`);
    }
  };

  return (
    <Container>
      <Title>친구 요청</Title>
      <InputGroup>
        <Input
          type="text"
          placeholder="친구 닉네임"
          value={friendNickname}
          onChange={(e) => setFriendNickname(e.target.value)}
        />
        <SendButton onClick={handleSendRequest}>보내기</SendButton>
      </InputGroup>

      <SubTitle>받은 요청 목록</SubTitle>
      <RequestList>
        {friendRequests.map((request) => (
          <RequestItem key={request.senderNickname || request}>
            <RequestInfo>{request.senderNickname}</RequestInfo>
            {request.senderStatus === 'REQUESTED' && (
              <AcceptButton onClick={() => handleAcceptRequest(request.senderNickname)}>
                수락
              </AcceptButton>
            )}
          </RequestItem>
        ))}
      </RequestList>
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
`;

const SubTitle = styled.h2`
  font-size: 1.2rem;
  color: white;
  margin: 1.5rem 0 1rem 0;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 16px;
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  background-color: #4a3228;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #5a4238;
  }
`;

const RequestList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RequestItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const RequestInfo = styled.span`
  color: white;
  font-weight: 500;
`;

const AcceptButton = styled.button`
  background-color: #4a3228;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a4238;
  }
`;

export default FriendRequest;