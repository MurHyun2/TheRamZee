import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useOpenVidu } from '../../../contexts/OpenViduContext';

const MyVideo = () => {
  const { publisher } = useOpenVidu();
  const videoRef = useRef(null);

  useEffect(() => {
    if (publisher && videoRef.current) {
      publisher.addVideoElement(videoRef.current);
    }
  }, [publisher]);

  return (
    <VideoContainer>
      <StyledVideo ref={videoRef} autoPlay />
    </VideoContainer>
  );
};

const VideoContainer = styled.div`
  position: relative;
  width: 200px; /* 🔥 원하는 크기로 조정 */
  height: 150px;
  background: #000;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain; /* 🔥 화면이 잘리지 않도록 설정 */
  transform: scaleX(-1); /* 🔥 좌우 반전 유지 */
  max-width: 200px; /* 🔥 너무 커지지 않도록 제한 */
  max-height: 150px;
`;

export default MyVideo;
