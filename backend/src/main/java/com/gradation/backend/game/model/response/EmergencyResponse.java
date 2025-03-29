package com.gradation.backend.game.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
public class EmergencyResponse {
    Map<Integer, List<String>> forestUsers;
    private Long serverTime;
    String voter;
}
