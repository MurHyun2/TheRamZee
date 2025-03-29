package com.gradation.backend.game.service;

import com.gradation.backend.game.model.response.*;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import java.util.*;

public interface GameService {

    RoomInitializationResponse initializeRoomStructure(int roomId, List<String> nicknames) throws OpenViduJavaClientException, OpenViduHttpException;

    EmergencyResponse emergency(int roomId, List<String> nicknames, String voter) throws OpenViduJavaClientException, OpenViduHttpException;

    MoveForestResponse moveForest(int roomId, String nickname, int newForest, List<String> nicknames) throws OpenViduJavaClientException, OpenViduHttpException;

    ResultResponse result(int roomId, List<String> nicknames);

    /**
     * 특정 유저의 도토리를 공용 저장소에 저장하고 초기화
     *
     * @param roomId 해당 방의 Id
     * @param nickname 유저 닉네임
     * @return SaveUserAcornsResponse 객체 (유저 닉네임, 새로운 totalAcorns 값, 저장한 acorns 값)
     */
    SaveUserAcornsResponse saveUserAcorns(int roomId, String nickname);

    /**
     * 특정 유저의 피로도를 증가시킴
     *
     * @param roomId 해당 방의 Id
     * @param nickname 유저 닉네임
     * @return IncrementUserFatigueResponse 객체 (유저 닉네임과 증가된 fatigue 값)
     */
    IncrementUserFatigueResponse incrementUserFatigue(int roomId, String nickname);

    /**
     * 특정 유저를 죽음 상태로 변경하고 살해자의 피로도를 감소시킴
     *
     * @param roomId 해당 방의 Id
     * @param victimNickname 살해당한 유저 닉네임
     * @param killerNickname 살해한 유저 닉네임
     * @return KillResponse 객체 (살해자 닉네임, 새로운 피로도 값, 살해당한 유저 닉네임)
     */
    KillResponse Kill(int roomId, String victimNickname, String killerNickname);

    /**
     * 특정 미션을 완료 상태로 변경하고 보상을 지급함
     *
     * @param roomId 해당 방의 Id
     * @param forestNum 숲 번호 (2-7)
     * @param missionNum 미션 번호 (1-3)
     * @param nickname 보상을 받을 유저 닉네임
     * @return CompleteMissionResponse 객체 (미션 완료 정보와 보상 내용)
     */
    CompleteMissionResponse completeMission(int roomId, int forestNum, int missionNum, String nickname);

    /**
     * 각 유저에 대한 투표 결과 처리
     *
     * @param roomId
     * @param nickname
     * @return VoteResponse 객체
     */
    VoteResponse vote(int roomId, String nickname);

    VoteResponse lastVote(int roomId, String nickname);
}


