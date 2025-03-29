import styled from 'styled-components';
import { Z_INDEX } from '../../../../constants/zIndex';
import DescriptionOverlay from './DescriptionOverlay';
import EmergencyVoteModal from '../vote/EmergencyVoteModal';
import FinalVoteModal from '../vote/FinalVoteModal';

const GameLayout = ({
  leftVideoGrid,
  rightVideoGrid,
  gameTimer,
  statePanel,
  buttonContainer,
  myVideo,
  miniMap,
  isGameStarted,
  background,
  mainForestButtons,
  missionButtons,
  miniGameOverlay,

  // Vote related props
  isVoting,
  isEmergencyVote,
  onVote,
  onCloseVote,
  players,

  // Description related props
  isDescriptionVisible,
  onShowDescription,
  onHideDescription,
  children,
}) => {
  return (
    <LayoutContainer>
      <BackgroundImage $background={background} />

      <TopSection>
        <LeftVideoGridArea>{leftVideoGrid}</LeftVideoGridArea>
        <GameTimerArea>{gameTimer}</GameTimerArea>
        <RightVideoGridArea>{rightVideoGrid}</RightVideoGridArea>

        {isGameStarted ? (
          <StatePanelArea>{statePanel}</StatePanelArea>
        ) : (
          <ButtonContainerArea>{buttonContainer}</ButtonContainerArea>
        )}
      </TopSection>

      {isGameStarted && missionButtons && (
        <MissionSection>{missionButtons}</MissionSection>
      )}

      <BottomSection>
        <MyVideoArea>{myVideo}</MyVideoArea>
        {isGameStarted && mainForestButtons && (
          <MainForestButtonsArea>{mainForestButtons}</MainForestButtonsArea>
        )}
        <MiniMapArea>
          {miniMap}
          <InfoIcon onClick={onShowDescription}>i</InfoIcon>
        </MiniMapArea>
      </BottomSection>

      {miniGameOverlay}

      {/* Vote Modals */}
      {isVoting && isEmergencyVote && (
        <EmergencyVoteModal
          isOpen={true}
          onClose={onCloseVote}
          players={players}
          onVote={onVote}
        />
      )}

      {isVoting && !isEmergencyVote && (
        <FinalVoteModal
          isOpen={true}
          onClose={onCloseVote}
          players={players}
          onVote={onVote}
        />
      )}

      {children}

      <DescriptionOverlay
        isVisible={isDescriptionVisible}
        onClose={onHideDescription}
        description="이 게임의 주요 목표는 다람쥐를 도와 임무를 완수하는 것입니다!"
      />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => `url(${props.$background})`};
  background-size: cover;
  background-position: center;
  z-index: ${Z_INDEX.BACKGROUND};
`;

const TopSection = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  z-index: ${Z_INDEX.MAIN_CONTENT};
`;

const LeftVideoGridArea = styled.div`
  flex: 3;
  margin-right: 20px;
`;

const GameTimerArea = styled.div`
  top: 20px;
  left: 50%;
  margin-right: 20px;
`;

const RightVideoGridArea = styled.div`
  flex: 2;
  margin-right: 20px;
`;

const StatePanelArea = styled.div`
  flex: 1;
  z-index: 1001;
`;

const ButtonContainerArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
`;

const MissionSection = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${Z_INDEX.MISSION_BUTTONS};
`;

const BottomSection = styled.div`
  position: fixed;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: ${Z_INDEX.MAIN_CONTENT};
`;

const MyVideoArea = styled.div`
  margin-left: 20px;
  margin-right: auto;
`;

const MainForestButtonsArea = styled.div`
  left: 50%;
`;

const MiniMapArea = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: 20px;
`;

const InfoIcon = styled.button`
  position: absolute;
  top: -20px;
  right: -10px;
  width: 30px;
  height: 30px;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
    color: #555;
  }
`;

export default GameLayout;