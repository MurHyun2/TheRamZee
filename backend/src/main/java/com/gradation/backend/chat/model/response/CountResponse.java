package com.gradation.backend.chat.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CountResponse {
    private Long unreadCount;
}
