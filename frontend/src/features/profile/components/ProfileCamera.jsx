import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const ProfileCamera = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 320 },
            height: { ideal: 240 }
          },
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
      }
    };

    startCamera();

    // cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <CameraContainer>
      <CameraVideo
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
    </CameraContainer>
  );
};

const CameraContainer = styled.div`
  width: 320px;
  height: 240px;
  background-color: rgba(45, 24, 16, 0.95);
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem auto;
`;

const CameraVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); // 거울처럼 좌우반전
`;

export default ProfileCamera;