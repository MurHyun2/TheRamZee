package com.gradation.backend.friends.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.common.utill.JwtTokenUtil;
import com.gradation.backend.friends.model.request.FriendAcceptRequest;
import com.gradation.backend.friends.model.request.FriendRequest;
import com.gradation.backend.friends.model.response.FriendRequestListResponse;
import com.gradation.backend.friends.model.response.FriendRequestResponse;
import com.gradation.backend.friends.model.response.FriendResponse;
import com.gradation.backend.friends.service.FriendsService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
@Tag(name = "친구 정보", description = "친구 관리 API")
public class FriendsController {
    private final UserService userService;
    private final FriendsService friendService;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * 친구 목록 조회 API.
     *
     * 현재 사용자의 친구 목록을 조회합니다.
     *
     * @param token JWT 토큰을 통해 인증된 사용자 정보를 가져옵니다.
     * @return 현재 사용자의 친구 목록
     */
    @Operation(summary = "친구 목록 조회", description = "현재 사용자의 친구 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "친구 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("list")
    public ResponseEntity<BaseResponse<List<FriendResponse>>> getFriendsList() {
        User currentUser = userService.getCurrentUser();
        List<FriendResponse> friendResponse = friendService.getFriends(currentUser.getId());
        return ResponseEntity.ok(BaseResponse.success("친구 찾기 성공적으로 처리되었습니다.", friendResponse));
    }

    /**
     * 친구 요청 목록 조회 API.
     *
     * 현재 사용자가 받은 친구 요청 목록을 조회합니다.
     *
     * @return 친구 요청 목록
     */
    @Operation(summary = "친구 요청 목록 조회", description = "현재 사용자가 받은 친구 요청 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "친구 요청 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/request")
    public ResponseEntity<BaseResponse<List<FriendRequestListResponse>>> getFriendRequests() {
        User currentUser = userService.getCurrentUser();  // 로그인한 유저 정보 가져오기
        List<FriendRequestListResponse> friendRequests = friendService.getFriendRequests(currentUser);  // 친구 요청 조회
        return ResponseEntity.ok(BaseResponse.success("친구 요청 목록 찾기에 성공했습니다.", friendRequests));  // 친구 요청 목록 반환
    }

    /**
     * 친구 요청 API.
     *
     * 사용자가 특정 닉네임을 가진 사용자에게 친구 요청을 보냅니다.
     *
     * @param token HTTP Authorization 헤더에 포함된 JWT 토큰
     * @param friendRequest 친구 요청 정보 (친구의 닉네임)
     * @return 요청에 대한 성공 메시지와 요청 정보
     */
    @Operation(summary = "친구 요청", description = "특정 닉네임을 가진 사용자에게 친구 요청을 보냅니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "친구 요청 성공"),
            @ApiResponse(responseCode = "404", description = "사용자 또는 친구를 찾을 수 없음"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })

    @PostMapping("/request/{friendNickname}")
    public ResponseEntity<BaseResponse<FriendRequestResponse>> sendFriendRequest(@PathVariable String friendNickname) {
        User currentUser = userService.getCurrentUser();
        friendService.sendFriendRequest(currentUser, friendNickname);
        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(currentUser.getNickname())
                .receiverNickname(friendNickname).build();
        return ResponseEntity.ok(BaseResponse.success("친구 요청을 성공했습니다.", response));
    }

    /**
     * 친구 요청 수락 API.
     *
     * 받은 친구 요청을 수락합니다.
     *
     * @param token HTTP Authorization 헤더에 포함된 JWT 토큰
     * @param acceptRequest 수락 요청 정보 (요청 보낸 사람의 닉네임)
     * @return 요청에 대한 성공 메시지와 요청 정보
     */
    @Operation(summary = "친구 요청 수락", description = "받은 친구 요청을 수락합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "친구 요청 수락 성공"),
            @ApiResponse(responseCode = "404", description = "요청을 보낸 친구를 찾을 수 없음"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
//    @PostMapping("/accept")
//    @Transactional
//    public ResponseEntity<BaseResponse<FriendRequestResponse>> acceptFriendRequest(@RequestHeader("Authorization") String token, @RequestBody FriendAcceptRequest acceptRequest) {
//        String username = jwtTokenUtil.extractUsername(token.substring(7));
//        User user = userService.getUserByUserName(username);
//        friendService.acceptFriendRequest(user, acceptRequest.getSenderNickname());
//        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(acceptRequest.getSenderNickname())
//                .receiverNickname(user.getNickname()).build();
//        return ResponseEntity.ok(BaseResponse.success("친구 요청을 수락했습니다.", response));
//    }

    @PostMapping("/accept/{senderNickname}")
    @Transactional
    public ResponseEntity<BaseResponse<FriendRequestResponse>> acceptFriendRequest(@PathVariable String senderNickname) {
        User currentUser = userService.getCurrentUser();
        friendService.acceptFriendRequest(currentUser, senderNickname);
        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(senderNickname)
                .receiverNickname(currentUser.getNickname()).build();
        return ResponseEntity.ok(BaseResponse.success("친구 요청을 수락했습니다.", response));
    }

    /**
     * 친구 삭제 API.
     *
     * 특정 친구와의 친구 관계를 삭제합니다.
     *
     * @param token HTTP Authorization 헤더에 포함된 JWT 토큰
     * @param friendRequest 삭제할 친구의 닉네임 정보
     * @return 삭제에 대한 성공 메시지
     */
    @Operation(summary = "친구 삭제", description = "특정 친구와의 친구 관계를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "친구 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "친구를 찾을 수 없음"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
//    @DeleteMapping("/delete")
//    @Transactional
//    public ResponseEntity<BaseResponse<FriendRequestResponse>> removeFriend(@RequestHeader("Authorization") String token, @RequestBody FriendRequest friendRequest) {
//        String username = jwtTokenUtil.extractUsername(token.substring(7));
//        User user = userService.getUserByUserName(username);
//        friendService.removeFriend(user, friendRequest.getFriendNickname());
//        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(user.getNickname())
//                .receiverNickname(friendRequest.getFriendNickname()).build();
//        return ResponseEntity.ok(BaseResponse.success("삭제에 성공했습니다.", response));
//    }
    @DeleteMapping("/{friendNickname}")
    public ResponseEntity<BaseResponse<FriendRequestResponse>> removeFriend(@PathVariable String friendNickname) {
        User currentUser = userService.getCurrentUser();
        friendService.removeFriend(currentUser, friendNickname);
        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(currentUser.getNickname())
                .receiverNickname(friendNickname).build();
        return ResponseEntity.ok(BaseResponse.success("삭제에 성공했습니다.", response));
    }

}