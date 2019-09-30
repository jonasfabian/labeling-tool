CREATE TABLE IF NOT EXISTS `userAndTextAudioIndex` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT,
    `textAudioIndexId` INT,
    `time` TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT uni UNIQUE (userId, textAudioIndexId)
) ENGINE = InnoDB;
