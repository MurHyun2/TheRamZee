import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const CARD_IMAGES = ['🌳', '🌲', '🍄', '🌸'];
const CARDS = [...CARD_IMAGES, ...CARD_IMAGES];

const MatchingGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const shuffleCards = () => [...CARDS].sort(() => Math.random() - 0.5);
  const [cards] = useState(shuffleCards());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    if (flipped.length === 2) {
      if (cards[flipped[0]] === cards[flipped[1]]) {
        setMatched(prev => [...prev, ...flipped]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === cards.length) {
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 3
        }));
      }
      setTimeout(() => onComplete(), 1000);
    }
  }, [matched, cards.length]);

  const handleCardClick = (index) => {
    if (flipped.length >= 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped(prev => [...prev, index]);
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <GameTitle>카드 짝 맞추기</GameTitle>
        <GameGrid>
  {cards.map((card, index) => (
    <Card
      key={index}
      onClick={() => handleCardClick(index)}
      aria-label={flipped.includes(index) || matched.includes(index) ? `카드 ${card}` : '뒤집힌 카드'}
      role="button"
    >
      <CardInner $isFlipped={flipped.includes(index) || matched.includes(index)}>
        <CardFront>?</CardFront>
        <CardBack>{card}</CardBack>
      </CardInner>
    </Card>
  ))}
</GameGrid>
        {matched.length === cards.length && (
          <GameOver>
            <h3>게임 종료!</h3>
          </GameOver>
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

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
`;

const Card = styled.div`
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'none'};
`;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  background: white;
  border-radius: 8px;
  border: 2px solid #333;
`;

const CardFront = styled(CardSide)``;

const CardBack = styled(CardSide)`
  transform: rotateY(180deg);
`;

const GameOver = styled.div`
  text-align: center;
  color: #48bb78;
  margin-top: 20px;
  
  h3 {
    font-family: 'JejuHallasan';
    font-size: 24px;
  }
`;

export default MatchingGame;