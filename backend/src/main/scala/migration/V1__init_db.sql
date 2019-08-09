SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE TABLE IF NOT EXISTS `textAudioIndex` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `samplingRate` INT,
    `textStartPos` INT,
    `textEndPos` INT,
    `audioStartPos` DOUBLE,
    `audioEndPos` DOUBLE,
    `speakerKey` INT,
    `labeled` INT default 0,
    `correct` INT default 0,
    `wrong` INT default 0,
    `transcript_file_id` INT,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `transcript` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `text` MEDIUMTEXT CHARACTER SET utf8,
    `fileId` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `audio` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(200),
    `fileId` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
