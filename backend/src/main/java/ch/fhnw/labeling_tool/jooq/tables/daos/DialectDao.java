/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.daos;


import ch.fhnw.labeling_tool.jooq.tables.Dialect;
import ch.fhnw.labeling_tool.jooq.tables.records.DialectRecord;

import java.util.List;

import org.jooq.Configuration;
import org.jooq.impl.DAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
@Repository
public class DialectDao extends DAOImpl<DialectRecord, ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect, Long> {

    public DialectDao() {
        super(Dialect.DIALECT, ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect.class);
    }

    @Autowired
    public DialectDao(Configuration configuration) {
        super(Dialect.DIALECT, ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect.class, configuration);
    }

    @Override
    public Long getId(ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect object) {
        return object.getId();
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect> fetchRangeOfId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(Dialect.DIALECT.ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect> fetchById(Long... values) {
        return fetch(Dialect.DIALECT.ID, values);
    }

    public ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect fetchOneById(Long value) {
        return fetchOne(Dialect.DIALECT.ID, value);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect> fetchRangeOfCountyId(String lowerInclusive, String upperInclusive) {
        return fetchRange(Dialect.DIALECT.COUNTY_ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect> fetchByCountyId(String... values) {
        return fetch(Dialect.DIALECT.COUNTY_ID, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect> fetchRangeOfCountyName(String lowerInclusive, String upperInclusive) {
        return fetchRange(Dialect.DIALECT.COUNTY_NAME, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect> fetchByCountyName(String... values) {
        return fetch(Dialect.DIALECT.COUNTY_NAME, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect> fetchRangeOfLanguageId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(Dialect.DIALECT.LANGUAGE_ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect> fetchByLanguageId(Long... values) {
        return fetch(Dialect.DIALECT.LANGUAGE_ID, values);
    }
}
