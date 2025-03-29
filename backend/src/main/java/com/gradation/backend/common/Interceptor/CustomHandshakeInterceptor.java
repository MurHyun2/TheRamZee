package com.gradation.backend.common.Interceptor;

import com.gradation.backend.common.utill.JwtTokenUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.Optional;

public class CustomHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenUtil jwtTokenUtil;

    public CustomHandshakeInterceptor(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {

        // 요청 URI에서 쿼리 스트링 추출
        String query = request.getURI().getQuery();
        // 쿼리 스트링에서 Access Token 추출
        String token = extractTokenFromQuery(query);

        if (token != null && jwtTokenUtil.validateToken(token)) {
            // 토큰이 유효한 경우 WebSocket 세션 속성에 Access Token 저장
            attributes.put("accessToken", token); // Access Token 저장
            return true; // 핸드셰이크 성공
        } else {

            return false; // 핸드셰이크 실패
        }
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler, Exception exception) {
        // 핸드셰이크 후 동작 정의 가능
    }

    /**
     * 쿼리 스트링에서 JWT 토큰을 추출합니다.
     *
     * @param query 쿼리 스트링
     * @return 추출된 JWT 토큰 (없을 경우 null)
     */
    private String extractTokenFromQuery(String query) {
        if (query != null) {
            return Optional.of(query)
                    .filter(q -> q.contains("accessToken=")) // "accessToken=" 포함 확인
                    .map(q -> q.split("accessToken=")[1]) // "accessToken=" 이후 값을 추출
                    .map(token -> token.split("&")[0]) // 다른 파라미터 분리
                    .orElse(null);
        }
        return null; // 쿼리 문자열이 없거나 "accessToken="이 없는 경우
    }
}
