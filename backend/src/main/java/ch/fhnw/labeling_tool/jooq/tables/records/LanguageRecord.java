/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.records;


import ch.fhnw.labeling_tool.jooq.tables.Language;

import javax.validation.constraints.Size;

import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record3;
import org.jooq.Row3;
import org.jooq.impl.UpdatableRecordImpl;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class LanguageRecord extends UpdatableRecordImpl<LanguageRecord> implements Record3<Long, String, String> {

    private static final long serialVersionUID = -328244968;

    public void setId(Long value) {
        set(0, value);
    }

    public Long getId() {
        return (Long) get(0);
    }

    public void setLanguageId(String value) {
        set(1, value);
    }

    @Size(max = 100)
    public String getLanguageId() {
        return (String) get(1);
    }

    public void setLanguageName(String value) {
        set(2, value);
    }

    @Size(max = 255)
    public String getLanguageName() {
        return (String) get(2);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Long> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record3 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row3<Long, String, String> fieldsRow() {
        return (Row3) super.fieldsRow();
    }

    @Override
    public Row3<Long, String, String> valuesRow() {
        return (Row3) super.valuesRow();
    }

    @Override
    public Field<Long> field1() {
        return Language.LANGUAGE.ID;
    }

    @Override
    public Field<String> field2() {
        return Language.LANGUAGE.LANGUAGE_ID;
    }

    @Override
    public Field<String> field3() {
        return Language.LANGUAGE.LANGUAGE_NAME;
    }

    @Override
    public Long component1() {
        return getId();
    }

    @Override
    public String component2() {
        return getLanguageId();
    }

    @Override
    public String component3() {
        return getLanguageName();
    }

    @Override
    public Long value1() {
        return getId();
    }

    @Override
    public String value2() {
        return getLanguageId();
    }

    @Override
    public String value3() {
        return getLanguageName();
    }

    @Override
    public LanguageRecord value1(Long value) {
        setId(value);
        return this;
    }

    @Override
    public LanguageRecord value2(String value) {
        setLanguageId(value);
        return this;
    }

    @Override
    public LanguageRecord value3(String value) {
        setLanguageName(value);
        return this;
    }

    @Override
    public LanguageRecord values(Long value1, String value2, String value3) {
        value1(value1);
        value2(value2);
        value3(value3);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public LanguageRecord() {
        super(Language.LANGUAGE);
    }

    public LanguageRecord(Long id, String languageId, String languageName) {
        super(Language.LANGUAGE);

        set(0, id);
        set(1, languageId);
        set(2, languageName);
    }
}
