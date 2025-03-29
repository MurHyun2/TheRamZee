import React, { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const HackingGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showingSequence, setShowingSequence] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [activeIndex, setActiveIndex] = useState(null);

  const generateSequence = () => {
    const newSequence = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * 4));
    setSequence(newSequence);
    showSequence(newSequence);
  };

  const showSequence = async (seq) => {
    setShowingSequence(true);
    setPlayerSequence([]);

    for (let i = 0; i < seq.length; i++) {
      setActiveIndex(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
      setActiveIndex(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setShowingSequence(false);
  };

  const handleButtonClick = (num) => {
    if (showingSequence || !isPlaying) return;

    const newPlayerSequence = [...playerSequence, num];
    setPlayerSequence(newPlayerSequence);

    if (!newPlayerSequence.every((value, index) => value === sequence[index])) {
      setIsPlaying(false);
      setGameStatus('waiting');
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      if (level === 3) {
        setGameStatus('success');
        if (gameState.role === 'good') {
          setGameState(prev => ({
            ...prev,
            heldAcorns: prev.heldAcorns + 3
          }));
        }
        setTimeout(onComplete, 1000);
      } else {
        setLevel(prev => prev + 1);
        setTimeout(generateSequence, 1000);
      }
      setPlayerSequence([]);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameStatus('playing');
    setLevel(1);
    generateSequence();
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>💻 시스템 해킹</GameTitle>

        <GameBoard>
          <ButtonGrid>
            {[0, 1, 2, 3].map(num => (
              <HackButton
                key={num}
                $active={activeIndex === num}
                onClick={() => handleButtonClick(num)}
                disabled={showingSequence || !isPlaying}
              >
                {num + 1}
              </HackButton>
            ))}
          </ButtonGrid>
        </GameBoard>

        {gameStatus === 'waiting' && (
          <StartButton onClick={startGame}>해킹 시작</StartButton>
        )}

        {gameStatus === 'playing' && (
          <StatusText>레벨 {level}/3 - 패턴을 따라하세요</StatusText>
        )}

        {gameStatus === 'success' && (
          <StatusText $success>✔ 시스템 해킹 성공!</StatusText>
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
  margin-bottom: 20px;
`;

const GameBoard = styled.div`
  margin: 20px auto;
  width: fit-content;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const HackButton = styled.button`
  width: 80px;
  height: 80px;
  border: 2px solid #2d3748;
  border-radius: 8px;
  background: ${props => props.$active ? '#48bb78' : 'white'};
  font-size: 24px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.disabled ? 'white' : '#e2e8f0'};
  }
`;

const StartButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #3182ce;
  }
`;

const StatusText = styled.div`
  text-align: center;
  margin-top: 20px;
  color: ${props => props.$success ? '#48bb78' : '#4a5568'};
  font-size: 16px;
`;

export default HackingGame;