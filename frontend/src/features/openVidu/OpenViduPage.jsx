import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useOpenVidu } from '../../contexts/OpenViduContext';
import { useAuth } from '../../contexts/AuthContext';
import { leaveRoom } from '../../api/room';
import { disconnectSocket } from '../../api/stomp';

const OpenViduPage = () => {
  const { handleLogout2 } = useAuth();
  const { joinSession, leaveSession } = useOpenVidu();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const nickname = sessionStorage.getItem('nickName') || 'Guest';
  const token = sessionStorage.getItem('openViduToken');

  const [localStream, setLocalStream] = useState(null);
  const videoRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);

  // 로컬 스트림 가져오기
  useEffect(() => {
    async function initLocalStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }
    initLocalStream();
  }, []);

  // video 태그에 로컬 스트림 연결
  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // "게임에 입장하기" 버튼 클릭 시 session 참가
  const enterGame = async () => {
    setIsDisabled(true); // 버튼 비활성화
    setTimeout(() => setIsDisabled(false), 5000); // 5초 후 다시 활성화
    await joinSession(token, nickname);
    navigate(`/room/${roomId}/game`);
  };

  // 페이지 종료나 뒤로가기 시 클린업
  useEffect(() => {
    const cleanup = () => {
      disconnectSocket();
      leaveRoom(roomId);
      leaveSession();
      handleLogout2();
    };

    const handleBeforeUnload = () => {
      cleanup();
    };

    const handlePopState = () => {
      cleanup();
      navigate('/rooms');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [roomId, navigate, leaveSession, handleLogout2]);

  return (
    <PreviewContainer>
      <Header>
        <Title>RAMZEE 미리보기</Title>
      </Header>
      <VideoWrapper>
        {localStream ? (
          <video autoPlay muted playsInline ref={videoRef} style={{ width: '100%' }} />
        ) : (
          <Placeholder>Loading...</Placeholder>
        )}
      </VideoWrapper>
      <ButtonGroup>
      <EnterButton onClick={enterGame} disabled={isDisabled}>
        {isDisabled ? '게임 입장중...' : '게임에 입장하기'}
      </EnterButton>
      </ButtonGroup>
    </PreviewContainer>
  );
};

export default OpenViduPage;

// 스타일 컴포넌트
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: rgba(34, 17, 7, 0.9);
`;

const Header = styled.div``;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #a4e17d; /* 밝은 녹색 */
`;

const VideoWrapper = styled.div`
  width: 60%;
  max-width: 650px;
  margin: 2rem auto;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  background-color: #444;
  color: #fff;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const EnterButton = styled.button`
  background-color: #a4e17d;
  color: black;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.2rem;
`;
