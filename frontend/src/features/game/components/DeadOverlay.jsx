import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Z_INDEX } from '../../../constants/zIndex';
import { animationImages } from '../../../assets/images';
import { useGame } from '../../../contexts/GameContext';

const DeadOverlay = ({ playerName }) => {
  const [showDeadScreen, setShowDeadScreen] = useState(false);
  const { 
    gameState
  } = useGame();

  useEffect(() => {
    // Kill 애니메이션이 끝난 후(3초) DeadScreen 표시
    const timer = setTimeout(() => {
      setShowDeadScreen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <OverlayContainer>
      {!showDeadScreen && (
        <KillAnimationContainer>
          <KillEffect />
        </KillAnimationContainer>
      )}
      {showDeadScreen && (
        <Content>
          <SkullIcon>💀</SkullIcon>
          <DeadText>Knockdown</DeadText>
          <PlayerName>{playerName}</PlayerName>
          <DeadMessage>{gameState.killerNickname}에게 폭행당했습니다.</DeadMessage>
          <SpectatorMessage>눈 앞이 캄캄해집니다.</SpectatorMessage>
        </Content>
      )}
    </OverlayContainer>
  );
};

const fadeInOut = keyframes`
  0% { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  10% { 
    opacity: 1; 
    transform: scale(1); 
  }
  90% { 
    opacity: 1; 
    transform: scale(1); 
  }
  100% { 
    opacity: 0; 
    transform: scale(0.8); 
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${Z_INDEX.KILL_ANIMATION};
`;

const KillAnimationContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const KillEffect = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${animationImages.kill});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  animation: ${fadeInOut} 3s forwards;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const SkullIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const DeadText = styled.div`
  color: #FF0000;
  font-size: 2rem;
  font-family: 'JejuHallasan';
  margin-bottom: 5px;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
`;

const PlayerName = styled.div`
  color: white;
  font-size: 1.5rem;
  font-family: 'JejuHallasan';
  margin-bottom: 10px;
`;

const DeadMessage = styled.div`
  color: #FF6666;
  font-size: 1.2rem;
  font-family: 'JejuHallasan';
  margin-bottom: 5px;
`;

const SpectatorMessage = styled.div`
  color: #90EE90;
  font-size: 1rem;
  font-family: 'JejuHallasan';
  opacity: 0.8;
`;

export default DeadOverlay;