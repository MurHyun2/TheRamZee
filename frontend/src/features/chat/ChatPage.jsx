import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { connectSocket, subscribeToTopic, sendMessage } from '../../api/stomp';
import { apiRequest } from '../../api/apiService';
import { FriendContext } from '../../contexts/FriendContext';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const ChatPage = ({ receiver, isOpen, onClose }) => {
  const { fetchUnreadCounts, isActiveChatRoom } = useContext(FriendContext);
  const [messages, setMessages] = useState([]);
  const subscriptionRef = useRef(null);
  
  useEffect(() => {
    if (!isOpen || !receiver) return;

    const username = sessionStorage.getItem("username");
    const nickname = sessionStorage.getItem("nickName");

    const loadChatHistory = async () => {
        try {
            const response = await apiRequest(
                `/api/v1/chat/history?sender=${nickname}&receiver=${receiver}`,
                'GET'
            );
            if (Array.isArray(response.data)) {
                setMessages(response.data);
            } else if (response.data && Array.isArray(response.data.messages)) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            setMessages([]);
        }
    };

    const setupWebSocket = async () => {
      try {
        await connectSocket();
        const myTopic = `/topic/messages/${username}/${receiver}`;
        
        
        // 이전 구독이 있다면 해제
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        
        // 새로운 구독 설정
        const subscription = subscribeToTopic(myTopic, (message) => {
          const isCurrentChat = (
            (message.sender = receiver && message.receiver === nickname) ||
            (message.sender = nickname && message.receiver === receiver)
          );
          
          if (isCurrentChat) {
            setMessages(prev => [...prev, message]);

          }
        });

        // 구독 객체 저장
        subscriptionRef.current = subscription;
      } catch (error) {
      }
    };

    loadChatHistory();
    setupWebSocket();

    // Cleanup 함수
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };

  }, [isOpen, receiver]);

  const markAsRead = async () => {
    if (!isActiveChatRoom(receiver)) return;
    
    try {
      await apiRequest("/api/v1/chat/mark-as-read", "PUT", {
        sender: receiver,
        receiver: sessionStorage.getItem("nickName")
      });
      fetchUnreadCounts();
    } catch (error) {
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const username = sessionStorage.getItem("username");
    try {
      const message = {
        sender: username,
        receiver: receiver,
        content: content.trim(),
        timestamp: new Date().toISOString()
      };

      await sendMessage("/app/chat.send", message);
      
      // 보낸 메시지를 즉시 화면에 표시
      setMessages(prev => [...prev, message]);
    } catch (error) {
    }
  };

  return (
    <ChatOverlay $isOpen={isOpen} onClick={markAsRead}>
      <ChatContainer>
        <ChatHeader receiver={receiver} onClose={onClose} />
        <ChatWindow messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </ChatContainer>
    </ChatOverlay>
  );
};

const ChatOverlay = styled.div`
  position: fixed;
  // top: 0;
  bottom: 0;
  right: ${props => props.$isOpen ? '400px' : '-800px'};
  width: 400px;
  height: 50%;
  background-color: rgba(45, 24, 16, 0.95);
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out, right 0.3s ease-in-out;
  z-index: 999;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export default ChatPage;