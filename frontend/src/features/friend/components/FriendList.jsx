import React, { useContext } from "react";
import { FriendContext } from "../../../contexts/FriendContext";
import { apiRequest } from "../../../api/apiService";
import { followFriend } from "../../../api/room";
import { useNavigate } from "react-router-dom";
import { X, DoorOpen } from 'lucide-react';
import styled from 'styled-components';

const FriendList = () => {
  const navigate = useNavigate();
  const { 
    friends, 
    unreadCounts, 
    setUnreadCounts,
    openChatOverlay,
    removeFriend 
  } = useContext(FriendContext);

  const handleFriendClick = async (nickname) => {
    try {
      await apiRequest("/api/v1/chat/mark-as-read", "PUT", {
        sender: nickname,
        receiver: sessionStorage.getItem("nickName"),
      });

      setUnreadCounts((prev) => ({ ...prev, [nickname]: 0 }));
      openChatOverlay(nickname);
    } catch (error) {
    }
  };

  const handleFollowClick = async (e, nickname) => {
    e.stopPropagation();
    try {
      const response = await followFriend(nickname);
      const { roomId, token } = response.data;
      sessionStorage.setItem('openViduToken', token);
      navigate(`/room/${roomId}`);
    } catch (error) {
      if (error.response?.status === 403) {
        alert('게임이 진행 중인 방에는 입장할 수 없습니다.');
      } else if (error.response?.status === 404) {
        alert('친구가 방에 입장해있지 않습니다.');
      } else {
        alert('친구 따라가기에 실패했습니다.');
      }
    }
  };

  const handleDeleteClick = async (e, nickname) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    
    if (window.confirm(`${nickname}님을 친구 목록에서 삭제하시겠습니까?`)) {
      const success = await removeFriend(nickname);
      if (success) {
        alert('친구가 삭제되었습니다.');
      }
    }
  };

  return (
    <ListContainer>
      <Title>친구 목록</Title>
      <List>
        {friends.map((friend, idx) => (
          <ListItem
            key={idx}
            onClick={() => handleFriendClick(friend.nickname)}
          >
            <StatusDot $isOnline={friend.status === '온라인'} />
            <FriendInfo>
              <Nickname>{friend.nickname}</Nickname>
            </FriendInfo>
            <ActionArea>
              {unreadCounts[friend.nickname] > 0 && (
                <UnreadBadge>
                  {unreadCounts[friend.nickname]}
                </UnreadBadge>
              )}
              <ActionButton
                onClick={(e) => handleFollowClick(e, friend.nickname)}
                aria-label="친구 따라가기"
                $color="#4ade80"
              >
                <DoorOpen size={16} />
              </ActionButton>
              <ActionButton
                onClick={(e) => handleDeleteClick(e, friend.nickname)}
                aria-label="친구 삭제"
                $color="#ff6b6b"
              >
                <X size={16} />
              </ActionButton>
            </ActionArea>
          </ListItem>
        ))}
      </List>
    </ListContainer>
  );
};

const ListContainer = styled.div`
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 0.75rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isOnline ? '#4ade80' : '#6b7280'};
  flex-shrink: 0;
`;

const FriendInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Nickname = styled.span`
  color: white;
  font-weight: 500;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$color};
  width: 43px;
  height: 32px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UnreadBadge = styled.span`
  background-color: #ff6b6b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
`;

export default FriendList;