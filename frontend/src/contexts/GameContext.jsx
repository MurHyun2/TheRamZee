import { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as gameService from '../api/gameService';
import { fetchRoomById } from '../api/room';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // 게임의 전체 상태 관리
  const [gameState, setGameState] = useState({
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
    forestNum: 1, // 현재 숲 번호 (초기는 메인 숲)

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

    // 게임 전체 정지
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
  });

  // const navigate = useNavigate();

  const [videoSettings, setVideoSettings] = useState({
    videoEnabled: true,
    audioEnabled: true
  });

  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const nickname = sessionStorage.getItem('nickName');

  // 피로도 및 도토리 저장 
  const [isStorageActive, setIsStorageActive] = useState(false);
  const [isEnergyActive, setIsEnergyActive] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const timerRef = useRef(null);

  // 최신 닉네임 리스트 가져오기 (startGame을 누를 때 실행됨)
  const getPlayers = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        const response = await fetchRoomById(roomId);

        // 최신 닉네임 리스트 생성
        const updatedPlayers = [...players, ...response.data['nicknames']]
          .map((nick, index) => ({
            id: index + 1, // ✅ 1부터 시작하는 id 부여
            nickName: nick,
            isMe: nick === nickname // 현재 사용자 닉네임과 비교하여 isMe 설정
          }));

        // 상태 업데이트
        setPlayers(updatedPlayers);

        // 최신 값 반환
        return updatedPlayers;
      } catch (error) {
        return players; // 에러 발생 시 기존 nicknames 반환
      }
    } else {
      return players;
    }
  }, [isConnected, roomId, players, nickname]);

  // 게임 시작 처리
  const startGame = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        // ✅ 최신 nicknames 값을 받아오기
        const updatedNicknames = await getPlayers();

        // ✅ nickName 값만 추출하여 배열 형태로 변환
        const nicknameList = updatedNicknames.map(player => player.nickName);

        // ✅ 게임 시작 요청
        gameService.startGame(roomId, nicknameList);
      } catch (error) {
      }
    } 
  }, [isConnected, roomId, getPlayers]);

  // 피로도 충전 처리
  const chargeFatigue = useCallback(async () => {
    if (isConnected && roomId && nickname) {
      try {
        await gameService.chargeFatigue(roomId, nickname);
      } catch (error) {
      }
    }
  }, [isConnected, roomId, nickname]);

  // 도토리 저장 처리
  const saveUserAcorns = useCallback(async () => {
    if (isConnected && roomId && nickname) {
      try {
        await gameService.saveUserAcorns(roomId, nickname);
      } catch (error) {
      }
    }
  }, [isConnected, roomId, nickname]);

  // 결과 조회 처리
  const result = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        // ✅ 최신 nicknames 값을 받아오기
        const updatedNicknames = await getPlayers();

        // ✅ nickName 값만 추출하여 배열 형태로 변환
        const nicknameList = updatedNicknames.map(player => player.nickName);
        await gameService.result(roomId, nicknameList);
      } catch (error) {
      }
    }
  }, [isConnected, roomId]);

  // 숲 이동 처리
  const moveForest = useCallback(async (forestNum) => {
    if (isConnected && roomId && nickname && forestNum) {
      try {
        // ✅ 최신 nicknames 값을 받아오기
        const updatedNicknames = await getPlayers();

        // ✅ nickName 값만 추출하여 배열 형태로 변환
        const nicknameList = updatedNicknames.map(player => player.nickName);
        await gameService.moveForest(roomId, nickname, forestNum, nicknameList);
        setGameState.currentForestNum = forestNum;
      } catch (error) {
      }
    }
  }, [isConnected, roomId, nickname]);
  
  // 플레이어 사망 처리
  const killUser = useCallback(async (vitimNickname) => {
    if (isConnected && roomId && nickname && vitimNickname) {
      try {
        await gameService.killUser(roomId, vitimNickname, nickname);
      } catch (error) {
      }
    }
  }, [isConnected, roomId, nickname]);

  // 긴급 투표 시작 처리
  const startEmergencyVote = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        const nicknameList = players.map(player => player.nickName);
        await gameService.startEmergencyVote(roomId, nicknameList, nickname);
      } catch (error) {
      }
    }
}, [isConnected, roomId, players, nickname]);

  // 투표 종료 처리 
  const endVote = useCallback((newVotedPlayers) => {

    // ✅ 투표 결과 카운트
    const voteCount = newVotedPlayers.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    // ✅ 최대 득표수 찾기
    const maxVotes = Math.max(...Object.values(voteCount));
    
    // ✅ 최대 득표수를 받은 닉네임 찾기
    const topVoted = Object.keys(voteCount).filter(name => voteCount[name] === maxVotes);

    // ✅ 동점자 체크 및 결과 할당
    const result = topVoted.length === 1 ? topVoted[0] : null;

    // if (result === null) return;

    return result;
  }, []);

  // 미션 완료 처리
  const completeMission = useCallback(async (forestNum, missionNum) => {
    if (isConnected && roomId) {
      try {
        await gameService.completeMission(roomId, forestNum, missionNum, nickname);

        const missionKey = `${forestNum}_${missionNum}`;

        setGameState(prev => {
          const newState = {
            ...prev,
            [missionKey]: [true, prev[missionKey][1]]
          };
          return newState;
        });
      } catch (error) {
      }
    }
  }, [isConnected, roomId, nickname, gameState]);

  // 액션 취소 함수 
  const cancelAction = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsStorageActive(false);
    setIsEnergyActive(false);
    setIsActionInProgress(false);
    timerRef.current = null;
  }, []);

  // 도토리 저장 함수 
  const startSaveAcorns = useCallback(() => {
    if (gameState.evilSquirrel !== false && gameState.heldAcorns === 0 && isStorageActive && gameState.isDead) return;
    setIsStorageActive(true);
    setIsActionInProgress(true);
    timerRef.current = setTimeout(() => {
      saveUserAcorns();
      setIsStorageActive(false);
      setIsActionInProgress(false);
    }, 10000);
  }, [gameState.evilSquirrel, gameState.heldAcorns, isStorageActive, gameState.isDead, saveUserAcorns]);

  // 피로도 충전 함수  
  const startChargeFatigue = useCallback(() => {
    if (gameState.fatigue >= 3 || isEnergyActive || gameState.isDead) return;
    setIsEnergyActive(true);
    setIsActionInProgress(true);
    timerRef.current = setTimeout(() => {
      chargeFatigue();
      setIsEnergyActive(false);
      setIsActionInProgress(false);
    }, gameState.evilSquirrel === false ? 7000 : 10000);
  }, [gameState.fatigue, isEnergyActive, gameState.isDead, gameState.evilSquirrel, chargeFatigue]);

  const value = {
    gameState,            
    videoSettings,        
    isConnected,
    roomId,
    players,
    isStorageActive,
    isEnergyActive,
    isActionInProgress,
    setGameState,         
    startGame,            
    chargeFatigue,        
    saveUserAcorns,       
    result,               
    moveForest,           
    killUser,              
    completeMission,      
    endVote,                    
    setVideoSettings,     
    setRoomId,
    setIsConnected,
    setPlayers,
    setIsStorageActive,
    setIsEnergyActive,
    cancelAction,
    startSaveAcorns,
    startChargeFatigue,
    startEmergencyVote,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

