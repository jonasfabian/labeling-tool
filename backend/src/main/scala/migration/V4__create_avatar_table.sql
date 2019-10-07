CREATE TABLE IF NOT EXISTS `avatar` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT,
    `avatar` BLOB,
    PRIMARY KEY (`id`),
    UNIQUE KEY userId (`userId`)
) ENGINE = InnoDB;
