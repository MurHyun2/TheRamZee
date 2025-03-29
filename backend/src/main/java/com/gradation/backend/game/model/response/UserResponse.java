package com.gradation.backend.game.model.response;

import lombok.Data;

@Data
public class UserResponse {
    private String nickname;
    private boolean alive;
    private int acorns;
    private int saveAcorns;
    private int fatigue;
    private String forestToken;
    private int forestNum;
    private int vote;
    private int lastVote;
    private boolean isEvilSquirrel;
}
