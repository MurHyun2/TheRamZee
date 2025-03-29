import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { GameProvider } from './contexts/GameContext';
import { OpenViduProvider } from './contexts/OpenViduContext'; // OpenViduContext 추가
import AppRoutes from './routes/AppRoutes';
import VolumeControl from './features/audio/VolumeControl';
import { VolumeProvider } from './contexts/VolumeContext';
import { FriendProvider } from './contexts/FriendContext';
import { BrowserRouter } from 'react-router-dom';
import SplashScreen from './features/audio/SplashScreen'; // 스플래시 컴포넌트 추가

const App = () => {
  const [showSplash, setShowSplash] = useState(false); // 스플래시 화면 상태 관리

  useEffect(() => {
    // localStorage에서 "visited" 키를 확인
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
      sessionStorage.setItem('hasVisited', 'true'); // 방문 기록 저장
      setShowSplash(true);
      // 3초 후 스플래시 화면 종료
      // setTimeout(() => {
      //   setShowSplash(false);
      // }, 3000);

    }
  }, []);

  useEffect(() => {
    if (showSplash) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setShowSplash(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showSplash]);

  return (
    <>
      {showSplash ? ( // 스플래시 화면 표시
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : ( // 스플래시 완료 후 메인 앱 렌더링
        <VolumeProvider>
          <VolumeControl />
          <AuthProvider>
            <UserProvider>
              <FriendProvider>
                <GameProvider>
                  <OpenViduProvider> {/* OpenViduProvider 추가 */}
                    <BrowserRouter>
                      <AppRoutes />
                    </BrowserRouter>
                  </OpenViduProvider>
                </GameProvider>
              </FriendProvider>
            </UserProvider>
          </AuthProvider>
        </VolumeProvider>
      )}
    </>
  );
};

export default App;
