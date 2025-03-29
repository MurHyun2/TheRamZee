package com.gradation.backend.game.model.request;

import lombok.Data;

import java.util.Stack;

@Data
public class chargeFatigueRequest {
    private int roomId;
    private String nickname;
}
