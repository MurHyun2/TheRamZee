import React, { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const HiddenDoorGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [correctDoor] = useState(Math.floor(Math.random() * 4));
  const [doors, setDoors] = useState([0, 1, 2, 3]);
  const [message, setMessage] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const handleDoorClick = (index) => {
    if (gameOver) return;

    if (index === correctDoor) {
      setMessage("✅ 올바른 문을 찾았습니다!");
      setGameOver(true);
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 3
        }));
      }
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setMessage("❌ 잘못된 문입니다! 다시 시도하세요.");
      setTimeout(() => {
        setMessage(null);
        setDoors([...Array(4)].map(() => Math.floor(Math.random() * 4)));
      }, 1500);
    }
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>🚪 숨겨진 문 찾기</GameTitle>
        <Instruction>정답 문을 찾아 통과하세요!</Instruction>

        <DoorContainer>
          {doors.map((d, i) => (
            <DoorButton
              key={i}
              $disabled={gameOver}
              onClick={() => handleDoorClick(i)}
              disabled={gameOver}
            >
              🚪
            </DoorButton>
          ))}
        </DoorContainer>

        {message && (
          <Message $type={message.includes("✅") ? "success" : "error"}>
            {message}
          </Message>
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

const DoorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
`;

const DoorButton = styled.button`
  font-size: 48px;
  padding: 20px;
  background: none;
  border: 2px solid #4a5568;
  border-radius: 8px;
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
  transition: transform 0.2s;

  &:hover {
    transform: ${props => props.$disabled ? 'none' : 'scale(1.05)'};
  }
`;

const Message = styled.div`
  text-align: center;
  padding: 10px;
  margin-top: 20px;
  color: ${props => props.$type === 'success' ? '#48bb78' : '#e53e3e'};
  background: ${props => props.$type === 'success' ? '#f0fff4' : '#fff5f5'};
  border-radius: 4px;
`;

export default HiddenDoorGame;