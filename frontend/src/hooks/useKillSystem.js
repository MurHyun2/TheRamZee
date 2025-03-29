import { useState, useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';

export const useKillSystem = () => {
  const { gameState, killUser } = useGame();
  const [killingPlayer, setKillingPlayer] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const isKillingRef = useRef(false);

  // 드래그 시작 핸들러
  const handleDragStart = (e, playerId) => {
    // 나쁜 다람쥐이고 피로도가 3일때만 가능
    if (gameState.evilSquirrel !== true || gameState.fatigue < 3) return;
    
    // 이미 죽은 플레이어는 제외
    if (gameState.killedPlayers.includes(playerId)) return;

    setDragStart({ 
      y: e.clientY, 
      playerId,
      timestamp: Date.now() 
    });
    setIsDragging(true);
  };

  // 드래그 진행 핸들러
  const handleDragMove = (e) => {
    if (!dragStart || !isDragging) return;
    
    const dragDistance = e.clientY - dragStart.y;
    const dragTime = Date.now() - dragStart.timestamp;

    // 50px 이상 아래로 드래그하고, 드래그 시간이 200ms 이상일 때
    if (dragDistance > 5 && dragTime > 200) {
      // 킬 애니메이션 시작
      startKillAnimation(dragStart.playerId);
      setDragStart(null);
      setIsDragging(false);
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = () => {
    setDragStart(null);
    setIsDragging(false);
  };

  // 킬 애니메이션 시작
  const startKillAnimation = async (victimId) => {
    if (isKillingRef.current) return; // 이미 킬 진행 중이면 중단
    isKillingRef.current = true;
    setKillingPlayer(victimId);
    
    // 3초 동안 GIF 애니메이션 재생
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 플레이어 죽음 처리
    killUser(victimId);
    setKillingPlayer(null);
    isKillingRef.current = false;
  };

  // 드래그 이벤트 정리
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, dragStart]);

  return {
    killingPlayer,
    handleDragStart,
    isKillable: gameState.evilSquirrel === true && gameState.fatigue >= 3 && !isKillingRef.current,
    isDragging
  };
};