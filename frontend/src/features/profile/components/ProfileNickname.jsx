import React from 'react';
import styled from 'styled-components';
import { useUser } from '../../../contexts/UserContext';

const ProfileNickname = () => {
  const { nickname } = useUser();

  return (
    <NicknameContainer>
      <NicknameText>{nickname || '닉네임'}</NicknameText>
    </NicknameContainer>
  );
};

const NicknameContainer = styled.div`
  // width: 100%;
  padding: 1rem;
  background-color: rgba(45, 24, 16, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  // margin-bottom: 1rem;
  padding: 1rem;
`;

const NicknameText = styled.span`
  display: block;
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

export default ProfileNickname;