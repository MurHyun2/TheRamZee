import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchRooms, createRoom } from '../../api/room';
import RoomList from './components/RoomList';
import CreateRoomForm from './components/CreateRoomForm';
import forestBg from "../../assets/images/backgrounds/forest-bg.gif";
import { useAuth } from '../../contexts/AuthContext';
import { FriendContext } from '../../contexts/FriendContext';
import  FriendPage  from '../../features/friend/FriendPage';
import  ProfilePage  from '../../features/profile/ProfilePage';
import ChatPage from '../../features/chat/ChatPage';

//이미지 불러오기
import PAN2 from "../../assets/images/object/PAN2.png" ;


import { Menu } from 'lucide-react';

const RoomPage = () => {
  const { handleLogout, handleLogout2 } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { 
    isFriendOverlayOpen, 
    isChatOverlayOpen,
    currentChatUser,
    toggleFriendOverlay, 
    closeChatOverlay,
    fetchFriends,
    fetchFriendRequests 
  } = useContext(FriendContext);


  // 방 목록 불러오기 함수
  const loadRooms = async () => {
    setLoading(true);
    try {
      const response = await fetchRooms();
     
      setRooms(response.data);
      setError(null); // 이전 에러 메시지 초기화
    } catch (err) {
      setError('방 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 방 목록 불러오기
  useEffect(() => {
    sessionStorage.setItem('roomHost', false)
    loadRooms();
    // 주기적으로 방 목록 업데이트
    const interval = setInterval(() => {
      loadRooms();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 방 생성 처리
  const handleRoomCreated = async (title, password) => {
    try {
      const response = await createRoom(title, password);
      const roomId = response.data.roomId;
      const openViduToken = response.data.token;
      sessionStorage.setItem('openViduToken', openViduToken);
      navigate(`/room/${roomId}`);
    } catch (error) {
      setError('방 생성에 실패했습니다');
    }
  };

  const handleMenuClick = () => {
    toggleFriendOverlay();
    fetchFriends();
    fetchFriendRequests();
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleLogout2();
    };
    const handlePopState = () => {
      handleLogout(); // 뒤로가기 시 로그아웃 실행
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleLogout, handleLogout2]);

  return (
    <PageContainer>
      <BackgroundImage />
      
      <ContentWrapper>
      <Header>
          <Title>THE RAMZEE</Title>
          <ButtonGroup>
            <CreateRoomButton onClick={() => setIsModalOpen(true)}>
              방 만들기
            </CreateRoomButton>
            <LogoutButton onClick={handleLogout}>
              로그아웃
            </LogoutButton>
            <MenuButton onClick={handleMenuClick}>{}
              <Menu size={24} />
            </MenuButton>
            
          </ButtonGroup>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {loading ? (
          <LoadingMessage>방 목록을 불러오는 중...</LoadingMessage>
        ) : (
          <RoomListContainer>
            <BackgroundBoardImage src={PAN2} alt="container background" />
            <RefreshButtonComponent onClick={loadRooms} loading={loading} />
            <RoomList rooms={rooms} />
          </RoomListContainer>
        )}

        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
              <CreateRoomForm onRoomCreated={handleRoomCreated} />
            </ModalContent>
          </ModalOverlay>
        )}
        <FriendOverlay $isOpen={isFriendOverlayOpen}>
          <FriendOverlayContent>
            <CloseButton onClick={toggleFriendOverlay}>×</CloseButton>
            <ProfilePage />
            <FriendPage />
          </FriendOverlayContent>
        </FriendOverlay>
        <ChatPage 
          isOpen={isChatOverlayOpen}
          receiver={currentChatUser}
          onClose={closeChatOverlay}
        />
      </ContentWrapper>
    </PageContainer>
  );
};
const RefreshIcon = styled.svg`
  width: 100px;
  height: 36px;
  cursor: pointer;
  fill: white;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }
`;

const RefreshButtonComponent = ({ onClick, loading }) => (
  <RefreshIcon
    onClick={onClick}
    disabled={loading}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
   <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="#2D1810" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
</svg>`
  </RefreshIcon>
);

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff8787;
  }
`;


const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const BackgroundImage = styled.div`
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${forestBg});
  background-size: cover;
  z-index: -1;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  
  text-shadow: 
    0 0 10px #00ff00,
    0 0 20px #00ff00,
    0 0 30px #00ff00;
`;

const CreateRoomButton = styled.button`
  background-color: #2d1810;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d2218;
  }
`;

const RoomListContainer = styled.div`
  width: 90%;
  margin-bottom: -100px;
  position: relative;
`;

const BackgroundBoardImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: fill;
  z-index: -1;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: rgba(139, 69, 19, 0.95);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: #ff6b6b;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
`;

const LoadingMessage = styled.div`
  color: white;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;
const MenuButton = styled.button`
  background-color: #2d1810;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d2218;
  }
`;

const FriendOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background-color: rgba(45, 24, 16, 0.95);
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
`;

const FriendOverlayContent = styled.div`
  height: 100%;
  padding: 2rem;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export default RoomPage;