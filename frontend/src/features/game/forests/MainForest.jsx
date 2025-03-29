import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import { backgroundImages, characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';
import { useNavigate, useParams } from 'react-router-dom';
import GameOverScreen from '../components/GameOverScreen';

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MainForestButtons from '../components/MainForestButtons';
import MiniMap from '../components/MiniMap';
import EmergencyVoteModal from '../../game/components/vote/EmergencyVoteModal';
import FinalVoteModal from '../../game/components/vote/FinalVoteModal';
import { leaveRoom } from '../../../api/room';
import { disconnectSocket } from '../../../api/stomp';
import { useAuth } from '../../../contexts/AuthContext';

const MainForest = () => {
  const { gameState, players, setGameState, endVote } = useGame();
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { handleLogout2 } = useAuth();
  const { subscribers, leaveSession } = useOpenVidu();

  const nickName = sessionStorage.getItem('nickName');
  const [timeLeft, setTimeLeft] = useState(60);
  const [lastTimeLeft, setLastTimeLeft] = useState(60);

  // 각 상황별 트랜지션(오버레이) 상태
  const [showGameOverOverlay, setShowGameOverOverlay] = useState(false);
  const [showEmergencyOverlay, setShowEmergencyOverlay] = useState(false);
  const [showFinalOverlay, setShowFinalOverlay] = useState(false);

  // 트랜지션 종료 후 모달 혹은 스크린 표시 상태
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showLastVoteModal, setShowLastVoteModal] = useState(false);

  // 게임 오버: gameState.isGameOver가 true면 5초 동안 오버레이를 보여주고 그 후 GameOverScreen을 렌더링  
  useEffect(() => {
    if (gameState.isGameOver) {
      setShowGameOverOverlay(true);
      const timer = setTimeout(() => {
        setShowGameOverOverlay(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isGameOver]);

  // 긴급 투표: gameState.isVoting && gameState.isEmergencyVote이면 5초 동안 오버레이 후 모달 표시  
  useEffect(() => {
    if (gameState.isVoting && gameState.isEmergencyVote) {
      setShowEmergencyOverlay(true);
      setShowEmergencyModal(false);
      const timer = setTimeout(() => {
        setShowEmergencyOverlay(false);
        setShowEmergencyModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isVoting, gameState.isEmergencyVote]);

  // 최종 투표: gameState.isVoting && !gameState.isEmergencyVote이면 5초 동안 오버레이 후 모달 표시  
  useEffect(() => {
    if (gameState.isVoting && !gameState.isEmergencyVote) {
      setShowFinalOverlay(true);
      setShowLastVoteModal(false);
      const timer = setTimeout(() => {
        setShowFinalOverlay(false);
        setShowLastVoteModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isVoting, gameState.isEmergencyVote]);

  // 긴급 투표 모달 타이머: 모달이 표시되면 1초 단위로 카운트 다운 후 handleEmergencyEnd 실행  
  useEffect(() => {
    if (showEmergencyModal) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleEmergencyEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showEmergencyModal, gameState.isVoting, gameState.isEmergencyVote, gameState.votedPlayers, setGameState]);

  // 최종 투표 모달 타이머: 모달이 표시되면 1초 단위로 카운트 다운 후 handleLastVoteEnd 실행  
  useEffect(() => {
    if (showLastVoteModal) {
      const timer = setInterval(() => {
        setLastTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleLastVoteEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showLastVoteModal, gameState.isVoting, gameState.isEmergencyVote, gameState.votedPlayers, setGameState]);

  // 긴급 투표 처리 함수  
  const handleEmergencyEnd = () => {
    setGameState(prev => {
      const updates = {
        ...prev,
        isVoting: false,
        isEmergencyVote: false,
        votingInProgress: false,
        totalVote: 0,
        votedPlayers: [],
        isPaused: false,
      };
      for (const player of gameState.votedPlayers) {
        updates[player] = 0;
      }
      return updates;
    });
    const result = endVote(gameState.votedPlayers);

    if (result != null) {
      if (result === gameState.evilSquirrelNickname) {
        setGameState(prev => ({
          ...prev,
          isGameOver: true,
          winner: 'good',
          gameOverReason: 'emergency',
          isStarted: false,
        }));
      } else {
        setGameState(prev => {
          const newKilledPlayers = [...prev.killedPlayers, result];
          const updates = {
            ...prev,
            killedPlayers: newKilledPlayers,
          };

          if (updates.count - newKilledPlayers.length <= 2) {
            updates.isGameOver = true;
            updates.gameOverReason = 'kill';
            updates.winner = 'bad';
            updates.isStarted = false;
          }
          if (result === nickName) {
            updates.isDead = true;
          }
          return updates;
        });
      }
    }
    setShowEmergencyModal(false);
  };

  // 최종 투표 처리 함수  
  const handleLastVoteEnd = () => {
    const result = endVote(gameState.votedPlayers);
    if (result === gameState.evilSquirrelNickname) {
      setGameState(prev => {
        const updates = {
          ...prev,
          isGameOver: true,
          winner: 'good',
          gameOverReason: 'time',
          isStarted: false,
        };
        for (const player of gameState.votedPlayers) {
          updates[player] = 0;
        }
        return updates;
      });
    } else {
      setGameState(prev => {
        const updates = {
          ...prev,
          isGameOver: true,
          winner: 'bad',
          gameOverReason: 'time',
          isStarted: false,
        };
        for (const player of gameState.votedPlayers) {
          updates[player] = 0;
        }
        return updates;
      });
    }
    setShowLastVoteModal(false);
  };

  // 현재 숲의 사용자 필터링  
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

  // 커서 효과 설정  
  useEffect(() => {
    const handleBeforeUnload = () => { 
      handleExit2();
    };
    const handleExit2 = () => {
      disconnectSocket();
      leaveRoom(roomId);
      leaveSession();
      handleLogout2();
    };
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
  }, [gameState.isStarted, gameState.evilSquirrel, roomId, navigate]);

  const handleExitGame = () => {
    navigate('/rooms');
  };

  const gameLayoutProps = {
    leftVideoGrid: <VideoGrid players={leftFilterCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightFilterCam} totalSlots={2} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    myVideo: <MyVideo />,
    miniMap: <MiniMap />,
    mainForestButtons: <MainForestButtons />,
    isGameStarted: gameState.isStarted,
    background: backgroundImages.mainForest,
    missionButtons: null,
    miniGameOverlay: null,
    isDescriptionVisible,
    onShowDescription: () => setIsDescriptionVisible(true),
    onHideDescription: () => setIsDescriptionVisible(false),
  };

  return (
    <>
      {gameState.isGameOver ? (
        <>
          {showGameOverOverlay ? (
            // gameState.winner에 따라 'good' 또는 'bad' variant를 전달합니다.
            <TransitionOverlay variant={gameState.winner === 'good' ? 'good' : 'bad'} />
          ) : (
            <GameOverScreen onExit={() => navigate('/rooms')} />
          )}
        </>
      ) : (
        <>
          <GameLayout {...gameLayoutProps} />
          
          {/* 긴급 투표 */}
          {gameState.isVoting && gameState.isEmergencyVote && (
            <>
              {showEmergencyOverlay ? (
                <TransitionOverlay variant="emergency" />
              ) : (
                showEmergencyModal && (
                  <EmergencyVoteModal
                    isOpen={gameState.isVoting && !gameState.isDead}
                    players={players.filter(p => !gameState.killedPlayers.includes(p.nickName))}
                    roomId={roomId}
                    timeLeft={timeLeft}
                  />
                )
              )}
            </>
          )}

          {/* 최종 투표 */}
          {gameState.isVoting && !gameState.isEmergencyVote && (
            <>
              {showFinalOverlay ? (
                <TransitionOverlay variant="final" />
              ) : (
                showLastVoteModal && (
                  <FinalVoteModal
                    isOpen={gameState.isVoting && !gameState.isDead}
                    players={players.filter(p => !gameState.killedPlayers.includes(p.nickName))}
                    roomId={roomId}
                    lastTimeLeft={lastTimeLeft}
                  />
                )
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default MainForest;

const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url(${({ variant }) => {
    switch (variant) {
      case 'good':
        return '/path/to/good_transition2.gif'; // 착한 다람쥐 승리 전용 transition
      case 'bad':
        return '/path/to/bad_transition2.gif';  // 나쁜 다람쥐 승리 전용 transition
      case 'emergency':
        return '/path/to/emergency3.gif';
      case 'final':
        return '/path/to/transition4.gif';
    }
  }}) center center no-repeat;
  background-size: cover;
  z-index: 9999;
`;
