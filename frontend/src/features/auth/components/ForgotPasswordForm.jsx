import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { resetPassword, findUsername } from '../../../api/email'; // API 호출 함수 가져오기
import forestBg from "../../../assets/images/backgrounds/forest-bg.gif";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('id'); // 'id' 또는 'password' 모드
  const [formData, setFormData] = useState({
    id: '',       // 사용자 ID
    name: '',     // 사용자 이름
    email: ''     // 사용자 이메일
  });
  const [message, setMessage] = useState(''); // 결과 메시지 상태

  // Form 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'id') {
        // 아이디 찾기 API 호출
        await findUsername(formData.name, formData.email); // 이름과 이메일 전달
        setMessage('입력하신 이메일로 아이디를 발송했습니다.');
      } else if (mode === 'password') {
        // 비밀번호 초기화 API 호출
        await resetPassword(formData.id, formData.email); // ID와 이메일 전달
        setMessage('입력하신 이메일로 임시 비밀번호를 발송했습니다.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || '오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <BackgroundImage />
      <Title>THE RAMZEE</Title>

      <FormContainer>
        <TabButtons>
          <TabButton 
            position="left" 
            active={mode === 'id'} 
            onClick={() => setMode('id')}
          >
            ID 찾기
          </TabButton>
          <TabButton 
            position="right" 
            active={mode === 'password'} 
            onClick={() => setMode('password')}
          >
            비밀번호 찾기
          </TabButton>
        </TabButtons>

        <form onSubmit={handleSubmit}>
          {mode === 'id' ? (
            <>
              <Input
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="아이디"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              />
              <Input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </>
          )}
          <ButtonGroup>
            <SubmitButton type="submit">찾기</SubmitButton>
            <LoginButton type="button" onClick={() => navigate('/')}>뒤로가기</LoginButton>
          </ButtonGroup>
        </form>

        {message && <Message>{message}</Message>} {/* 결과 메시지 표시 */}
      </FormContainer>
    </Container>
  );
};

// 스타일 정의
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${forestBg});
  background-size: cover;
  z-index: -1;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
`;

const FormContainer = styled.div`
  background-color: rgba(139,69,19,0.9);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
`;

const TabButtons = styled.div`
 display:flex;
 margin-bottom: 1.5rem;
 background: rgba(139, 69, 19, 0.9);
 border-radius: 10px;
`;

const TabButton=styled.button`
  flex:1;
  padding:.5rem;
  background:${props=>props.active?'#2d1810':'transparent'};
  color:${props=>props.active?'white':'#2d1810'};
  border:none;
  cursor:pointer;

  border-radius: ${props => 
    props.position === 'left'
      ? '10px 0 0 10px' 
      : '0 10px 10px 0'
  };
`;

const Input=styled.input`
  width:93.5%;
  padding:.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  transition: transform 0.2s;

  &:focus {
    outline: none;
    transform: scale(1.02);
  }
`;

const ButtonGroup=styled.div`
  display:flex;
  justify-content:space-between;
  // gap:.5rem;
  // margin-bottom: 1rem;
`;

const SubmitButton=styled.button`
  background: #90EE90;
  color: black;
  padding:.5rem 1.5rem;
  border-radius: 5px;
  border: none;
  cursor:pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #98FB98;
  }
`;

const LoginButton=styled.button`
  background-color: #2d1810;
  color: white;
  padding:.5rem 1.5rem;
  border-radius: 5px;
  border: none;
  cursor:pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d2218;
  }
`;

const Message=styled.p`
  color:white;
  margin-top:.75rem;
  text-align:center;
`;

export default ForgotPassword;