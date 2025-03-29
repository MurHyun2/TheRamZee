import { useState } from 'react';
import styled from 'styled-components';

const ChatWindow = ({ friendName, onClose }) => {
 const [message, setMessage] = useState('');

 return (
   <ChatContainer>
     <ChatHeader>
       <span>{friendName}</span>
       <CloseButton onClick={onClose}>X</CloseButton>
     </ChatHeader>
     
     <ChatBody>
       {/* 메시지 목록 표시 영역 */}
     </ChatBody>

     <ChatInput
       type="text"
       placeholder="메시지를 입력하세요"
       value={message}
       onChange={(e) => setMessage(e.target.value)}
     />
   </ChatContainer>
 );
};

const ChatContainer = styled.div`
 position: fixed;
 left: 20px;
 top: 20px;
 width: 300px;
 background-color: rgba(139, 69, 19, 0.8);
 border-radius: 10px;
`;

const ChatHeader = styled.div`
 display: flex;
 justify-content: space-between;
 padding: 10px;
 color: white;
 border-bottom: 1px solid rgba(255,255,255,0.2);
`;

const CloseButton = styled.button`
 background: none;
 border: none;
 color: white;
 cursor: pointer;
`;

const ChatBody = styled.div`
 height: 300px;
 overflow-y: auto;
 padding: 10px;
`;

const ChatInput = styled.input`
 width: 90%;
 margin: 10px;
 padding: 5px;
 border: none;
 border-radius: 5px;
`;

export default ChatWindow;