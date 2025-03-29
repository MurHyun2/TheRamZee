package com.gradation.backend.game.model.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class RoomInitializationResponse {
    Map<Integer, List<String>> forestUsers;
    private Map<String, UserResponse> users;
    private Map<String, ForestResponse> forests;
    private Long serverTime;
}