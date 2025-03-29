package com.gradation.backend.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * PasswordEncoderConfig는 비밀번호 암호화를 위한 설정을 제공합니다.
 * Spring Security에서 비밀번호를 안전하게 저장하고 검증하기 위해
 * {@link BCryptPasswordEncoder}를 Bean으로 등록합니다.
 */
@Configuration
public class PasswordEncoderConfig {

    /**
     * PasswordEncoder Bean 정의.
     *
     * @return {@link BCryptPasswordEncoder} 객체를 반환하여 비밀번호 암호화 및 검증에 사용됩니다.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
