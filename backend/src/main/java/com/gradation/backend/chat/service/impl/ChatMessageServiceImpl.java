package com.gradation.backend.chat.service.impl;
import com.gradation.backend.chat.model.response.UnreadMessageResponse;
import com.gradation.backend.chat.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 채팅 메시지 관리 서비스 클래스.
 *
 * Redis를 활용하여 채팅 메시지 저장, 조회, 읽지 않은 메시지 관리 등의 기능을 제공합니다.
 */
@Service
public class ChatMessageServiceImpl implements ChatMessageService {

    private static final String CHAT_PREFIX = "chat:"; // Redis 키 접두사

    @Autowired
    private RedisTemplate<String, String> redisTemplate2;

    public ChatMessageServiceImpl(@Qualifier("redisTemplate2")RedisTemplate<String, String> redisTemplate2) {
        this.redisTemplate2 = redisTemplate2;
    }



    /**
     * 두 사용자를 기준으로 Redis 채팅 키를 생성합니다.
     *
     * 채팅 키는 사용자 이름을 사전순으로 정렬하여 항상 동일한 키를 생성합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @return Redis 채팅 키
     */
    public String generateChatKey(String sender, String receiver) {
        if (sender.compareTo(receiver) < 0) {
            return CHAT_PREFIX + sender + ":" + receiver;
        } else {
            return CHAT_PREFIX + receiver + ":" + sender;
        }
    }

    /**
     * 읽지 않은 메시지 카운트를 관리하기 위한 Redis 키를 생성합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @return 읽지 않은 메시지 카운트를 위한 Redis 키
     */
    public String generateUnreadKey(String sender, String receiver) {
        return "unread:" + sender + ":" + receiver; // 송신자와 수신자의 순서를 고정
    }

    /**
     * 메시지를 Redis에 저장합니다.
     *
     * 메시지는 송신자와 수신자 간 채팅 키를 기준으로 저장되며, 읽지 않은 메시지 카운트를 증가시킵니다.
     * 메시지는 24시간 동안 유지됩니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @param content  메시지 내용
     */
    public void saveMessage(String sender, String receiver, String content) {
        String key = generateChatKey(sender, receiver);
        String message = String.format("%s: %s", sender, content);
        redisTemplate2.opsForList().rightPush(key, message);
        // 읽지 않은 메시지 카운트 증가
        String unreadKey = generateUnreadKey(sender, receiver);
        // 채팅 키의 TTL(유효 기간) 설정: 24시간
        redisTemplate2.expire(key, 24, java.util.concurrent.TimeUnit.HOURS);
        redisTemplate2.opsForValue().increment(unreadKey);

    }

    /**
     * 특정 사용자 간의 모든 채팅 메시지를 Redis에서 조회합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @return 송신자와 수신자 간의 모든 메시지 리스트
     */
    public List<String> getMessages(String sender, String receiver) {
        String key = generateChatKey(sender, receiver);
        return redisTemplate2.opsForList().range(key, 0, -1);
    }

    /**
     * 읽지 않은 메시지 개수를 조회합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @return 읽지 않은 메시지 개수
     */
    @Override
    public Long getUnreadCount(String sender, String receiver) {
        String unreadKey = generateUnreadKey(sender, receiver);
        Object value = redisTemplate2.opsForValue().get(unreadKey); // Redis에서 값 가져오기

        return value != null ? Long.parseLong(value.toString()) : 0L; // 문자열을 Long으로 변환
    }

    /**
     * 특정 수신자(receiver)와 관련된 모든 발신자(sender)의 읽지 않은 메시지 개수를 조회합니다.
     *
     * @param receiver 메시지 수신자
     * @return 각 발신자(sender)와 읽지 않은 메시지 수를 담은 리스트
     */
    @Override
    public List<UnreadMessageResponse> getUnreadCountsForReceiver(String receiver) {
        String pattern = "unread:*:" + receiver; // unread 키 패턴: "unread:{sender}:{receiver}"
        Set<String> unreadKeys = redisTemplate2.keys(pattern);

        if (unreadKeys == null || unreadKeys.isEmpty()) {
            return Collections.emptyList(); // 읽지 않은 메시지가 없으면 빈 리스트 반환
        }
        // 각 key에서 `sender`와 읽지 않은 메시지 수를 추출하여 응답 생성
        return unreadKeys.stream()
                .map(unreadKey -> {
                    String sender = extractSenderFromKey(unreadKey); // Redis 키에서 송신자 추출
                    String value = String.valueOf(redisTemplate2.opsForValue().get(unreadKey)); // Redis에서 읽지 않은 메시지 수 조회
                    Long unreadCount = value != null ? Long.parseLong(value) : 0L;
                    return new UnreadMessageResponse(sender, unreadCount); // 응답 객체 생성
                })
                .collect(Collectors.toList());
    }

    /**
     * Redis 키에서 발신자(sender)를 추출합니다.
     *
     * @param key Redis 키 (패턴: "unread:{sender}:{receiver}")
     * @return 발신자(sender)의 이름
     */
    private String extractSenderFromKey(String key) {
        // 키 형식: "unread:{sender}:{receiver}"
        return key.split(":")[1]; // 두 번째 요소가 sender
    }

    /**
     * 읽지 않은 메시지를 읽음 처리합니다.
     *
     * 읽지 않은 메시지 카운트를 관리하는 Redis 키를 삭제하여 초기화합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     */
    public void markMessagesAsRead(String sender, String receiver) {
        String unreadKey = generateUnreadKey(sender, receiver);
        redisTemplate2.delete(unreadKey); // 읽지 않은 카운트 초기화
    }

}
