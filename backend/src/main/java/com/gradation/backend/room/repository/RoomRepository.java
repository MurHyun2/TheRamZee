package com.gradation.backend.room.repository;

import com.gradation.backend.room.model.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    /**
     * 방 단건 조회 시 Users와 함께 로딩
     */
    @Query("SELECT r FROM Room r " +
            "LEFT JOIN FETCH r.users " +
            "WHERE r.Id = :roomId")
    Optional<Room> findByIdWithUsers(@Param("roomId") Long roomId);

    /**
     * 방 목록 조회 시 Users와 함께 로딩
     */
    @Query("SELECT DISTINCT r FROM Room r " +
            "LEFT JOIN FETCH r.users ")
    List<Room> findAllWithUsers();
}
