import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

// 상수 조정
const THROW_POSITION = { x: 200, y: 400 };
const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;

const RockThrowingGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [stones, setStones] = useState([]);
  const [targets, setTargets] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [score, setScore] = useState(0);
  const [remainingStones, setRemainingStones] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef(null);
  const frameRef = useRef(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    spawnTargets();
    startGameLoop();
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const spawnTargets = () => {
    const newTargets = Array(3).fill(null).map((_, index) => ({
      id: index,
      x: 150 + (index * 150),
      y: 100 + (Math.random() * 150),
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 1.5 + Math.random() * 1.5,
      hit: false
    }));
    setTargets(newTargets);
  };

  const startGameLoop = () => {
    const updateGame = () => {
      if (!gameOver) {
        // 표적 움직임 업데이트
        setTargets(prev => prev.map(target => {
          if (target.hit) return target;
          
          let newX = target.x + (target.speed * target.direction);
          if (newX < 100 || newX > GAME_WIDTH - 100) {
            target.direction *= -1;
            newX = target.x + (target.speed * target.direction);
          }
          
          return {
            ...target,
            x: newX
          };
        }));

        // 돌 물리 업데이트
        setStones(prev => prev.map(stone => {
          const gravity = 0.4;
          const newVy = stone.vy + gravity;
          const newX = stone.x + stone.vx;
          const newY = stone.y + stone.vy;

          // 충돌 체크
          let hasCollided = false;
          setTargets(prevTargets => {
            let newTargets = [...prevTargets];
            let hitCount = 0;
            
            newTargets = newTargets.map(target => {
              if (target.hit) {
                hitCount++;
                return target;
              }
              
              const dx = target.x - newX;
              const dy = target.y - newY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 30) {
                hasCollided = true;
                hitCount++;
                return { ...target, hit: true };
              }
              return target;
            });

            // 모든 표적을 맞췄는지 확인
            if (hitCount === 3 && !gameOver && !completedRef.current) {
              completedRef.current = true; // ref를 통해 완료 상태 표시
              setGameOver(true);
              setHasCompleted(true);
              if (gameState.role === 'good') {
                setGameState(prev => ({
                  ...prev,
                  heldAcorns: prev.heldAcorns + 3
                }));
              }
              onComplete(); // setTimeout 제거
            }
            return newTargets;
          });

          if (newY > GAME_HEIGHT || hasCollided) {
            return null;
          }

          return {
            ...stone,
            x: newX,
            y: newY,
            vy: newVy
          };
        }).filter(Boolean));
      }

      frameRef.current = requestAnimationFrame(updateGame);
    };

    frameRef.current = requestAnimationFrame(updateGame);
  };

  const handleMouseDown = (e) => {
    if (gameOver || remainingStones <= 0) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    setDragStart(THROW_POSITION);
    setDragCurrent({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!dragStart) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    setDragCurrent({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseUp = () => {
    if (!dragStart || !dragCurrent) return;

    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const power = Math.min(distance / 10, 15);
    const angle = Math.atan2(dy, dx);
    
    const newStone = {
      id: Date.now(),
      x: THROW_POSITION.x,
      y: THROW_POSITION.y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power
    };

    setStones(prev => [...prev, newStone]);
    setRemainingStones(prev => prev - 1);
    setDragStart(null);
    setDragCurrent(null);

    // 돌을 다 썼는데 승리하지 못한 경우
    if (remainingStones <= 1 && score < 3) {
      setTimeout(() => {
        setGameOver(true);
        setTimeout(onClose, 1500);
      }, 2000);
    }
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>🪨 돌 던지기</GameTitle>
        
        <StatusBar>
          <div>맞춘 표적: {targets.filter(t => t.hit).length}/3</div>
          <div>남은 돌: {remainingStones}</div>
        </StatusBar>

        <GameArea
          ref={gameAreaRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {dragStart && dragCurrent && (
            <AimLine
              $startX={dragStart.x}
              $startY={dragStart.y}
              $endX={dragCurrent.x}
              $endY={dragCurrent.y}
            />
          )}

          {targets.map(target => (
            <Target
              key={target.id}
              $hit={target.hit}
              style={{
                left: `${target.x}px`,
                top: `${target.y}px`
              }}
            >
              🎯
            </Target>
          ))}

          {stones.map(stone => (
            <Stone
              key={stone.id}
              style={{
                left: `${stone.x}px`,
                top: `${stone.y}px`
              }}
            >
              🪨
            </Stone>
          ))}

          <ThrowPosition>
            <div>🪨</div>
          </ThrowPosition>
        </GameArea>

        <Instructions>
          발사대에서 마우스를 드래그하여 돌을 던지세요!<br/>
          모든 표적을 맞추면 승리!
        </Instructions>

        {gameOver && targets.every(t => t.hit) && (
          <SuccessMessage>🎉 모든 표적을 맞췄습니다!</SuccessMessage>
        )}
        
        {gameOver && !targets.every(t => t.hit) && (
          <FailMessage>더 정확하게 조준해보세요...</FailMessage>
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
  max-width: 90vw;
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
  max-width: ${GAME_WIDTH}px;
  padding: 10px;
  background: #F7FAFC;
  border-radius: 8px;
  font-weight: bold;
  color: #4A5568;
`;

const GameArea = styled.div`
  width: ${GAME_WIDTH}px;
  height: ${GAME_HEIGHT}px;
  background: #2D3748;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
`;

const ThrowPosition = styled.div`
  position: absolute;
  left: ${THROW_POSITION.x}px;
  top: ${THROW_POSITION.y}px;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  pointer-events: none;
`;

const Target = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  font-size: 40px;
  opacity: ${props => props.$hit ? 0.3 : 1};
  transition: opacity 0.3s;
  user-select: none;
`;

const Stone = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  font-size: 32px;
  user-select: none;
`;

const AimLine = styled.div`
  position: absolute;
  top: ${props => props.$startY}px;
  left: ${props => props.$startX}px;
  width: ${props => {
    const dx = props.$endX - props.$startX;
    const dy = props.$endY - props.$startY;
    return Math.sqrt(dx * dx + dy * dy);
  }}px;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  transform-origin: left center;
  transform: rotate(${props => {
    const dx = props.$endX - props.$startX;
    const dy = props.$endY - props.$startY;
    return Math.atan2(dy, dx);
  }}rad);
  pointer-events: none;
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
  max-width: ${GAME_WIDTH}px;
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

export default RockThrowingGame;