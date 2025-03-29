import styled from 'styled-components';

const EmptyMissionOverlay = ({ onClose }) => {
  return (
    <OverlayContainer>
      <Message>미션 준비중입니다...</Message>
      <CloseButton onClick={onClose}>나가기</CloseButton>
    </OverlayContainer>
  );
};

const OverlayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
`;

const Message = styled.div`
  color: white;
  font-size: 2rem;
  font-family: 'JejuHallasan';
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #FF4444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'JejuHallasan';
`;

export default EmptyMissionOverlay;