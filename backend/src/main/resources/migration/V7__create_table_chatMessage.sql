CREATE TABLE IF NOT EXISTS `chatMessage` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `chatMemberId` INT,
    `message` TEXT,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
