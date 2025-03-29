package com.gradation.backend.user.model.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    private final String nickname;
    private final List<? extends GrantedAuthority> authorities;

    // 생성자
    public CustomUserDetails(String username, String password, String nickname, List<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.authorities = authorities;
    }

    // 사용자 권한 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // 사용자 비밀번호 반환
    @Override
    public String getPassword() {
        return password;
    }

    // 사용자 이름 반환
    @Override
    public String getUsername() {
        return username;
    }

    // 사용자 닉네임 반환 (커스텀 메서드)
    public String getUserNickName() {
        return nickname;
    }

    // 계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {
        return true; // true로 설정하면 계정이 만료되지 않음
    }

    // 계정 잠김 여부
    @Override
    public boolean isAccountNonLocked() {
        return true; // true로 설정하면 계정이 잠기지 않음
    }

    // 자격 증명 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // true로 설정하면 자격 증명이 만료되지 않음
    }

    // 계정 활성화 여부
    @Override
    public boolean isEnabled() {
        return true; // true로 설정하면 계정이 활성화됨
    }
}
