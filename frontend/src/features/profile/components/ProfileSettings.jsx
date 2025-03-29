import React, { useState } from 'react';
import styled from 'styled-components';
import { updateUser, deleteUser } from '../../../api/user';
import { useUser } from '../../../contexts/UserContext';
import { useAuth } from '../../../contexts/AuthContext';
import { sendMessage } from '../../../api/stomp';
import { apiRequest } from '../../../api/apiService';

const ProfileSettings = () => {
  const { setNickname } = useUser();
  const { handleLogout } = useAuth();
  const [isNicknameFormVisible, setNicknameFormVisible] = useState(false);
  const [isPasswordFormVisible, setPasswordFormVisible] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 닉네임 변경 처리
  const handleNicknameSubmit = async (e) => {
    e.preventDefault();
    if (!newNickname.trim()) return;

    try {
      const username = sessionStorage.getItem('username');
      const response = await updateUser({
          username: username, // username 추가
          nickname: newNickname,
          // 이 필드들도 함께 보내야 함
          password: "",  // 빈 문자열로 보내서 validation을 피함
          name: "",
          email: ""
      });
      if (response.success) {
          sessionStorage.setItem('nickName', newNickname);
          setNickname(newNickname);
          setNewNickname('');
          setNicknameFormVisible(false);

          // WebSocket을 통해 메시지 발행
          sendMessage("/app/nickname.update", {
            username: username,
            newNickname: newNickname
          });
      }
    } catch (error) {
      alert('닉네임 변경에 실패했습니다.');
    }
  };

  // 비밀번호 변경 처리
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 현재 비밀번호와 새 비밀번호가 같은지 확인
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      alert('현재 비밀번호와 새 비밀번호는 동일합니다. 다른 비밀번호를 입력해주세요.');
      return;
    }

    // 새 비밀번호가 비밀번호 양식과 일치하는지 확인인
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwordForm.newPassword)) {
      alert('비밀번호는 8자 이상, 숫자, 대소문자, 특수문자를 포함해야 합니다');
      return;
    }

    try {
      // 현재 비밀번호 검증을 위한 로그인 시도
      try {
        await apiRequest('/api/v1/auth/login', 'POST', {
            username: sessionStorage.getItem('username'),
            password: passwordForm.currentPassword
        });
      } catch (loginError) {
          alert('현재 비밀번호가 일치하지 않습니다.');
          return;
      }
      const username = sessionStorage.getItem('username');
      const response = await updateUser({
        username: username,
        password: passwordForm.newPassword,  // 새 비밀번호를 password 필드로 전송
        name: "",
        email: "",
        nickname: ""
      });
      if (response.success) {
        alert('비밀번호가 변경되었습니다.');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordFormVisible(false);
        // handleLogout();
      }
    } catch (error) {
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await deleteUser();
        handleLogout();
      } catch (error) {
        alert('회원 탈퇴에 실패했습니다.');
      }
    }
  };

  return (
    <SettingsContainer>
      <ButtonGroup>
        <SettingButton onClick={() => {
          setNicknameFormVisible(!isNicknameFormVisible);
          setPasswordFormVisible(false);
        }}>
          닉네임 변경
        </SettingButton>
        <SettingButton onClick={() => {
          setPasswordFormVisible(!isPasswordFormVisible);
          setNicknameFormVisible(false);
        }}>
          비밀번호 변경
        </SettingButton>
        <DeleteButton onClick={handleDeleteAccount}>
          회원탈퇴
        </DeleteButton>
      </ButtonGroup>

      {isNicknameFormVisible && (
        <SlideForm onSubmit={handleNicknameSubmit}>
          <FormTitle>닉네임 변경</FormTitle>
          <Input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="새로운 닉네임"
            required
          />
          <SubmitButton type="submit">변경하기</SubmitButton>
        </SlideForm>
      )}

      {isPasswordFormVisible && (
        <SlideForm onSubmit={handlePasswordSubmit}>
          <FormTitle>비밀번호 변경</FormTitle>
          <Input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
            placeholder="현재 비밀번호"
            required
          />
          <Input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
            placeholder="새 비밀번호"
            required
          />
          <Input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            placeholder="새 비밀번호 확인"
            required
          />
          <SubmitButton type="submit">변경하기</SubmitButton>
        </SlideForm>
      )}
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  // width: 100%;
  padding: 1rem;
  background-color: rgba(45, 24, 16, 0.95);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SettingButton = styled.button`
  flex: 1;
  padding: 0.3rem;
  background-color: #4a3228;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a4238;
  }
`;

const DeleteButton = styled(SettingButton)`
background-color: #9b2c2c;

  &:hover {
    background-color: #c53030;
  }
`;

const SlideForm = styled.form`
  // width: 100%;  // 너비 제한
  padding: 1rem;
  border-radius: 8px;
  // margin-top: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const FormTitle = styled.h3`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #4a3228;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    background-color: #5a4238;
  }
`;

export default ProfileSettings;