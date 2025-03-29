package com.gradation.backend.friends.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.friends.model.request.FriendRequest;
import com.gradation.backend.friends.service.FollowService;
import com.gradation.backend.openvidu.service.OpenViduService;
import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.model.response.RoomFollowReesponse;
import com.gradation.backend.room.service.RoomService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@Tag(name = "친구 따라가기", description = "친구 따라가기 API")
public class FollowController {
    private final FollowService followService;
    private final UserService userService;
    private final RoomService roomService;
    private final OpenViduService openViduService;

    /**
     * 친구의 방에 참여하게 만드는 API.
     *
     * 이 API는 요청한 사용자가 친구의 방에 참가하도록 설정합니다.
     * 단, 게임이 이미 진행 중인 방에는 참가할 수 없습니다.
     * 비밀번호를 무시하고 친구의 방에 참가합니다.
     *
     * @param followFriendRequest 친구의 닉네임을 포함한 요청 데이터
     * @return 친구의 방 정보와 성공 메시지를 포함한 응답 또는 에러 메시지
     */

    @PostMapping("/follow")
    @Transactional
    @Operation(
            summary = "친구의 방에 참가",
            description = "친구의 닉네임을 입력받아 해당 친구가 속한 방에 참가합니다. 게임이 진행 중인 방에는 참가할 수 없습니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "방 참가에 성공했습니다."),
            @ApiResponse(responseCode = "403", description = "게임이 진행 중인 방에는 참가할 수 없습니다."),
            @ApiResponse(responseCode = "404", description = "친구 또는 방을 찾을 수 없습니다.")
    })
    public ResponseEntity<BaseResponse<RoomFollowReesponse>> followFriend(@RequestBody FriendRequest followFriendRequest) {
        try {
            User currentUser = userService.getCurrentUser();  // 현재 로그인한 사용자
            // 요청 본문에서 친구의 닉네임을 가져옴
            String friendNickname = followFriendRequest.getFriendNickname();

            // 친구의 방에 입장
            RoomFollowReesponse response = followService.joinRoomByFriend(currentUser, friendNickname);

            // 친구가 속한 방 검색
            Long roomId = response.getRoomId();

            // 친구가 속한 방의 비밀번호 가져와서 참가하기
            Room room = roomService.getRoom(roomId);

            Room joinedRoom = roomService.friendJoinRoom(roomId, currentUser.getNickname(), room.getPassword());

            // 오픈비두 세션 토큰 발급
            String sessionId = roomId + "-1";
            String token = openViduService.generateToken(sessionId, currentUser.getNickname());
            response.setToken(token);

            return ResponseEntity.ok(BaseResponse.success("방 참가에 성공했습니다.", response));

        } catch (RuntimeException e) {
            // 게임 중인 방에 입장 시 예외 처리
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(BaseResponse.error(e.getMessage()));
        }// 방 정보 반환
        catch (OpenViduJavaClientException e) {
            throw new RuntimeException(e);
        } catch (OpenViduHttpException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(BaseResponse.error(e.getMessage()));
        }
    }
}
