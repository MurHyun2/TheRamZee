package com.gradation.backend.openvidu.service.impl;

import com.gradation.backend.openvidu.service.OpenViduService;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OpenViduServiceImpl implements OpenViduService {

    private final OpenVidu openVidu;

    /**
     * 새로운 세션 생성
     *
     * @param sessionId 세션 ID (roomId 와 동일하게 사용)
     * @return 생성된 세션 객체
     */
    public Session createSession(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {

        Session session = openVidu.getActiveSession(sessionId);

        if (session != null) {
            return session;
        }

        SessionProperties properties = new SessionProperties.Builder()
                .customSessionId(sessionId)
                .mediaMode(MediaMode.ROUTED)
                .recordingMode(RecordingMode.MANUAL)
                .defaultRecordingProperties(new RecordingProperties.Builder()
                        .outputMode(Recording.OutputMode.COMPOSED) // 또는 OutputMode.INDIVIDUAL
                        .hasAudio(true)
                        .hasVideo(true)
                        .build())
                .build();

        return openVidu.createSession(properties);
    }

    /**
     * 토큰 생성
     *
     * @param sessionId 세션 ID
     * @param nickname  사용자 닉네임
     * @return
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    public String generateToken(String sessionId, String nickname) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openVidu.getActiveSession(sessionId);

        if (session == null) {
            throw new IllegalArgumentException("세션을 찾을 수 없습니다. 세션 ID: " + sessionId);
        }

        ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
                .type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER) // 동영상 전송과 스트림
                .data(nickname)
                .kurentoOptions(
                        new KurentoOptions.Builder()
                                .allowedFilters(new String[]{"GStreamerFilter", "FaceOverlayFilter"})
                                .build())
                .build();

        Connection connection = session.createConnection(connectionProperties);
        String token = connection.getToken();

        return token;
    }
}
