package com.gradation.backend.room.model.response;

import com.gradation.backend.user.model.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomFollowReesponse {
    private Long roomId;
    private String title;
    private Boolean gameStatus;
    private UserDto host;
    private String token;
}
