/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.daos;


import ch.fhnw.labeling_tool.jooq.tables.UserGroup;
import ch.fhnw.labeling_tool.jooq.tables.records.UserGroupRecord;

import java.util.List;

import org.jooq.Configuration;
import org.jooq.impl.DAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
@Repository
public class UserGroupDao extends DAOImpl<UserGroupRecord, ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup, Long> {

    public UserGroupDao() {
        super(UserGroup.USER_GROUP, ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup.class);
    }

    @Autowired
    public UserGroupDao(Configuration configuration) {
        super(UserGroup.USER_GROUP, ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup.class, configuration);
    }

    @Override
    public Long getId(ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup object) {
        return object.getId();
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup> fetchRangeOfId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(UserGroup.USER_GROUP.ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup> fetchById(Long... values) {
        return fetch(UserGroup.USER_GROUP.ID, values);
    }

    public ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup fetchOneById(Long value) {
        return fetchOne(UserGroup.USER_GROUP.ID, value);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup> fetchRangeOfName(String lowerInclusive, String upperInclusive) {
        return fetchRange(UserGroup.USER_GROUP.NAME, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup> fetchByName(String... values) {
        return fetch(UserGroup.USER_GROUP.NAME, values);
    }
}
