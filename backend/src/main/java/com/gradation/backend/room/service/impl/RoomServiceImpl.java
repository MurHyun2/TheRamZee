package com.gradation.backend.room.service.impl;

import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.repository.RoomRepository;
import com.gradation.backend.room.service.RoomService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 방 생성
     *
     * @param title
     * @param password
     * @param nickname
     * @return
     */
    @Transactional
    public Room createRoom(String title, Integer password, String nickname) {

        // 생성자 닉네임을 받아서 생성자로 가져옴
        User host = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("생성자 닉네임이 필요합니다."));

        // 이미 존재하던 방에서 퇴장
        Room existRoom = host.getRoom();
        if (existRoom != null) {
            if (existRoom.getHost() == host){
                List<User> users = existRoom.getUsers();
                for (User participant : users) {
                    participant.setRoom(null);
                }
                roomRepository.delete(existRoom);
            } else {
                existRoom.removeUser(host); // 기존 방에서 User 제거
            }
        }

        // 2) 방 엔티티 생성 & DB 저장
        Room room = Room.createRoom(title, password, host);
        roomRepository.save(room);

        // Fetch Join을 사용하여 fakeUsers를 강제로 로드
        return roomRepository.findByIdWithUsers(room.getId())
                .orElseThrow(() -> new RuntimeException("Room not found after creation"));

    }

    /**
     * 방 참가
     *
     * @param roomId
     * @param nickname
     * @param password
     * @return room
     */
    @Transactional
    public Room joinRoom(Long roomId, String nickname, Integer password) {
        // 참여자 유저 조회
        User user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("참여자를 찾을 수 없습니다."));

        // 이미 존재하던 방에서 퇴장
        Room existRoom = user.getRoom();
        if (existRoom != null) {
            if (existRoom.getHost() == user){
                List<User> users = existRoom.getUsers();
                for (User participant : users) {
                    participant.setRoom(null);
                }
                roomRepository.delete(existRoom);
            } else {
                existRoom.removeUser(user); // 기존 방에서 User 제거
            }
        }

        // 방 조회 (fetch join)
        Room room = roomRepository.findByIdWithUsers(roomId)
                .orElseThrow(() -> new RuntimeException("참여하려는 방을 찾을 수 없습니다."));


        //비번방일 경우 비밀번호 검증
        if (room.getPassword() != null && !Objects.equals(password, room.getPassword())) {
            throw new IllegalArgumentException("비밀번호 오류!");
        }

        // 방 인원이 이미 6명일 경우 참가 불가
        if (room.getUsers().size() > 6) {
            throw new RuntimeException("방 인원이 다 찼습니다!");
        }
//        if (room.getUsers().stream().anyMatch(u -> u.getName().equals(user.getName()))) {
//            throw new IllegalArgumentException("이미 방에 참가한 유저입니다!");
//        }
        // 참여자 추가
        room.addUser(user);

        return room;
    }

    /**
     * 방 나가기
     *
     * @param roomId
     * @param nickname
     */
    @Transactional
    public void leaveRoom(Long roomId, String nickname) {
        // 참여자 유저 조회
        User user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("참여자를 찾을 수 없습니다."));

        // 방 조회 (fetch join)
        Room room = roomRepository.findByIdWithUsers(roomId)
                .orElseThrow(() -> new RuntimeException("참여하려는 방을 찾을 수 없습니다."));

        // 참여자 검증
        if (user.equals(room.getHost())) {
            List<User> users = room.getUsers();
            for (User participant : users) {
                participant.setRoom(null);
            }
            Map<String, Object> message = new HashMap<>();
            message.put("status", "success");
            message.put("message", "방장이 방을 나갔습니다.");
            messagingTemplate.convertAndSend("/topic/game/" + roomId + "/out", message);
            roomRepository.delete(room);

        } else {
            room.removeUser(user);
        }
    }

    /**
     * 방 목록 조회
     *
     * @return 방 목록
     */
    @Transactional(readOnly = true)
    public List<Room> getRooms() {
        return roomRepository.findAllWithUsers();
    }

    /**
     * 방 단건 조회
     *
     * @param roomId
     * @return 방 하나
     */
    @Transactional(readOnly = true)
    public Room getRoom(Long roomId) {
        return roomRepository.findByIdWithUsers(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found. id=" + roomId));

    }
    @Transactional
    public Room friendJoinRoom(Long roomId, String nickname, Integer password) {
        // 참여자 유저 조회
        User user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("참여자를 찾을 수 없습니다."));


        // 방 조회 (fetch join)
        Room room = roomRepository.findByIdWithUsers(roomId)
                .orElseThrow(() -> new RuntimeException("참여하려는 방을 찾을 수 없습니다."));


        //비번방일 경우 비밀번호 검증
        if (room.getPassword() != null && !password.equals(room.getPassword())) {
            throw new IllegalArgumentException("비밀번호 오류!");
        }

        // 방 인원이 이미 6명일 경우 참가 불가
        if (room.getUsers().size() > 6) {
            throw new RuntimeException("방 인원이 다 찼습니다!");
        }
        if (room.getUsers().stream().anyMatch(u -> u.getName().equals(user.getName()))) {
            return room;
        }
        // 참여자 추가
        room.addUser(user);

        return room;
    }

}
