import { useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { subscribeToTopic } from '../api/stomp'
import { useGame } from '../contexts/GameContext';

export const useGameHandlers = (roomId, setGameState, moveForest, cancelAction, endVote) => {
  const nickName = sessionStorage.getItem('nickName');
  const navigate = useNavigate();
    const { 
      players
    } = useGame();

  // 게임 초기화 응답 처리
  const handleGameStartResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          subscribeToTopic(`/topic/server-time`, handleTimeSyncResponse);
          const initializedData = message.data;
          const userKey = `ROOM:${roomId}:USER:${nickName}`;
          const forestKey = `ROOM:${roomId}:FOREST:1`;

          setGameState((prev) => ({
            ...prev,
            isStarted: true,
            evilSquirrel: initializedData.users[userKey].evilSquirrel,
            forestToken: initializedData.users[userKey].forestToken,
            forestUsers: initializedData.forestUsers,
            count: initializedData.forests[forestKey].count,
            evilSquirrelNickname: initializedData.forests[forestKey].evilSquirrelNickname,
            initServerTime: initializedData.serverTime,
            serverTime: initializedData.serverTime,
          }));
        }
      } catch (error) {
      }
    },
    [roomId, setGameState, nickName]
  );

  // 비상 상황 응답 처리
  const handleEmergencyResponse = useCallback(
    (message) => {
    const initializedData = message.data;
    if (message.success) {
      setGameState(prev => ({
        ...prev,
        isVoting: true,
        isEmergencyVote: true,
        forestNum: 1, 
        forestUsers: initializedData.forestUsers,
        isPaused: true,
        hasUsedEmergency: true,
        voter: initializedData.voter,
        serverTime: initializedData.serverTime,
        timer: 270 - Math.floor((initializedData.serverTime - prev.initServerTime)/1000),
      }));
      cancelAction();
      moveForest(1);
      navigate(`/game/${roomId}/main`); 
    }
  },
  [roomId]
);

