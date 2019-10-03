CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR (100),
    `lastName` VARCHAR (100),
    `email` VARCHAR (100),
    `username` VARCHAR(100),
    `avatarVersion` INT,
    `password` VARCHAR (100),
    `canton` VARCHAR(45),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB;
