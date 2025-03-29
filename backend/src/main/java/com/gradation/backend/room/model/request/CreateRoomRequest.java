package com.gradation.backend.room.model.request;

import lombok.Data;

@Data
public class CreateRoomRequest {
        private String title;        // 방 제목
        private Integer password;       // 방 비밀번호 (없으면 null)
}

