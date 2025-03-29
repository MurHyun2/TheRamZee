import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const ShadowGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [cells, setCells] = useState([]);
  const [revealCount, setRevealCount] = useState(0);
  const [message, setMessage] = useState("안개 속에 숨은 도토리를 찾아보세요!");
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = () => {
    const newCells = Array(16).fill(null).map(() => ({
      revealed: false,
      hasDot: false
    }));

    let dotsPlaced = 0;
    while (dotsPlaced < 3) {
      const randomIndex = Math.floor(Math.random() * 16);
      if (!newCells[randomIndex].hasDot) {
        newCells[randomIndex].hasDot = true;
        dotsPlaced++;
      }
    }

    setCells(newCells);
    setRevealCount(0);
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCellClick = (index) => {
    if (gameOver || cells[index].revealed) return;

    const newCells = [...cells];
    newCells[index].revealed = true;
    setCells(newCells);
    setRevealCount(prev => prev + 1);

    if (newCells[index].hasDot) {
      const foundCount = newCells.filter(cell => cell.revealed && cell.hasDot).length;
      if (foundCount === 3) {
        setMessage("🌟 모든 도토리를 찾았어요!");
        setGameOver(true);
        if (gameState.role === 'good') {
          setGameState(prev => ({
            ...prev,
            heldAcorns: prev.heldAcorns + 3
          }));
        }
        setTimeout(() => onComplete(), 1500);
      } else {
        setMessage(`✨ 도토리를 찾았어요! (${foundCount}/3)`);
      }
    } else {
      if (revealCount >= 8) {
        setMessage("안개가 너무 짙어졌어요! 다시 시도해보세요.");
        setGameOver(true);
        setTimeout(initializeGame, 2000);
      } else {
        setMessage(`안개를 ${9 - (revealCount + 1)}번 더 걷어낼 수 있어요!`);
      }
    }
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>🌫️ 안개 속 도토리</GameTitle>
        <FogGrid>
          {cells.map((cell, index) => (
            <FogCell
              key={index}
              $revealed={cell.revealed}
              $hasDot={cell.hasDot}
              onClick={() => handleCellClick(index)}
              disabled={gameOver || cell.revealed}
            >
              {cell.revealed && cell.hasDot && '🌰'}
            </FogCell>
          ))}
        </FogGrid>
        <Message $type={message?.includes('🌟') ? 'success' : 'info'}>
          {message}
        </Message>
        <Attempts>남은 시도: {Math.max(0, 9 - revealCount)}</Attempts>
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
`;

const GameTitle = styled.h2`
  font-family: 'JejuHallasan';
  text-align: center;
  margin-bottom: 20px;
`;

const FogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px;
`;

const FogCell = styled.button`
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 4px;
  background: ${props => props.$revealed ? 'transparent' : '#cbd5e0'};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
`;

const Message = styled.div`
  text-align: center;
  color: ${props => props.$type === 'success' ? '#48bb78' : '#4a5568'};
  margin: 20px 0;
`;

const Attempts = styled.div`
  text-align: center;
  color: #4a5568;
`;

export default ShadowGame;