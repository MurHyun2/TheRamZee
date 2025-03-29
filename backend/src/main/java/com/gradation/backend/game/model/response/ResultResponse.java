package com.gradation.backend.game.model.response;

import lombok.Data;

import java.util.Map;

@Data
public class ResultResponse {
    private Map<String, Integer> results;
}
