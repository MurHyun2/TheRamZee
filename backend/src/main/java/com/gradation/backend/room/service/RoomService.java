package com.gradation.backend.room.service;

import com.gradation.backend.room.model.entity.Room;

import java.util.List;

public interface RoomService {

    /**
     * 방 생성
     *
     * @param title    방 제목
     * @param password 방 비밀번호
     * @param nickname 생성자 닉네임
     * @return 생성된 Room 객체
     */
    Room createRoom(String title, Integer password, String nickname);

    /**
     * 방 참가
     *
     * @param roomId   방 ID
     * @param nickname 참가자 닉네임
     * @param password 방 비밀번호
     * @return 참가한 Room 객체
     */
    Room joinRoom(Long roomId, String nickname, Integer password);

    /**
     * 방 나가기
     *
     * @param roomId   방 ID
     * @param nickname 나가는 유저 닉네임
     */
    void leaveRoom(Long roomId, String nickname);

    /**
     * 방 목록 조회
     *
     * @return 모든 방의 목록
     */
    List<Room> getRooms();

    /**
     * 방 단건 조회
     *
     * @param roomId 조회할 방 ID
     * @return 조회된 Room 객체
     */
    Room getRoom(Long roomId);
    Room friendJoinRoom(Long roomId, String nickname, Integer password);
}
