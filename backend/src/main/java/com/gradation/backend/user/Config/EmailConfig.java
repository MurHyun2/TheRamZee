package com.gradation.backend.user.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * 이메일 설정을 담당하는 Configuration 클래스
 * - Spring에서 이메일 전송에 필요한 JavaMailSender Bean을 구성합니다.
 */
@Configuration
public class EmailConfig {

    /* 이메일 발신자 계정 정보 (설정 파일에서 주입) */
    @Value("${spring.mail.username}")
    private String username; // 이메일 계정 ID (발신자 이메일 주소)

    @Value("${spring.mail.password}")
    private String password; // 이메일 계정 비밀번호 또는 앱 비밀번호

    /**
     * JavaMailSender Bean 생성 메서드
     * - JavaMailSenderImpl 객체를 생성하여 이메일 전송에 필요한 설정을 추가합니다.
     *
     * @return JavaMailSender 이메일 전송을 위한 컴포넌트
     */
    @Bean
    public JavaMailSender mailSender() {

        // JavaMailSender 구현체 생성
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Gmail SMTP 서버 설정
        mailSender.setHost("smtp.gmail.com"); // Gmail SMTP 서버 호스트 주소
        mailSender.setPort(587);             // Gmail SMTP 서버의 TLS 포트

        // 발신자 계정 정보 설정
        mailSender.setUsername(username);    // 발신자 이메일 주소
        mailSender.setPassword(password);    // 발신자 이메일 비밀번호 (또는 앱 비밀번호)

        // 추가적인 이메일 전송 설정
        Properties javaMailProperties = new Properties();

        /* 이메일 전송 프로토콜 설정 (SMTP) */
        javaMailProperties.put("mail.transport.protocol", "smtp");

        /* SMTP 인증 활성화 */
        javaMailProperties.put("mail.smtp.auth", "true");

        /* SSL 소켓 팩토리 클래스 설정 */
        javaMailProperties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        /* TLS(STARTTLS) 사용 설정 */
        javaMailProperties.put("mail.smtp.starttls.enable", "true");

        /* 디버깅 활성화 (콘솔에 디버그 로그 출력) */
        javaMailProperties.put("mail.debug", "true");

        /* SSL 인증서 신뢰를 위한 설정 */
        javaMailProperties.put("mail.smtp.ssl.trust", "smtp.gmail.com");

        /* SSL에서 사용할 프로토콜 설정 (TLS 1.3) */
        javaMailProperties.put("mail.smtp.ssl.protocols", "TLSv1.3");

        // JavaMailSender에 추가 설정 적용
        mailSender.setJavaMailProperties(javaMailProperties);

        // 완성된 JavaMailSender 반환
        return mailSender;
    }
}
