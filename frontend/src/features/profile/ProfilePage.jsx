import React from 'react';
import styled from 'styled-components';
import ProfileCamera from './components/ProfileCamera';
import ProfileNickname from './components/ProfileNickname';
import ProfileSettings from './components/ProfileSettings';

const ProfilePage = () => {
  return (
    <ProfileContainer>
      <Section>
        <ProfileCamera />
      </Section>
      
      <Section>
        <ProfileNickname />
      </Section>
      
      <Section>
        <ProfileSettings />
      </Section>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  // width: 100%;
  // margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

export default ProfilePage;