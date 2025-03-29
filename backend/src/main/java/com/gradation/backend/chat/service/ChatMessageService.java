package com.gradation.backend.chat.service;

import com.gradation.backend.chat.model.response.UnreadMessageResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChatMessageService {

    String generateChatKey(String sender, String receiver);
    String generateUnreadKey(String sender, String receiver);
    void saveMessage(String sender, String receiver, String content);
    List<String> getMessages(String sender, String receiver);
    Long getUnreadCount(String sender, String receiver);
    void markMessagesAsRead(String sender, String receiver);
    List<UnreadMessageResponse> getUnreadCountsForReceiver(String receiver);
}
