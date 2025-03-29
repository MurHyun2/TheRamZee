package com.gradation.backend.user.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.user.model.dto.EmailCheckDto;
import com.gradation.backend.user.model.request.EmailRequest;
import com.gradation.backend.user.model.request.FindUsernameRequest;
import com.gradation.backend.user.model.request.ResetPasswordRequest;
import com.gradation.backend.user.model.response.EmailSendResponse;
import com.gradation.backend.user.model.response.FindUsernameResponse;
import com.gradation.backend.user.model.response.ResetPasswordResponse;
import com.gradation.backend.user.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * EmailController는 이메일 인증과 관련된 API를 제공합니다.
 * - 이메일 인증번호 전송
 * - 이메일 인증번호 검증
 */
@RestController
@RequestMapping("/api/v1/email")
@Tag(name = "이메일 인증", description = "이메일 인증 API")
public class EmailController {
    private final EmailService emailService;
    private final RedisTemplate<String, String> redisTemplate1;

    public EmailController(EmailService emailService, @Qualifier("redisTemplate1") RedisTemplate<String, String> redisTemplate1) {
        this.emailService = emailService;
        this.redisTemplate1 = redisTemplate1;
    }
    /**
     * 이메일 인증번호 전송 API.
     * 사용자가 회원가입 시 이메일 인증번호 요청을 하면, 해당 이메일로 인증번호를 생성하고 전송합니다.
     *
     * @param emailRequest 사용자의 이메일 주소를 포함한 요청 객체
     * @return 인증번호가 포함된 응답 객체 (개발 단계에서는 인증번호를 반환하며, 실제 배포 환경에서는 생략 가능)
     */
    @PostMapping("/email-send")
    @Operation(summary = "이메일 인증번호 전송", description = "사용자가 회원가입 시 이메일로 인증번호를 요청합니다.")
    public ResponseEntity<BaseResponse<EmailSendResponse>> mailSend(@RequestBody @Valid EmailRequest emailRequest) {
        if (emailService.isEmailRegistered(emailRequest.getEmail())) {
            return ResponseEntity.badRequest().body(
                    BaseResponse.error("이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.")
            );
        }

        // 인증번호 생성 및 이메일 전송
        String code = emailService.joinEmail(emailRequest.getEmail());
        EmailSendResponse response = new EmailSendResponse(code);

        return ResponseEntity.ok(BaseResponse.success("인증번호가 전송되었습니다.", response));
    }

    /**
     * 이메일 인증번호 검증 API.
     * 사용자가 입력한 인증번호를 검증하여 인증이 성공했는지 확인하고 상태를 저장합니다.
     *
     * @param emailCheckDto 사용자의 이메일 주소와 입력한 인증번호를 담은 객체
     * @return 인증 성공 또는 실패 메시지
     */
    @PostMapping("/email-auth")
    @Operation(summary = "이메일 인증번호 검증", description = "사용자가 입력한 인증번호를 검증하여 이메일 인증 상태를 처리합니다.")
    public ResponseEntity<BaseResponse<String>> authCheck(@RequestBody @Valid EmailCheckDto emailCheckDto) {
        // Redis에서 저장된 인증번호 조회
        String redisKey = "email:auth:" + emailCheckDto.getEmail();
        String storedAuthNum = redisTemplate1.opsForValue().get(redisKey);

        // 인증번호가 Redis에 없을 경우 (만료되었거나 미요청 상태)
        if (storedAuthNum == null) {
            return ResponseEntity.badRequest().body(BaseResponse.error("인증번호가 만료되었거나 존재하지 않습니다."));
        }

        // 인증번호 불일치 처리
        if (!storedAuthNum.equals(emailCheckDto.getAuthNum())) {
            return ResponseEntity.badRequest().body(BaseResponse.error("인증번호가 일치하지 않습니다."));
        }

        // 인증번호 일치 - 이메일 인증 성공 처리
        String verifiedKey = emailCheckDto.getEmail() + ":verified";
        redisTemplate1.opsForValue().set(verifiedKey, "true", 180, TimeUnit.SECONDS); // 인증 상태를 Redis에 저장 (3분간 유효)

        // 성공 응답 반환
        return ResponseEntity.ok(BaseResponse.success("이메일 인증에 성공했습니다.", null));
    }

    /**
     * 아이디를 이메일로 전송하는 API.
     * 사용자가 등록된 이름과 이메일을 입력하면 해당 이메일로 등록된 아이디를 전송합니다.
     *
     * @param findUsernameRequest 사용자의 이름과 이메일 주소를 포함한 요청 객체
     * @return 성공 메시지 응답 객체
     */
    @PostMapping("/find-username")
    @Operation(summary = "아이디 이메일 전송", description = "사용자의 이름과 이메일이 일치하는 경우 아이디를 이메일로 전송합니다.")
    public ResponseEntity<BaseResponse<String>> sendUsernameByEmail(
            @RequestBody @Valid FindUsernameRequest findUsernameRequest) {
        emailService.sendUsernameByEmail(
                findUsernameRequest.getName(),
                findUsernameRequest.getEmail()
        );
        return ResponseEntity.ok(BaseResponse.success("아이디가 이메일로 전송되었습니다.", null));
    }



    /**
     * 비밀번호 재설정을 위한 이메일 발송 API.
     * 이메일로 임시 비밀번호를 전송하여 사용자가 로그인 후 비밀번호를 변경할 수 있도록 합니다.
     *
     * @param resetPasswordRequest 사용자의 이메일 주소를 포함한 요청 객체
     * @return 성공 메시지 응답 객체
     */
    @PostMapping("/reset-password")
    @Operation(summary = "비밀번호 초기화", description = "사용자의 이메일과 아이디가 일치하는 경우 임시 비밀번호를 전송합니다.")
    public ResponseEntity<BaseResponse<ResetPasswordResponse>> resetPassword(
            @RequestBody @Valid ResetPasswordRequest resetPasswordRequest) {
        String password = emailService.resetPassword(
                resetPasswordRequest.getEmail(), resetPasswordRequest.getUsername());
        ResetPasswordResponse response = new ResetPasswordResponse(password);
        return ResponseEntity.ok(BaseResponse.success("임시 비밀번호가 이메일로 전송되었습니다.", response));
    }

}

