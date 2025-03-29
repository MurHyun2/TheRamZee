import React, { useCallback, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { login, register} from '../../api/auth';
import { sendEmailVerification, verifyEmailCode } from '../../api/email';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PAN from "../../assets/images/object/PAN.png" ;
import forestBg from "../../assets/images/backgrounds/forest-bg.gif"; 
import { FriendContext } from '../../contexts/FriendContext';
const LoginPage = () => {
  const { updateAccessToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true); // 로그인/회원가입 모드 전환용 상태
  // 추가
  const { setUsername } = useContext(FriendContext);
  const handleLogin = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await login(username, password);
      updateAccessToken(response.data);
      sessionStorage.setItem('username',username);
      // 추가
      setUsername(username);
      navigate('/rooms');
    } catch (error) {
      setError(error.response?.data?.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, [updateAccessToken, navigate]);

  const handleRegister = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      setIsLoginMode(true); // 회원가입 성공 후 로그인 모드로 전환
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
    } catch (error) {
      setError(error.response?.data?.message || '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <BackgroundImage />
      <Title>THE RAMZEE</Title>
      
      <FormContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isLoginMode ? (
          <LoginForm 
            onLogin={handleLogin} 
            loading={loading} 
            onSwitchMode={() => navigate('/register')} // 회원가입 페이지로 이동
          />
        ) : (
          <RegisterForm 
            onRegister={handleRegister}
            onEmailSend={sendEmailVerification}
            onEmailVerify={verifyEmailCode}
            loading={loading} 
          />
        )}
      </FormContainer>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  height: 100vh;
  width: 100vw;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
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
  text-shadow: 
    0 0 10px #00ff00,
    0 0 20px #00ff00,
    0 0 30px #00ff00;
  z-index: 1;
`;

const FormContainer = styled.div`
  background: url(${PAN}) no-repeat center center;
  background-color: rgba(139, 69, 19, 0.9);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  z-index: 1;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-bottom: 1rem;
  text-align: center;
`;

export default LoginPage;
