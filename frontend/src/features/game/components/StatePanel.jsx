import { useGame } from '../../../contexts/GameContext';
import styled from 'styled-components';
import acornImage from '../../../assets/images/object/arcon.png'
import buttonBgImage from '../../../assets/images/object/plat.png';
import goodgem from '../../../assets/images/object/goodgem.png';
import evilgem from '../../../assets/images/object/evilgem.png';
import goodnogem from '../../../assets/images/object/goodnogem.png';
import evilnogem from '../../../assets/images/object/evilnogem.png';
import gaegeImage from'../../../assets/images/object/gaege.png'

const StatePanel = () => {
  const { gameState } = useGame();
  const MAX_ACORNS = 13;

  return (
    <StatePanelContainer>
      {gameState.evilSquirrel === false && (
        <>
          <StateItem>
            <StateLabel>총 도토리:</StateLabel>
            <AcornBarContainer>
              <AcornProgressBar 
                $progress={(gameState.totalAcorns / MAX_ACORNS) * 100}
              />
              <AcornCount></AcornCount>
            </AcornBarContainer>
          </StateItem>
          <StateItem>
            <StateLabel>보유 도토리:</StateLabel>
            <AcornPointBar>
              {[...Array(3)].map((_, index) => (
                <AcornPoint 
                  key={index}
                  $isFilled={index < gameState.heldAcorns}
                  $acornImage={acornImage}
                />
              ))}
            </AcornPointBar>
          </StateItem>
        </>
      )}
      <StateItem>
        <StateLabel>피로도:</StateLabel>
        <FatigueBar>
          {[...Array(3)].map((_, index) => (
            <FatiguePoint 
              key={index}
              $isFilled={index < gameState.fatigue}
              $evilSquirrel={gameState.evilSquirrel}
            />
          ))}
        </FatigueBar>
      </StateItem>
      {gameState.evilSquirrel === true && gameState.fatigue >= 3 && (
        <KillModeText>킬 모드 활성화!</KillModeText>
      )}
    </StatePanelContainer>
  );
};

const StatePanelContainer = styled.div`
  background-image: url(${buttonBgImage});
  background-size: 100% 100%;  // 배경 이미지 크기 조절
  background-repeat: no-repeat;
  background-position: center;
  padding: 35px 30px;         // 패딩 증가
  border-radius: 10px;
  min-width: 230px;           // 너비 증가
  color: white;
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 4px;                  // 아이템 간격 증가
`;

const StateItem = styled.div`
  margin-bottom: 0;           // gap으로 대체했으므로 제거
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StateLabel = styled.span`
  font-size: 1.0rem;          // 폰트 크기 증가
  margin-left: 10px;
  margin-bottom : 5px;
`;

const AcornBarContainer = styled.div`
  position: relative;
  width: 140px;
  height: 15px;
  transform: translateY(-5px);
  background-image: url(${gaegeImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
`;

const AcornProgressBar = styled.div`
  position: absolute;
  top: 4px;
  left: 6px;
  width: calc(${props => props.$progress}% - 12px);
  height: calc(100% - 8px);
  background-color: rgba(76, 175, 80, 0.8);
  transition: width 0.3s ease;
`;

const AcornCount = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const FatigueBar = styled.div`
  display: flex;
  gap: 2px;
`;

const FatiguePoint = styled.div`
  width: 40px;
  height: 28px;
    transform: translateY(-5px);
  background: ${props => {
    // 나쁜 다람쥐일 때
    if (props.$evilSquirrel) {
      return props.$isFilled ? 
        `url(${evilgem})` :    // 채워진 상태 - 빨간 보석
        `url(${evilnogem})`;   // 비워진 상태 - 빨간 빈 보석
    }
    // 착한 다람쥐일 때
    return props.$isFilled ? 
      `url(${goodgem})` :      // 채워진 상태 - 파란 보석
      `url(${goodnogem})`;     // 비워진 상태 - 파란 빈 보석
  }};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: opacity 0.3s;
  opacity: ${props => props.$isFilled ? 1 : 0.6};  // 투명도 조정
`;
const KillModeText = styled.div`
  color: #FF4444;
  font-size: 1.4rem;          // 폰트 크기 증가
  text-align: center;
  margin-top: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);  // 텍스트 그림자 추가
  animation: blink 1s infinite;

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
const AcornPointBar = styled.div`
  display: flex;
  gap: 5px;
`;

const AcornPoint = styled.div`
  width: 25px;                // 크기 증가
  height: 25px;
  background: ${props => props.$isFilled ? 
    `url(${props.$acornImage})` : 
    'rgba(255, 255, 255, 0)'};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: opacity 0.3s;
  opacity: ${props => props.$isFilled ? 1 : 0.3};
`;
export default StatePanel;