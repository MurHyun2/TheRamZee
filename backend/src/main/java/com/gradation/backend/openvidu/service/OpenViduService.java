package com.gradation.backend.openvidu.service;

import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;

public interface OpenViduService {

    /**
     * 새로운 세션 생성
     *
     * @param sessionId 세션 ID (roomId와 동일하게 사용)
     * @return 생성된 세션 객체
     * @throws OpenViduJavaClientException OpenVidu 클라이언트 예외
     * @throws OpenViduHttpException       OpenVidu HTTP 예외
     */
    Session createSession(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException;

    /**
     * 세션에 참여하기 위한 토큰 생성
     *
     * @param sessionId 세션 ID
     * @param nickname  사용자 닉네임
     * @return 생성된 토큰 문자열
     * @throws OpenViduJavaClientException OpenVidu 클라이언트 예외
     * @throws OpenViduHttpException       OpenVidu HTTP 예외
     */

    String generateToken(String sessionId, String nickname) throws OpenViduJavaClientException, OpenViduHttpException;
}
