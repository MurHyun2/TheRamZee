package com.gradation.backend.user.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmailSendResponse {
    private String code; // 인증번호
}
