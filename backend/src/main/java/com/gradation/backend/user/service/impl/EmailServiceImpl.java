package com.gradation.backend.user.service.impl;

import com.gradation.backend.common.config.RedisConfig;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.repository.UserRepository;
import com.gradation.backend.user.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service

public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender; // 이메일 전송을 위한 JavaMailSender 객체
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate1;
    private int authNumber; // 생성된 인증 번호를 저장하는 변수

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public EmailServiceImpl(JavaMailSender javaMailSender, RedisConfig redisConfig, UserRepository userRepository,@Qualifier("redisTemplate1") RedisTemplate<String, String> redisTemplate1, PasswordEncoder passwordEncoder) {
        this.javaMailSender = javaMailSender;
        this.userRepository = userRepository;
        this.redisTemplate1 = redisTemplate1;
        this.passwordEncoder = passwordEncoder;
    }

    /* 이메일 발신자 주소 (application.properties에서 주입) */
    @Value("${spring.mail.username}")
    private String serviceName;

    /**
     * 랜덤 인증번호 생성 메서드
     * - 6자리 랜덤 숫자를 생성하여 `authNumber` 변수에 저장합니다.
     * - 회원가입 시 이메일 인증에서 사용할 인증번호를 생성하는 데 사용됩니다.
     */
    public void makeRandomNum() {
        Random r = new Random(); // 랜덤 객체 생성
        String randomNumber = "";

        // 6자리 숫자 생성
        for (int i = 0; i < 6; i++) {
            randomNumber += Integer.toString(r.nextInt(10)); // 0~9 사이의 정수를 문자열로 변환하여 연결
        }

        authNumber = Integer.parseInt(randomNumber); // 문자열을 정수로 변환하여 저장
    }

    /**
     * 이메일 전송 메서드
     * - 이메일을 생성 후 발송하며, 발송된 인증번호를 Redis에 저장합니다.
     * - 인증번호는 3분(180초)의 유효기간을 가집니다.
     *
     * @param setFrom 발신자의 이메일 주소
     * @param toMail  수신자의 이메일 주소
     * @param title   이메일 제목
     * @param content 이메일 본문 (HTML 형식 지원)
     */
    public void mailSend(String setFrom, String toMail, String title, String content) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
            helper.setFrom(setFrom);
            helper.setTo(toMail);
            helper.setSubject(title);
            helper.setText(content, true);
            javaMailSender.send(message); // 이메일 전송
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        // RedisTemplate 사용
        ValueOperations<String, String> valOperations = redisTemplate1.opsForValue();
        String redisKey = "email:auth:" + toMail;
        valOperations.set(redisKey, Integer.toString(authNumber), 300, TimeUnit.SECONDS);
    }

    /**
     * 이메일 인증 요청 처리 메서드
     * - 랜덤 인증 번호를 생성하고, 사용자 이메일로 인증 메일을 발송합니다.
     *
     * @param email 사용자 이메일 주소
     * @return 생성된 인증 번호
     */
    public String joinEmail(String email) {
        makeRandomNum(); // 랜덤 인증 번호 생성

        String customerMail = email; // 수신자 이메일 주소
        String title = "회원 가입을 위한 이메일입니다!"; // 이메일 제목
        String content = // 이메일 본문
                "이메일을 인증하기 위한 절차입니다." + "<br><br>" + "인증 번호는 " + authNumber + "입니다." + "<br>" + "회원 가입 폼에 해당 번호를 입력해주세요.";

        mailSend(serviceName, customerMail, title, content); // 이메일 발송
        return Integer.toString(authNumber); // 생성된 인증 번호 반환
    }

    /**
     * 인증번호 확인 메서드
     * - Redis에서 저장된 인증 번호를 조회하여 사용자가 입력한 인증 번호와 일치 여부를 확인합니다.
     *
     * @param email   사용자 이메일 주소
     * @param authNum 사용자가 입력한 인증 번호
     * @return 인증 성공 여부 (true / false)
     */
    public Boolean checkAuthNum(String email, String authNum) {
        ValueOperations<String, String> valOperations = redisTemplate1.opsForValue();
        String code = valOperations.get(email);

        return Objects.equals(code, authNum); // 인증 결과 반환
    }

    /**
     * 이메일명 중복 확인 메서드
     *
     * @param email 인증하려는 사용자의 이메일명
     * @return 이메일이 중복 여부 true, false로 반환
     */
    @Override
    public Boolean isEmailRegistered(String email) {
        // 이메일 중복 여부 확인
        return userRepository.existsByEmail(email);
    }

    /**
     * 사용자 이름과 이메일을 기반으로 사용자의 아이디를 찾고, 이메일로 전송합니다.
     *
     * @param name  사용자 이름
     * @param email 사용자 이메일 주소
     */
    @Override
    public void sendUsernameByEmail(String name, String email) {
        // 이름과 이메일로 사용자 검색
        User user = userRepository.findByNameAndEmail(name, email).orElseThrow(() -> new RuntimeException("입력한 이름과 이메일이 일치하는 사용자를 찾을 수 없습니다."));

        // 사용자의 ID(username) 가져오기
        String username = user.getUsername();

        // 이메일로 ID 전송
        String title = "회원님의 아이디 정보 안내";
        String content = "회원님께서 요청하신 아이디는 다음과 같습니다: <br><strong>" + username + "</strong>";
        mailSend(serviceName, email, title, content);
    }

    /**
     * 사용자 비밀번호를 초기화하고, 임시 비밀번호를 이메일로 전송합니다.
     *
     * @param email    사용자 이메일 주소
     * @param username 사용자 이름
     * @return 생성된 임시 비밀번호
     */
    @Override
    public String resetPassword(String email, String username) {
        // 이메일과 아이디로 사용자 찾기
        User user = userRepository.findByEmailAndUsername(email, username).orElseThrow(() -> new RuntimeException("입력한 이메일과 아이디가 일치하는 사용자를 찾을 수 없습니다."));

        // 임시 비밀번호 생성
        String temporaryPassword = generateTemporaryPassword();
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);

        // 이메일로 임시 비밀번호 발송
        String title = "임시 비밀번호 안내";
        String content = "회원님의 임시 비밀번호는 다음과 같습니다: <br><strong>" + temporaryPassword + "</strong><br>로그인 후 반드시 비밀번호를 변경해주세요.";
        mailSend(serviceName, email, title, content);
        return temporaryPassword;
    }

    /**
     * 임시 비밀번호를 생성합니다.
     * 생성된 비밀번호는 영문 대소문자, 숫자, 특수문자로 이루어져 있으며 길이는 8자리입니다.
     *
     * @return 생성된 임시 비밀번호
     */
    private String generateTemporaryPassword() {
        // Character pools
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String specialChars = "@$!%*?&";

        Random random = new Random();

        // Ensure at least one character from each category
        char upper = uppercase.charAt(random.nextInt(uppercase.length()));
        char lower = lowercase.charAt(random.nextInt(lowercase.length()));
        char digit = digits.charAt(random.nextInt(digits.length()));
        char special = specialChars.charAt(random.nextInt(specialChars.length()));

        // Fill the remaining length with random characters from all categories
        String allChars = uppercase + lowercase + digits + specialChars;
        int remainingLength = 8 - 4; // Total length - already added 4 characters

        StringBuilder passwordBuilder = new StringBuilder();
        passwordBuilder.append(upper).append(lower).append(digit).append(special);

        for (int i = 0; i < remainingLength; i++) {
            passwordBuilder.append(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Shuffle the characters to ensure randomness
        List<Character> passwordCharacters = new ArrayList<>();
        for (char c : passwordBuilder.toString().toCharArray()) {
            passwordCharacters.add(c);
        }
        Collections.shuffle(passwordCharacters);

        // Convert the shuffled list back to a string
        StringBuilder shuffledPassword = new StringBuilder();
        for (char c : passwordCharacters) {
            shuffledPassword.append(c);
        }

        return shuffledPassword.toString();
    }
}


