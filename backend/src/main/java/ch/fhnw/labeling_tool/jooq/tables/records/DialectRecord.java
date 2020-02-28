/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.records;


import ch.fhnw.labeling_tool.jooq.tables.Dialect;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record4;
import org.jooq.Row4;
import org.jooq.impl.UpdatableRecordImpl;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class DialectRecord extends UpdatableRecordImpl<DialectRecord> implements Record4<Long, String, String, Long> {

    private static final long serialVersionUID = 1065551623;

    public void setId(Long value) {
        set(0, value);
    }

    public Long getId() {
        return (Long) get(0);
    }

    public void setCountyId(String value) {
        set(1, value);
    }

    @Size(max = 100)
    public String getCountyId() {
        return (String) get(1);
    }

    public void setCountyName(String value) {
        set(2, value);
    }

    @Size(max = 255)
    public String getCountyName() {
        return (String) get(2);
    }

    public void setLanguageId(Long value) {
        set(3, value);
    }

    @NotNull
    public Long getLanguageId() {
        return (Long) get(3);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Long> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record4 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row4<Long, String, String, Long> fieldsRow() {
        return (Row4) super.fieldsRow();
    }

    @Override
    public Row4<Long, String, String, Long> valuesRow() {
        return (Row4) super.valuesRow();
    }

    @Override
    public Field<Long> field1() {
        return Dialect.DIALECT.ID;
    }

    @Override
    public Field<String> field2() {
        return Dialect.DIALECT.COUNTY_ID;
    }

    @Override
    public Field<String> field3() {
        return Dialect.DIALECT.COUNTY_NAME;
    }

    @Override
    public Field<Long> field4() {
        return Dialect.DIALECT.LANGUAGE_ID;
    }

    @Override
    public Long component1() {
        return getId();
    }

    @Override
    public String component2() {
        return getCountyId();
    }

    @Override
    public String component3() {
        return getCountyName();
    }

    @Override
    public Long component4() {
        return getLanguageId();
    }

    @Override
    public Long value1() {
        return getId();
    }

    @Override
    public String value2() {
        return getCountyId();
    }

    @Override
    public String value3() {
        return getCountyName();
    }

    @Override
    public Long value4() {
        return getLanguageId();
    }

    @Override
    public DialectRecord value1(Long value) {
        setId(value);
        return this;
    }

    @Override
    public DialectRecord value2(String value) {
        setCountyId(value);
        return this;
    }

    @Override
    public DialectRecord value3(String value) {
        setCountyName(value);
        return this;
    }

    @Override
    public DialectRecord value4(Long value) {
        setLanguageId(value);
        return this;
    }

    @Override
    public DialectRecord values(Long value1, String value2, String value3, Long value4) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public DialectRecord() {
        super(Dialect.DIALECT);
    }

    public DialectRecord(Long id, String countyId, String countyName, Long languageId) {
        super(Dialect.DIALECT);

        set(0, id);
        set(1, countyId);
        set(2, countyName);
        set(3, languageId);
    }
}