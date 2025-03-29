package com.gradation.backend.common.handler;

import com.gradation.backend.common.utill.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Principal;

/**
 * WebSocket STOMP 메시지를 처리하는 인터셉터
 * 주로 WebSocket 연결 시 JWT 토큰을 검증하는 역할을 수행합니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JwtTokenUtil jwtTokenUtil;

    /**
     * 메시지가 채널로 전송되기 전에 호출되는 메서드
     * 주로 CONNECT 명령어에 대해 JWT 토큰 검증을 수행합니다.
     *
     * @param message 전송될 메시지
     * @param channel 메시지가 전송될 채널
     * @return 처리된 메시지 (null 반환 시 메시지 전송이 중단됨)
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        log.info("🟢 StompHandler preSend called, command={}", accessor.getCommand());

        if (accessor.getCommand() == StompCommand.CONNECT) {
            // STOMP 헤더에서 JWT 추출
            String token = resolveToken(accessor);
            if (token == null || !jwtTokenUtil.validateToken(token)) {
                log.error("🚨 WebSocket 연결 거부 - 유효하지 않은 JWT");
                return null; // JWT가 유효하지 않으면 WebSocket 연결 차단
            }

            String username = jwtTokenUtil.extractUsername(token);
            log.info("✅ WebSocket 인증 성공 - 사용자: {}", username);
            accessor.setUser(new UserPrincipal(username));
        }
        return message;
    }

    /**
     * STOMP 헤더에서 JWT 토큰을 추출하는 메서드
     *
     * @param accessor STOMP 헤더 접근자
     * @return 추출된 JWT 토큰 (없거나 유효하지 않은 경우 null)
     */
    private String resolveToken(StompHeaderAccessor accessor) {
        String bearerToken = accessor.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * WebSocket 연결에 대한 사용자 정보를 나타내는 내부 클래스
     */
    public static class UserPrincipal implements Principal {
        private final String username;

        public UserPrincipal(String username) {
            this.username = username;
        }

        @Override
        public String getName() {
            return this.username;
        }
    }
}
