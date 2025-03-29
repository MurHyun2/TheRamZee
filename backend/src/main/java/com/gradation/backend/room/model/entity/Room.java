package com.gradation.backend.room.model.entity;

import com.gradation.backend.user.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "room")
public class Room {

    @Id
    @Column(name = "id", columnDefinition = "INT UNSIGNED")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String title;

    @Column(nullable = true)
    private Integer password;

    @Column(name = "game_status", nullable = false)
    private Boolean gameStatus;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", foreignKey = @ForeignKey(name = "fk_user_name"), nullable = false, columnDefinition = "INT UNSIGNED")
    private User host;

    @OneToMany(mappedBy = "room", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();

    /**
     * 참여자 추가
     *
     * @param user
     */
    public void addUser(User user) {
        this.users.add(user);
        user.setRoom(this);   // 양방향 동기화
    }

    /**
     * 방 생성 메서드 (호스트 자동 참가)
     *
     * @param title
     * @param password
     * @param host
     * @return Room
     */
    public static Room createRoom(String title, Integer password, User host) {
        Room room = new Room();
        room.setTitle(title);
        room.setPassword(password);
        room.setGameStatus(false);
        room.setHost(host);
        room.addUser(host);

        return room;
    }

    /**
     * 참여자 제거 메서드 (양방향 연관관계 유지)
     *
     * @param user
     */
    public void removeUser(User user) {
        users.remove(user);
        user.setRoom(null);
    }
}
