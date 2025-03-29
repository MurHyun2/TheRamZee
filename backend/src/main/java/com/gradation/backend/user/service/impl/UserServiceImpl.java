package com.gradation.backend.user.service.impl;

import com.gradation.backend.common.utill.JwtTokenUtil;
import com.gradation.backend.common.utill.RedisUtil;
import com.gradation.backend.friends.model.entitiy.FriendStatus;
import com.gradation.backend.friends.model.response.FriendResponse;
import com.gradation.backend.friends.repository.FriendsRepository;
import com.gradation.backend.user.exception.UserNotFoundException;
import com.gradation.backend.user.model.entity.CustomUserDetails;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.model.request.UserRequest;
import com.gradation.backend.user.model.response.TokenResponse;
import com.gradation.backend.user.model.response.UserResponse;
import com.gradation.backend.user.model.response.StatusResponse;
import com.gradation.backend.user.repository.UserRepository;
import com.gradation.backend.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * UserServiceImpl는 UserService 인터페이스의 구현체로,
 * 사용자 등록, 로그인, 로그아웃, 사용자 정보 수정, 삭제 등의 기능을 제공하는 서비스 클래스입니다.
 * 이 클래스는 JWT 토큰 생성 및 Redis를 사용한 세션 관리와 같은 인증 및 사용자 상태 관리를 처리합니다.
 *
 * 주요 기능:
 * - 사용자 등록 및 이메일 인증 확인
 * - 사용자 로그인 및 상태 업데이트
 * - 사용자 로그아웃
 * - 사용자 정보 조회, 수정, 삭제
 *
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, String> redisTemplate1;
    private final JwtTokenUtil jwtTokenUtil;
    private final RedisUtil redisUtil;
    private final AuthenticationManager authenticationManager;
    private final FriendsRepository friendsRepository;
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, @Qualifier("redisTemplate1")RedisTemplate<String, String> redisTemplate1, RedisUtil redisUtil, JwtTokenUtil jwtTokenUtil, AuthenticationManager authenticationManager, FriendsRepository friendsRepository, SimpMessagingTemplate messagingTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.redisTemplate1 = redisTemplate1;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
        this.redisUtil = redisUtil;
        this.friendsRepository = friendsRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * 사용자 등록 메서드.
     * 이메일 인증을 확인한 뒤, 사용자 정보를 저장합니다.
     * 저장된 사용자 정보는 UserResponse 형태로 반환됩니다.
     *
     * @param request 사용자 등록 요청 객체
     * @return 저장된 사용자 정보를 담은 UserResponse 객체
     * @throws IllegalStateException 이메일 인증이 완료, 비밀번호 유효성 검사되지 않았을 경우
     * @throws RuntimeException 사용자 이름, 이메일, 닉네임이 중복된 경우
     */
    @Override
    @Transactional
    public UserResponse registerUser(UserRequest request) {
        // 이메일 인증 여부 확인
        ValueOperations<String, String> valOperations = redisTemplate1.opsForValue();
        String emailVerified = valOperations.get(request.getEmail() + ":verified");

        if (emailVerified == null || !emailVerified.equals("true")) {
            throw new IllegalStateException("이메일 인증이 완료되지 않았습니다.");
        }
        if (!isValidPassword(request.getPassword())) {
            throw new IllegalArgumentException("비밀번호는 대소문자, 숫자, 특수문자를 포함해야 하며 8자 이상이어야 합니다.");
        }
        // 사용자명, 이메일, 닉네임 중복 확인
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자 이름입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }

        // 새로운 사용자 생성
        User user = new User();
        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setNickname(request.getNickname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserStatus(false);
        user.setLoginRoot("local");
        // 사용자 저장
        User savedUser = userRepository.save(user);
        // 인증 상태 제거 (회원가입 후 인증 상태 삭제)
        redisTemplate1.delete(request.getEmail() + ":verified");

        return toResponseDTO(savedUser);
    }

    /**
     * 사용자 로그인 메서드.
     * 사용자 인증 후 Access Token과 Refresh Token을 생성 및 반환합니다.
     * 또한, 로그인 상태를 업데이트합니다.
     *
     * @param request 로그인 요청 객체
     * @return Access 및 Refresh 토큰을 담은 TokenResponse 객체
     * @throws UserNotFoundException 사용자를 찾을 수 없을 경우
     */
    @Override
    @Transactional
    public TokenResponse login(UserRequest request) {
        // 사용자 인증 처리
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Access 및 Refresh Token 생성
        String accessToken = jwtTokenUtil.generateAccessToken(userDetails);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

        // Redis에 Refresh Token 저장
        redisUtil.setex(userDetails.getUsername() + ":refresh", refreshToken, jwtTokenUtil.getRefreshTokenExpiration(), TimeUnit.MILLISECONDS);

        User existingUser = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UserNotFoundException("User not found"));

        existingUser.setUserStatus(true); // 상태 업데이트
        userRepository.save(existingUser);

        List<User> friends = friendsRepository.findFriendsByUser(existingUser, FriendStatus.ACCEPTED);
        List<FriendResponse> updatedFriends = friends.stream()
                .map(friend -> new FriendResponse(friend.getNickname(), "오프라인"))
                .collect(Collectors.toList());

        // 친구들에게 상태 변경 알림 전송
        for(User friend : friends) {
            messagingTemplate.convertAndSend("/topic/friends/" + friend.getUsername(), updatedFriends);
        }

        return new TokenResponse(accessToken, existingUser.getNickname());
    }

    /**
     * 사용자 로그아웃 메서드.
     * Redis에서 사용자의 Refresh Token을 삭제하며, 사용자 상태를 "오프라인"으로 업데이트합니다.
     *
     * @param username 로그아웃하려는 사용자의 이름
     * @return 로그아웃 상태 응답 객체 (StatusResponse)
     * @throws UserNotFoundException 사용자를 찾을 수 없을 경우
     */
    @Override
    @Transactional
    public StatusResponse logout(String username) {
        User existingUser = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        existingUser.setUserStatus(false); // 상태 업데이트
        userRepository.save(existingUser);

        List<User> friends = friendsRepository.findFriendsByUser(existingUser, FriendStatus.ACCEPTED);
        List<FriendResponse> updatedFriends = friends.stream()
                .map(friend -> new FriendResponse(friend.getNickname(), "오프라인"))
                .collect(Collectors.toList());

        // 친구들에게 상태 변경 알림 전송
        for(User friend : friends) {
            messagingTemplate.convertAndSend("/topic/friends/" + friend.getUsername(), updatedFriends);
        }
        return null;
    }

    /**
     * 사용자 정보 조회 메서드.
     *
     * @param username 조회하려는 사용자의 이름
     * @return 조회된 사용자 정보를 담은 UserResponse 객체
     * @throws UserNotFoundException 사용자를 찾을 수 없을 경우
     */
    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        return toResponseDTO(user);
    }

    /**
     * 사용자 정보 조회 메서드.
     *
     * @param username 조회하려는 사용자의 이름
     * @return 조회된 사용자 정보를 담은 UserResponse 객체
     * @throws UserNotFoundException 사용자를 찾을 수 없을 경우
     */
    @Override
    public Long getUserId(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        return user.getId();
    }

    /**
     * 사용자 정보 업데이트 메서드.
     * 전달된 요청 객체의 정보를 기준으로 사용자의 정보를 업데이트합니다.
     *
     * @param request 사용자 정보 업데이트 요청 객체
     * @return 업데이트된 사용자 정보를 담은 UserResponse 객체
     * @throws UserNotFoundException 사용자를 찾을 수 없을 경우
     */
    @Override
    @Transactional
    public UserResponse updateUser(UserRequest request) {
        User existingUser = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            existingUser.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getName() != null && !request.getName().isEmpty()) {
            existingUser.setName(request.getName());
        }

        if (request.getNickname() != null && !request.getNickname().isEmpty()) {
            existingUser.setNickname(request.getNickname());
        }

        return toResponseDTO(userRepository.save(existingUser));
    }

    /**
     * 사용자 삭제 메서드.
     * 사용자의 ID를 기준으로 데이터베이스에서 삭제합니다.
     *
     * @param username 삭제하려는 사용자의 이름
     * @throws UserNotFoundException 사용자를 찾을 수 없을 경우
     */
    @Override
    @Transactional
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        userRepository.delete(user);

    }

    /**
     * User 엔터티를 UserResponse 객체로 변환하는 유틸리티 메서드.
     *
     * @param user 변환하려는 User 엔터티 객체
     * @return 변환된 UserResponse 객체
     */
    private UserResponse toResponseDTO(User user) {
        UserResponse response = new UserResponse();
        response.setUsername(user.getUsername());
        response.setName(user.getName());
        response.setNickname(user.getNickname());
        response.setEmail(user.getEmail());
        return response;
    }

    /**
     * 비밀번호 유효성 검사.
     *
     * @param password 확인하려는 password
     * @return password 패턴 일치 여부
     */
    private boolean isValidPassword(String password) {
        String passwordPattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$";
        return password.matches(passwordPattern);
    }

    /**
     * 현재 인증된 사용자 정보를 반환합니다.
     *
     * 이 메서드는 Spring Security의 SecurityContextHolder에서
     * 현재 인증된 사용자의 정보를 가져와 데이터베이스에서 조회한 후 반환합니다.
     *
     * @return 현재 인증된 사용자의 {@link User} 객체
     * @throws RuntimeException 현재 인증된 사용자를 데이터베이스에서 찾을 수 없는 경우 발생
     */
    @Override
    public User getCurrentUser() {
        // 1. SecurityContextHolder에서 현재 인증된 사용자 정보 가져오기
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getName();
        // 2. 데이터베이스에서 사용자 정보 조회
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("현재 사용자를 찾을 수 없습니다."));
    }

    /**
     * 주어진 사용자 이름(username)을 기반으로 사용자를 조회합니다.
     *
     * @param username 조회할 사용자의 username
     * @return 주어진 username에 해당하는 {@link User} 객체
     * @throws UserNotFoundException 데이터베이스에서 해당 username을 가진 사용자를 찾을 수 없는 경우 발생
     */
    @Override
    public User getUserByUserName(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        return user;
    }

    /**
     * 주어진 사용자 닉네임(nickname)을 기반으로 사용자를 조회합니다.
     *
     * @param nickname 조회할 사용자의 닉네임
     * @return 주어진 닉네임에 해당하는 {@link User} 객체
     * @throws UserNotFoundException 데이터베이스에서 해당 닉네임을 가진 사용자를 찾을 수 없는 경우 발생
     */
    @Override
    public User getUserByUserNickname(String nickname) {
        User user = userRepository.findByNickname(nickname).orElseThrow(() -> new UserNotFoundException("User not found"));
        return user;
    }

    @Override
    @Transactional
    public void updateUserStatusToOnline(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setUserStatus(true); // Set status to online
        userRepository.save(user);
    }

    @Override
    public void notifyFriendsAboutStatusChange(String username, boolean isOnline) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<User> friends = friendsRepository.findFriendsByUser(user, FriendStatus.ACCEPTED);
        String statusMessage = isOnline ? "온라인" : "오프라인";

        List<FriendResponse> friendResponses = friends.stream()
                .map(friend -> new FriendResponse(friend.getNickname(), statusMessage))
                .collect(Collectors.toList());

        for (User friend : friends) {
            messagingTemplate.convertAndSend("/topic/friends/" + friend.getUsername(), friendResponses);
        }
    }
}
