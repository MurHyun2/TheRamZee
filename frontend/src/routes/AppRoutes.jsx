import React, { useEffect } from 'react';
import {  Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import UserPage from '../features/user/UserPage';
import RoomPage from '../features/room/RoomPage';
import OpenViduPageWrapper from '../features/openVidu/OpenViduPage';
import GamePage from '../features/game/GameRoom';
import MainForest from '../features/game/forests/MainForest';
import TwistedForest from '../features/game/forests/TwistedForest';
import DryForest from '../features/game/forests/DryForest';
import BreathingForest from '../features/game/forests/BreathingForest';
import FoggyForest from '../features/game/forests/FoggyForest';
import FairyForest from '../features/game/forests/FairyForest';
import TimeForest from '../features/game/forests/TimeForest';
import RegisterPage from '../features/auth/RegisterPage';
import BackgroundMusic from '../features/audio/BackgroundMusic';
import ForgotPassword from '../features/auth/components/ForgotPasswordForm';
import {relog} from '../api/auth';
const AppRoutes = () => {
  const location = useLocation(); // 현재 경로를 가져오는 React Router 훅

  useEffect(() => {
    const callApiOnRouteChange = async () => {
      // 로그인, 비밀번호 찾기, 회원가입 페이지에서는 세션 초기화
      if (["/login", "/forgot-password", "/register"].includes(location.pathname)) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('nickName');
        sessionStorage.removeItem('isRefreshing');
      } else {
          await relog();
        
      }
    };

    callApiOnRouteChange();
  }, [location, relog]);

  return (
    <>
      <BackgroundMusic />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/start/*" element={null} /> {/* 이 라인 추가 */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/room/:roomId" element={<OpenViduPageWrapper />} />
        <Route path="/room/:roomId/game" element={<GamePage />} />
        <Route path="/game/:roomId/main" element={<MainForest />} />
        <Route path="/game/:roomId/forest/twisted" element={<TwistedForest />} />
        <Route path="/game/:roomId/forest/dry" element={<DryForest />} />
        <Route path="/game/:roomId/forest/breathing" element={<BreathingForest />} />
        <Route path="/game/:roomId/forest/foggy" element={<FoggyForest />} />
        <Route path="/game/:roomId/forest/fairy" element={<FairyForest />} />
        <Route path="/game/:roomId/forest/time" element={<TimeForest />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      </>
  );
};

export default AppRoutes;
