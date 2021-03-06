/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.records;


import ch.fhnw.labeling_tool.jooq.enums.SpeakerSex;
import ch.fhnw.labeling_tool.jooq.tables.Speaker;

import javax.validation.constraints.Size;

import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record5;
import org.jooq.Row5;
import org.jooq.impl.UpdatableRecordImpl;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class SpeakerRecord extends UpdatableRecordImpl<SpeakerRecord> implements Record5<Long, String, String, String, SpeakerSex> {

    private static final long serialVersionUID = 2121727813;

    public void setId(Long value) {
        set(0, value);
    }

    public Long getId() {
        return (Long) get(0);
    }

    public void setName(String value) {
        set(1, value);
    }

    @Size(max = 45)
    public String getName() {
        return (String) get(1);
    }

    public void setLanguage(String value) {
        set(2, value);
    }

    @Size(max = 45)
    public String getLanguage() {
        return (String) get(2);
    }

    public void setDialect(String value) {
        set(3, value);
    }

    @Size(max = 45)
    public String getDialect() {
        return (String) get(3);
    }

    public void setSex(SpeakerSex value) {
        set(4, value);
    }

    public SpeakerSex getSex() {
        return (SpeakerSex) get(4);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Long> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record5 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row5<Long, String, String, String, SpeakerSex> fieldsRow() {
        return (Row5) super.fieldsRow();
    }

    @Override
    public Row5<Long, String, String, String, SpeakerSex> valuesRow() {
        return (Row5) super.valuesRow();
    }

    @Override
    public Field<Long> field1() {
        return Speaker.SPEAKER.ID;
    }

    @Override
    public Field<String> field2() {
        return Speaker.SPEAKER.NAME;
    }

    @Override
    public Field<String> field3() {
        return Speaker.SPEAKER.LANGUAGE;
    }

    @Override
    public Field<String> field4() {
        return Speaker.SPEAKER.DIALECT;
    }

    @Override
    public Field<SpeakerSex> field5() {
        return Speaker.SPEAKER.SEX;
    }

    @Override
    public Long component1() {
        return getId();
    }

    @Override
    public String component2() {
        return getName();
    }

    @Override
    public String component3() {
        return getLanguage();
    }

    @Override
    public String component4() {
        return getDialect();
    }

    @Override
    public SpeakerSex component5() {
        return getSex();
    }

    @Override
    public Long value1() {
        return getId();
    }

    @Override
    public String value2() {
        return getName();
    }

    @Override
    public String value3() {
        return getLanguage();
    }

    @Override
    public String value4() {
        return getDialect();
    }

    @Override
    public SpeakerSex value5() {
        return getSex();
    }

    @Override
    public SpeakerRecord value1(Long value) {
        setId(value);
        return this;
    }

    @Override
    public SpeakerRecord value2(String value) {
        setName(value);
        return this;
    }

    @Override
    public SpeakerRecord value3(String value) {
        setLanguage(value);
        return this;
    }

    @Override
    public SpeakerRecord value4(String value) {
        setDialect(value);
        return this;
    }

    @Override
    public SpeakerRecord value5(SpeakerSex value) {
        setSex(value);
        return this;
    }

    @Override
    public SpeakerRecord values(Long value1, String value2, String value3, String value4, SpeakerSex value5) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public SpeakerRecord() {
        super(Speaker.SPEAKER);
    }

    public SpeakerRecord(Long id, String name, String language, String dialect, SpeakerSex sex) {
        super(Speaker.SPEAKER);

        set(0, id);
        set(1, name);
        set(2, language);
        set(3, dialect);
        set(4, sex);
    }
}
