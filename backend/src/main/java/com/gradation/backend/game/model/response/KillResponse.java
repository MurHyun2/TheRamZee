package com.gradation.backend.game.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KillResponse {
    private String killerNickname;
    private int killerFatigue;
    private String victimNickname;
}