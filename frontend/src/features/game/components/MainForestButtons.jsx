import { useEffect } from 'react';
import {styled} from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import buttonBgImage from '../../../assets/images/object/plat.png';


const MainForestButtons = () => {
  const { 
    gameState, 
    startSaveAcorns, 
    startChargeFatigue, 
    cancelAction, 
    isStorageActive, 
    isEnergyActive,
    startEmergencyVote,
    isActionInProgress,
  } = useGame();

  // 도토리 저장 
  const clkSave = () => {
    startSaveAcorns();
  };

  // 피로도 충전 
  const clkFatigue = () => {
    startChargeFatigue();
  };

  // 긴급 클릭 
  const clkEmergency = async () => {
    if (gameState.isDead || gameState.hasUsedEmergency) return;
    
    try { 
      startEmergencyVote();
      gameState.hasUsedEmergency = true;
    } catch (error) {
    }
  };

  useEffect(() => {
    // 폰트 미리 로드
    const font = new FontFace(
      'NeoDunggeunmoPro-Regular',
      `url('/fonts/NeoDunggeunmoPro-Regular.ttf')`,
      { display: 'swap' }
    );

    // 폰트 로드 및 적용
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {
    });
  }, []);

  return (
    <ButtonContainer>
      <EnergyButton 
        onClick={clkFatigue}
        disabled={isEnergyActive || gameState.fatigue >= 3 || isActionInProgress}
        $isActive={isEnergyActive}
        $evilSquirrel={gameState.evilSquirrel}
      >
        {isEnergyActive ? '충전중...' : '에너지'}
        {isEnergyActive && <ProgressBar $evilSquirrel={gameState.evilSquirrel} />}
      </EnergyButton>

      <EmergencyButton 
        onClick={clkEmergency}
        disabled={gameState.hasUsedEmergency || isActionInProgress || gameState.timer > 150 }
      >
        긴급
      </EmergencyButton>

      {(isStorageActive || isEnergyActive) && (
        <CancelButton onClick={cancelAction}>
          취소
        </CancelButton>
      )}

      {gameState.evilSquirrel === false && (
        <StorageButton 
          onClick={clkSave}
          disabled={isStorageActive || gameState.heldAcorns === 0 || isActionInProgress}
          $isActive={isStorageActive}
        >
          {isStorageActive ? '저장중...' : '창고'}
          {isStorageActive && <ProgressBar />}
        </StorageButton>
      )}
      
    </ButtonContainer>
  );
};


const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  z-index: 11;

  @font-face {
    font-family: 'NeoDunggeunmoPro-Regular';
    src: url('/fonts/NeoDunggeunmoPro-Regular.ttf') format('truetype');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
  }
`;


const BaseButton = styled.button`
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
    font-family: 'NeoDunggeunmoPro-Regular', sans-serif;  
  font-size: 1.7rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-image: url(${buttonBgImage});
  background-color: transparent; // 배경색 투명하게
  
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  min-width: 150px;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StorageButton = styled(BaseButton)`
 
  opacity: ${props => props.$isActive ? 0.8 : 1};
`;

const EnergyButton = styled(BaseButton)`
 
  opacity: ${props => props.$isActive ? 0.8 : 1};
`;

const EmergencyButton = styled(BaseButton)`
  
`;

const CancelButton = styled(BaseButton)`
  filter: grayscale(1);
`;
const ProgressBar = styled.div`
 position: absolute;
 bottom: 0;
 left: 0;
 height: 3px;
 background-color: rgba(255, 255, 255, 1); 
 animation: progress ${props => props.$evilSquirrel === false ? '7s' : '10s'} linear forwards;

 @keyframes progress {
   from { width: 0; }
   to { width: 100%; }
 }
`;

export default MainForestButtons;