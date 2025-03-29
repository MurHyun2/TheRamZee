package com.gradation.backend.user.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private Long userId;
    private String nickname;
    private Boolean userStatus;  // 온라인 상태
}
