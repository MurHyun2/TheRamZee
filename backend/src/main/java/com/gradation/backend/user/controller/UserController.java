package com.gradation.backend.user.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.user.model.request.UserRequest;
import com.gradation.backend.user.model.response.UserResponse;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * UserController는 사용자 관리와 관련된 API를 제공합니다.
 * - 현재 사용자 정보 조회
 * - 사용자 정보 업데이트
 * - 사용자 계정 삭제
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "회원 정보", description = "사용자 관리 API")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    /**
     * 현재 사용자 정보 조회 API.
     * 인증된 사용자의 정보를 반환합니다.
     *
     * @param authentication Spring Security의 Authentication 객체 (현재 인증된 사용자 정보)
     * @return 현재 사용자의 정보가 포함된 응답 객체
     */
    @GetMapping("/me")
    @Operation(summary = "현재 사용자 정보 조회", description = "현재 인증된 사용자의 정보를 가져옵니다.")
    public ResponseEntity<BaseResponse<UserResponse>> getUser(Authentication authentication) {
        // 인증된 사용자의 이름으로 사용자 정보 조회
        UserResponse userResponse = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(BaseResponse.success("사용자 정보를 성공적으로 조회했습니다.", userResponse));
    }

    /**
     * 사용자 정보 업데이트 API.
     * 현재 사용자의 정보를 업데이트합니다.
     *
     * @param request 업데이트할 사용자 정보 (DTO)
     * @param authentication Spring Security의 Authentication 객체 (현재 인증된 사용자 정보)
     * @return 업데이트된 사용자 정보가 포함된 응답 객체
     */
    @PutMapping("/update")
    @Operation(summary = "사용자 정보 업데이트", description = "현재 사용자의 정보를 업데이트합니다.")
    public ResponseEntity<BaseResponse<UserResponse>> updateUser(@RequestBody UserRequest request, Authentication authentication) {
        // 인증된 사용자가 자신의 계정만 업데이트할 수 있도록 제한
        if (!authentication.getName().equals(request.getUsername())) {
            return ResponseEntity.badRequest().body(BaseResponse.error("자신의 계정만 업데이트할 수 있습니다."));
        }
        UserResponse updatedUser = userService.updateUser(request);
        return ResponseEntity.ok(BaseResponse.success("사용자 정보가 성공적으로 업데이트되었습니다.", updatedUser));
    }

    /**
     * 사용자 계정 삭제 API.
     * 현재 사용자의 계정을 삭제합니다.
     *
     * @param authentication Spring Security의 Authentication 객체 (현재 인증된 사용자 정보)
     * @return 성공 메시지가 포함된 응답 객체
     */
    @DeleteMapping("/delete")
    @Operation(summary = "사용자 계정 삭제", description = "현재 사용자의 계정을 삭제합니다.")
    public ResponseEntity<BaseResponse<UserResponse>> deleteUser(Authentication authentication) {
        // 인증된 사용자의 이름으로 계정 삭제
        userService.deleteUser(authentication.getName());
        return ResponseEntity.ok(BaseResponse.success("사용자 계정이 성공적으로 삭제되었습니다.", null));
    }
}
