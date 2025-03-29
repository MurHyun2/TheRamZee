import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import { backgroundImages, characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';
import { useNavigate, useParams } from 'react-router-dom';

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MiniMap from '../components/MiniMap';
import SnakeGame from '../components/missions/SnakeGame';
import MatchingGame from '../components/missions/MatchingGame';
import MushiroomCollectionGame from '../components/missions/MushiroomCollectionGame';
import snake from '../../../assets/images/object/snake.png';
import mushroom from '../../../assets/images/object/mushroom.png';
import tree from '../../../assets/images/object/tree.png';
import { leaveRoom } from '../../../api/room';
import { disconnectSocket } from '../../../api/stomp';
import { useAuth } from '../../../contexts/AuthContext';

const TwistedForest = () => {
  const { gameState, completeMission } = useGame();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  
  const showDescriptionOverlay = () => setIsDescriptionVisible(true);
  const hideDescriptionOverlay = () => setIsDescriptionVisible(false);
  
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { handleLogout2 } = useAuth();
  const {
    subscribers,
    leaveSession,
  } = useOpenVidu();
   
  // 현재 사용자가 위치한 숲 번호 가져오기
  const currentForestNum = gameState.forestNum;
  const currentForestUser = gameState.forestUsers?.[currentForestNum];
  
  const filteredSubscribers = subscribers.filter(sub => {
    try {
      // 🔥 JSON 데이터와 추가 문자열(`%/%닉네임`) 분리
      const rawData = sub.stream.connection.data.split("%/%")[0]; 
      const subData = JSON.parse(rawData); // {"clientData": "test1"}
      const subscriberNickname = subData.clientData;

      // 🔥 현재 숲에 속한 유저(`currentForestUser`)와 일치하는 경우만 필터링
      return currentForestUser?.includes(subscriberNickname);
    } catch (error) {
      return false; // 파싱 실패한 경우 필터링에서 제외
    }
  });

  const leftFilterCam = filteredSubscribers.slice(0, 3);
  const rightFilterCam = filteredSubscribers.slice(3, 7);
  
  const isMissionCompleted = (missionId) => {
    const missionNum = missionId === 'snake' ? 1 : 
                      missionId === 'matching' ? 2 : 3;
    return gameState[`2_${missionNum}`][0]; // gameState에서 미션 완료 상태 확인
  };

  const handleMissionClick = (missionId) => {
    if (isMissionCompleted(missionId)) return;
    if (gameState.fatigue < 1) return;
    if (gameState.evilSquirrel) return;
    setCurrentMission(missionId);
    setShowMiniGame(true);
  };

  const handleMissionComplete = async () => {
    try {
      const missionNum = currentMission === 'snake' ? 1 : 
                        currentMission === 'matching' ? 2 : 3;
      
      await completeMission(2, missionNum);
      setShowMiniGame(false);
      setCurrentMission(null);
    } catch (error) {
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => { 
          handleExit2();
    
        };
            const handleExit2 = () => {
              disconnectSocket();
              leaveRoom(roomId);
              leaveSession();
              handleLogout2();
            }

    if (gameState.isStarted && gameState.evilSquirrel !== null) {
      const cursorImage = gameState.evilSquirrel ? characterImages.badSquirrel : characterImages.goodSquirrel;
      document.body.style.cursor = `url("${cursorImage}") 16 16, auto`;
    } else {
      document.body.style.cursor = 'auto';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameState.isStarted, gameState.evilSquirrel,roomId, navigate]);

  const gameLayoutProps = {
    // 기본 레이아웃 요소
    leftVideoGrid: <VideoGrid players={leftFilterCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightFilterCam} totalSlots={2} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    myVideo: <MyVideo />,
    miniMap: <MiniMap />,
    
    // 미션 관련
    missionButtons: (
      <MissionButtons>
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('snake')}
            completed={isMissionCompleted('snake')}
          >
            <MissionImage src={snake} alt="snake mission" />
            {isMissionCompleted('snake') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('matching')}
            completed={isMissionCompleted('matching')}
          >
            <MissionImage src={tree} alt="matching mission" />
            {isMissionCompleted('matching') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('mushroom')}
            completed={isMissionCompleted('mushroom')}
          >
            <MissionImage src={mushroom} alt="mushroom mission" />
            {isMissionCompleted('mushroom') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
      </MissionButtons>
    ),
    
    // 미니게임 오버레이
    miniGameOverlay: showMiniGame && (
      currentMission === 'snake' ? (
        <SnakeGame
          onComplete={handleMissionComplete}
          onClose={() => {
            setShowMiniGame(false);
            setCurrentMission(null);
          }}
        />
      ) : currentMission === 'matching' ? (
        <MatchingGame
          onComplete={handleMissionComplete}
          onClose={() => {
            setShowMiniGame(false);
            setCurrentMission(null);
          }}
        />
      ) : currentMission === 'mushroom' ? (
        <MushiroomCollectionGame
          onComplete={handleMissionComplete}
          onClose={() => {
            setShowMiniGame(false);
            setCurrentMission(null);
          }}
        />
      ) : null
    ),
    
    // 기타
    isGameStarted: gameState.isStarted,
    background: backgroundImages.twistedForest,
    mainForestButtons: null,
    voteScreen: null,

    isDescriptionVisible,
    onShowDescription: showDescriptionOverlay,
    onHideDescription: hideDescriptionOverlay,
  };

  return <GameLayout {...gameLayoutProps} />;
};

const MissionButtons = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 100px;
`;

const MissionButtonWrapper = styled.div`
  position: absolute;
  &:nth-child(1) {
    top: 7vh;
    right: 15vw;
  }
  &:nth-child(2) {
    top: 33vh;
    left: -68vh;
  }
  &:nth-child(3) {
    bottom: -30vh;
    left: 68vh;
    transform: translateX(-50%);
  }
`;

const StyledMissionButton = styled.button`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
   background: transparent; // 추가
  border: none; // 추가
  padding: 0; // 추가
  opacity: ${props => props.completed ? 0.5 : 1};
  cursor: ${props => props.completed ? 'not-allowed' : 'pointer'};
  
  &:hover {
    transform: ${props => props.completed ? 'none' : 'scale(1.1)'};
  }
`;

const MissionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CompletedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: red;
  font-size: 70px;
`;

export default TwistedForest;