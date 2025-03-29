package com.gradation.backend.room.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.openvidu.service.OpenViduService;
import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.model.request.CreateRoomRequest;
import com.gradation.backend.room.model.request.JoinRoomRequest;

import com.gradation.backend.room.model.response.CreateRoomResponse;
import com.gradation.backend.room.model.response.JoinRoomResponse;
import com.gradation.backend.room.model.response.RoomResponse;

import com.gradation.backend.room.service.RoomService;

import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eclipse.jdt.internal.compiler.lookup.AptSourceLocalVariableBinding;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor
@Tag(name = "Room API", description = "Room API")
public class RoomController {

    private final RoomService roomService;
    private final UserService userService;
    private final OpenViduService openViduService;

    /**
     * 방 생성
     */
    @PostMapping("/rooms")
    @Operation(summary = "방 생성", description = "새로운 방을 생성합니다.")
    @Transactional
    public ResponseEntity<BaseResponse<CreateRoomResponse>> createRoom(@RequestBody CreateRoomRequest request) throws OpenViduJavaClientException, OpenViduHttpException {
        User currentUser = userService.getCurrentUser();
        String nickname = currentUser.getNickname();

        Room createdRoom = roomService.createRoom(
                request.getTitle(),
                request.getPassword(),
                nickname
        );

        String sessionId = String.valueOf(createdRoom.getId()) + "-1";

        // 세션 생성
        Session session = openViduService.createSession(sessionId);

        // 토큰 생성
        String token = openViduService.generateToken(session.getSessionId(), nickname);

        CreateRoomResponse response = new CreateRoomResponse(createdRoom, token);
        return ResponseEntity.ok(BaseResponse.success("success", response));
    }

    /**
     * 방 참여
     */
    @PostMapping("/rooms/{roomId}/join")
    @Operation(summary = "방 참여", description = "방에 참여합니다.")
    @Transactional
    public ResponseEntity<BaseResponse<JoinRoomResponse>> joinRoom(
            @PathVariable Long roomId,
            @RequestBody(required = false) JoinRoomRequest request
    ) throws OpenViduJavaClientException, OpenViduHttpException {
        try {
            User currentUser = userService.getCurrentUser();
            String nickname = currentUser.getNickname();
            Room updatedRoom = roomService.joinRoom(roomId, nickname, request.getPassword());

            //스트링 변환
            String sessionId = String.valueOf(updatedRoom.getId()) + "-1";

            //토큰 생성
            String token = openViduService.generateToken(sessionId, nickname);

            JoinRoomResponse response = new JoinRoomResponse(updatedRoom, token);

            return ResponseEntity.ok(BaseResponse.success("success", response));
        } catch (IllegalArgumentException e) {
            // 비밀번호 오류 처리
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.error("비밀번호가 일치하지 않습니다."));
        }
    }

    /**
     * 방 나가기
     */
    @PostMapping("/rooms/{roomId}/leave")
    @Operation(summary = "방 나가기", description = "방을 나갑니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> leaveRoom(
            @PathVariable Long roomId
//            @RequestBody LeaveRoomRequest request
    ) {
        String nickname = userService.getCurrentUser().getNickname();
        roomService.leaveRoom(roomId, nickname);
        return ResponseEntity.ok(BaseResponse.success("success",null));
    }

    /**
     * 방 목록 조회
     */
    @GetMapping("/rooms")
    @Operation(summary = "방 목록 조회", description = "방 목록을 조회합니다.")
    public ResponseEntity<BaseResponse<List<RoomResponse>>> getRooms() {
        List<Room> rooms = roomService.getRooms();
        List<RoomResponse> responseList = rooms.stream()
                .map(r -> new RoomResponse(r))
                .collect(Collectors.toList());
        return ResponseEntity.ok(BaseResponse.success("success", responseList));
    }

    /**
     * 방 단건 조회
     */
    @GetMapping("/rooms/{roomId}")
    @Operation(summary = "방 단건 조회", description = "roomId로 방을 조회합니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> searchRoom(@PathVariable Long roomId) {
        Room room = roomService.getRoom(roomId);
        RoomResponse response = new RoomResponse(room);
        return ResponseEntity.ok(BaseResponse.success("success", response));
    }
}
