import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../../../contexts/GameContext';
import styled from 'styled-components';
import { disconnectSocket } from '../../../api/stomp';

const GameOverScreen = () => {
  const navigate = useNavigate();
  const { gameState, 
          setGameState,
          setPlayers,
          result,
        } 
        = useGame();
  const { roomId } = useParams();

  useEffect(() => {
    result();
  }, []);

  const handleExit = async () => {
    await disconnectSocket();
    setGameState((prev) => ({
      ...prev,
    // 유저 정보
    nickName: null,

    // 숲 별 유저 정보
    forestUsers: null,
    count: 0,

    // 게임 진행 상태
    isStarted: false, // 게임 시작 여부

    //게임 시간
    initServerTime: null, // 서버시간 (게임 시작 시간)
    serverTime: null, // 서버 시간 (현재 시간)
    timer: 210, // 게임 시간 (4분)
    
    evilSquirrel: null, // true | false
    forestToken: null,  // 숲 토큰
    forestNum: 1, // 현재 숲 번호 (초기는 메인 숲숲)

    // 게임 리소스
    totalAcorns: 0, // 저장된 도토리
    heldAcorns: 0,  // 보유 중인 도토리
    fatigue: 0,     // 피로도 (0-3)

    // 투표 시스템
    isVoting: false,
    isEmergencyVote: false,
    totalVote: 0,
    votedPlayers: [],
    hasUsedEmergency: false,

    // 게임 전체 정지(추후)
    isPaused: false, // 게임 타이머 일시정지 여부

    // 플레이어 상태
    killedPlayers: [], // 죽은 플레이어들의 ID 배열
    isSpectating: false, // 관전자 모드
    isDead: false, // 죽음 상태

    // 종료 상태
    isGameOver: false,           // 게임 종료 여부
    gameOverReason: null,        // 'acorns' | 'emergency' | 'time'
    winner: null,                // 'good' | 'bad'

    //미션 상태
    "2_1": [false, 1], // 2번 숲 1번 미션
    "2_2": [false, 2], // 2번 숲 2번 미션
    "2_3": [false, 3], // 2번 숲 3번 미션
    "3_1": [false, 1], // 3번 숲 1번 미션
    "3_2": [false, 2], // 3번 숲 2번 미션
    "3_3": [false, 3], // 3번 숲 3번 미션
    "4_1": [false, 1], // 4번 숲 1번 미션
    "4_2": [false, 2], // 4번 숲 2번 미션
    "4_3": [false, 3], // 4번 숲 3번 미션
    "5_1": [false, 1], // 5번 숲 1번 미션
    "5_2": [false, 2], // 5번 숲 2번 미션
    "5_3": [false, 3], // 5번 숲 3번 미션
    "6_1": [false, 1], // 6번 숲 1번 미션
    "6_2": [false, 2], // 6번 숲 2번 미션
    "6_3": [false, 3], // 6번 숲 3번 미션
    "7_1": [false, 1], // 6번 숲 1번 미션
    "7_2": [false, 2], // 6번 숲 2번 미션
    "7_3": [false, 3], // 6번 숲 3번 미션
    }));
    setPlayers([]);
    navigate(`/room/${roomId}/game`);
  };

  const getMessage = () => {

    // 도토리로 인한 종료 
    if (gameState.gameOverReason === 'acorns') {
      return gameState.goodSquirrel 
        ? "도토리를 모두 모으지 못했습니다!\n나쁜 다람쥐 승리!\n"
        : "도토리를 모두 모았습니다!\n착한 다람쥐 승리!\n";
    }
  
    // 긴급 투표로 인한 종료 
    if (gameState.gameOverReason === 'emergency') {
      return gameState.winner === "good"
        ? "나쁜 다람쥐를 찾아냈습니다!\n착한 다람쥐 승리!\n"
        : "착한 다람쥐를 죽였습니다!\n나쁜 다람쥐 승리!\n";
    }
  
    // 최종 투표로 인한 종료 
    if (gameState.gameOverReason === 'time') {
      return gameState.winner === "good"
        ? "시간 종료! 나쁜 다람쥐를 찾아냈습니다!\n착한 다람쥐 승리!\n"
        : "시간 종료! 나쁜 다람쥐를 찾지 못했습니다!\n나쁜 다람쥐 승리!\n";
    }
  
    // 킬로 인한 종료 
    if (gameState.gameOverReason === 'kill') {
      return "착한 다람쥐무리를 처치했습니다!\n나쁜 다람쥐 승리!\n";
    }
  
    return "게임 종료!";
  };

  return (
    <OverlayContainer>
      <ContentBox>
        <Title>게임 종료</Title>
        <Message>{getMessage()}</Message>
        <Message>모은 도토리 개수</Message>
        <Message>
        {gameState.results && Object.entries(gameState.results).map(([key, value]) => (
          <div key={key}>
            {key}는 {value === -1 ? "나쁜 다람쥐!!" : `도토리 ${value}개 저장`}
          </div>
        ))}
        </Message>
        <ExitButton onClick={handleExit}>
          로비로 돌아가기
        </ExitButton>
      </ContentBox>
    </OverlayContainer>
  );
};

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
  z-index: 9999;  /* 매우 높은 z-index 값으로 설정 */
`;

const ContentBox = styled.div`
  background-color: rgba(139, 69, 19, 0.95);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  text-align: center;
  z-index: 10000;  /* overlay보다 더 높게 설정 */
`;

const Title = styled.h2`
  color: white;
  font-size: 2.5rem;
  font-family: 'JejuHallasan';
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  color: white;
  font-size: 1.2rem;
  font-family: 'JejuHallasan';
  margin-bottom: 2rem;
  white-space: pre-line;
`;

const ExitButton = styled.button`
  background-color: #90EE90;
  color: black;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-family: 'JejuHallasan';
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #98FB98;
  }
`;

export default GameOverScreen;