package com.gradation.backend.friends.service.impl;

import com.gradation.backend.friends.service.FollowService;
import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.model.response.RoomFollowReesponse;
import com.gradation.backend.room.repository.RoomRepository;
import com.gradation.backend.user.model.dto.UserDto;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 팔로우 서비스 클래스.
 *
 * 친구의 방에 참여하거나 관련된 동작을 처리하는 기능을 제공합니다.
 */
@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    /**
     * 친구가 속한 방에 현재 사용자를 참가시키는 메서드.
     *
     * 이 메서드는 현재 사용자가 친구의 방에 입장하도록 설정하며,
     * 게임이 진행 중인 방에는 입장할 수 없습니다.
     *
     * @param currentUser    현재 사용자 (방에 입장하고자 하는 사용자)
     * @param friendNickname 친구의 닉네임 (친구가 속한 방 정보를 조회하기 위해 사용)
     * @return {@link RoomFollowReesponse} 객체로, 친구의 방 정보를 포함한 응답
     * @throws RuntimeException 친구를 찾을 수 없거나 친구가 속한 방이 없을 경우, 혹은 게임이 진행 중인 방일 경우
     */
    public RoomFollowReesponse joinRoomByFriend(User currentUser, String friendNickname) {
        // 친구의 정보를 조회
        User friend = userRepository.findByNickname(friendNickname)
                .orElseThrow(() -> new RuntimeException("친구를 찾을 수 없습니다."));

        // 친구가 속한 방 정보 조회
        Room friendRoom = friend.getRoom();
        if (friendRoom == null) {
            throw new RuntimeException("친구가 속한 방이 없습니다.");
        }
        if (friendRoom.getGameStatus()) {
            throw new RuntimeException("게임이 진행 중인 방에는 입장할 수 없습니다.");
        }

        // 현재 사용자를 친구의 방으로 입장시킴 (비밀번호 무시)
        currentUser.setRoom(friendRoom);

        // 현재 사용자의 방 정보 업데이트
        userRepository.save(currentUser);

        // 친구의 방 정보를 DTO로 생성해 반환
        RoomFollowReesponse roomDTO = new RoomFollowReesponse();
        roomDTO.setRoomId(friendRoom.getId());
        roomDTO.setTitle(friendRoom.getTitle());
        roomDTO.setGameStatus(friendRoom.getGameStatus());

        // 방의 호스트 정보를 DTO로 변환하여 추가
        User host = friendRoom.getHost();
        UserDto hostDTO = new UserDto();
        hostDTO.setUserId(host.getId());
        hostDTO.setNickname(host.getNickname());
        hostDTO.setUserStatus(host.getUserStatus());
        roomDTO.setHost(hostDTO);

        return roomDTO;
    }
}
