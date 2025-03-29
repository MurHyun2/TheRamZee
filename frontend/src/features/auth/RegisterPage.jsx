import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { register } from '../../api/auth';
import { sendEmailVerification, verifyEmailCode } from '../../api/email';
import RegisterForm from './components/RegisterForm';
import forestBg from "../../assets/images/backgrounds/forest-bg.gif"; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
        <BackgroundImage />
      <Title>회원가입</Title>
      <FormContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <RegisterForm 
          onRegister={handleRegister}
          onEmailSend={sendEmailVerification}
          onEmailVerify={verifyEmailCode}
          loading={loading} 
        />
      </FormContainer>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  height: 100vh;
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
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const FormContainer = styled.div`
  background: rgba(139, 69, 19, 0.9);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  text-align: center;
`;

export default RegisterPage;
