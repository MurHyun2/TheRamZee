package com.gradation.backend.common.config;

import com.gradation.backend.common.handler.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket 및 STOMP 설정 클래스
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    /**
     * STOMP 메시지 브로커 설정
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue", "/topic");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user"); // 1:1 사용자 메시징
    }

    /**
     * WebSocket STOMP 엔드포인트 등록 및 설정
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // SockJS를 사용하는 WebSocket 엔드포인트 설정
        registry.addEndpoint("/ws")
                .setAllowedOrigins("https://ramzee.online") // CORS 허용 Origin 설정
                .withSockJS();

        // 일반 WebSocket 엔드포인트 설정
        registry.addEndpoint("/ws")
                .setAllowedOrigins("https://ramzee.online"); // CORS 허용 Origin 설정
    }

    /**
     * 클라이언트로부터 들어오는 STOMP 메시지 채널 설정
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // StompHandler를 인터셉터로 등록하여 들어오는 메시지를 처리
        registration.interceptors(stompHandler);
    }
}
