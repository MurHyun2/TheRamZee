package com.gradation.backend.game.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompleteMissionResponse {
    private String nickname;
    private int forestNum;
    private int missionNum;
    private int acornReward;
    private int userAcorns;
}