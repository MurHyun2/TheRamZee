package com.gradation.backend.user.model.entity;
import com.gradation.backend.friends.model.entitiy.Friends;
import com.gradation.backend.room.model.entity.Room;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "user")
public class User{

    @Id
    @Column(name = "id", columnDefinition = "INT UNSIGNED")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String username;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 10, unique = true)
    private String nickname;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String email;

    @Column(name = "login_root", nullable = false, length = 10)
    private String loginRoot;

    @Column(name = "user_status", nullable = false)
    private Boolean userStatus;

    @ManyToOne
    @JoinColumn(name = "room_id", foreignKey = @ForeignKey(name = "FK_User_Room"), columnDefinition = "INT UNSIGNED")
    private Room room;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friends> friends;
}
