import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const FireEscapeGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [acorns, setAcorns] = useState([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('좋은 도토리를 선택해주세요!');

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // 25개의 도토리 생성 (8개 정상, 40개 탄 도토리)
    const newAcorns = [];
    // 정상 도토리
    for (let i = 0; i < 6; i++) {
      newAcorns.push({
        id: `good-${i}`,
        type: 'good',
        collected: false,
        position: {
          x: Math.random() * 320 + 40,
          y: Math.random() * 320 + 40
        }
      });
    }
    // 탄 도토리
    for (let i = 0; i < 40; i++) {
      newAcorns.push({
        id: `burnt-${i}`,
        type: 'burnt',
        collected: false,
        position: {
          x: Math.random() * 320 + 40,
          y: Math.random() * 320 + 40
        }
      });
    }
    
    // 배열을 무작위로 섞기
    for (let i = newAcorns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newAcorns[i], newAcorns[j]] = [newAcorns[j], newAcorns[i]];
    }
    
    setAcorns(newAcorns);
  };

  const handleAcornClick = (acorn) => {
    if (gameOver || acorn.collected) return;

    setAcorns(prev => prev.map(a => 
      a.id === acorn.id ? { ...a, collected: true } : a
    ));

    if (acorn.type === 'good') {
      setScore(prev => prev + 1);
      setMessage('좋은 도토리를 찾았습니다! 🎉');
      
      // 승리 조건: 6개의 좋은 도토리를 모으면 승리
      if (score + 1 >= 6) {
        setGameOver(true);
        setMessage('축하합니다! 충분한 도토리를 모았어요! 🎉');
        if (gameState.role === 'good') {
          setGameState(prev => ({
            ...prev,
            heldAcorns: prev.heldAcorns + 3
          }));
        }
        setTimeout(onComplete, 1500);
      }
    } else {
      setMistakes(prev => prev + 1);
      setMessage('탄 도토리였네요... 😢');
      
      // 실패 조건: 3번 실수하면 게임 오버
      if (mistakes + 1 >= 2) {
        setGameOver(true);
        setMessage('실수를 너무 많이 했어요... 다시 도전해보세요!');
        setTimeout(onClose, 1500);
      }
    }
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>🌰 도토리 선별하기</GameTitle>
        
        <StatusBar>
          <div>찾은 도토리: {score}/6</div>
          <div>남은 기회: {3 - mistakes}</div>
        </StatusBar>

        <Message>{message}</Message>
        
        <PlayArea>
          {acorns.map((acorn) => (
            <Acorn
              key={acorn.id}
              $type={acorn.type}
              $collected={acorn.collected}
              style={{
                left: `${acorn.position.x}px`,
                top: `${acorn.position.y}px`
              }}
              onClick={() => handleAcornClick(acorn)}
              disabled={acorn.collected}
            >
              {acorn.type === 'good' ? '🌰' : '⚫'}
            </Acorn>
          ))}
        </PlayArea>

        <Instructions>
          • 불에 타지 않은 도토리 6개를 찾으세요!<br/>
          • 탄 도토리는 피해주세요 (2번 실수 가능)<br/>
          • 조심하세요! 탄 도토리가 더 많습니다
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
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
  max-width: 400px;
  padding: 10px;
  background: #F7FAFC;
  border-radius: 8px;
  font-weight: bold;
  color: #4A5568;
`;

const Message = styled.div`
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  background: #EBF8FF;
  color: #2B6CB0;
  font-weight: bold;
  width: 100%;
  max-width: 400px;
`;

const PlayArea = styled.div`
  width: 400px;
  height: 400px;
  background: #2D3748;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const Acorn = styled.button`
  width: 40px;
  height: 40px;
  position: absolute;
  transform: translate(-50%, -50%);
  background: ${props => props.$collected ? 'transparent' : '#4A5568'};
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: ${props => props.$collected ? 'default' : 'pointer'};
  opacity: ${props => props.$collected ? 0.5 : 1};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: ${props => props.$collected ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(1.1)'};
  }
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
  max-width: 400px;
`;

export default FireEscapeGame;