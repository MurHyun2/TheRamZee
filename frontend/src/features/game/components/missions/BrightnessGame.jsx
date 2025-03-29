import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const BrightnessGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const getRandomMultipleOfFive = (min, max) => {
    const range = Math.floor((max - min) / 5) + 1;
    return min + 5 * Math.floor(Math.random() * range);
  };

  const [brightness, setBrightness] = useState(() => getRandomMultipleOfFive(5, 25));
  const targetBrightness = 90;

  const handleScroll = (event) => {
    event.preventDefault();
    setBrightness(prev => {
      const newBrightness = prev + (event.deltaY > 0 ? -5 : 5);
      return Math.max(0, Math.min(100, newBrightness));
    });
  };

  useEffect(() => {
    if (brightness === targetBrightness) {
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 3
        }));
      }
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  }, [brightness]);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <GameOverlay onClick={onClose}>
      <GameContent 
        onClick={e => e.stopPropagation()} 
        style={{ filter: `brightness(${brightness}%)` }}
      >
        <CloseButton onClick={onClose}>×</CloseButton>
        <GameTitle>🌞 밝기 조절</GameTitle>

        <BrightnessInfo>
          목표 밝기: {targetBrightness}%<br />
          현재 밝기: {brightness}%
        </BrightnessInfo>

        <ScrollHint>마우스 휠을 사용하여 밝기를 조절하세요</ScrollHint>

        {brightness === targetBrightness && (
          <SuccessMessage>✔ 밝기 조절 성공!</SuccessMessage>
        )}
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

const GameContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  position: relative;
`;

const GameTitle = styled.h2`
  font-family: 'JejuHallasan';
  text-align: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: #e53e3e;
  }
`;

const BrightnessInfo = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
  color: #4a5568;
`;

const ScrollHint = styled.div`
  text-align: center;
  color: #718096;
  margin-top: 20px;
`;

const SuccessMessage = styled.div`
  text-align: center;
  color: #48bb78;
  font-size: 20px;
  margin-top: 20px;
  animation: bounce 0.5s infinite alternate;

  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }
`;

export default BrightnessGame;