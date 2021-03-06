/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.daos;


import ch.fhnw.labeling_tool.jooq.tables.TextAudio;
import ch.fhnw.labeling_tool.jooq.tables.records.TextAudioRecord;

import java.util.List;

import org.jooq.Configuration;
import org.jooq.impl.DAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
@Repository
public class TextAudioDao extends DAOImpl<TextAudioRecord, ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio, Long> {

    public TextAudioDao() {
        super(TextAudio.TEXT_AUDIO, ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio.class);
    }

    @Autowired
    public TextAudioDao(Configuration configuration) {
        super(TextAudio.TEXT_AUDIO, ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio.class, configuration);
    }

    @Override
    public Long getId(ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio object) {
        return object.getId();
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchById(Long... values) {
        return fetch(TextAudio.TEXT_AUDIO.ID, values);
    }

    public ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio fetchOneById(Long value) {
        return fetchOne(TextAudio.TEXT_AUDIO.ID, value);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfAudioStart(Double lowerInclusive, Double upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.AUDIO_START, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchByAudioStart(Double... values) {
        return fetch(TextAudio.TEXT_AUDIO.AUDIO_START, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfAudioEnd(Double lowerInclusive, Double upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.AUDIO_END, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchByAudioEnd(Double... values) {
        return fetch(TextAudio.TEXT_AUDIO.AUDIO_END, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfText(String lowerInclusive, String upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.TEXT, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchByText(String... values) {
        return fetch(TextAudio.TEXT_AUDIO.TEXT, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfPathToFile(String lowerInclusive, String upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.PATH_TO_FILE, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchByPathToFile(String... values) {
        return fetch(TextAudio.TEXT_AUDIO.PATH_TO_FILE, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfSpeakerId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.SPEAKER_ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchBySpeakerId(Long... values) {
        return fetch(TextAudio.TEXT_AUDIO.SPEAKER_ID, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfSourceId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.SOURCE_ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchBySourceId(Long... values) {
        return fetch(TextAudio.TEXT_AUDIO.SOURCE_ID, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfWrong(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.WRONG, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchByWrong(Long... values) {
        return fetch(TextAudio.TEXT_AUDIO.WRONG, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchRangeOfCorrect(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(TextAudio.TEXT_AUDIO.CORRECT, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio> fetchByCorrect(Long... values) {
        return fetch(TextAudio.TEXT_AUDIO.CORRECT, values);
    }
}
