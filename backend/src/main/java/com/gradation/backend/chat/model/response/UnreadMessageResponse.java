package com.gradation.backend.chat.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UnreadMessageResponse {
    private String sender;    // 메시지를 보낸 사용자
    private Long unreadCount; // 읽지 않은 메시지 개수
}
