CREATE TABLE IF NOT EXISTS `chatMember` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `chatId` INT,
    `userId` INT,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
