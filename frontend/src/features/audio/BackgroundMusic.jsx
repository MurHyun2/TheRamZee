import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVolume } from '../../contexts/VolumeContext';
import { musicMap } from './musicMap';

const BackgroundMusic = () => {
  const { volume } = useVolume();
  const location = useLocation();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      // 볼륨 설정
      audioRef.current.volume = volume;

      const matchedKey = Object.keys(musicMap).find((key) => location.pathname.startsWith(key));
      const currentMusic = matchedKey ? musicMap[matchedKey] : null;

      // 음악이 변경되어야 할 경우만 src 업데이트 및 재생
      if (currentMusic && audioRef.current.src !== window.location.origin  + currentMusic) {
        audioRef.current.src = currentMusic;
      }
    }
  }, [location.pathname, volume]);

  return <audio ref={audioRef} autoPlay loop />;
};

export default BackgroundMusic;
