/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.daos;


import ch.fhnw.labeling_tool.jooq.tables.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.records.ExcerptRecord;

import java.util.List;

import org.jooq.Configuration;
import org.jooq.impl.DAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
@Repository
public class ExcerptDao extends DAOImpl<ExcerptRecord, ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt, Long> {

    public ExcerptDao() {
        super(Excerpt.EXCERPT, ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt.class);
    }

    @Autowired
    public ExcerptDao(Configuration configuration) {
        super(Excerpt.EXCERPT, ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt.class, configuration);
    }

    @Override
    public Long getId(ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt object) {
        return object.getId();
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchRangeOfId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(Excerpt.EXCERPT.ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchById(Long... values) {
        return fetch(Excerpt.EXCERPT.ID, values);
    }

    public ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt fetchOneById(Long value) {
        return fetchOne(Excerpt.EXCERPT.ID, value);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchRangeOfOriginalTextId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(Excerpt.EXCERPT.ORIGINAL_TEXT_ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchByOriginalTextId(Long... values) {
        return fetch(Excerpt.EXCERPT.ORIGINAL_TEXT_ID, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchRangeOfExcerpt(String lowerInclusive, String upperInclusive) {
        return fetchRange(Excerpt.EXCERPT.EXCERPT_, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchByExcerpt(String... values) {
        return fetch(Excerpt.EXCERPT.EXCERPT_, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchRangeOfIsskipped(Integer lowerInclusive, Integer upperInclusive) {
        return fetchRange(Excerpt.EXCERPT.ISSKIPPED, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchByIsskipped(Integer... values) {
        return fetch(Excerpt.EXCERPT.ISSKIPPED, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchRangeOfIsprivate(Boolean lowerInclusive, Boolean upperInclusive) {
        return fetchRange(Excerpt.EXCERPT.ISPRIVATE, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchByIsprivate(Boolean... values) {
        return fetch(Excerpt.EXCERPT.ISPRIVATE, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchRangeOfIsSentenceError(Boolean lowerInclusive, Boolean upperInclusive) {
        return fetchRange(Excerpt.EXCERPT.IS_SENTENCE_ERROR, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt> fetchByIsSentenceError(Boolean... values) {
        return fetch(Excerpt.EXCERPT.IS_SENTENCE_ERROR, values);
    }
}
