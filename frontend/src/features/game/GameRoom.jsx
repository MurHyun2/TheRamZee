import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import { useOpenVidu } from '../../contexts/OpenViduContext';
import { backgroundImages } from '../../assets/images';
import { connectSocket, disconnectSocket } from '../../api/stomp';
import { useGameHandlers } from '../../handlers/gameHandlers';
import { subscribeToTopic } from '../../api/stomp';
import { leaveRoom } from '../../api/room';

// 공통 레이아웃 import
import GameLayout from './components/common/GameLayout';
import RoleReveal from './components/RoleReveal';
import buttonBgImage from'../../assets/images/object/plat.png'
import buttonBgImage2 from'../../assets/images/object/dia.png'

// components import
import VideoGrid from './components/VideoGrid';
import MyVideo from './components/MyVideo';
import GameTimer from './components/GameTimer';
import StatePanel from './components/StatePanel';
import MainForestButtons from './components/MainForestButtons';
import MiniMap from './components/MiniMap';
import { useAuth } from '../../contexts/AuthContext'; // 추가

const GameRoom = () => {
    const { handleLogout2 } = useAuth();
  const navigate = useNavigate();
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  
  const showDescriptionOverlay = () => setIsDescriptionVisible(true);
  const hideDescriptionOverlay = () => setIsDescriptionVisible(false);

  
  const { 
    gameState, 
    startGame, 
    setRoomId,
    setIsConnected,
    setGameState,
    moveForest,
    cancelAction,
    endVote,
  } = useGame();

  const {
    subscribers,
    leaveSession,
  } = useOpenVidu();

  const { roomId } = useParams();  // roomId 가져오기
  const handlers = useGameHandlers(roomId, setGameState, moveForest, cancelAction, endVote);
  const isSubscribed = useRef(false); // 중복 실행 방지 플래그
  const roomHost = sessionStorage.getItem('roomHost') || null;

  useEffect(() => {
    const overlayKey = `overlay_${roomId}`;
    const hasSeenOverlay = localStorage.getItem(overlayKey);

    if (!hasSeenOverlay) {
      setIsDescriptionVisible(true); // Show overlay
      localStorage.setItem(overlayKey, "true"); // Mark as shown
    }

    setRoomId(roomId);
    if (!roomId) {
      return;
    }
    
    setGameState((prev) => ({
      ...prev,
      roomId: roomId,
    }));

    // 소켓 연결 및 구독 
    const connectAndSubscribe = async () => {
      try {
        if (isSubscribed.current) return; // 이미 구독된 경우 실행하지 않음
        isSubscribed.current = true; // 구독 상태 설정

        await connectSocket();
        setIsConnected(true);
        setTimeout(() => {
          subscribeToTopic(`/topic/game/${roomId}/start`, (response) => {
            handlers.handleGameStartResponse(response);
            setShowRoleReveal(true); // 역할 공개 화면 활성화
          });
          subscribeToTopic(`/topic/game/${roomId}/emergency`, handlers.handleEmergencyResponse);
          subscribeToTopic(`/topic/game/${roomId}/move`, handlers.handleMoveResponse);
          subscribeToTopic(`/topic/game/${roomId}/save-acorns`, handlers.handleSaveAcornsResponse);
          subscribeToTopic(`/topic/game/${roomId}/acorns`, handlers.handleResultResponse)
          subscribeToTopic(`/user/queue/game/${roomId}/charge-fatigue`, handlers.handleChargeFatigueResponse);
          subscribeToTopic(`/topic/game/${roomId}/kill`, handlers.handleKillResponse);
          subscribeToTopic(`/topic/game/${roomId}/complete-mission`, handlers.handleCompleteMissionResponse);
          subscribeToTopic(`/topic/game/${roomId}/out`, handlers.handleOutResponse);
          subscribeToTopic(`/topic/game/${roomId}/vote`, handlers.handleVoteResponse);
          subscribeToTopic(`/topic/game/${roomId}/last-vote`, handlers.handleLastVoteResponse);
        }, 100);
      } catch (error) {
      }
    };

    connectAndSubscribe();

    const handleBeforeUnload = () => { 
      handleExit2();
    };
  
    // 뒤로가기 처리
    const handlePopState = () => {
      handleExit();
      navigate('/rooms');
    };
    
    const handleExit2 = () => {
      disconnectSocket();
      leaveRoom(roomId);
      leaveSession();
      handleLogout2();
    }

    // 공통 종료 처리 함수
    const handleExit = () => {
      disconnectSocket();
      leaveRoom(roomId);
      leaveSession();
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [roomId, navigate]);

  // 게임 시작하기 버튼 클릭 
  const clkStart = () => {
    startGame();
  };

  // 방 나가기 버튼 클릭 
  const clkExit = () => {
    disconnectSocket();
    leaveRoom(roomId);
    leaveSession();
    navigate('/rooms');
  };

  const leftCam = subscribers.slice(0, 3);
  const rightCam = subscribers.slice(3, 7);

  // GameLayout에 전달할 컴포넌트들
  const gameLayoutProps = {
      
    leftVideoGrid: <VideoGrid players={leftCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightCam} totalSlots={2} gridPosition="right" />,

    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    buttonContainer: (
      <ButtonContainer>
        <StartButton 
          onClick={clkStart} 
          disabled={roomHost !== "true"}
        >
          게임 시작
        </StartButton>
        <ExitButton onClick={clkExit}>나가기</ExitButton>
      </ButtonContainer>  
    ),
    myVideo: <MyVideo />,
    mainForestButtons: <MainForestButtons />,
    miniMap: <MiniMap />,
    isGameStarted: gameState.isStarted,
    background: backgroundImages.mainForest,
    miniGameOverlay: null,   // GameRoom에서는 미니게임 없음
    voteScreen: null,        // GameRoom에서는 투표 화면 없음

      // 설명서 관련 props 전달
    isDescriptionVisible,
    onShowDescription: showDescriptionOverlay,
    onHideDescription: hideDescriptionOverlay,
  };
  
  return (
    <>
      <GameLayout {...gameLayoutProps}/>
      {showRoleReveal && <RoleReveal roomId={roomId} />}
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StartButton = styled.button`
  padding: 15px 30px;
  background-image: url(${buttonBgImage});
  background-size: 100% 100%;  // 버튼 크기에 맞게 이미지 조절
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.5rem;
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif;
  min-width: 200px;          // 최소 너비 설정
  min-height: 70px;          // 최소 높이 설정
  color: white;              // 텍스트 색상
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);  // 텍스트 가독성
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);  // 호버 시 약간 확대
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active {
    transform: scale(0.95);  // 클릭 시 약간 축소
  }
`;

const ExitButton = styled(StartButton)`
  // StartButton의 스타일을 상속받고, 호버 색상만 변경
  background-image: url(${buttonBgImage2});
  &:hover {
    transform: scale(1.05);
  }
`;

export default GameRoom;