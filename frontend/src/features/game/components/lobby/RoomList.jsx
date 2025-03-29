import styled from 'styled-components';
import RoomItem from './RoomItem';

const RoomList = ({ rooms, onRoomClick }) => {
  return (
    <>
      <RoomListHeader>
        <span>| 호스트 |</span>
        <span>| 방제목 |</span>
        <span>| 인원 |</span>
      </RoomListHeader>

      <RoomListContainer>
        {rooms.map((room) => (
          <RoomItem 
            key={room.id} 
            room={room} 
            onClick={() => onRoomClick(room.id)} 
          />
        ))}
      </RoomListContainer>
    </>
  );
};

const RoomListHeader = styled.div`
  display: flex;
  justify-content: space-around;
  color: white;
  padding: 10px;
`;

const RoomListContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default RoomList;