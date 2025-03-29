import React, { createContext, useContext, useState, useEffect } from 'react';

const VolumeContext = createContext();

export const VolumeProvider = ({ children }) => {
  // localStorage에서 초기 볼륨 값을 가져오거나 기본값 0.5로 설정
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('volume');
    return savedVolume !== null ? parseFloat(savedVolume) : 0.5;
  });

  // 볼륨 값이 변경될 때 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('volume', volume);
  }, [volume]);

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
    </VolumeContext.Provider>
  );
};

export const useVolume = () => {
  return useContext(VolumeContext);
};
