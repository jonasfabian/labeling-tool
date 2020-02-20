CREATE TABLE user_group
(
    id   BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    PRIMARY KEY (id)
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;

CREATE TABLE user
(
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL,
    username   VARCHAR(100) NOT NULL,
    password   VARCHAR(100) NOT NULL,
    canton     VARCHAR(45)  NOT NULL,
    sex        ENUM ('none','m','f')      DEFAULT 'none',
    licence    ENUM ('public','academic') DEFAULT 'academic',
    enabled    BOOLEAN                    DEFAULT true,
    PRIMARY KEY (id),
    UNIQUE KEY username (username),
    UNIQUE KEY email (email)
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;

CREATE TABLE user_group_role
(
    id            BIGINT NOT NULL AUTO_INCREMENT,
    role          ENUM ('ADMIN', 'GROUP_ADMIN', 'USER'),
    user_id       BIGINT NOT NULL,
    user_group_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_group_id) REFERENCES user_group (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE

) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;

### Recoding/Upload Functionality

CREATE TABLE original_text
(
    id            BIGINT NOT NULL AUTO_INCREMENT,
    user_group_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_group_id) REFERENCES user_group (id) ON DELETE CASCADE
);
CREATE TABLE excerpt
(
    id               BIGINT NOT NULL AUTO_INCREMENT,
    original_text_id BIGINT NOT NULL,
    excerpt          TEXT   NOT NULL,
    isSkipped        INT     DEFAULT 0,
    isPrivate        BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (original_text_id) REFERENCES original_text (id) ON DELETE CASCADE
);
CREATE TABLE recording
(
    id         BIGINT   NOT NULL AUTO_INCREMENT,
    excerpt_id BIGINT   NOT NULL,
    user_id    BIGINT   NOT NULL,
    time       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (excerpt_id) REFERENCES excerpt (id) ON DELETE CASCADE
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;

CREATE TABLE checked_recording
(
    id           BIGINT   NOT NULL AUTO_INCREMENT,
    recording_id BIGINT   NOT NULL,
    user_id      BIGINT   NOT NULL,
    label        ENUM ('SKIPPED', 'CORRECT', 'WRONG'),
    time         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (recording_id) REFERENCES recording (id) ON DELETE CASCADE
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;

### Trancript Import with auto aligned audio etc.

CREATE TABLE speaker
(
    id       BIGINT NOT NULL AUTO_INCREMENT,
    name     VARCHAR(45),
    language VARCHAR(45),
    dialect  VARCHAR(45),
    sex      ENUM ('none','m','f') DEFAULT 'none',
    PRIMARY KEY (id)
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;

CREATE TABLE source
(
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    description    TEXT         NOT NULL,
    name           varchar(45)  NOT NULL,
    raw_audio_path varchar(255) NOT NULL,
    raw_file_path  varchar(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 8
  DEFAULT CHARSET = utf8;

CREATE TABLE text_audio
(
    id           BIGINT NOT NULL AUTO_INCREMENT,
    audio_start  FLOAT  NOT NULL,
    audio_end    FLOAT  NOT NULL,
    text         TEXT   NOT NULL,
    path_to_file varchar(255) DEFAULT NULL,
    speaker_id   BIGINT NOT NULL,
    source_id    BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (speaker_id) REFERENCES speaker (id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES source (id) ON DELETE CASCADE
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;

CREATE TABLE checked_text_audio
(
    id            BIGINT   NOT NULL AUTO_INCREMENT,
    text_audio_id BIGINT   NOT NULL,
    user_id       BIGINT   NOT NULL,
    label         ENUM ('SKIPPED', 'CORRECT', 'WRONG'),
    time          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (text_audio_id) REFERENCES text_audio (id) ON DELETE CASCADE
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;


# password admin
INSERT INTO user(id, first_name, last_name, email, username, password, canton)
VALUES (1, 'admin', 'admin', 'admin', 'admin', '$2a$10$nY/FB8OIhF55Iatu.Vf5Au/mRUnrjYsYU.3yamAxcxZPc4e3Dh1jm', 'ag');
INSERT INTO user_group(id, name) VALUE (1, 'public test group');
INSERT INTO user_group_role(role, user_id, user_group_id)
VALUES ('ADMIN', 1, 1),
       ('GROUP_ADMIN', 1, 1);
