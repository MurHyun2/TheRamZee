package com.gradation.backend.user.service.impl;

import com.gradation.backend.user.model.entity.CustomUserDetails;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * CustomUserDetailsServiceImpl는 Spring Security의 UserDetailsService 인터페이스를 구현한 클래스입니다.
 * 이 클래스는 사용자 이름(username)을 기준으로 사용자의 인증 정보를 데이터베이스에서 조회하여,
 * Spring Security에서 사용할 수 있도록 UserDetails 객체로 반환합니다.
 *
 */
@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 사용자 이름(username)을 기준으로 데이터베이스에서 사용자 인증 정보를 조회합니다.
     * Spring Security에서 인증 요청이 들어오면 호출되며, 조회된 사용자 정보를 UserDetails 객체로 변환하여 반환합니다.
     *
     * @param username 인증 요청 시 제공된 사용자 이름
     * @return UserDetails 객체 (Spring Security에서 사용하는 사용자 인증 정보)
     * @throws UsernameNotFoundException 제공된 사용자 이름으로 사용자를 찾을 수 없는 경우 발생
     */
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
//        return new org.springframework.security.core.userdetails.User(
//                user.getUsername(),
//                user.getPassword(),
//                Collections.emptyList()
//        );
//    }
    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return new CustomUserDetails(
                user.getUsername(),
                user.getPassword(),
                user.getNickname(),
                Collections.emptyList()
        );
    }
}
