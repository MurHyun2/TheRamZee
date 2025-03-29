package com.gradation.backend.game.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaveUserAcornsResponse {
    private String nickname;
    private int newTotalAcorns;
    private int userAcorns;
}