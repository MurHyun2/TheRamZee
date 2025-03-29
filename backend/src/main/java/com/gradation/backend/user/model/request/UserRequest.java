package com.gradation.backend.user.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    @Size(min = 5, max = 15, message = "아이디는 5자 이상, 15자 이하로 입력해주세요.")
    private String username;    // 사용자 ID
    private String name;  // 사용자 본명
    private String email;
    @NotBlank(message = "비밀번호는 필수 항목입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상, 20자 이하로 입력해주세요.")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
            message = "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.")
    private String password;
    private String nickname;
}
