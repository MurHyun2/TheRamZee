import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';

const RoleReveal = ({ roomId }) => {
  const navigate = useNavigate();
  const { gameState } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/game/${roomId}/main`); // 2초 후 자동 이동
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
  }, [navigate, roomId]);

  return (
    <Overlay>
      <Content>
        <RoleTitle $isEvil={gameState.evilSquirrel}>
          당신은 {gameState.evilSquirrel ? '나쁜 다람쥐' : '착한 다람쥐'} 입니다
        </RoleTitle>
        <RoleDescription>
          {gameState.evilSquirrel
            ? '다른 다람쥐들을 모두 제거하세요!'
            : '도토리를 모으고 나쁜 다람쥐를 찾아내세요!'}
        </RoleDescription>
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Content = styled.div`
  text-align: center;
  color: white;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const RoleTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ $isEvil }) => ($isEvil ? '#FF4444' : '#90EE90')};
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  font-family: 'JejuHallasan';
`;

const RoleDescription = styled.p`
  font-size: 1.5rem;
  color: #FFFFFF;
  font-family: 'JejuHallasan';
`;

export default RoleReveal;
