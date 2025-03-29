import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';

const MissionButton = ({ 
  onClick, 
  completed = false,
  disabled = false,
 }) => {
  const { gameState } = useGame();
  const isDisabled = disabled || 
    completed || 
    (gameState.evilSquirrel === true && gameState.fatigue < 1);
 
  return (
    <StyledMissionButton
      onClick={onClick}
      disabled={isDisabled}
      $completed={completed}
      $isKillable={gameState.evilSquirrel === true && gameState.fatigue >= 3}
    >
      {completed && '⭐'} {/* 완료된 경우에만 별 표시 */}
    </StyledMissionButton>
  );
 };

const StyledMissionButton = styled.button`
 width: 100px;
 height: 100px;
 border: none;
 border-radius: 50%;
 background: ${props => props.$completed ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0)'};
 color: white;
 font-size: 1.5rem;
 cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
 opacity: 100%;
 transition: transform 0.2s;

 /* 추후 이미지 버튼으로 변경 시 추가할 스타일
 background-image: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'none'};
 background-size: cover;
 background-position: center;
 background-color: ${props => !props.$backgroundImage && (props.$completed ? '#666' : '#FFD700')};
 */

 &:hover:not(:disabled) {
   transform: scale(1.2);
   ${props => props.$isKillable && `
     background: rgba(255, 0, 0, 0.2);
   `}
 }
`;

export default MissionButton;