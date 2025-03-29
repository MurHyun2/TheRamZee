import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const VineSlashGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [vines, setVines] = useState([]);
  const [score, setScore] = useState(0);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const gameInterval = useRef(null);

  useEffect(() => {
    spawnVines(2);

    gameInterval.current = window.setInterval(() => {
      updateVines();
      if (score >= 15) {
        clearInterval(gameInterval.current);
        setShowCompletionMessage(true);
        if (gameState.role === 'good') {
          setGameState(prev => ({
            ...prev,
            heldAcorns: prev.heldAcorns + 3
          }));
        }
        setTimeout(() => onComplete(), 3000);
      }
    }, 100);

    return () => {
      if (gameInterval.current !== null) clearInterval(gameInterval.current);
    };
  }, [score]);

  const spawnVines = (count) => {
    if (vines.length >= 5) return;
    
    const newVines = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 320 + 40,
      y: -50,
      width: Math.random() * 10 + 10,
      height: Math.random() * 40 + 60,
      fallingSpeed: Math.random() * 5 + 1,
    }));
    setVines(prev => [...prev, ...newVines]);
  };

  const updateVines = () => {
    setVines(prev => {
      const updatedVines = prev.map(vine => ({
        ...vine,
        y: vine.y + vine.fallingSpeed * 2,
      }));

      if (updatedVines.some(vine => vine.y + vine.height >= 400)) {
        clearInterval(gameInterval.current);
        setShowGameOverMessage(true);
        setTimeout(() => onClose(), 1500);
        return [];
      }

      return updatedVines.filter(vine => vine.y < 400);
    });

    if (Math.random() < 0.5) {
      spawnVines(1);
    }
  };

  const handleVineSlash = (id) => {
    setVines(prev => prev.filter(vine => vine.id !== id));
    setScore(prev => prev + 1);
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>🌿 덩쿨 슬래셔</GameTitle>
        <Instruction>덩쿨이 떨어지기 전에 빠르게 클릭하여 제거하세요!</Instruction>

        <VineContainer>
          {vines.map(vine => (
            <Vine
              key={vine.id}
              style={{
                left: vine.x,
                top: vine.y,
                width: `${vine.width}px`,
                height: `${vine.height}px`,
              }}
              onClick={() => handleVineSlash(vine.id)}
            />
          ))}
        </VineContainer>

        <Score>도토리 획득: {score} / 15</Score>

        {showCompletionMessage && (
          <CompletionMessage>🎉 덩쿨을 모두 제거했습니다! 🎉</CompletionMessage>
        )}

        {showGameOverMessage && (
          <GameOverMessage>❌ 덩쿨에 맞았습니다! ❌</GameOverMessage>
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
  margin-bottom: 10px;
`;

const Instruction = styled.p`
  text-align: center;
  color: #4a5568;
  margin-bottom: 20px;
`;

const VineContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  background: #f7fafc;
  border-radius: 8px;
  overflow: hidden;
`;

const Vine = styled.div`
  position: absolute;
  background: #48bb78;
  cursor: pointer;
  border-radius: 2px;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Score = styled.div`
  text-align: center;
  margin-top: 10px;
  font-family: 'JejuHallasan';
  color: #4a5568;
`;

const CompletionMessage = styled.div`
  text-align: center;
  color: #48bb78;
  font-size: 20px;
  margin-top: 10px;
  animation: bounce 0.5s infinite alternate;

  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }
`;

const GameOverMessage = styled.div`
  text-align: center;
  color: #e53e3e;
  font-size: 20px;
  margin-top: 10px;
`;

export default VineSlashGame;