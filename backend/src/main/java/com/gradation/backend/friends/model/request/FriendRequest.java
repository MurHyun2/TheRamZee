package com.gradation.backend.friends.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok: Getter, Setter 자동 생성
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequest {
    private String friendNickname; // 친구 닉네임
}
