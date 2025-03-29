-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS gradation_db;
USE gradation_db;

-- User 테이블
CREATE TABLE IF NOT EXISTS user (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
    room_id INT UNSIGNED NULL,
    login_root VARCHAR(10) NOT NULL,
    user_status BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

-- Room 테이블
CREATE TABLE IF NOT EXISTS room (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NULL,
    password INT NULL,
    host_id INT UNSIGNED NOT NULL,
    game_status BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_name FOREIGN KEY (host_id) REFERENCES user(id) ON DELETE CASCADE
);

-- User 테이블 외래 키 추가
ALTER TABLE user
ADD CONSTRAINT fk_user_room FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE SET NULL;

-- Friends 참가자 테이블
CREATE TABLE IF NOT EXISTS friends (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    friends_id INT UNSIGNED NOT NULL,
    status ENUM('REQUESTED', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'REQUESTED',
    PRIMARY KEY (id),
    CONSTRAINT fk_friends_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_friends_friend FOREIGN KEY (friends_id) REFERENCES user(id) ON DELETE CASCADE
);
