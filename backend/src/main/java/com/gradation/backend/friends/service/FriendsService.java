package com.gradation.backend.friends.service;

import com.gradation.backend.friends.model.response.FriendRequestListResponse;
import com.gradation.backend.friends.model.response.FriendResponse;
import com.gradation.backend.user.model.entity.User;

import java.util.List;

public interface FriendsService {
    List<FriendResponse> getFriends(Long userId);
    void sendFriendRequest(User sender, String friendNickname);
    void acceptFriendRequest(User receiver, String senderNickname);
    void removeFriend(User currentUser, String friendNickname);
    List<FriendRequestListResponse> getFriendRequests(User currentUser);
}