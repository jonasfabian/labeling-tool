SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE =
        'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE TABLE IF NOT EXISTS `textAudio`
(
    `id`         BIGINT NOT NULL AUTO_INCREMENT,
    `audioStart` FLOAT  NOT NULL,
    `audioEnd`   FLOAT  NOT NULL,
    `text`       MEDIUMTEXT,
    `fileId`     BIGINT NOT NULL,
    `speaker`    VARCHAR(45),
    `labeled`    BIGINT default 0,
    `correct`    BIGINT default 0,
    `wrong`      BIGINT default 0,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `speaker`
(
    `id`           BIGINT      NOT NULL AUTO_INCREMENT,
    `speakerId`    VARCHAR(45) NOT NULL,
    `sex`          VARCHAR(45) NOT NULL,
    `languageUsed` VARCHAR(45),
    `dialect`      VARCHAR(45),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `user`
(
    `id`            BIGINT NOT NULL AUTO_INCREMENT,
    `firstName`     VARCHAR(100),
    `lastName`      VARCHAR(100),
    `email`         VARCHAR(100),
    `username`      VARCHAR(100),
    `avatarVersion` BIGINT,
    `password`      VARCHAR(100),
    `canton`        VARCHAR(45),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `recordings`
(
    `id`     BIGINT NOT NULL AUTO_INCREMENT,
    `text`   MEDIUMTEXT CHARACTER SET utf8,
    `userId` INT    NOT NULL,
    `audio`  BLOB,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `userAndTextAudio`
(
    `id`          BIGINT NOT NULL AUTO_INCREMENT,
    `userId`      VARCHAR(100),
    `textAudioId` VARCHAR(100),
    `time`        VARCHAR(100),
    PRIMARY KEY (`id`),
    CONSTRAINT uni UNIQUE (userId, textAudioId)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `avatar`
(
    `id`     BIGINT NOT NULL AUTO_INCREMENT,
    `userId` INT,
    `avatar` BLOB,
    PRIMARY KEY (`id`),
    UNIQUE KEY userId (`userId`)
) ENGINE = InnoDB;
