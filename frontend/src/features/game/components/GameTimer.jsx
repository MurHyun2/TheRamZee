import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import gaegeImage from'../../../assets/images/object/gaege.png';
import diaImage from'../../../assets/images/object/PAN.png';

const GameTimer = () => {
  const { gameState, setGameState, cancelAction, moveForest } = useGame();
  const INITIAL_TIME = 210; // 4분
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let timerInterval;

    if (gameState.isStarted && !gameState.isPaused && gameState.timer > 0) {
      timerInterval = setInterval(() => {
        setGameState(prev => {
          const newTimer = prev.timer - 1;

          if (newTimer === 0) {
            cancelAction();
            moveForest(1);
            navigate(`/game/${roomId}/main`);
            return {
              ...prev,
              timer: 0,
              isVoting: true,
              votes: {}
            };
          }

          return {
            ...prev,
            timer: newTimer
          };
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [gameState.isStarted, gameState.isPaused, gameState.timer]);

  const getProgressBarColor = (timer) => {
    const percentage = (timer / INITIAL_TIME) * 100;
    if (percentage > 66) return '#4CAF50'; // 녹색
    if (percentage > 33) return '#FFC107'; // 노란색
    return '#FF5252'; // 빨간색
  };

  useEffect(() => {
    const font = new FontFace(
      'NeoDunggeunmoPro-Regular',
      `url('/fonts/NeoDunggeunmoPro-Regular.ttf')`,
      { display: 'swap' }
    );

    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {});
  }, []);

  return (
    <TimerContainer>
      <TimeText>남은 시간</TimeText>
      <ProgressBarContainer>
        <ProgressBar 
          $progress={(gameState.timer / INITIAL_TIME) * 100}
          $color={getProgressBarColor(gameState.timer)}
        />
      </ProgressBarContainer>
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  background-image: url(${diaImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 200px;  /* 크기 살짝 줄이기 */
  height: 100px; /* 크기 살짝 줄이기 */
  padding: 15px; /* 내부 패딩 조정 */
  position: relative;
  z-index: 1001;
`;

const TimeText = styled.div`
  font-size: 1.5rem; /* 글씨 크기 약간 줄이기 */
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif;  
  color: white;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 12px; /* 글씨와 바 사이 간격 줄이기 */
`;

const ProgressBarContainer = styled.div`
  width: 80%;  /* 판자 크기에 맞게 조정 */
  height: 25px; /* 게이지 바 크기 약간 줄이기 */
  background-image: url(${gaegeImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  
`;

const ProgressBar = styled.div`
  height: 50%;
  width: ${props => props.$progress}%;
  max-width: 100%;  /* 바가 초과되지 않도록 */
  background-color: ${props => props.$color};
  border-radius: 5px;
  transition: width 1s linear, background-color 0.5s ease-in-out;

  @keyframes flash {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  animation: ${props => props.$progress <= 25 ? 'flash 1s infinite' : 'none'};
`;

export default GameTimer;
