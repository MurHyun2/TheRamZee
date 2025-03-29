package com.gradation.backend.user.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private String username;
    private String name;
    private String nickname;
    private String password;
    private String email;
}
