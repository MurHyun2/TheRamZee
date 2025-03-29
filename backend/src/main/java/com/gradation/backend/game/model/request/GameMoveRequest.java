package com.gradation.backend.game.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GameMoveRequest {
    private int roomId;
    private String nickname;
    private int newForest;

    @JsonProperty("nicknames")
    private List<String> nicknames;
}
