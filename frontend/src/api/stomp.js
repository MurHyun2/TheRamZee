import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://ramzee.online';

let stompClient = null;

// 소켓 연결 
export const connectSocket = async () => {
  return new Promise((resolve, reject) => {
    let token = sessionStorage.getItem('accessToken');
    const socket = new SockJS(`${BASE_URL}/ws`);

    stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: (frame) => {
        resolve(stompClient);
      },
      onStompError: (frame) => {
        reject(frame);
      }
    });

    stompClient.activate();
  });
};

// 소켓 연결 해제 
export const disconnectSocket = async () => {
  if (stompClient !== null) {
    await stompClient.deactivate();
    stompClient = null;
  }
};

// 구독 
export const subscribeToTopic = (topic, callback) => {
  if (stompClient !== null && stompClient.connected) {
    const subscription = stompClient.subscribe(topic, (message) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        callback(message.body);
      }
    });
    return subscription;
  } else {
    return null;
  }
};

// 메시지 보내기 
export const sendMessage = async (destination, body) => {
  if (stompClient !== null && stompClient.connected) {
    await stompClient.publish({
      destination: destination,
      body: JSON.stringify(body)
    });
  } else {
    const error = new Error('STOMP 연결이 되어있지 않아 메시지 전송 실패');
    throw error;
  }
};

// 구독 해제 
export const unsubscribeTopic = (subscription) => {
  if (subscription) {
    subscription.unsubscribe();
  }
};

// 채팅 관련 토픽 상수
export const CHAT_TOPICS = {
  PRIVATE_CHAT: (sender, receiver) => `/topic/chat/${sender}-${receiver}`,
  CHAT_NOTIFICATIONS: (username) => `/topic/chat-notifications/${username}`,
  UNREAD_COUNT: (username) => `/topic/unread-count/${username}`,
};

// Friend 관련 토픽 상수
export const FRIEND_TOPICS = {
  FRIENDS: (username) => `/topic/friends/${username}`,
  FRIEND_REQUESTS: (username) => `/topic/friend-requests/${username}`,
  NICKNAME_UPDATES: (username) => `/topic/nickname-updates/${username}`
};

// 채팅 메시지 전송 헬퍼 함수
export const sendChatMessage = async (sender, receiver, content) => {
  const destination = CHAT_TOPICS.PRIVATE_CHAT(sender, receiver);
  const message = {
    sender,
    receiver,
    content,
    timestamp: new Date().toISOString()
  };
  await sendMessage(destination, message);
};

// 채팅방 구독 헬퍼 함수
export const subscribeToChatRoom = (sender, receiver, callback) => {
  const topic = CHAT_TOPICS.PRIVATE_CHAT(sender, receiver);
  return subscribeToTopic(topic, callback);
};