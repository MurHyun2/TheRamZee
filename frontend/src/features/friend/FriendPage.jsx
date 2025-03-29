import React from 'react';
import styled from 'styled-components';
import FriendList from './components/FriendList';
import FriendRequest from './components/FriendRequest';

const FriendPage = () => {
  return (
    <FriendPageContainer>
      <Header>
        <Title>친구 목록</Title>
      </Header>
      
      <ContentSection>
        {/* 친구 목록 섹션 */}
        <Section>
          <FriendList />
        </Section>

        {/* 친구 요청 섹션 */}
        <Section>
          <FriendRequest />
        </Section>
      </ContentSection>
    </FriendPageContainer>
  );
};

const FriendPageContainer = styled.div`
  height: 100%;
  background-color: rgba(45, 24, 16, 0.95);
  color: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin: 0;
`;

const ContentSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

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

const Section = styled.div`
  margin-bottom: 2rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;

  h1 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  input {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 0.5rem;
    color: white;
    width: 100%;
    margin-bottom: 1rem;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  button {
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
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

export default FriendPage;