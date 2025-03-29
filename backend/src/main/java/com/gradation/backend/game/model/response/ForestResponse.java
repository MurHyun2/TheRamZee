package com.gradation.backend.game.model.response;
import com.gradation.backend.game.service.impl.GameServiceImpl;
import lombok.Data;

@Data
public class ForestResponse {
    private Boolean emergencyPossible;
    private Integer totalAcorns;
    private Integer totalVote;
    private Integer totalLastVote;
    private Integer count;
    private String evilSquirrelNickname;
    private GameServiceImpl.MissionData mission1;
    private GameServiceImpl.MissionData mission2;
    private GameServiceImpl.MissionData mission3;
}
