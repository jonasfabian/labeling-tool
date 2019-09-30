CREATE TABLE IF NOT EXISTS `recordings` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `text` MEDIUMTEXT CHARACTER SET utf8,
    `userId` INT NOT NULL,
    `audio` BLOB,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
