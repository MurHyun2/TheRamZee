import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // AuthContext에서 accessToken과 setAccessToken 둘 다 가져옵니다.
  const { accessToken, setAccessToken } = useAuth();
  const [nickname, setNickname] = useState(sessionStorage.getItem('nickName'));

  // 세션 스토리지의 닉네임이 변경될 때마다 상태 업데이트
  useEffect(() => {
    const storedNickname = sessionStorage.getItem('nickName');
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, [accessToken]); // accessToken이 변경될 때(로그인/로그아웃 시)도 체크

  // nickname이 변경될 때마다 sessionStorage 업데이트
  useEffect(() => {
    if (nickname) {
      sessionStorage.setItem('nickName', nickname);
    }
  }, [nickname]);

  // 새로고침 여부를 판단하는 로직: 페이지 로드시 Navigation Timing API 사용
  useEffect(() => {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && navEntries[0].type === 'reload') {
      // 새로고침이면 sessionStorage에 플래그 세팅
      sessionStorage.setItem('isRefreshing', 'true');
    }
  }, []);

  // beforeunload 이벤트 핸들러 등록
  useEffect(() => {
    if (!accessToken) return;

    const handleBeforeUnload = async (event) => {
      // 새로고침 플래그가 있다면 새로고침으로 간주하여 logout 호출 건너뜀
      if (sessionStorage.getItem('isRefreshing')) {
        sessionStorage.removeItem('isRefreshing');
        return;
      }
      // 그렇지 않다면 창을 닫는 것으로 판단하여 logout 호출
      //await logout();
      // 로그아웃 후 인증 상태 초기화 및 로그인 페이지 리다이렉트
      setAccessToken(null);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('nickName');
      sessionStorage.removeItem('isRefreshing');
      // window.location.href = '/login';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [accessToken, setAccessToken]);

  // 키보드 이벤트를 통해 새로고침(F5, Ctrl+R, Command+R) 감지
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'F5' ||
        (e.ctrlKey && e.key.toLowerCase() === 'r') ||
        (e.metaKey && e.key.toLowerCase() === 'r')
      ) {
        sessionStorage.setItem('isRefreshing', 'true');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const value = {
    nickname,
    setNickname,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
