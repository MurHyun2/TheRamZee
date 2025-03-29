package com.gradation.backend.chat.controller;

import com.gradation.backend.chat.model.entity.ChatMessage;
import com.gradation.backend.chat.service.ChatMessageService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

/**
 * 1:1 채팅 관리를 담당하는 컨트롤러 클래스.
 * 이 클래스는 채팅 메시지 전송 및 채팅 내역 조회와 관련된 API를 제공합니다.
 */
@Controller
@Tag(name = "1:1 채팅 관리", description = "채팅 관리 API")
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    public ChatController(ChatMessageService chatMessageService, SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.chatMessageService = chatMessageService;
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    /**
     * 사용자의 채팅 내역을 조회합니다.
     *
     * 이 메서드는 Redis에서 발신자와 수신자 간의 이전 대화 내역을 조회하고,
     * 해당 내역을 발신자에게 WebSocket을 통해 전송합니다.
     *
     * @param receiver  채팅 내역을 조회할 상대방(수신자)의 사용자 이름
     * @param principal 현재 인증된 사용자의 정보 (발신자)
     */
    @Operation(
            summary = "채팅 내역 조회",
            description = "사용자가 요청한 채팅 내역을 조회하여 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "채팅 내역 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청")
            }
    )
    @MessageMapping("/chat.history")
    @Transactional
    public void loadChatHistory(String receiver, Principal principal) {
        String sender = principal.getName(); // 발신자 정보

        // Redis에서 이전 대화 내역 조회
        List<String> chatHistory = chatMessageService.getMessages(sender, receiver);

        // 조회된 내역을 발신자에게 전송
        messagingTemplate.convertAndSendToUser(
                sender, "/queue/chat-history", chatHistory
        );
    }

    /**
     * 새로운 채팅 메시지를 상대방에게 전송합니다.
     * 이 메서드는 메시지를 Redis에 저장하고, 읽지 않은 메시지 개수를 계산하여 상대방에게 알림과 메시지를 실시간으로 전송합니다.
     *
     * @param chatMessage 전송할 {@link ChatMessage} 객체 (발신자, 수신자, 내용 포함)
     * @param principal   현재 인증된 사용자의 정보 (발신자)
     */
    @Operation(
            summary = "메시지 전송",
            description = "새로운 채팅 메시지를 보내고, 상대방에게 실시간으로 전송합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청")
            }
    )
    @MessageMapping("/chat.send")
    @Transactional
    public void sendMessage(ChatMessage chatMessage, Principal principal) {
        String sender = chatMessage.getSender();

        // 발신자와 수신자의 사용자 정보를 가져옴
        User users = userService.getUserByUserName(sender);
        User user = userService.getUserByUserNickname(chatMessage.getReceiver());
        String receiver = user.getUsername();

        // 메시지를 저장하고 읽지 않은 메시지 개수를 계산
        chatMessageService.saveMessage(users.getNickname(), chatMessage.getReceiver(), chatMessage.getContent());
        Long unreadCount = chatMessageService.getUnreadCount(users.getNickname(), chatMessage.getReceiver());

        // 읽지 않은 메시지가 있는 경우 알림 전송
        if (unreadCount > 0) {
            messagingTemplate.convertAndSend(
                    "/topic/notifications" + receiver,
                    "새로운 메시지가 있습니다 (" + unreadCount + "개)"
            );
        }

        // 메시지를 상대방에게 실시간으로 전송
        messagingTemplate.convertAndSend(
                "/topic/messages/" + receiver + "/" + users.getNickname(),
                chatMessage
        );
    }
}
