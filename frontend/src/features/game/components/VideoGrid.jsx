import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import goodSquirrel from '../../../assets/images/characters/good-squirrel.png';
import { useKillSystem } from '../../../hooks/useKillSystem';
import { useGame } from '../../../contexts/GameContext';
import KillAnimation from './KillAnimation';
import DeadOverlay from './DeadOverlay';
import evilKillCursor from '../../../assets/images/animations/evil-kill-hover.gif';

const VideoGrid = (props) => {
  const { session, subscribers } = useOpenVidu();
  const { gameState } = useGame();
  const { killingPlayer, handleDragStart, isKillable, isDragging } = useKillSystem();
  const [showDeadOverlay, setShowDeadOverlay] = useState(false);
  const videoRefs = useRef({});
  const currentSubscribers = props.players || [];
  const totalSlots = props.totalSlots;
  
  const slots = Array.from({ length: totalSlots }, (_, i) => currentSubscribers[i] || null);

  useEffect(() => {
    if (gameState.isDead && !showDeadOverlay) {
      setShowDeadOverlay(true);
    }
  }, [gameState.isDead]);

  useEffect(() => {
    slots.forEach((player) => {
      if (player?.stream?.connection?.connectionId) {
        const connectionId = player.stream.connection.connectionId;
        if (!videoRefs.current[connectionId]) {
          videoRefs.current[connectionId] = React.createRef();
        }
      }
    });

    slots.forEach((player) => {
      if (player?.stream?.connection?.connectionId) {
        const connectionId = player.stream.connection.connectionId;
        const videoElement = videoRefs.current[connectionId]?.current;
        if (videoElement && !videoElement.dataset.assigned) {
          player.addVideoElement(videoElement);
          videoElement.dataset.assigned = "true";
        }
      }
    });
  }, [slots]);

  useEffect(() => {
    subscribers.forEach((player) => {
      if (player?.stream?.connection?.data) {
        try {
          const rawData = player.stream.connection.data.split("%/%")[0];
          const parsedData = JSON.parse(rawData);
          const subscriberNickname = parsedData.clientData;
          // 1) 숲에 포함되어 있는지 체크
          const isInForest = gameState.forestUsers?.[gameState.forestNum]?.includes(subscriberNickname);

            // 2) 죽은 사람인지 체크
            const isKilled = gameState.killedPlayers?.includes(subscriberNickname);
            
            // if (!isInForest) {
            //   player.subscribeToAudio(false);
            // } 
            // if (isKilled) {
            //   player.subscribeToAudio(false);
            // }
            if (isInForest && !isKilled) {
              player.subscribeToAudio(true);
            } else {
              player.subscribeToAudio(false);
            }
          } catch (error) {
          }
      }
    });
  }, [subscribers, gameState.forestNum, gameState.forestUsers, gameState.killedPlayers]);

  const getPlayerInfo = (sub) => {
    let playerNickname = '';
    try {
      const rawData = sub?.stream?.connection?.data;
      if (rawData) {
        const parsedData = rawData.split("%/%")[0];
        const playerData = JSON.parse(parsedData);
        playerNickname = playerData.clientData;
      }
    } catch (error) {
    }
    const isPlayerDead = gameState.killedPlayers?.includes(playerNickname);
    return { playerNickname, isPlayerDead };
  };

  if (!session) {
    return <GridContainer>Loading...</GridContainer>;
  }

  return (
    <GridContainer>
      {slots.map((sub) => {
        const connectionId = sub?.stream?.connection?.connectionId;
        const { playerNickname, isPlayerDead } = getPlayerInfo(sub);

        return (
          <VideoContainer
            key={connectionId}
            onMouseDown={(e) => isKillable && handleDragStart(e, playerNickname)}
            isKillable={isKillable}
            isDragging={isDragging}
          >
            {connectionId ? (
              <>
                <StyledVideo
                  ref={(el) => {
                    if (el && connectionId) {
                      if (!videoRefs.current[connectionId]) {
                        videoRefs.current[connectionId] = { current: el };
                      } else {
                        videoRefs.current[connectionId].current = el;
                      }
                    }
                  }}
                  autoPlay
                  $isDead={isPlayerDead}
                />
                {killingPlayer === playerNickname && (
                  <KillAnimation onAnimationEnd={() => setShowDeadOverlay(true)} />
                )}
                {isPlayerDead && <DeadIndicator>💀</DeadIndicator>}
                <PlayerName>{playerNickname}</PlayerName>
              </>
            ) : (
              <ImageContainer>
                <PlaceholderImage 
                  src={props.placeholderImage || goodSquirrel}
                />
              </ImageContainer>
            )}
          </VideoContainer>
        );
      })}

      {showDeadOverlay && gameState.isDead && (
        <DeadOverlay playerName={gameState.nickName} />
      )}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 0px;
  opacity: 100%;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 173px;
  height: 130px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: ${props => props.isKillable ? (props.isDragging ? 'grabbing' : 'pointer') : 'default'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${evilKillCursor}) center/cover no-repeat;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 2;
    pointer-events: none;
  }

  ${props => props.isKillable && !props.isDragging && `
    &:hover::before {
      opacity: 1;
    }
  `}
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scaleX(-1);
  max-width: 200px;
  max-height: 150px;
  opacity: ${props => props.$isDead ? '0.5' : '1'};
  filter: ${props => props.$isDead ? 'grayscale(100%)' : 'none'};
`;

const PlaceholderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 100%;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 80%;
`;

const DeadIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const PlayerName = styled.div`
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
`;

export default VideoGrid;