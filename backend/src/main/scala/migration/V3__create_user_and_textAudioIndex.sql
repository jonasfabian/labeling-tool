CREATE TABLE IF NOT EXISTS `userAndTextAudioIndex` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT,
    `textAudioIndexId` INT,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
