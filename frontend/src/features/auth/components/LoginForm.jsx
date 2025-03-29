import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginForm = ({ onLogin, loading }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <Input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <ButtonGroup>
        <LoginButton type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </LoginButton>
        <ForgotButton
          type="button"
          onClick={() => navigate('/forgot-password')}
          disabled={loading}
        >
          아이디/ 비밀번호 찾기
        </ForgotButton>
      </ButtonGroup>

      {/* 회원가입 버튼 */}
      <RegisterButton
        type="button"
        onClick={() => navigate('/register')}
        disabled={loading}
      >
        회원가입
      </RegisterButton>
    </form>
  );
};

// 스타일 정의
const Input = styled.input`
  width: 93.5%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  background: white;
  font-size: 1rem;
  transition: transform 0.2s;

  &:focus {
    outline: none;
    transform: scale(1.02);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const LoginButton = styled.button`
  background-color: #2d1810;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d2218;
  }
`;

const ForgotButton = styled.button`
  background-color: #90EE90;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #98FB98;
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  background-color: #2d1810;
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: color 0.2s;

   
  &:hover {
    background-color: #3d2218;
  }
`;

export default LoginForm;
