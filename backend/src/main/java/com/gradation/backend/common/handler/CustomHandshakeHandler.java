package com.gradation.backend.common.handler;

import com.gradation.backend.common.utill.JwtTokenUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    private final JwtTokenUtil jwtTokenUtil;

    // JwtTokenUtil을 주입받도록 생성자 추가
    public CustomHandshakeHandler(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    protected Principal determineUser(
            ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        // HandshakeInterceptor에서 설정한 "accessToken" 속성 가져오기
        String accessToken = (String) attributes.get("accessToken");
        if (accessToken != null && jwtTokenUtil.validateToken(accessToken)) {
            // JWT에서 사용자 이름(username) 추출
            String username = jwtTokenUtil.extractUsername(accessToken);
            if (username != null) {
                return new UserPrincipal(username); // 사용자 이름을 Principal로 설정
            }
        }
        return null; // null 반환 시 WebSocket 연결 거부
    }
}

// 사용자 이름 기반 Principal 구현
class UserPrincipal implements Principal {
    private final String username;

    public UserPrincipal(String username) {
        this.username = username;
    }

    @Override
    public String getName() {
        return this.username; // Principal의 이름으로 사용자 이름 반환
    }
}

