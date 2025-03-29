import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const FlowerGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [matches, setMatches] = useState({});
  const [draggingItem, setDraggingItem] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const fairies = [
    { id: 'fairy1', name: '요정 1', flower: 'red' },
    { id: 'fairy2', name: '요정 2', flower: 'yellow' },
    { id: 'fairy3', name: '요정 3', flower: 'blue' },
  ];

  const flowers = [
    { id: 'red', color: 'red' },
    { id: 'yellow', color: 'yellow' },
    { id: 'blue', color: 'blue' },
  ];

  useEffect(() => {
    const isGameComplete = () => {
      return fairies.every((fairy) => matches[fairy.id] === fairy.flower);
    };

    if (isGameComplete() && !gameCompleted) {
      setGameCompleted(true);
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 3
        }));
      }
      onComplete();
    }
  }, [matches, gameCompleted]);

  const handleDragStart = (flowerId) => {
    setDraggingItem(flowerId);
  };

  const handleDrop = (fairyId) => {
    if (draggingItem) {
      setMatches(prev => ({
        ...prev,
        [fairyId]: draggingItem,
      }));
      setDraggingItem(null);
    }
  };

  return (
    <GameOverlay>
      <GameContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <GameTitle>꽃다발 전달</GameTitle>

        <FairyContainer>
          {fairies.map((fairy) => (
            <FairySlot
              key={fairy.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(fairy.id)}
            >
              <Fairy>{fairy.name} ({fairy.flower})</Fairy>
              {matches[fairy.id] && (
                <FlowerMatch $color={matches[fairy.id]} />
              )}
            </FairySlot>
          ))}
        </FairyContainer>

        <FlowerContainer>
          {flowers.map((flower) => (
            <Flower
              key={flower.id}
              $color={flower.color}
              draggable
              onDragStart={() => handleDragStart(flower.id)}
            />
          ))}
        </FlowerContainer>
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

const FairyContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

const FairySlot = styled.div`
  width: 100px;
  height: 100px;
  border: 2px dashed gray;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
`;

const Fairy = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const FlowerMatch = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  position: absolute;
`;

const FlowerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Flower = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

export default FlowerGame;