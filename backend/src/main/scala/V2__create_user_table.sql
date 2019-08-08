CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR (100),
    `lastName` VARCHAR (100),
    `email` VARCHAR (100),
    `password` VARCHAR (100),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB;

INSERT INTO `user` (`email`, `password`) VALUES ('yeet@gmx.ch', MD5('yeet'));
INSERT INTO `user` (`email`, `password`) VALUES ('yote@gmail.ch', MD5('yote'));
