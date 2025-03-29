package com.gradation.backend.game.model.request;

import lombok.Data;

import java.util.List;

@Data
public class VoteResetRequest {
    private int roomId;
    private List<String> nicknames;
}