CREATE TABLE language
(
    id            BIGINT NOT NULL AUTO_INCREMENT,
    language_id   VARCHAR(100),
    language_name TINYTEXT,
    PRIMARY KEY (id)
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;

CREATE TABLE dialect
(
    id          BIGINT NOT NULL AUTO_INCREMENT,
    county_id   VARCHAR(100),
    county_name TINYTEXT,
    language_id BIGINT NOT NULL,
    FOREIGN KEY (language_id) REFERENCES language (id) ON DELETE RESTRICT,
    PRIMARY KEY (id)
) ENGINE = INNODB
  DEFAULT CHARSET = UTF8MB4;
INSERT INTO language(id, language_id, language_name)
VALUES (1, 'CH-de', 'Swiss German'),
       (2, 'DE-de', 'Standard German');
INSERT INTO dialect(county_id, county_name, language_id)
VALUES ('ag', 'Aargau', 1),
       ('ai', 'Appenzell Innerrhoden', 1),
       ('ar', 'Appenzell Ausserrhoden', 1),
       ('be', 'Bern', 1),
       ('bl', 'Basel-Landschaft', 1),
       ('bs', 'Basel-Stadt', 1),
       ('fr', 'Freiburg', 1),
       ('ge', 'Genf', 1),
       ('gl', 'Glarus', 1),
       ('gr', 'Graubünden', 1),
       ('ju', 'Jura', 1),
       ('lu', 'Luzern', 1),
       ('ne', 'Neuenburg', 1),
       ('nw', 'Nidwalden', 1),
       ('ow', 'Obwalden', 1),
       ('sg', 'St. Gallen', 1),
       ('sh', 'Schaffhausen', 1),
       ('so', 'Solothurn', 1),
       ('sz', 'Schwyz', 1),
       ('tg', 'Thurgau', 1),
       ('ti', 'Tessin', 1),
       ('ur', 'Uri', 1),
       ('vd', 'Waadt', 1),
       ('vs', 'Wallis', 1),
       ('zg', 'Zug', 1),
       ('zh', 'Zürich', 1);
ALTER TABLE user
    ADD COLUMN dialect_id BIGINT DEFAULT 1,
    ADD FOREIGN KEY (dialect_id) REFERENCES dialect (id) ON DELETE RESTRICT;
UPDATE user INNER JOIN dialect
    ON user.canton = dialect.county_id
SET user.dialect_id = dialect.id;
ALTER TABLE user
    MODIFY COLUMN dialect_id BIGINT NOT NULL,
    DROP COLUMN canton;

ALTER TABLE excerpt
    ADD COLUMN is_sentence_error BOOLEAN DEFAULT FALSE;
ALTER TABLE recording
    MODIFY COLUMN label ENUM ('SKIPPED','RECORDED','PRIVATE','SENTENCE_ERROR')
