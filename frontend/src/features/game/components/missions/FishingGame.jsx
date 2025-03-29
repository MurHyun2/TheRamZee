import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const FishingGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [isBiting, setIsBiting] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [showGuide, setShowGuide] = useState(true);
  const animationRef = useRef();
  const targetZone = { start: 45, end: 55 };

  const animate = () => {
    setPosition((prev) => {
      const newPos = prev + 1;
      return newPos > 100 ? 0 : newPos;
    });
    animationRef.current = requestAnimationFrame(animate);
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameResult(null);
    setShowGuide(false);
    const biteTime = 1000 + Math.random() * 3000;
    setTimeout(() => {
      setIsBiting(true);
      setTimeout(() => {
        if (isPlaying) {
          setIsBiting(false);
          setGameResult('fail');
          setIsPlaying(false);
        }
      }, 2000);
    }, biteTime);

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleCatch = () => {
    if (!isPlaying || !isBiting) return;

    cancelAnimationFrame(animationRef.current);
    setIsPlaying(false);
    setIsBiting(false);

    const isSuccess = position >= targetZone.start && position <= targetZone.end;
    setGameResult(isSuccess ? 'success' : 'fail');

    if (isSuccess) {
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 3
        }));
      }
      setTimeout(() => onComplete(), 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <GameTitle>도토리 낚기 게임</GameTitle>

        <FishingContainer>
          <LakeBackground>
            {isBiting && <Ripple />}
          </LakeBackground>

          <GaugeContainer>
            <TargetZone 
              style={{
                left: `${targetZone.start}%`,
                width: `${targetZone.end - targetZone.start}%`,
              }}
            />
            <Indicator style={{ left: `${position}%` }} />
          </GaugeContainer>

          {showGuide && (
            <Message>
              시작 버튼을 누르고 도토리가 걸리면 타이밍에 맞춰 잡으세요!
            </Message>
          )}
          
          {isBiting && (
            <Message $type="biting">도토리가 걸렸다!</Message>
          )}
          
          {gameResult === 'success' && (
            <Message $type="success">도토리를 낚았다!</Message>
          )}
          
          {gameResult === 'fail' && (
            <Message $type="fail">도토리를 놓쳤다...</Message>
          )}

          {!isPlaying && !gameResult && (
            <GameButton onClick={startGame}>시작</GameButton>
          )}
          
          {isPlaying && (
            <GameButton onClick={handleCatch}>낚기!</GameButton>
          )}
          
          {gameResult === 'fail' && (
            <GameButton onClick={startGame}>다시하기</GameButton>
          )}
        </FishingContainer>
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

const FishingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LakeBackground = styled.div`
  background: #add8e6;
  height: 200px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const Ripple = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ripple-effect 2s infinite;

  @keyframes ripple-effect {
    from {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
`;

const GaugeContainer = styled.div`
  height: 20px;
  background: #ddd;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const TargetZone = styled.div`
  background: rgba(0, 255, 0, 0.5);
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
`;

const Indicator = styled.div`
  width: 10px;
  height: 20px;
  background: red;
  position: absolute;
  top: 0;
  z-index: 2;
`;

const Message = styled.div`
  text-align: center;
  font-size: 16px;
  color: ${props => {
    switch(props.$type) {
      case 'biting': return '#ed8936';
      case 'success': return '#48bb78';
      case 'fail': return '#e53e3e';
      default: return '#4a5568';
    }
  }};
`;

const GameButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background: #4299e1;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: #3182ce;
  }
`;

export default FishingGame;