// 숲 이동 응답 처리
const handleMoveResponse = useCallback(
  async (message) => {
    try {
      if (message.success) {
        const initializedData = message.data;

        setGameState((prev) => ({
          ...prev,
          forestUsers: initializedData.forestUsers,
        }));

        if (message.data['nickname'] === nickName) {
          setGameState((prev) => ({
            ...prev,
            forestToken: initializedData.forestToken,
            forestNum: initializedData.forestNum,
          }));
        }
      }
    } catch (error) {
    }
  },
  []
  );

  // 도토리 저장 응답 처리
  const handleSaveAcornsResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          
          // 도토리가 13개 이상이면 게임 종료
          if (initializedData.newTotalAcorns >= 13) {
            navigate(`/game/${roomId}/main`);
            setGameState((prev) => ({
              ...prev,
              totalAcorns: initializedData.newTotalAcorns,
              heldAcorns: 0,
              isGameOver: true,
              gameOverReason: 'acorns',
              winner: 'good',
              isStarted: false
            }));setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                currentScreen: 'gameOver'
              }));
            }, 500);
          } else {
            setGameState((prev) => ({
              ...prev,
              totalAcorns: initializedData.newTotalAcorns
            }));
            if (message.data['nickname'] === nickName) {
              setGameState((prev) => ({
                ...prev,
                heldAcorns: 0
              }));
            }
          }
        }
      } catch (error) {
      }
    },
    [setGameState, nickName, navigate, roomId]
  );

  // 결과 조회 처리
  const handleResultResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data.results;

          setGameState((prev) => ({
            ...prev,
            results: initializedData
          }));
        }
      } catch (error) {
      }
    },
    [setGameState, nickName]
  );
  
  // 피로도 충전 응답 처리
  const handleChargeFatigueResponse = useCallback(
    (message) => {
      try {
        if (message.success && message.data['nickname'] === nickName) {
          const initializedData = message.data;
          setGameState((prev) => ({
            ...prev,
            fatigue: initializedData.userFatigue
          }));
        }
      } catch (error) {
      }
    },
    [setGameState, nickName]
  );

  // 킬 응답 처리
  const handleKillResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          
          setGameState((prev) => {
            const newKilledPlayers = [...prev.killedPlayers, initializedData['victimNickname']];
            
            // 기본 업데이트 객체
            const updates = {
              ...prev,
              killedPlayers: newKilledPlayers,
              killerNickname: initializedData['killerNickname']
            };
  
            // 킬러/희생자 관련 업데이트
            if (message.data['killerNickname'] === nickName) {
              updates.fatigue = initializedData['killerFatigue'];
            } else if (message.data['victimNickname'] === nickName) {
              updates.isDead = true;
              updates.isSpectating = true;
            }
  
            // 나쁜 다람쥐 승리 조건 체크
            if (updates.count - newKilledPlayers.length <= 2) {
              navigate(`/game/${roomId}/main`);
              updates.isGameOver = true;
              updates.gameOverReason = 'kill';
              updates.winner = 'bad';
              updates.isStarted = false;
            }
  
            return updates;
          });
        }
      } catch (error) {
      }
    },
    [setGameState, nickName, navigate, roomId]
  );

  // 미션 완료 응답 처리
  const handleCompleteMissionResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          
          // initializedData에서 미션 정보 추출
          const forestNum = initializedData.forestNum;
          const missionNum = initializedData.missionNum;
          const missionKey = `${forestNum}_${missionNum}`;

          // 모든 플레이어가 미션 완료 상태 업데이트
          setGameState(prev => ({
            ...prev,
            [missionKey]: [true, prev[missionKey][1]],
          }));

          // 미션을 완료한 플레이어인 경우에만 추가 상태 업데이트
          if (initializedData.nickname === nickName) {
            setGameState(prev => ({
              ...prev,
              fatigue: Math.max(prev.fatigue - 1, 0),
              heldAcorns: initializedData.userAcorns
            }));
          }
        }
      } catch (error) {
      }
    },
    [nickName, setGameState]
  );

  // 퇴장 응답 처리 
  const handleOutResponse = useCallback(
    (message) => {
      try {
        if (message.status) {
          navigate("/rooms");
        }
      } catch (error) {
      }
    },
    [setGameState]
  );

  // 긴급 투표 처리 
  const handleVoteResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          setGameState((prev) => {
            const newVotedPlayers = [...prev.votedPlayers, initializedData.nickname];

            const updates = {
              ...prev,
              [initializedData.nickname]: initializedData.voteNum,
              votedPlayers: newVotedPlayers,
              totalVote: initializedData.totalVote
            };
            
            // 모든 유저 투표 완료 
            if (initializedData.totalVote === updates.count-updates.killedPlayers.length) {
              updates.isVoting = false;
              updates.isEmergencyVote = false;
              updates.totalVote = 0;
              updates.votedPlayers = [];
              updates.isPaused = false;
              for (const player of newVotedPlayers) {
                updates[player] = 0;
              }
              const result = endVote(newVotedPlayers);
              
              if (result != null ) {
                // 나쁜 다람쥐 색출 유무
                if (result === updates.evilSquirrelNickname) {
                    updates.isGameOver = true;
                    updates.winner = 'good';
                    updates.gameOverReason = 'emergency';
                    updates.isStarted = false;
                  } else {
                    const newKilledPlayers = [...prev.killedPlayers, result];
                    updates.killedPlayers = newKilledPlayers;
      
                    // 나쁜 다람쥐 승리 조건 체크
                    if (updates.count - newKilledPlayers.length <= 2) {
                      updates.isGameOver = true;
                      updates.gameOverReason = 'kill';
                      updates.winner = 'bad';
                      updates.isStarted = false;
                    } else if (result === nickName) {
                      updates.isDead = true;
                    }
                  }
              }

            }
            return updates;
          }); 
          
        }
      } catch (error) {
      }
    },
    [setGameState]
  );

  // 최종 투표 처리 
  const handleLastVoteResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;

          setGameState((prev) => {
            const newVotedPlayers = [...prev.votedPlayers, initializedData.nickname];

            const updates = {
              ...prev,
              [initializedData.nickname]: initializedData.voteNum,
              votedPlayers: newVotedPlayers,
              totalVote: initializedData.totalVote
            };
            
            // 모든 유저 투표 완료 
            if (initializedData.totalVote === updates.count-updates.killedPlayers.length) {
              const result = endVote(newVotedPlayers);

              // 나쁜 다람쥐 색출 유무
              if (result === updates.evilSquirrelNickname) {
                  updates.isGameOver = true;
                  updates.winner = 'good';
                  updates.gameOverReason = 'time';
                  updates.isStarted = false;
                  for (const player of newVotedPlayers) {
                    updates[player] = 0;
                  }
                } else {
                updates.isGameOver = true;
                updates.winner = 'bad';
                updates.gameOverReason = 'time';
                updates.isStarted = false;
                for (const player of newVotedPlayers) {
                  updates[player] = 0;
                }
                }
            }
            return updates;
          }); 
          
        }
      } catch (error) {
      }
    },
    [setGameState]
  );

  // 서버시간 동기화
  const handleTimeSyncResponse = useCallback(
    (message) => {
      try {
      if (message) {
        const initializedData = message['serverTime'];
        
        setGameState((prev) => {
          
          const totalGameTime = prev.hasUsedEmergency ? 300 : 240;
          const now = initializedData;
          // 기본 업데이트 객체
          const updates = {
            ...prev,
            serverTime : now,
            timer: totalGameTime - Math.floor((now - prev.initServerTime)/1000)
          };
          return updates;
        });
        
      }
    } catch (error) {
    }
  },
  [setGameState]
);

  return {
    handleGameStartResponse,
    handleMoveResponse,
    handleSaveAcornsResponse,
    handleResultResponse,
    handleChargeFatigueResponse,
    handleKillResponse,
    handleCompleteMissionResponse,
    handleOutResponse,
    handleEmergencyResponse,
    handleVoteResponse,
    handleLastVoteResponse,
    handleTimeSyncResponse
  };
};
