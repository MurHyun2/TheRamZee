package com.gradation.backend.friends.service;

import com.gradation.backend.room.model.response.RoomFollowReesponse;
import com.gradation.backend.user.model.entity.User;

public interface FollowService {
    RoomFollowReesponse joinRoomByFriend(User currentUser, String friendNickname);
}