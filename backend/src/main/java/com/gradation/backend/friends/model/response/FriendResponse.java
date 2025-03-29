package com.gradation.backend.friends.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FriendResponse {

    private String nickname; // 친구 닉네임
    private String status;   // 온라인/오프라인 상태 ("온라인" 또는 "오프라인")
}
