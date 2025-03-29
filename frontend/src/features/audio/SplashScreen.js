import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const SplashScreen = ({ onComplete }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // intro-music.mp3 오디오 객체 생성 및 볼륨 50% 설정
    audioRef.current = new Audio('/audio/intro-music.mp3');
    audioRef.current.volume = 0.5;

    // 4.5초 후에 오디오 재생 시도
    const timer = setTimeout(() => {
      audioRef.current.play().catch((error) =>
        console.error('Audio play error:', error)
      );
    }, 4500);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 비디오가 정상적으로 로드되었을 때 호출됨
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  // 비디오 로드 실패 시 호출됨
  const handleVideoError = (e) => {
    console.error('Video load error:', e);
    if (onComplete) {
      onComplete();
    }
  };

  // 비디오 재생 종료 시 호출됨 (비디오가 정상 로드된 경우에만 onComplete 호출)
  const handleVideoEnd = () => {
    if (videoLoaded && onComplete) {
      onComplete();
    }
  };

  return (
    <SplashContainer>
      <SplashVideo
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        onEnded={handleVideoEnd}
      >
        <source src="https://ramzee.online/start/video.mp4" type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </SplashVideo>
    </SplashContainer>
  );
};

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SplashVideo = styled.video`
  width: auto;
  max-width: 100%;
  max-height: 100%;
`;

export default SplashScreen;
