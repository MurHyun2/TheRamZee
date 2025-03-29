import { sendMessage } from './stomp';

// 게임 초기화
export const startGame = async (roomId, nicknames) => {
  try {
    await sendMessage(`/app/game/${roomId}/start`, { roomId, nicknames });
  } catch (error) {
    throw error;
  }
};

// 숲 이동
export const moveForest = async (roomId, nickname, newForest, nicknames) => {
  try {
    await sendMessage(`/app/game/${roomId}/move`, { roomId, nickname, newForest, nicknames });
  } catch (error) {
    throw error;
  }
};

// 도토리 저장
export const saveUserAcorns = async (roomId, nickname) => {
  try {
    await sendMessage(`/app/game/${roomId}/save-acorns`, { roomId, nickname });
  } catch (error) {
    throw error;
  }
};

// 게임 결과 
export const result = async (roomId, nicknames) => {
  try {
    await sendMessage(`/app/game/${roomId}/acorns`, { roomId, nicknames });
  } catch (error) {
    throw error;
  }
};

// 피로도 충전 
export const chargeFatigue = async (roomId, nickname) => {
  try {
    await sendMessage(`/app/game/${roomId}/charge-fatigue`, { roomId, nickname });
  } catch (error) {
    throw error;
  }
};

// 다람쥐 킬 
export const killUser = async (roomId, victimNickname, killerNickname) => {
  try {
    await sendMessage(`/app/game/${roomId}/kill`, { roomId, victimNickname, killerNickname });
  } catch (error) {
    throw error;
  }
};

// 미션 완료 
export const completeMission = async (roomId, forestNum, missionNum, nickname) => {
  try {
    await sendMessage(`/app/game/${roomId}/complete-mission`, { roomId, forestNum, missionNum, nickname });
  } catch (error) {
    throw error;
  }
};

// 긴급 투표 
export const startEmergencyVote = async (roomId, nicknames, voter) => {
  try {
    await sendMessage(`/app/game/${roomId}/emergency`, { roomId, nicknames, voter });
  } catch (error) {
    throw error;
  }
};

// 최종 투표 
export const sendLastVote = async (roomId, nickname) => {
  try {
    await sendMessage(`/app/game/${roomId}/last-vote`, { roomId, nickname });
  } catch (error) {
    throw error;
  }
};

// 투표하기 
export const sendVote = async (roomId, nickname) => {
  try {
    await sendMessage(`/app/game/${roomId}/vote`, { roomId, nickname });
  } catch (error) {
    throw error;
  }
};

