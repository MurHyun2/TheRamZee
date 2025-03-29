package com.gradation.backend.common.utill;

import com.gradation.backend.user.model.entity.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JwtTokenUtil은 JWT 토큰 생성, 검증, 정보 추출과 관련된 유틸리티 클래스입니다.
 * - Access 토큰 및 Refresh 토큰 생성
 * - 토큰에서 사용자 정보 추출
 * - 토큰 유효성 검증
 */
@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token.expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenExpiration;

    /**
     * Access 토큰을 생성합니다.
     *
     * @param userDetails 인증된 사용자의 정보를 담고 있는 UserDetails 객체
     * @return 생성된 Access 토큰 (JWT 형식)
     */
    public String generateAccessToken(CustomUserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userDetails.getUsername()); // 사용자 ID
        claims.put("nickname", userDetails.getUserNickName()); // 닉네임 추가
        return createToken(claims, userDetails.getUsername(), accessTokenExpiration);
    }

    /**
     * Refresh 토큰을 생성합니다.
     *
     * @param userDetails 인증된 사용자의 정보를 담고 있는 UserDetails 객체
     * @return 생성된 Refresh 토큰 (JWT 형식)
     */
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername(), refreshTokenExpiration);
    }

    /**
     * JWT 토큰을 생성합니다.
     *
     * @param claims 클레임 정보 (추가적으로 저장할 데이터)
     * @param subject 토큰의 주체 (보통 사용자명)
     * @param expiration 토큰의 만료 시간 (밀리초 단위)
     * @return 생성된 JWT 토큰
     */
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * JWT 토큰의 유효성을 검증합니다.
     *
     * @param token 검증할 JWT 토큰
     * @param userDetails 인증된 사용자의 정보를 담고 있는 UserDetails 객체
     * @return 토큰이 유효하면 true, 그렇지 않으면 false
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (ExpiredJwtException ex) {
            return false;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token); // 토큰 디코딩
            return !isTokenExpired(token); // 만료되지 않았는지 확인
        } catch (ExpiredJwtException ex) {
            return false; // 예외 발생 시 유효하지 않음
        }
    }

    /**
     * JWT 토큰에서 사용자 이름(주체)을 추출합니다.
     *
     * @param token 사용자 이름을 추출할 JWT 토큰
     * @return 추출된 사용자 이름
     */
    public String extractUsername(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (ExpiredJwtException e) {
            // 만료된 토큰에서도 클레임 정보 추출 가능
            return e.getClaims().getSubject();
        }
    }

    /**
     * JWT 토큰에서 만료 시간을 추출합니다.
     *
     * @param token 만료 시간을 추출할 JWT 토큰
     * @return 추출된 만료 시간 (Date 객체)
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * JWT 토큰에서 특정 클레임을 추출합니다.
     *
     * @param token 클레임을 추출할 JWT 토큰
     * @param claimsResolver 클레임을 처리하는 함수형 인터페이스
     * @param <T> 반환 타입
     * @return 추출된 클레임 값
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * JWT 토큰에서 모든 클레임을 추출합니다.
     *
     * @param token 클레임을 추출할 JWT 토큰
     * @return 추출된 모든 클레임 (Claims 객체)
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .setAllowedClockSkewSeconds(60)
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * JWT 토큰이 만료되었는지 확인합니다.
     *
     * @param token 확인할 JWT 토큰
     * @return 만료되었으면 true, 그렇지 않으면 false
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Access 토큰의 만료 시간을 반환합니다.
     *
     * @return Access 토큰의 만료 시간 (밀리초 단위)
     */
    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    /**
     * Refresh 토큰의 만료 시간을 반환합니다.
     *
     * @return Refresh 토큰의 만료 시간 (밀리초 단위)
     */
    public long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }

    /**
     * JWT 토큰 추출
     * "Bearer " 문자열을 제거하고 순수한 JWT 토큰만 반환
     */
    public String extractJwt(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7); // "Bearer " 이후의 토큰만 반환
        }
        throw new IllegalArgumentException("Invalid Authorization Header");
    }
}
