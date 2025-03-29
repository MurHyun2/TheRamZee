import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const ArrowPuzzleGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const puzzleRef = useRef(null);
  const arrowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  
  const getRandomPosition = () => {
    const puzzleWidth = 400;
    const puzzleHeight = 400;
    const arrowSize = 80;
    
    return {
      x: Math.floor(Math.random() * (puzzleWidth - arrowSize)),
      y: Math.floor(Math.random() * (puzzleHeight - arrowSize))
    };
  };

  const [position, setPosition] = useState(getRandomPosition());
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (isSolved) return;
    
    const arrow = arrowRef.current;
    if (!arrow) return;

    setIsDragging(true);
    const rect = arrow.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isSolved) return;

    const puzzle = puzzleRef.current;
    const arrow = arrowRef.current;
    if (!puzzle || !arrow) return;

    const puzzleRect = puzzle.getBoundingClientRect();
    const newX = e.clientX - puzzleRect.left - startPos.x;
    const newY = e.clientY - puzzleRect.top - startPos.y;

    const maxX = puzzleRect.width - arrow.offsetWidth;
    const maxY = puzzleRect.height - arrow.offsetHeight;
    
    setPosition({
      x: Math.max(0, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY))
    });
  };

  const checkCompletion = () => {
    const arrow = arrowRef.current;
    const dropZone = document.querySelector('.arrow-shadow');
    
    if (!arrow || !dropZone) return false;

    const arrowRect = arrow.getBoundingClientRect();
    const dropRect = dropZone.getBoundingClientRect();

    const arrowCenter = {
      x: arrowRect.left + arrowRect.width / 2,
      y: arrowRect.top + arrowRect.height / 2
    };
    
    const dropCenter = {
      x: dropRect.left + dropRect.width / 2,
      y: dropRect.top + dropRect.height / 2
    };

    const distance = Math.sqrt(
      Math.pow(dropCenter.x - arrowCenter.x, 2) +
      Math.pow(dropCenter.y - arrowCenter.y, 2)
    );

    return distance < 20;
  };

  const handleMouseUp = () => {
    if (!isDragging || isSolved) return;

    if (checkCompletion()) {
      setIsSolved(true);
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 3
        }));
      }
      setTimeout(() => onComplete(), 500);
    }

    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>화살표 맞추기</GameTitle>
        <PuzzleContainer
  ref={puzzleRef}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
>
  <ArrowShadow className="arrow-shadow">
    <ArrowShape />
  </ArrowShadow>
  
  <DraggableArrow
    ref={arrowRef}
    onMouseDown={handleMouseDown}
    $isDragging={isDragging}
    $isSolved={isSolved}
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }}
  >
    <ArrowShape />
  </DraggableArrow>
</PuzzleContainer>
        <Instruction>화살표를 드래그하여 그림자에 맞추세요</Instruction>
        {isSolved && (
          <SuccessMessage>완료!</SuccessMessage>
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

const PuzzleContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 20px auto;
  background: #f7fafc;
  border-radius: 8px;
  user-select: none;
  overflow: hidden;
`;

const ArrowShadow = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.1);
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DraggableArrow = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$isSolved ? 'default' : props.$isDragging ? 'grabbing' : 'grab'};
  touch-action: none;
  padding: 5px;
`;

const ArrowShape = styled.div`
  position: relative;
  width: 12px;
  height: 60px;
  background-color: #ac1219;
  margin-top: 15px;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: -15px;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 0 18px 18px 18px;
    border-color: transparent transparent #ac1219 transparent;
  }
`;

const Instruction = styled.p`
  text-align: center;
  color: #4a5568;
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

export default ArrowPuzzleGame;