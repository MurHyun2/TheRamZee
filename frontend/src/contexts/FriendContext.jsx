import React, { createContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/apiService';
import { connectSocket, subscribeToTopic, FRIEND_TOPICS } from '../api/stomp';

export const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isFriendOverlayOpen, setIsFriendOverlayOpen] = useState(false);
  const [isChatOverlayOpen, setIsChatOverlayOpen] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  // user 상태변화
  const [username, setUsername] = useState(sessionStorage.getItem('username'));

  // 채팅방 활성 상태 체크 함수
  const isActiveChatRoom = (nickname) => {
    return isChatOverlayOpen && currentChatUser === nickname;
  };

  // 친구 목록 가져오기
  const fetchFriends = async () => {
    try {
      const response = await apiRequest('/api/v1/friends/list', 'GET');
      setFriends(response.data || []);
    } catch (error) {
    }
  };

  // 친구 요청 목록 가져오기
  const fetchFriendRequests = async () => {
    try {
      const response = await apiRequest('/api/v1/friends/request', 'GET');
      setFriendRequests(response.data || []);
    } catch (error) {
    }
  };

  // 읽지 않은 메시지 수 가져오기
  const fetchUnreadCounts = async () => {
    try {
      const receiver = sessionStorage.getItem('nickName');
      const response = await apiRequest(`/api/v1/chat/unread-count?receiver=${receiver}`, 'GET');
      const counts = response.data.reduce((acc, item) => {
        acc[item.sender] = item.unreadCount;
        return acc;
      }, {});
      setUnreadCounts(counts);
    } catch (error) {
    }
  };

  // 친구 요청 보내기
  const sendFriendRequest = async (friendNickname) => {
    try {
      await apiRequest(`/api/v1/friends/request/${friendNickname}`, 'POST');
      await fetchFriendRequests();
      return true;
    } catch (error) {
      return false;
    }
  };

  // 친구 요청 수락
  const acceptFriendRequest = async (senderNickname) => {
    try {
      await apiRequest(`/api/v1/friends/accept/${senderNickname}`, 'POST');
      await Promise.all([fetchFriends(), fetchFriendRequests()]);
      return true;
    } catch (error) {
      return false;
    }
  };

  // 친구 삭제
  const removeFriend = async (friendNickname) => {
    try {
      await apiRequest(`/api/v1/friends/${friendNickname}`, 'DELETE');
      await fetchFriends();
      return true;
    } catch (error) {
      return false;
    }
  };

  // 오버레이 제어 함수들
  const openFriendOverlay = () => setIsFriendOverlayOpen(true);
  const closeFriendOverlay = () => {
    setIsFriendOverlayOpen(false);
    // 친구 목록이 닫힐 때 채팅창도 함께 닫기
    setIsChatOverlayOpen(false);
    setCurrentChatUser(null);
  };
  const toggleFriendOverlay = () => {
    const newState = !isFriendOverlayOpen;
    setIsFriendOverlayOpen(newState);
    
    // 친구 목록이 닫힐 때 (newState가 false일 때) 채팅창도 함께 닫기
    if (!newState) {
      setIsChatOverlayOpen(false);
      setCurrentChatUser(null);
    }
  };

  const openChatOverlay = (nickname) => {
    setCurrentChatUser(nickname);
    setIsChatOverlayOpen(true);
  };
  const closeChatOverlay = () => {
    setIsChatOverlayOpen(false);
    setCurrentChatUser(null);
  };

  useEffect(() => {
    if (!username) return;

    // 초기 데이터 로드
    fetchFriends();
    fetchFriendRequests();
    fetchUnreadCounts();

    // WebSocket 연결 및 구독
    connectSocket().then(() => {
      // 친구 목록 업데이트 구독
      setTimeout(() => {subscribeToTopic(FRIEND_TOPICS.FRIENDS(username), (message) => {
        fetchFriends();
      })},100);

      // 친구 요청 업데이트 구독
      setTimeout(()=>{subscribeToTopic(FRIEND_TOPICS.FRIEND_REQUESTS(username), (message) => {
        fetchFriendRequests();
      })}, 100);
      
      // 읽지 않은 메시지 알림 구독 추가
      setTimeout(() => {
        subscribeToTopic(`/topic/notifications${username}`, () => {
          fetchUnreadCounts();
        });
      }, 100);

      // 닉네임 업데이트 구독
      setTimeout(() => {
        subscribeToTopic(FRIEND_TOPICS.NICKNAME_UPDATES(username), () => {
          fetchFriends();  // 친구 목록 갱신
        });
      }, 100);
    });
    // user 상태변화
  }, [username]);

  return (
    <FriendContext.Provider 
      value={{ 
        friends,
        friendRequests,
        unreadCounts,
        isFriendOverlayOpen,
        isChatOverlayOpen,
        currentChatUser,
        username,
        fetchFriends,
        fetchFriendRequests,
        fetchUnreadCounts,
        sendFriendRequest,
        acceptFriendRequest,
        removeFriend,
        openFriendOverlay,
        closeFriendOverlay,
        toggleFriendOverlay,
        setUnreadCounts,
        setFriends,
        setUsername,
        openChatOverlay,
        closeChatOverlay,
        isActiveChatRoom
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};
