package com.gradation.backend.user.service;

public interface EmailService {

    void mailSend(String setFrom, String toMail, String title, String content);

    String joinEmail(String email);

    void makeRandomNum();

    Boolean checkAuthNum(String email, String authNum);

    Boolean isEmailRegistered(String email);

    String resetPassword(String email, String username);

    void sendUsernameByEmail(String name, String email);
}

