package com.gradation.backend.user.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponse {
    private String accessToken;  // 새로 발급된 Access 토큰
    private String usernickname; // 사용자 닉네임
}
