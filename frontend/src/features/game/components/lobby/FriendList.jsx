import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import VideoComponent from '../video/VideoComponent';
import FriendItem from './FriendItem';
import AddFriendModal from './AddFriendModal';

const FriendList = () => {
 const navigate = useNavigate();
 const [myVideo, setMyVideo] = useState({
   isCameraOn: true,
   isMicOn: true
 });
 
 const [friends, setFriends] = useState([
   { id: 1, name: '이대현쟁쟁맨', isOnline: true, roomId: 'room1' },
   { id: 2, name: '사나이경환', isOnline: false, roomId: null }
 ]);
 
 const [showAddModal, setShowAddModal] = useState(false);

 const handleAddFriend = (friendName) => {
   const newFriend = {
     id: Date.now(),
     name: friendName,
     isOnline: false,
     roomId: null
   };
   setFriends(prev => [...prev, newFriend]);
 };

 const handleDeleteFriend = (friendId) => {
   setFriends(prev => prev.filter(friend => friend.id !== friendId));
 };

 const handleFollowFriend = (friendId) => {
   const friend = friends.find(f => f.id === friendId);
   if (friend && friend.isOnline && friend.roomId) {
     navigate(`/game/${friend.roomId}`);
   } else {
     alert('친구가 게임방에 있지 않습니다.');
   }
 };

 return (
   <Container>
     <MyProfile>
       <VideoComponent />
       <ProfileControls>
         <span>기무선진</span>
         <ButtonGroup>
           <ControlButton onClick={() => setMyVideo(prev => ({...prev, isCameraOn: !prev.isCameraOn}))}>
             캡
           </ControlButton>
           <ControlButton onClick={() => setMyVideo(prev => ({...prev, isMicOn: !prev.isMicOn}))}>
             오
           </ControlButton>
         </ButtonGroup>
       </ProfileControls>
     </MyProfile>

     <AddFriendButton onClick={() => setShowAddModal(true)}>
       친구 추가 +
     </AddFriendButton>

     <FriendsList>
       {friends.map(friend => (
         <FriendItem
           key={friend.id}
           friend={friend}
           onDelete={handleDeleteFriend}
           onFollow={handleFollowFriend}
         />
       ))}
     </FriendsList>

     {showAddModal && (
       <AddFriendModal
         onClose={() => setShowAddModal(false)}
         onAdd={handleAddFriend}
       />
     )}
   </Container>
 );
};

const Container = styled.div`
 position: fixed;
 right: 0;
 top: 0;
 width: 300px;
 height: 100%;
 background-color: rgba(139, 69, 19, 0.8);
 padding: 20px;
 display: flex;
 flex-direction: column;
`;

const MyProfile = styled.div`
 margin-bottom: 20px;
 background: rgba(0, 0, 0, 0.2);
 border-radius: 10px;
 overflow: hidden;
`;

const ProfileControls = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 10px;
 color: white;
`;

const ButtonGroup = styled.div`
 display: flex;
 gap: 5px;
`;

const ControlButton = styled.button`
 padding: 5px 10px;
 background: #90EE90;
 border: none;
 border-radius: 3px;
 cursor: pointer;
 
 &:hover {
   background: #98FB98;
 }
`;

const AddFriendButton = styled.button`
 width: 100%;
 padding: 8px;
 background: #90EE90;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 margin-bottom: 10px;
 font-weight: bold;
 
 &:hover {
   background: #98FB98;
 }
`;

const FriendsList = styled.div`
 flex: 1;
 overflow-y: auto;
 display: flex;
 flex-direction: column;
 gap: 10px;
 
 &::-webkit-scrollbar {
   width: 5px;
 }
 
 &::-webkit-scrollbar-track {
   background: rgba(0, 0, 0, 0.1);
 }
 
 &::-webkit-scrollbar-thumb {
   background: rgba(0, 0, 0, 0.2);
   border-radius: 3px;
 }
`;

export default FriendList;