import React, { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';
import snake from './snake.png';

const SnakeGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    if (Math.random() < 0.04) {
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 1
        }));
      }
      onComplete();
    }
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>뱀 죽이기</GameTitle>
        <GameDescription>4%확률로 '뱀'이 죽습니다</GameDescription>
        <SnakeContainer>
          <SnakeSprite onClick={handleClick}>
            <img src={snake} alt="Snake" />
          </SnakeSprite>
          <ClickCounter>클릭 횟수: {clicks}</ClickCounter>
        </SnakeContainer>
      </GameContent>
    </GameOverlay>
  );
};

const GameOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const GameDescription = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
`;

const GameContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
`;

const GameTitle = styled.h2`
  font-family: 'JejuHallasan';
  text-align: center;
  margin-bottom: 20px;
`;

const SnakeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const SnakeSprite = styled.div`
  cursor: pointer;
  transition: transform 0.1s;
  
  &:active {
    transform: scale(0.95);
  }
`;

const ClickCounter = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #4a5568;
`;

export default SnakeGame;
