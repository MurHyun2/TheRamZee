package com.gradation.backend.game.service.impl;

import com.gradation.backend.common.utill.RedisUtil;
import com.gradation.backend.game.model.response.*;
import com.gradation.backend.game.service.GameService;
import com.gradation.backend.openvidu.service.OpenViduService;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final RedisUtil redisUtil;
    private final OpenViduService openViduService;

    /**
     * 방 초기화 (시작하기 클릭 시)
     *
     * @param roomId 해당 방의 Id
     * @param nicknames 모든 참가자의 닉네임
     * @return 방의 전체 정보를 담은 RoomInitializationResponse 객체
     */
    public RoomInitializationResponse initializeRoomStructure(int roomId, List<String> nicknames)
            throws OpenViduJavaClientException, OpenViduHttpException {
        RoomInitializationResponse responseDto = new RoomInitializationResponse();

        Map<String, UserResponse> usersData = new HashMap<>();
        Map<String, ForestResponse> forestsData = new HashMap<>();

        // 1. Room 기본 정보 저장
        String roomKey = "ROOM:" + roomId;

        // RoomKey 아래 모든 데이터 초기화
        redisUtil.del(roomKey + "*");

        // 2. Users 데이터 추가 + 각 유저가 현재 위치한 숲 정보 표시( 지금은 로비라서 1)
        Random random = new Random();
        String evilSquirrelNickname = nicknames.get(random.nextInt(nicknames.size()));

        for (String nickname : nicknames) {
            String userKey = roomKey + ":USER:" + nickname;
            UserResponse userData = new UserResponse();

            //토큰 재발급
            String token = openViduService.generateToken(roomId+ "-1", nickname);

            userData.setNickname(nickname);
            userData.setAlive(true);
            userData.setAcorns(0);
            userData.setSaveAcorns(0);
            userData.setFatigue(0);
            userData.setForestToken(token);
            userData.setForestNum(1);
            userData.setVote(0);
            userData.setLastVote(0);
            userData.setEvilSquirrel(nickname.equals(evilSquirrelNickname));

            // Redis Hash로 저장
            Map<String, Object> userDataMap = convertToMap(userData);
            userDataMap.forEach((field, value) -> redisUtil.hset(userKey, field, value));
            usersData.put(userKey, userData);
        }
        responseDto.setUsers(usersData);

        // 3. Forests 데이터 추가
        for (int forestNum = 1; forestNum <= 7; forestNum++) {
            String forestKey = roomKey + ":FOREST:" + forestNum;
            ForestResponse forestData = new ForestResponse();

            if (forestNum == 1) {
                forestData.setEmergencyPossible(true);
                forestData.setTotalAcorns(0);
                forestData.setTotalVote(0);
                forestData.setTotalLastVote(0);
                forestData.setCount(nicknames.size());
                forestData.setEvilSquirrelNickname(evilSquirrelNickname);
            } else {
                forestData.setMission1(new MissionData(false, 1));
                forestData.setMission2(new MissionData(false, 1));
                forestData.setMission3(new MissionData(false, 1));
            }

            // Redis Hash로 저장
            Map<String, Object> forestDataMap = convertToMap(forestData);
            forestDataMap.forEach((field, value) -> redisUtil.hset(forestKey, field, value));
            forestsData.put(forestKey, forestData);
        }
        responseDto.setForests(forestsData);

        Map<Integer, List<String>> forestUsers = getForestUserMap(roomId, nicknames);
        responseDto.setForestUsers(forestUsers);

        Long serverTime = Instant.now().toEpochMilli();
        responseDto.setServerTime(serverTime);

        return responseDto;
    }

    // DTO 객체를 Map으로 변환하는 유틸리티 메서드
    private Map<String, Object> convertToMap(Object dto) {
        Map<String, Object> map = new HashMap<>();
        for (Field field : dto.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                map.put(field.getName(), field.get(dto));
            } catch (IllegalAccessException e) {
            }
        }
        return map;
    }

    /**
     * 미션 데이터 value값 사용자 정의
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MissionData {
        private boolean isCompleted;
        private int acornReward;
    }

    /**
     * 긴급 상황 처리
     *
     * @param roomId 해당 방의 Id
     * @param nicknames 모든 참가자의 닉네임
     * @return 모든 사용자의 닉네임과 새로운 토큰 값을 담은 EmergencyResponse 객체
     */
    public EmergencyResponse emergency(int roomId, List<String> nicknames, String voter) throws OpenViduJavaClientException, OpenViduHttpException {
        String roomKey = "ROOM:" + roomId;
        String forestKey = roomKey + ":FOREST:1";

        for (String nickname : nicknames) {
            String userKey = roomKey + ":USER:" + nickname;

            if (nickname != null) {
                redisUtil.hset(userKey, "forestNum", 1);
            }
        }

        // 앞으로 긴급 불가능
        redisUtil.hset(forestKey, "emergencyPossible", false);

        // EmergencyResponse 객체 생성 및 반환
        EmergencyResponse response = new EmergencyResponse();

        Map<Integer, List<String>> forestUsers = getForestUserMap(roomId, nicknames);
        response.setForestUsers(forestUsers);
        response.setVoter(voter);

        Long serverTime = Instant.now().toEpochMilli();
        response.setServerTime(serverTime);

        return response;
    }

    /**
     * 특정 유저가 특정 숲으로 이동
     *
     * @param roomId 해당 방의 Id
     * @param nickname 유저 닉네임
     * @param newForest 새로운 forestToken 값
     * @return MoveForestResponse 객체 (유저 닉네임과 새로운 forestToken)
     */
    public MoveForestResponse moveForest(int roomId, String nickname, int newForest, List<String> nicknames) throws OpenViduJavaClientException, OpenViduHttpException {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;
        int forestNum = newForest;

        redisUtil.hset(userKey, "forestNum", forestNum);

        // 최신 숲별 유저 정보 조회
        Map<Integer, List<String>> forestUsers = getForestUserMap(roomId, nicknames);

        // MoveForestResponse 객체 생성 및 반환
        return new MoveForestResponse(nickname, forestNum, forestUsers);
    }

    /**
     * 방의 숲별 유저 정보를 조회하여 반환
     */
    public Map<Integer, List<String>> getForestUserMap(int roomId, List<String> nicknames) {
        String roomKey = "ROOM:" + roomId;
        Map<Integer, List<String>> forestUsers = new HashMap<>();

        for (int forestNum = 1; forestNum <= 7; forestNum++) {
            List<String> userList = new ArrayList<>();
    
            for (String nickname: nicknames){
                String userKey = roomKey + ":USER:" + nickname;
                Object userForestNumObj = redisUtil.hget(userKey, "forestNum");
                Integer userForestNum = (Integer) userForestNumObj;

                if (userForestNum != null && userForestNum == forestNum) {
                    if (nickname != null) {
                        userList.add(nickname);
                    }
                }
            }
            forestUsers.put(forestNum, userList);
        }
        return forestUsers;
    }

    /**
     * 결과 처리
     *
     * @param roomId: 해당 방의 Id
     * @param nicknames: 유저 nickname리스트
     * @return 유저의 acorns 값
     */
    public ResultResponse result(int roomId, List<String> nicknames) {
        String roomKey = "ROOM:" + roomId;
        Map<String, Integer> resultsData = new HashMap<>();

        for (String nickname: nicknames) {
            String userKey = roomKey + ":USER:" + nickname;
            Object isEvilSquirrelObj = redisUtil.hget(userKey, "isEvilSquirrel");
            Object saveAcornsObj = redisUtil.hget(userKey, "saveAcorns");

            boolean isEvilSquirrel = (boolean) isEvilSquirrelObj;
            int saveAcorns = (Integer) saveAcornsObj;

            if (isEvilSquirrel) {
                resultsData.put(nickname, -1);
            } else {
                resultsData.put(nickname, saveAcorns);
            }
        }
        ResultResponse response = new ResultResponse();
        response.setResults(resultsData);

        return response;
    }

    /**
     * 특정 유저의 acorns값을 공용 저장소에 저장
     * 특정 유저의 acorns값 0으로 초기화
     *
     * @param roomId: 해당 방의 Id
     * @param nickname: 유저 닉네임
     * @return SaveUserAcornsResponse 객체 (유저 닉네임, 새로운 totalAcorns 값, 유저가 저장한 acorns 값)
     */
    public SaveUserAcornsResponse saveUserAcorns(int roomId, String nickname) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;
        String forestKey = roomKey + ":FOREST:1";

        // 유저의 현재 acorns 값 가져오기
        Integer currentAcorns = (Integer) redisUtil.hget(userKey, "acorns");

        // 유저가 저장한 acorns 값 저장하기
        Integer currentSaveAcorns = (Integer) redisUtil.hget(userKey, "saveAcorns") ;
        int newSaveAcorns = currentSaveAcorns + currentAcorns;
        redisUtil.hset(userKey, "saveAcorns", newSaveAcorns);

        // 유저의 acorns를 0으로 초기화
        redisUtil.hset(userKey, "acorns", 0);

        // 방의 totalAcorns 업데이트
        Integer totalAcorns = (Integer) redisUtil.hget(forestKey, "totalAcorns");
        int newTotalAcorns = totalAcorns + currentAcorns;
        redisUtil.hset(forestKey, "totalAcorns", newTotalAcorns);

        // SaveUserAcornsResponse 객체 생성 및 반환
        return new SaveUserAcornsResponse(nickname, newTotalAcorns, currentAcorns);
    }

    /**
     * 특정 유저의 fatigue 값을 1충전
     *
     * @param roomId: 해당 방의 Id
     * @param nickname: 유저 닉네임
     * @return IncrementUserFatigueResponse 객체 (유저 닉네임, 증가된 fatigue 값)
     */
    public IncrementUserFatigueResponse incrementUserFatigue(int roomId, String nickname) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;

        // 사용자의 현재 fatigue 값 가져오기
        Object fatigueObj = redisUtil.hget(userKey, "fatigue");

        // fatigue 값을 1 증가시킴
        int currentFatigue = (Integer) fatigueObj;
        int newFatigue = currentFatigue + 1;

        // 증가된 fatigue 값을 Redis에 저장
        redisUtil.hset(userKey, "fatigue", newFatigue);

        // IncrementUserFatigueResponse 객체 생성 및 반환
        return new IncrementUserFatigueResponse(nickname, newFatigue);
    }

    /**
     * 특정 유저의 alive 상태를 죽음 상태로 변경
     * 나의 피로도 3 차감
     *
     * @param roomId: 해당 방의 Id
     * @param victimNickname: 살해자 닉네임
     * @param killerNickname: 살인자 닉네임
     * @return KillResponse 객체 (살해자 닉네임, 살해자의 새로운 피로도, 살해당한 유저의 닉네임)
     */
    public KillResponse Kill(int roomId, String victimNickname, String killerNickname) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + victimNickname;
        String myKey = roomKey + ":USER:" + killerNickname;

        // alive 상태를 false로 설정
        redisUtil.hset(userKey, "alive", false);

        // 살해자의 피로도 값 3 차감
        Object fatigueObj = redisUtil.hget(myKey, "fatigue");
        int currentFatigue = (Integer) fatigueObj;
        int newFatigue = currentFatigue - 3;

        // 새로운 fatigue 값을 Redis에 저장
        redisUtil.hset(myKey, "fatigue", newFatigue);

        // KillResponse 객체 생성 및 반환
        return new KillResponse(killerNickname, newFatigue, victimNickname);
    }

    /**
     * 특정 forest의 특정 mission 상태를 완료로 변경
     * 보상을 유저에게 지급
     * 유저의 피로도 -1
     *
     * @param roomId: 해당 방의 Id
     * @param forestNum: forest 번호 (2-7)
     * @param missionNum: mission 번호 (1-3)
     * @param nickname: 보상을 받을 유저 닉네임(1-6)
     * @return CompleteMissionResponse 객체
     */
    public CompleteMissionResponse completeMission(int roomId, int forestNum, int missionNum, String nickname) {
        String roomKey = "ROOM:" + roomId;
        String forestKey = roomKey + ":FOREST:" + forestNum;

        String userKey = roomKey + ":USER:" + nickname;
        String missionKey = "mission" + missionNum;

        // 1. 미션 데이터 조회
        MissionData missionData = (MissionData) redisUtil.hget(forestKey, missionKey);

        // 2. 보상 획득 및 미션 상태 업데이트
        int reward = missionData.getAcornReward();
        missionData.setCompleted(true);

        // 3. 업데이트된 미션 데이터 저장
        redisUtil.hset(forestKey, missionKey, missionData);

        // 4. 유저의 acorns 업데이트
        Integer currentAcorns = (Integer) redisUtil.hget(userKey, "acorns");
        int newAcorns = currentAcorns + reward;
        redisUtil.hset(userKey, "acorns", newAcorns);

        // 5. 유저의 피로도 업데이트
        Integer currentFatigue = (Integer) redisUtil.hget(userKey, "fatigue");
        int newFatigue = Math.max(currentFatigue - 1, 0);  // 피로도가 음수가 되지 않도록 함
        redisUtil.hset(userKey, "fatigue", newFatigue);

        // 6. CompleteMissionResponse 객체 생성 및 반환
        return new CompleteMissionResponse(nickname, forestNum, missionNum, reward, newAcorns);
    }

    /**
     * 각 유저에 대한 투표 결과 처리
     *
     * @param roomId
     * @param nickname
     * @return VoteResponse 객체
     */
    public VoteResponse vote(int roomId, String nickname) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;
        String forestKey = roomKey + ":FOREST:1";

        Object voteNumObj = redisUtil.hget(userKey, "vote");
        int voteNum = (Integer) voteNumObj + 1;

        Object totalVoteObj = redisUtil.hget(forestKey, "totalVote");
        int totalVote = (Integer) totalVoteObj + 1;

        redisUtil.hset(userKey, "vote", voteNum);
        redisUtil.hset(forestKey, "totalVote", totalVote);

        Long serverTime = Instant.now().toEpochMilli();

        return new VoteResponse(nickname, voteNum, totalVote, serverTime);
    }

    public VoteResponse lastVote (int roomId, String nickname) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;
        String forestKey = roomKey + ":FOREST:1";

        Object voteNumObj = redisUtil.hget(userKey, "lastVote");
        int voteNum = (Integer) voteNumObj + 1;

        Object totalVoteObj = redisUtil.hget(forestKey, "totalLastVote");
        int totalVote = (Integer) totalVoteObj + 1;

        redisUtil.hset(userKey, "lastVote", voteNum);
        redisUtil.hset(forestKey, "totalLastVote", totalVote);

        Long serverTime = Instant.now().toEpochMilli();

        return new VoteResponse(nickname, voteNum, totalVote, serverTime);
    }

}


