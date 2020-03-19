ALTER TABLE original_text
    ADD COLUMN user_id BIGINT DEFAULT 1,
    ADD COLUMN time    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE RESTRICT;
ALTER TABLE text_audio
    ADD COLUMN wrong   BIGINT DEFAULT 0,
    ADD COLUMN correct BIGINT DEFAULT 0;
ALTER TABLE recording
    ADD COLUMN wrong   BIGINT DEFAULT 0,
    ADD COLUMN correct BIGINT DEFAULT 0;
UPDATE text_audio r1
SET wrong   = (SELECT count(*) from checked_text_audio r2 where label = 'WRONG' and r1.id = r2.text_audio_id),
    correct = (SELECT count(*) from checked_text_audio r2 where label = 'CORRECT' and r1.id = r2.text_audio_id);
