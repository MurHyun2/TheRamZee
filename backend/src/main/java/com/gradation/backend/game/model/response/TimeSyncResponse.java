package com.gradation.backend.game.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TimeSyncResponse {
    private Long serverTime;
}
