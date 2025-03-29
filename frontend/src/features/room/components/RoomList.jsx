import React from 'react';
import styled from 'styled-components';
import RoomListItem from './RoomListItem';


const RoomList = ({ rooms }) => {
  if (!rooms || rooms.length === 0) {
    return <EmptyMessage>생성된 방이 없습니다</EmptyMessage>;
  }

  return (
    <GridContainer>
      {rooms.map((room) => (
        <RoomListItem key={room.roomId} room={room} />
      ))}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  // gap: 1rem;
  padding: 2rem;
  padding-bottom: 3rem;
`;

const EmptyMessage = styled.div`
  color: white;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

export default RoomList;