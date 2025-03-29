package com.gradation.backend.chat.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MessageResponse {
    private String sender; // 메시지 송신자
    private String content; // 메시지 내용
}
