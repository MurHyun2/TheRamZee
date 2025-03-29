import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const CircuitConnectionGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [circuits, setCircuits] = useState([]);
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [connections, setConnections] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('두 개의 회로를 연결해주세요!');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const boardRef = useRef(null);

  useEffect(() => {
    initializeCircuits();
  }, []);

  const getRandomPosition = () => {
    // 격자 위치에서 랜덤하게 약간의 오프셋을 추가
    const offset = 20;
    return {
      x: Math.random() * (360 - offset * 2) + offset,
      y: Math.random() * (360 - offset * 2) + offset
    };
  };

  const initializeCircuits = () => {
    const pairs = [
      { id: 0, pairId: 3, color: '#F6E05E' },
      { id: 1, pairId: 4, color: '#4299E1' },
      { id: 2, pairId: 5, color: '#F687B3' }
    ];

    const positions = Array(6).fill(null).map(() => getRandomPosition());
    const initialCircuits = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      connected: false,
      position: positions[index],
      color: pairs.find(p => p.id === index)?.color || 
             pairs.find(p => p.pairId === index)?.color,
      pairId: pairs.find(p => p.id === index)?.pairId ||
              pairs.find(p => p.pairId === index)?.id
    }));
    setCircuits(initialCircuits);
  };

  const handleMouseMove = (e) => {
    if (!boardRef.current || !selectedCircuit) return;
    const rect = boardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCircuitClick = (circuitId) => {
    if (completed) return;

    const clickedCircuit = circuits.find(c => c.id === circuitId);
    
    if (selectedCircuit === null) {
      setSelectedCircuit(circuitId);
      setMessage('같은 색상의 회로와 연결하세요!');
    } else if (selectedCircuit !== circuitId) {
      const selectedCircuitObj = circuits.find(c => c.id === selectedCircuit);
      
      if (selectedCircuitObj.color === clickedCircuit.color) {
        const newConnection = {
          from: selectedCircuit,
          to: circuitId,
          color: clickedCircuit.color,
          fromPos: circuits.find(c => c.id === selectedCircuit).position,
          toPos: clickedCircuit.position
        };
        
        setConnections(prev => [...prev, newConnection]);
        setCircuits(prev => prev.map(circuit => {
          if (circuit.id === selectedCircuit || circuit.id === circuitId) {
            return { ...circuit, connected: true };
          }
          return circuit;
        }));
        
        setMessage('좋아요! 다음 회로를 연결하세요.');
        
        if (connections.length + 1 === 3) {
          setCompleted(true);
          setMessage('🎉 모든 회로 연결 완료!');
          if (gameState.role === 'good') {
            setGameState(prev => ({
              ...prev,
              heldAcorns: prev.heldAcorns + 3
            }));
          }
          setTimeout(onComplete, 1500);
        }
      } else {
        setMessage('❌ 같은 색상의 회로를 연결해야 합니다!');
      }
      setSelectedCircuit(null);
    }
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <GameTitle>🔌 회로 연결</GameTitle>
        
        <Instructions>
          • 같은 색상의 회로끼리 연결하세요<br/>
          • 총 3쌍의 회로를 모두 연결해야 합니다<br/>
          • 순서는 상관없습니다
        </Instructions>

        <Message $type={message.includes('❌') ? 'error' : 
                      message.includes('🎉') ? 'success' : 'info'}>
          {message}
        </Message>

        <CircuitBoard 
          ref={boardRef}
          onMouseMove={handleMouseMove}
        >
          <ConnectionLayer>
            {connections.map((connection, index) => (
              <ConnectionLine
                key={index}
                $startX={connection.fromPos.x}
                $startY={connection.fromPos.y}
                $endX={connection.toPos.x}
                $endY={connection.toPos.y}
                $color={connection.color}
              />
            ))}
            {selectedCircuit && (
              <ConnectionLine
                $startX={circuits.find(c => c.id === selectedCircuit).position.x}
                $startY={circuits.find(c => c.id === selectedCircuit).position.y}
                $endX={mousePos.x}
                $endY={mousePos.y}
                $color={circuits.find(c => c.id === selectedCircuit).color}
                $temporary
              />
            )}
          </ConnectionLayer>
          
          {circuits.map((circuit) => (
            <CircuitNode
              key={circuit.id}
              $selected={selectedCircuit === circuit.id}
              $connected={circuit.connected}
              $color={circuit.color}
              style={{
                left: `${circuit.position.x}px`,
                top: `${circuit.position.y}px`
              }}
              onClick={() => handleCircuitClick(circuit.id)}
              disabled={circuit.connected}
            >
              <CircuitDot $color={circuit.color} />
            </CircuitNode>
          ))}
        </CircuitBoard>
        
        <Progress>
          연결 진행도: {connections.length}/3
        </Progress>
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

const Message = styled.div`
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  font-weight: bold;
  background: ${props => 
    props.$type === 'error' ? '#FED7D7' :
    props.$type === 'success' ? '#C6F6D5' :
    '#EBF8FF'};
  color: ${props => 
    props.$type === 'error' ? '#E53E3E' :
    props.$type === 'success' ? '#48BB78' :
    '#2B6CB0'};
`;

const CircuitBoard = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
`;

const CircuitNode = styled.button`
  position: absolute;
  width: 60px;
  height: 60px;
  background: ${props => props.$selected ? props.$color : '#2d3748'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$connected ? 'default' : 'pointer'};
  transition: all 0.3s;
  border: 3px solid ${props => props.$connected ? props.$color : '#4a5568'};
  opacity: ${props => props.$connected ? 0.7 : 1};
  outline: none;
  transform: translate(-50%, -50%);

  &:hover {
    transform: ${props => props.$connected ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(1.1)'};
  }
`;

const CircuitDot = styled.div`
  width: 20px;
  height: 20px;
  background: ${props => props.$color};
  border-radius: 50%;
  box-shadow: 0 0 10px ${props => props.$color};
`;

const ConnectionLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const ConnectionLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: ${props => props.$startY}px;
    left: ${props => props.$startX}px;
    width: ${props => {
      const dx = props.$endX - props.$startX;
      const dy = props.$endY - props.$startY;
      return Math.sqrt(dx * dx + dy * dy);
    }}px;
    height: 4px;
    background: ${props => props.$color};
    opacity: ${props => props.$temporary ? 0.5 : 1};
    box-shadow: 0 0 10px ${props => props.$color};
    transform-origin: left center;
    transform: rotate(${props => {
      const dx = props.$endX - props.$startX;
      const dy = props.$endY - props.$startY;
      return Math.atan2(dy, dx);
    }}rad);
  }
`;

const Progress = styled.div`
  text-align: center;
  color: #4A5568;
  font-weight: bold;
  font-size: 16px;
`;

export default CircuitConnectionGame;