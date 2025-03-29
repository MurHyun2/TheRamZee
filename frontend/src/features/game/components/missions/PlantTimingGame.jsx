import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const SquirrelGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [position, setPosition] = useState(50);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const targetScore = 10;

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      if (e.key === 'ArrowLeft') {
        setPosition(prev => Math.max(0, prev - 10));
      } else if (e.key === 'ArrowRight') {
        setPosition(prev => Math.min(90, prev + 10));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  // 아이템 생성
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const newItem = {
        id: Date.now(),
        type: Math.random() < 0.7 ? 'good' : 'bad', // 70% 확률로 좋은 도토리
        position: Math.random() * 90,
        top: -20
      };
      setItems(prev => [...prev, newItem]);
    }, 500); // 1초에서 0.5초로 변경

    return () => clearInterval(interval);
  }, [gameOver]);

  // 아이템 이동 및 충돌 검사
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setItems(prev => {
        const newItems = prev.map(item => ({
          ...item,
          top: item.top + 7
        })).filter(item => item.top < 100);

        // 충돌 검사
        newItems.forEach(item => {
          if (item.top >= 70 && item.top <= 80) {
            const itemLeft = item.position;
            const squirrelLeft = position;
            
            if (Math.abs(itemLeft - squirrelLeft) < 15) {
              if (item.type === 'good') {
                setScore(s => s + 1);
                setMessage('도토리 획득! 🌟');
              } else {
                setLives(l => l - 1);
                setMessage('나쁜 도토리! ⚡');
              }
              setItems(prev => prev.filter(i => i.id !== item.id));
            }
          }
        });

        return newItems;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [position, gameOver]);

  // 게임 오버 체크
  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      setTimeout(() => onClose(), 1500);
    }
    if (score >= targetScore) {
      setGameOver(true);
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 1
        }));
      }
      setTimeout(onComplete, 1500);
    }
  }, [lives, score]);

  // 메시지 자동 제거
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>🐿️ 다람쥐의 도토리 수집</GameTitle>
        
        <GameArea>
          <Stats>
            <div>점수: {score} / {targetScore}</div>
            <div>생명: {'❤️'.repeat(lives)}</div>
          </Stats>

          {message && <Message>{message}</Message>}
          
          {items.map(item => (
            <Item 
              key={item.id}
              $position={item.position}
              $top={item.top}
              $type={item.type}
            >
              {item.type === 'good' ? '🌰' : '💥'}
            </Item>
          ))}

          <Squirrel $position={position}>
            🐿️
          </Squirrel>
        </GameArea>

        {gameOver && lives <= 0 && (
          <GameOverMessage $success={false}>
            생명이 다 떨어졌습니다! 다시 도전해보세요.
          </GameOverMessage>
        )}

        {gameOver && score >= targetScore && (
          <GameOverMessage $success={true}>
            도토리를 모두 모았습니다! 🎉
          </GameOverMessage>
        )}

        <Instructions>
          ← → 방향키로 다람쥐를 움직여 도토리를 받으세요!
          나쁜 도토리(💥)는 피하세요!
        </Instructions>
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
  min-width: 400px;
  position: relative;
`;

const GameTitle = styled.h2`
  font-family: 'JejuHallasan';
  text-align: center;
  margin-bottom: 20px;
`;

const GameArea = styled.div`
  height: 400px;
  position: relative;
  background: #f0fff4;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
`;

const Stats = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 18px;
  display: flex;
  gap: 20px;
  z-index: 2;
`;

const Message = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #2d3748;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
  z-index: 3;
`;

const Item = styled.div`
  position: absolute;
  left: ${props => props.$position}%;
  top: ${props => props.$top}%;
  font-size: 24px;
  transition: top 0.05s linear;
`;

const Squirrel = styled.div`
  position: absolute;
  bottom: 20px;
  left: ${props => props.$position}%;
  font-size: 40px;
  transition: left 0.1s ease;
  transform: translateX(-50%);
`;

const GameOverMessage = styled.div`
  text-align: center;
  color: ${props => props.$success ? '#48bb78' : '#e53e3e'};
  font-size: 20px;
  margin-top: 20px;
  animation: ${props => props.$success ? 'bounce 0.5s infinite alternate' : 'none'};

  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }
`;

const Instructions = styled.p`
  text-align: center;
  color: #4a5568;
  margin-top: 20px;
  font-size: 14px;
`;

export default SquirrelGame;