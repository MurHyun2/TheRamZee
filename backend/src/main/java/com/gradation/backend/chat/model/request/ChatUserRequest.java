package com.gradation.backend.chat.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChatUserRequest {
    String sender;
    String receiver;
}
