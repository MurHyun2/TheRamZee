package com.gradation.backend.friends.repository;

import com.gradation.backend.friends.model.entitiy.FriendStatus;
import com.gradation.backend.friends.model.entitiy.Friends;
import com.gradation.backend.friends.model.response.FriendResponse;
import com.gradation.backend.user.model.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FriendsRepository extends JpaRepository<Friends, Long> {

    @Query("SELECT f FROM Friends f WHERE f.user.Id = :userId AND f.status = :status")
    List<Friends> findByUserIdAndStatus(Long userId, FriendStatus status);
    Optional<Friends> findByUserAndFriend(User user, User friend);
    Optional<Friends> findByUserAndFriendAndStatus(User user, User friend, FriendStatus status);
    List<Friends> findByFriendAndStatus(User friend, FriendStatus status);
    @Query("SELECT f.friend FROM Friends f WHERE f.user = :user AND f.status = :status")
    List<User> findFriendsByUser(@Param("user") User user, @Param("status") FriendStatus status);
}
