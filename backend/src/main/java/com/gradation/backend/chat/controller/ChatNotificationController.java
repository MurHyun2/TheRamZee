package com.gradation.backend.chat.controller;

import com.gradation.backend.chat.model.request.ChatUserRequest;
import com.gradation.backend.chat.model.response.CountResponse;
import com.gradation.backend.chat.model.response.MessageResponse;
import com.gradation.backend.chat.model.response.UnreadMessageResponse;
import com.gradation.backend.chat.service.ChatMessageService;
import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 1:1 채팅 알림 관리를 위한 컨트롤러 클래스.
 *
 * 이 컨트롤러는 1:1 채팅 메시지의 읽지 않은 메시지 개수 조회, 메시지 읽음 처리,
 * 채팅 기록 조회 등의 API를 제공합니다.
 */
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Tag(name = "1:1 채팅", description = "1:1 채팅 메시지 알림 관리 API")
public class ChatNotificationController {

    private final ChatMessageService chatMessageService;
    private final UserService userService;

    /**
     * 읽지 않은 메시지 개수를 조회합니다.
     *
     * @param receiver 메시지 닉네임
     * @return 읽지 않은 메시지의 개수
     */
    @Operation(summary = "읽지 않은 메시지 수 조회",
            description = "특정 사용자 간의 읽지 않은 메시지의 개수를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "읽지 않은 메시지 수 조회 성공"),
            @ApiResponse(responseCode = "400", description = "요청 파라미터가 잘못되었음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/unread-count")
    public ResponseEntity<BaseResponse<List<UnreadMessageResponse>>> getUnreadCount(@RequestParam String receiver) {
        List<UnreadMessageResponse> unreadCounts = chatMessageService.getUnreadCountsForReceiver(receiver);

        // 응답 반환
        return ResponseEntity.ok(BaseResponse.success("읽지 않은 메시지 목록입니다.", unreadCounts));
    }

    /**
     * 메시지를 읽음 상태로 업데이트합니다.
     *
     * @param chatUserRequest   메시지 송신자의  닉네임, 수신자의 닉네임
     * @return HTTP 상태 코드 204(No Content) - 성공적으로 처리됨을 나타냅니다.
     */
    @Operation(summary = "메시지를 읽음 처리",
            description = "특정 사용자와의 대화에서 읽지 않은 메시지를 읽음 상태로 만듭니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "읽음 처리 성공 (내용 없음)"),
            @ApiResponse(responseCode = "400", description = "요청 파라미터가 잘못되었음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PutMapping("/mark-as-read")
    public ResponseEntity<Void> markAsRead(@RequestBody ChatUserRequest chatUserRequest) {
        chatMessageService.markMessagesAsRead(chatUserRequest.getSender(), chatUserRequest.getReceiver());
        return ResponseEntity.noContent().build();
    }

    /**
     * 특정 사용자 간의 채팅 기록을 조회합니다.
     *
     * @param sender   메시지 송신자의 ID 또는 닉네임
     * @param receiver 메시지 수신자의 ID 또는 닉네임
     * @return 송신자와 수신자 간의 채팅 기록 (메시지 리스트)
     */

    @Operation(summary = "채팅 기록 조회", description = "특정 사용자 간의 채팅 기록을 반환합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "채팅 기록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/history")
    public ResponseEntity<BaseResponse<List<MessageResponse>>> getChatHistory(@RequestParam String sender, @RequestParam String receiver) {
        // Redis에서 채팅 기록 조회
        List<String> chatHistory = chatMessageService.getMessages(sender, receiver);
        // 채팅 기록 문자열을 MessageResponse 객체로 변환
        List<MessageResponse> messageResponses = chatHistory.stream()
                .map(message -> {
                    String[] parts = message.split(": ", 2); // "sender: content" 형식에서 파싱
                    String messageSender = parts[0];
                    String content = parts[1];
                    return new MessageResponse(messageSender, content);
                })
                .toList();
        // 성공 응답 반환
        return ResponseEntity.ok(BaseResponse.success("메시지 기록을 조회했습니다.", messageResponses));
    }
}
