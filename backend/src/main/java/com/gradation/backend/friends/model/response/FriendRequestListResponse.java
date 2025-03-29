package com.gradation.backend.friends.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FriendRequestListResponse {
    private String senderNickname;
    private String senderStatus;
}
