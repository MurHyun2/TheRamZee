package com.gradation.backend.friends.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendRequestResponse {
    private String senderNickname;   // 요청을 보낸 사용자 닉네임
    private String receiverNickname; // 요청을 받은 사용자 닉네임
}
