import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const FairyCatchingGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [sprites, setSprites] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // 30초 제한시간
  const gameAreaRef = useRef(null);
  const spawnTimerRef = useRef(null);

  useEffect(() => {
    startSpawning();
    // 제한시간 타이머
    const timeInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(timeInterval);
          setTimeout(onClose, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      clearInterval(timeInterval);
    };
  }, []);

  const startSpawning = () => {
    spawnTimerRef.current = setInterval(() => {
      if (!gameOver) {
        spawnSprite();
      }
    }, 500); // 0.5초마다 생성 (더 빠르게)
  };

  const spawnSprite = () => {
    if (sprites.length >= 12) return; // 최대 12개까지 생성 가능

    const isFairy = Math.random() > 0.4; // 60% 진짜 요정, 40% 가짜 요정
    const newSprite = {
      id: Date.now(),
      x: Math.random() * 360 + 20,
      y: Math.random() * 360 + 20,
      isFairy,
      speed: 3 + Math.random() * 3, // 더 빠른 속도
      direction: Math.random() * Math.PI * 2,
      size: isFairy ? 40 : 35,
    };

    setSprites(prev => [...prev, newSprite]);

    // 7초 후 자동 삭제 (더 짧게)
    setTimeout(() => {
      setSprites(prev => prev.filter(sprite => sprite.id !== newSprite.id));
    }, 3000);
  };

  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (!gameOver) {
        setSprites(prev => prev.map(sprite => {
          let newX = sprite.x + Math.cos(sprite.direction) * sprite.speed;
          let newY = sprite.y + Math.sin(sprite.direction) * sprite.speed;

          if (newX <= 0 || newX >= 400) {
            sprite.direction = Math.PI - sprite.direction;
            newX = sprite.x;
          }
          if (newY <= 0 || newY >= 400) {
            sprite.direction = -sprite.direction;
            newY = sprite.y;
          }

          return {
            ...sprite,
            x: newX,
            y: newY
          };
        }));
      }
    }, 30);

    return () => clearInterval(moveInterval);
  }, [gameOver]);

  const handleSpriteClick = (sprite, e) => {
    e.stopPropagation();
    if (gameOver) return;

    setSprites(prev => prev.filter(s => s.id !== sprite.id));

    if (sprite.isFairy) {
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore >= 10) {
          setGameOver(true);
          if (gameState.role === 'good') {
            setGameState(prev => ({
              ...prev,
              heldAcorns: prev.heldAcorns + 3
            }));
          }
          setTimeout(onComplete, 1500);
        }
        return newScore;
      });
    } else {
      setMistakes(prev => {
        const newMistakes = prev + 1;
        if (newMistakes >= 1) {
          setGameOver(true);
          setTimeout(onClose, 1500);
        }
        return newMistakes;
      });
    }
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>✨ 요정 잡기</GameTitle>
        
        <StatusBar>
          <div>잡은 요정: {score}/10</div>
          <Timer $timeLeft={timeLeft}>남은 시간: {timeLeft}초</Timer>
        </StatusBar>

        <GameArea ref={gameAreaRef}>
          {sprites.map(sprite => (
            <Sprite
              key={sprite.id}
              $isFairy={sprite.isFairy}
              style={{
                left: `${sprite.x}px`,
                top: `${sprite.y}px`,
                width: `${sprite.size}px`,
                height: `${sprite.size}px`
              }}
              onClick={(e) => handleSpriteClick(sprite, e)}
            >
              {sprite.isFairy ? '🧚' : '👻'}
            </Sprite>
          ))}
        </GameArea>

        <Instructions>
          • 30초 안에 진짜 요정(🧚) 10마리를 잡으세요!<br/>
          • 가짜 요정(👻)을 조심하세요!<br/>
          • 실수하면 바로 게임 오버!
        </Instructions>

        {gameOver && score >= 10 && (
          <SuccessMessage>🎉 요정을 모두 잡았습니다!</SuccessMessage>
        )}
        
        {gameOver && mistakes >= 1 && (
          <FailMessage>가짜 요정에게 속았네요...</FailMessage>
        )}

        {gameOver && timeLeft <= 0 && (
          <FailMessage>시간이 초과되었습니다!</FailMessage>
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
  border-radius: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const GameTitle = styled.h2`
  font-family: 'JejuHallasan';
  text-align: center;
  margin: 0;
  color: #2D3748;
  font-size: 24px;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  padding: 10px;
  background: #F7FAFC;
  border-radius: 8px;
  font-weight: bold;
  color: #4A5568;
`;

const Timer = styled.div`
  color: ${props => props.$timeLeft <= 10 ? '#E53E3E' : '#4A5568'};
  ${props => props.$timeLeft <= 10 && `
    animation: pulse 1s infinite;
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `}
`;

const GameArea = styled.div`
  width: 400px;
  height: 400px;
  background: #2D3748;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const Sprite = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  user-select: none;
  transform: translate(-50%, -50%);
  transition: transform 0.1s;
  filter: ${props => props.$isFairy ? 'drop-shadow(0 0 5px #FFF5) drop-shadow(0 0 10px #FFF5)' : 'none'};

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const Instructions = styled.p`
  text-align: center;
  color: #4A5568;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  padding: 10px;
  background: #F7FAFC;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
`;

const SuccessMessage = styled.div`
  text-align: center;
  color: #48BB78;
  font-size: 20px;
  font-weight: bold;
  animation: bounce 0.5s infinite alternate;

  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }
`;

const FailMessage = styled.div`
  text-align: center;
  color: #E53E3E;
  font-size: 20px;
  font-weight: bold;
`;

export default FairyCatchingGame;