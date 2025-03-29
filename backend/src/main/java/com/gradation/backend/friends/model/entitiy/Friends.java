package com.gradation.backend.friends.model.entitiy;

import com.gradation.backend.user.model.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "friends")
public class Friends {

    @Id
    @Column(name = "id", columnDefinition = "INT UNSIGNED")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_friends_user"), nullable = false)
    private User user; // User와의 다대일 관계

    @ManyToOne
    @JoinColumn(name = "friends_id", foreignKey = @ForeignKey(name = "fk_friends_friend"), nullable = false)
    private User friend;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('REQUESTED', 'ACCEPTED', 'REJECTED')")
    private FriendStatus status;

    public Friends(User receiver, User sender, FriendStatus friendStatus) {
        this.user = receiver;
        this.friend = sender;
        this.status = friendStatus;
    }

    public Friends() {

    }
}
