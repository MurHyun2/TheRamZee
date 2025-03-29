import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const MushroomCollectionGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [basket, setBasket] = useState([]);
  const [mushrooms, setMushrooms] = useState([]);
  const [message, setMessage] = useState('안전한 버섯 3개만 찾으면 됩니다!');
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const mushroomTypes = [
    { id: 'safe1', emoji: '🍄', safe: true, color: '#48bb78' },
    { id: 'safe2', emoji: '🍄', safe: true, color: '#38a169' },
    { id: 'safe3', emoji: '🍄', safe: true, color: '#2f855a' },
    { id: 'safe4', emoji: '🍄', safe: true, color: '#e53e3e' },
    { id: 'poison2', emoji: '🍄', safe: false, color: '#c53030' }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...mushroomTypes]
      .sort(() => Math.random() - 0.5)
      .map((mushroom, index) => ({
        ...mushroom,
        id: `${mushroom.id}-${index}`,
        position: index,
        revealed: false
      }));
    setMushrooms(shuffled);
    setBasket([]);
    setGameOver(false);
    setMessage('안전한 버섯 3개만 찾으면 됩니다!');
  };

  const handleMushroomHover = (mushroom) => {
    if (!gameOver) {
      setShowHint(true);
    }
  };

  const handleMushroomLeave = () => {
    setShowHint(false);
  };

  const handleMushroomClick = (mushroom) => {
    if (gameOver) return;

    const updatedMushroom = { ...mushroom, revealed: true };
    
    if (mushroom.safe) {
      setBasket(prev => [...prev, updatedMushroom]);
      setMushrooms(prev => prev.filter(m => m.id !== mushroom.id));
      
      // 3개만 모아도 승리하도록 수정
      if (basket.length + 1 === 3) {
        setMessage('🎉 안전한 버섯 3개를 모두 찾았습니다!');
        setGameOver(true);
        if (gameState.role === 'good') {
          setGameState(prev => ({
            ...prev,
            heldAcorns: prev.heldAcorns + 3
          }));
        }
        setTimeout(onComplete, 1500);
      }
    } else {
      setMessage('❌ 독버섯을 건드렸습니다!');
      setGameOver(true);
      setMushrooms(prev => 
        prev.map(m => ({ ...m, revealed: true }))
      );
      setTimeout(initializeGame, 2000);
    }
  };

  // ... (나머지 스타일 컴포넌트 코드는 동일하게 유지)

  return (
    <GameOverlay>
      <GameContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <GameTitle>🍄 버섯 수집가</GameTitle>
        
        <ForestScene>
          <MushroomGrid>
            {mushrooms.map((mushroom) => (
              <MushroomSpot
                key={mushroom.id}
                onClick={() => handleMushroomClick(mushroom)}
                onMouseEnter={() => handleMushroomHover(mushroom)}
                onMouseLeave={handleMushroomLeave}
                $revealed={mushroom.revealed}
                $safe={mushroom.safe}
                disabled={gameOver}
              >
                <MushroomEmoji>{mushroom.emoji}</MushroomEmoji>
                {showHint && !gameOver && (
                  <MistEffect $color={mushroom.color} />
                )}
              </MushroomSpot>
            ))}
          </MushroomGrid>

          <BasketContainer>
            <BasketTitle>수집한 버섯 ({basket.length}/3)</BasketTitle>
            <BasketGrid>
              {basket.map((mushroom, index) => (
                <CollectedMushroom key={index}>
                  {mushroom.emoji}
                </CollectedMushroom>
              ))}
            </BasketGrid>
          </BasketContainer>
        </ForestScene>

        <MessageBox $type={message.includes('🎉') ? 'success' : message.includes('❌') ? 'error' : 'info'}>
          {message}
        </MessageBox>

        <Instructions>
          안개 속에서 안전한 버섯 3개를 찾아 수집하세요.
          <br />
          독버섯을 건드리면 게임이 종료됩니다!
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
  border-radius: 12px;
  min-width: 300px;
  position: relative;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #4a5568;
  
  &:hover {
    color: #e53e3e;
  }
`;

const GameTitle = styled.h2`
  font-family: 'JejuHallasan';
  text-align: center;
  margin-bottom: 20px;
  color: #2d3748;
  text-shadow: 0 0 5px rgba(45, 55, 72, 0.3);
`;

const ForestScene = styled.div`
  background: #2d3748;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
`;

const MushroomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const MushroomSpot = styled.button`
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 12px;
  background: ${props => props.$revealed 
    ? props.$safe 
      ? 'rgba(72, 187, 120, 0.2)' 
      : 'rgba(229, 62, 62, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.05)'};
    background: rgba(255, 255, 255, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    z-index: 1;
  }
`;

const MushroomEmoji = styled.div`
  font-size: 40px;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
  
  ${MushroomSpot}:hover & {
    transform: scale(1.1);
  }
`;

const MistEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => `radial-gradient(circle at center, transparent, ${props.$color}33)`};
  opacity: 0;
  animation: mistPulse 2s infinite;

  @keyframes mistPulse {
    0% { opacity: 0; }
    50% { opacity: 0.5; }
    100% { opacity: 0; }
  }
`;

const BasketContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
`;

const BasketTitle = styled.h3`
  color: white;
  text-align: center;
  margin-bottom: 15px;
  font-family: 'JejuHallasan';
  font-size: 18px;
`;

const BasketGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  min-height: 60px;
`;

const CollectedMushroom = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: rgba(72, 187, 120, 0.2);
  border-radius: 8px;
  animation: popIn 0.3s ease-out;

  @keyframes popIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const MessageBox = styled.div`
  text-align: center;
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  font-size: 18px;
  font-family: 'JejuHallasan';
  background: ${props => {
    switch(props.$type) {
      case 'success': return 'rgba(72, 187, 120, 0.1)';
      case 'error': return 'rgba(229, 62, 62, 0.1)';
      default: return 'rgba(74, 85, 104, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.$type) {
      case 'success': return '#48bb78';
      case 'error': return '#e53e3e';
      default: return '#4a5568';
    }
  }};
  animation: ${props => props.$type === 'success' ? 'bounce 0.5s infinite alternate' : 'none'};

  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.05); }
  }
`;

const Instructions = styled.p`
  text-align: center;
  color: #718096;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 20px;
  
  &::before, &::after {
    content: '';
    display: block;
    width: 50px;
    height: 1px;
    background: #718096;
    margin: 10px auto;
    opacity: 0.3;
  }
`;

export default MushroomCollectionGame;