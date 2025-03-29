import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import { backgroundImages, characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MiniMap from '../components/MiniMap';
import MazeGame from '../components/missions/MazeGame';
import VineSlashGame from '../components/missions/VineSlashGame';
import PlantGame from '../components/missions/PlantTimingGame'
import flyhell from '../../../assets/images/object/flyhell.png'
import weed from '../../../assets/images/object/weed.png'
import ram from '../../../assets/images/object/ram.png'
import { leaveRoom } from '../../../api/room';
import { disconnectSocket } from '../../../api/stomp';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';


const BreathingForest = () => {
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
  
  const currentForestNum = gameState.forestNum;
  const currentForestUser = gameState.forestUsers?.[currentForestNum];
  
  const filteredSubscribers = subscribers.filter(sub => {
    try {
      const rawData = sub.stream.connection.data.split("%/%")[0];
      const subData = JSON.parse(rawData);
      const subscriberNickname = subData.clientData;
      return currentForestUser?.includes(subscriberNickname);
    } catch (error) {
      return false;
    }
  });

  const leftFilterCam = filteredSubscribers.slice(0, 3);
  const rightFilterCam = filteredSubscribers.slice(3, 7);

  const isMissionCompleted = (missionId) => {
    const missionNum = missionId === 'maze' ? 1 : missionId === 'vine' ? 2 : 3;
    return gameState[`7_${missionNum}`][0];
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
      const missionNum = currentMission === 'maze' ? 1 : currentMission === 'vine' ? 2 : 3;
      await completeMission(7, missionNum);
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
    leftVideoGrid: <VideoGrid players={leftFilterCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightFilterCam} totalSlots={2} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    myVideo: <MyVideo />,
    miniMap: <MiniMap />,
    missionButtons: (
      <MissionButtons>
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('maze')}
            completed={isMissionCompleted('maze')}
          >
            <MissionImage src={flyhell} alt="maze mission" />
            {isMissionCompleted('maze') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('vine')}
            completed={isMissionCompleted('vine')}
          >
            <MissionImage src={weed} alt="vine mission" />
            {isMissionCompleted('vine') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('plant')}
            completed={isMissionCompleted('plant')}
          >
            <MissionImage src={ram} alt="plant mission" />
            {isMissionCompleted('plant') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
      </MissionButtons>
    ),
    miniGameOverlay: showMiniGame && (
      currentMission === 'maze' ? (
        <MazeGame onComplete={handleMissionComplete} onClose={() => { setShowMiniGame(false); setCurrentMission(null); }} />
      ) : currentMission === 'vine' ? (
        <VineSlashGame onComplete={handleMissionComplete} onClose={() => { setShowMiniGame(false); setCurrentMission(null); }} />
      ) : currentMission === 'plant' ? (
        <PlantGame onComplete={handleMissionComplete} onClose={() => { setShowMiniGame(false); setCurrentMission(null); }} />
      ) : null
    ),
    isGameStarted: gameState.isStarted,
    background: backgroundImages.breathingForest,
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
    top: 27vh;
    right: -30vw;
  }
  &:nth-child(2) {
    top: 7vh;
    right: -7vw;
  }
  &:nth-child(3) {
    bottom: -40vh;
    left: -28vw;
    transform: translateX(-50%);
  }
`;

const StyledMissionButton = styled.button`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  padding: 0;
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

export default BreathingForest;
