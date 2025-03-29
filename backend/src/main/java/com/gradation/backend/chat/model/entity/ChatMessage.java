package com.gradation.backend.chat.model.entity;

public class ChatMessage {
    private String sender;   // 발신자
    private String receiver; // 수신자
    private String content;  // 메시지 내용

    // Getter 및 Setter
    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
