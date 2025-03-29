package com.gradation.backend.user.service;


import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.model.request.UserRequest;
import com.gradation.backend.user.model.response.StatusResponse;
import com.gradation.backend.user.model.response.TokenResponse;
import com.gradation.backend.user.model.response.UserResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * UserService는 사용자 관리와 관련된 비즈니스 로직을 정의하는 인터페이스입니다.
 * - 사용자 등록
 * - 사용자 조회
 * - 사용자 업데이트
 * - 사용자 삭제
 */
public interface UserService {

    TokenResponse login(UserRequest request);

    UserResponse registerUser(UserRequest request);

    UserResponse getUserByUsername(String username);

    UserResponse updateUser(UserRequest request);

    void deleteUser(String username);

    StatusResponse logout(String username);

    User getCurrentUser();

    Long getUserId(String username);

    User getUserByUserName(String username);

    User getUserByUserNickname(String nickname);
    void notifyFriendsAboutStatusChange(String username, boolean isOnline);
    void updateUserStatusToOnline(String username);
}
