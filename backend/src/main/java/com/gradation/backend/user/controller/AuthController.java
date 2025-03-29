package com.gradation.backend.user.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.common.utill.JwtTokenUtil;
import com.gradation.backend.common.utill.RedisUtil;
import com.gradation.backend.user.model.entity.CustomUserDetails;
import com.gradation.backend.user.model.request.UserRequest;
import com.gradation.backend.user.model.response.TokenResponse;
import com.gradation.backend.user.model.response.UserResponse;
import com.gradation.backend.user.service.impl.CustomUserDetailsServiceImpl;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * AuthController는 사용자 인증과 관련된 API를 제공합니다.
 * - 로그인
 * - 토큰 갱신
 * - 로그아웃
 * - 사용자 등록
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "회원 인증", description = "사용자 인증 관리 API")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final CustomUserDetailsServiceImpl customUserDetailsServiceImpl;
    private final JwtTokenUtil jwtTokenUtil;
    private final RedisUtil redisUtil;

    /**
     * 사용자 등록 API.
     *
     * @param request 등록하려는 사용자 정보
     * @return 등록된 사용자 정보가 포함된 응답 객체
     */
    @PostMapping("/register")
    @Operation(summary = "사용자 등록", description = "새로운 사용자 계정을 생성합니다.")
    @Transactional
    public ResponseEntity<BaseResponse<UserResponse>> register(@RequestBody UserRequest request) {
        UserResponse registeredUser = userService.registerUser(request);
        return ResponseEntity.ok(BaseResponse.success("사용자가 성공적으로 등록되었습니다.", registeredUser));
    }

    /**
     * 사용자 로그인 API.
     * 사용자 인증 후 Access 및 Refresh 토큰을 반환합니다.
     *
     * @param request 로그인 요청 데이터 (username, password)
     * @return Access 및 Refresh 토큰이 포함된 응답 객체
     */
    @PostMapping("/login")
    @Operation(summary = "사용자 로그인", description = "사용자를 인증하고 Access 및 Refresh 토큰을 반환합니다.")
    public ResponseEntity<BaseResponse<TokenResponse>> login(@RequestBody @Valid UserRequest request) {
        try {
            TokenResponse tokenResponse = userService.login(request);
            return ResponseEntity.ok(BaseResponse.success("로그인 성공", tokenResponse));
        } catch (BadCredentialsException e) {
            // 잘못된 사용자명 또는 비밀번호
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.error("잘못된 사용자 이름 또는 비밀번호입니다."));
        } catch (Exception e) {
            // 기타 예외 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse.error("로그인 중 문제가 발생했습니다."));
        }
    }

    /**
     * Access 토큰 갱신 API.
     * 유효한 Refresh 토큰을 사용하여 새로운 Access 토큰을 발급받습니다.
     *
     * @param request Refresh 토큰이 포함된 요청 데이터
     * @return 새로운 Access 토큰이 포함된 응답 객체
     */
    @PostMapping("/refresh-token")
    @Operation(summary = "Access 토큰 갱신", description = "유효한 Refresh 토큰을 사용하여 새로운 Access 토큰을 발급받습니다.")
    public ResponseEntity<BaseResponse<TokenResponse>> refreshToken(@RequestHeader("Authorization") String expiredAccessToken) {
        if (expiredAccessToken.startsWith("Bearer ")) {
            expiredAccessToken = expiredAccessToken.substring(7);
        }

        String username = jwtTokenUtil.extractUsername(expiredAccessToken);
        if (username != null && redisUtil.hasKey(username + ":refresh")) {
            // Redis에서 Refresh Token을 가져온다
            String refreshToken = (String) redisUtil.get(username + ":refresh");
            CustomUserDetails userDetails = customUserDetailsServiceImpl.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(refreshToken, userDetails)) {
                String newAccessToken = jwtTokenUtil.generateAccessToken(userDetails);
                TokenResponse tokenResponse = new TokenResponse(newAccessToken, userDetails.getUserNickName());
                return ResponseEntity.ok(BaseResponse.success("Access 토큰이 성공적으로 갱신되었습니다.", tokenResponse));
            }
        }
        return ResponseEntity.badRequest().body(
                BaseResponse.error("유효하지 않은 Access 토큰입니다."));
    }


    /**
     * 로그아웃 API.
     * 사용자의 Refresh 토큰을 무효화합니다.
     *
     * @param token Authorization 헤더에 포함된 Access 토큰
     * @return 로그아웃 성공 메시지
     */
    @PostMapping("/logout")
    @Operation(summary = "사용자 로그아웃", description = "사용자의 Refresh 토큰을 무효화합니다.")
    public ResponseEntity<BaseResponse<String>> logout(@RequestHeader("Authorization") String token) {
        String username = jwtTokenUtil.extractUsername(token.substring(7));
        userService.logout(username);
        redisUtil.delete(username + ":refresh");
        return ResponseEntity.ok(BaseResponse.success("로그아웃이 성공적으로 처리되었습니다.", null));
    }
    @PostMapping("/relog")
    @Operation(summary = "사용자 재로그인", description = "Access Token을 사용해 사용자의 상태를 온라인으로 변경하고 친구들에게 알립니다.")
    public ResponseEntity<BaseResponse<String>> relog(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // Remove "Bearer " prefix
        }

        try {
            // Extract username from token
            String username = jwtTokenUtil.extractUsername(token);

            // Update user status to online
            userService.updateUserStatusToOnline(username);

            // Notify friends about status change
            userService.notifyFriendsAboutStatusChange(username, true);

            return ResponseEntity.ok(BaseResponse.success("사용자의 상태가 온라인으로 변경되었습니다.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.error("토큰이 유효하지 않거나 사용자 상태를 업데이트할 수 없습니다."));
        }
    }
}
