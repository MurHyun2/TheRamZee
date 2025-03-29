import styled from 'styled-components';

const RoomItem = ({ room, onClick }) => {
  return (
    <Container onClick={onClick}>
      <span>{room.host}</span>
      <span>{room.title}</span>
      <span>{room.currentPlayers}/{room.maxPlayers}</span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  background-color: rgba(139, 69, 19, 0.8);
  border-radius: 10px;
  color: white;
  padding: 15px;
  cursor: pointer;

  span {
    flex: 1;
    text-align: center;
  }
`;

export default RoomItem;