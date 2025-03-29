package com.gradation.backend.game.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoveForestResponse {
    private String nickname;
//    private String forestToken;
    private int forestNum;
    private Map<Integer, List<String>> forestUsers;
}
