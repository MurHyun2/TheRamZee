package com.gradation.backend.game.model.request;

import lombok.Data;

@Data
public class getUserFatigueRequest {
    private int roomId;
    private int userNum;
}

