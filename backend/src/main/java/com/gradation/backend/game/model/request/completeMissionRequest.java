package com.gradation.backend.game.model.request;

import lombok.Data;

@Data
public class completeMissionRequest {
    private int roomId;
    private int forestNum;
    private int missionNum;
    private String nickname;
}