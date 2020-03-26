ALTER TABLE user
    MODIFY COLUMN first_name VARCHAR(100) DEFAULT NULL,
    MODIFY COLUMN last_name VARCHAR(100) DEFAULT NULL,
    MODIFY COLUMN licence ENUM ('PUBLIC','ACADEMIC') DEFAULT 'PUBLIC',
    ADD COLUMN zip_code VARCHAR(45) NOT NULL;
ALTER TABLE source
    ADD COLUMN licence TEXT NOT NULL;
ALTER TABLE recording
    ADD COLUMN deleted DATETIME DEFAULT NULL;
ALTER TABLE text_audio
    ADD COLUMN deleted DATETIME DEFAULT NULL;
ALTER TABLE user_group
    ADD COLUMN description MEDIUMTEXT DEFAULT NULL