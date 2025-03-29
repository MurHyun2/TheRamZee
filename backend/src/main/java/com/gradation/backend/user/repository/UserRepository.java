package com.gradation.backend.user.repository;


import com.gradation.backend.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository는 사용자 데이터를 관리하기 위한 JPA 리포지토리 인터페이스입니다.
 * Spring Data JPA를 사용하여 데이터베이스와 상호작용합니다.
 */
public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<User> findByNameAndEmail(String name, String email);

    Optional<User> findByEmailAndUsername(String email, String username);

    Optional<User> findByNickname(String nickname);
}
