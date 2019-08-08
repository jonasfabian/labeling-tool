CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR (100),
    `lastName` VARCHAR (100),
    `email` VARCHAR (100),
    `password` VARCHAR (100),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB;

INSERT INTO `user` (`firstName`, `lastName`, `email`, `password`) VALUES ('hans', 'müller', 'yeet@gmx.ch', SHA1('yeet'));
INSERT INTO `user` (`firstName`, `lastName`, `email`, `password`) VALUES ('peter', 'lichtsteiner', 'yote@gmx.ch', SHA1('yote'));
