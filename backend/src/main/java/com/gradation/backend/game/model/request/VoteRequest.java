package com.gradation.backend.game.model.request;

import lombok.Data;

@Data
public class VoteRequest {
    private int roomId;
    private String nickname;
}