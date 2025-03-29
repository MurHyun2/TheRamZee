import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const FireGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [lights, setLights] = useState(Array(5).fill(true));
  const lightsRef = useRef(lights);
  const [isListening, setIsListening] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const volumeThreshold = 50;
  const holdThreshold = 54;

  useEffect(() => {
    let audioContext = null;
    let analyser;
    let microphone;
    let dataArray;
    let isGameActive = true;

    const startListening = async () => {
      try {
        audioContext = new AudioContext();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
        setIsListening(true);

        const checkSound = () => {
          if (!isGameActive) return;

          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

          if (volume > volumeThreshold) {
            setHoldTime(prev => {
              const newTime = prev + 1;
              if (newTime >= holdThreshold) {
                turnOffAllLights();
              }
              return newTime;
            });
          } else {
            setHoldTime(0);
          }

          if (lightsRef.current.some(light => light)) {
            requestAnimationFrame(checkSound);
          } else {
            if (gameState.role === 'good') {
              setGameState(prev => ({
                ...prev,
                heldAcorns: prev.heldAcorns + 3
              }));
            }
            stopListening();
            onComplete();
          }
        };

        checkSound();
      } catch (err) {
      }
    };

    const stopListening = () => {
      isGameActive = false;
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
      setIsListening(false);
    };

    startListening();

    return () => stopListening();
  }, [onComplete]);

  const turnOffAllLights = () => {
    setLights(Array(lights.length).fill(false));
    lightsRef.current = Array(lights.length).fill(false);
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <GameTitle>불 끄기 게임</GameTitle>
        <LightContainer>
          {lights.map((light, index) => (
            <Light key={index} $isOn={light} />
          ))}
        </LightContainer>
        {!lights.some(light => light) && (
          <GameOverMessage>
            <h3>모든 불을 껐습니다!</h3>
          </GameOverMessage>
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

const LightContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
`;

const Light = styled.div`
  width: 50px;
  height: 50px;
  background-color: red;
  border-radius: 50%;
  opacity: ${props => props.$isOn ? 1 : 0};
  transition: opacity 0.5s;
`;

const GameOverMessage = styled.div`
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

export default FireGame;