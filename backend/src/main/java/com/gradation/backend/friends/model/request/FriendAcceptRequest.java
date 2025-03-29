package com.gradation.backend.friends.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendAcceptRequest {
    private String senderNickname;   // 요청을 보낸 사용자 닉네임
}
