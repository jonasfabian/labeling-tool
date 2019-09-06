CREATE TABLE IF NOT EXISTS `chat` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `chatName` VARCHAR(100),
    PRIMARY KEY (`id`),
    UNIQUE KEY `chatName` (`chatName`)
) ENGINE = InnoDB;
