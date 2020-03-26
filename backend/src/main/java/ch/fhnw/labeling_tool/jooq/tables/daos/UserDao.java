/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.daos;


import ch.fhnw.labeling_tool.jooq.enums.UserAge;
import ch.fhnw.labeling_tool.jooq.enums.UserLicence;
import ch.fhnw.labeling_tool.jooq.enums.UserSex;
import ch.fhnw.labeling_tool.jooq.tables.User;
import ch.fhnw.labeling_tool.jooq.tables.records.UserRecord;

import java.util.List;

import org.jooq.Configuration;
import org.jooq.impl.DAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
@Repository
public class UserDao extends DAOImpl<UserRecord, ch.fhnw.labeling_tool.jooq.tables.pojos.User, Long> {

    public UserDao() {
        super(User.USER, ch.fhnw.labeling_tool.jooq.tables.pojos.User.class);
    }

    @Autowired
    public UserDao(Configuration configuration) {
        super(User.USER, ch.fhnw.labeling_tool.jooq.tables.pojos.User.class, configuration);
    }

    @Override
    public Long getId(ch.fhnw.labeling_tool.jooq.tables.pojos.User object) {
        return object.getId();
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(User.USER.ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchById(Long... values) {
        return fetch(User.USER.ID, values);
    }

    public ch.fhnw.labeling_tool.jooq.tables.pojos.User fetchOneById(Long value) {
        return fetchOne(User.USER.ID, value);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfFirstName(String lowerInclusive, String upperInclusive) {
        return fetchRange(User.USER.FIRST_NAME, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByFirstName(String... values) {
        return fetch(User.USER.FIRST_NAME, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfLastName(String lowerInclusive, String upperInclusive) {
        return fetchRange(User.USER.LAST_NAME, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByLastName(String... values) {
        return fetch(User.USER.LAST_NAME, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfEmail(String lowerInclusive, String upperInclusive) {
        return fetchRange(User.USER.EMAIL, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByEmail(String... values) {
        return fetch(User.USER.EMAIL, values);
    }

    public ch.fhnw.labeling_tool.jooq.tables.pojos.User fetchOneByEmail(String value) {
        return fetchOne(User.USER.EMAIL, value);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfUsername(String lowerInclusive, String upperInclusive) {
        return fetchRange(User.USER.USERNAME, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByUsername(String... values) {
        return fetch(User.USER.USERNAME, values);
    }

    public ch.fhnw.labeling_tool.jooq.tables.pojos.User fetchOneByUsername(String value) {
        return fetchOne(User.USER.USERNAME, value);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfPassword(String lowerInclusive, String upperInclusive) {
        return fetchRange(User.USER.PASSWORD, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByPassword(String... values) {
        return fetch(User.USER.PASSWORD, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfSex(UserSex lowerInclusive, UserSex upperInclusive) {
        return fetchRange(User.USER.SEX, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchBySex(UserSex... values) {
        return fetch(User.USER.SEX, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfLicence(UserLicence lowerInclusive, UserLicence upperInclusive) {
        return fetchRange(User.USER.LICENCE, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByLicence(UserLicence... values) {
        return fetch(User.USER.LICENCE, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfAge(UserAge lowerInclusive, UserAge upperInclusive) {
        return fetchRange(User.USER.AGE, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByAge(UserAge... values) {
        return fetch(User.USER.AGE, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfEnabled(Boolean lowerInclusive, Boolean upperInclusive) {
        return fetchRange(User.USER.ENABLED, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByEnabled(Boolean... values) {
        return fetch(User.USER.ENABLED, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfDialectId(Long lowerInclusive, Long upperInclusive) {
        return fetchRange(User.USER.DIALECT_ID, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByDialectId(Long... values) {
        return fetch(User.USER.DIALECT_ID, values);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchRangeOfZipCode(String lowerInclusive, String upperInclusive) {
        return fetchRange(User.USER.ZIP_CODE, lowerInclusive, upperInclusive);
    }

    public List<ch.fhnw.labeling_tool.jooq.tables.pojos.User> fetchByZipCode(String... values) {
        return fetch(User.USER.ZIP_CODE, values);
    }
}
