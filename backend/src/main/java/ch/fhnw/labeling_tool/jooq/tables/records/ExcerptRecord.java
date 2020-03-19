/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.records;


import ch.fhnw.labeling_tool.jooq.tables.Excerpt;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record6;
import org.jooq.Row6;
import org.jooq.impl.UpdatableRecordImpl;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class ExcerptRecord extends UpdatableRecordImpl<ExcerptRecord> implements Record6<Long, Long, String, Integer, Boolean, Boolean> {

    private static final long serialVersionUID = 566034723;

    public void setId(Long value) {
        set(0, value);
    }

    public Long getId() {
        return (Long) get(0);
    }

    public void setOriginalTextId(Long value) {
        set(1, value);
    }

    @NotNull
    public Long getOriginalTextId() {
        return (Long) get(1);
    }

    public void setExcerpt(String value) {
        set(2, value);
    }

    @NotNull
    @Size(max = 65535)
    public String getExcerpt() {
        return (String) get(2);
    }

    public void setIsskipped(Integer value) {
        set(3, value);
    }

    public Integer getIsskipped() {
        return (Integer) get(3);
    }

    public void setIsprivate(Boolean value) {
        set(4, value);
    }

    public Boolean getIsprivate() {
        return (Boolean) get(4);
    }

    public void setIsSentenceError(Boolean value) {
        set(5, value);
    }

    public Boolean getIsSentenceError() {
        return (Boolean) get(5);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Long> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record6 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row6<Long, Long, String, Integer, Boolean, Boolean> fieldsRow() {
        return (Row6) super.fieldsRow();
    }

    @Override
    public Row6<Long, Long, String, Integer, Boolean, Boolean> valuesRow() {
        return (Row6) super.valuesRow();
    }

    @Override
    public Field<Long> field1() {
        return Excerpt.EXCERPT.ID;
    }

    @Override
    public Field<Long> field2() {
        return Excerpt.EXCERPT.ORIGINAL_TEXT_ID;
    }

    @Override
    public Field<String> field3() {
        return Excerpt.EXCERPT.EXCERPT_;
    }

    @Override
    public Field<Integer> field4() {
        return Excerpt.EXCERPT.ISSKIPPED;
    }

    @Override
    public Field<Boolean> field5() {
        return Excerpt.EXCERPT.ISPRIVATE;
    }

    @Override
    public Field<Boolean> field6() {
        return Excerpt.EXCERPT.IS_SENTENCE_ERROR;
    }

    @Override
    public Long component1() {
        return getId();
    }

    @Override
    public Long component2() {
        return getOriginalTextId();
    }

    @Override
    public String component3() {
        return getExcerpt();
    }

    @Override
    public Integer component4() {
        return getIsskipped();
    }

    @Override
    public Boolean component5() {
        return getIsprivate();
    }

    @Override
    public Boolean component6() {
        return getIsSentenceError();
    }

    @Override
    public Long value1() {
        return getId();
    }

    @Override
    public Long value2() {
        return getOriginalTextId();
    }

    @Override
    public String value3() {
        return getExcerpt();
    }

    @Override
    public Integer value4() {
        return getIsskipped();
    }

    @Override
    public Boolean value5() {
        return getIsprivate();
    }

    @Override
    public Boolean value6() {
        return getIsSentenceError();
    }

    @Override
    public ExcerptRecord value1(Long value) {
        setId(value);
        return this;
    }

    @Override
    public ExcerptRecord value2(Long value) {
        setOriginalTextId(value);
        return this;
    }

    @Override
    public ExcerptRecord value3(String value) {
        setExcerpt(value);
        return this;
    }

    @Override
    public ExcerptRecord value4(Integer value) {
        setIsskipped(value);
        return this;
    }

    @Override
    public ExcerptRecord value5(Boolean value) {
        setIsprivate(value);
        return this;
    }

    @Override
    public ExcerptRecord value6(Boolean value) {
        setIsSentenceError(value);
        return this;
    }

    @Override
    public ExcerptRecord values(Long value1, Long value2, String value3, Integer value4, Boolean value5, Boolean value6) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        value6(value6);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public ExcerptRecord() {
        super(Excerpt.EXCERPT);
    }

    public ExcerptRecord(Long id, Long originalTextId, String excerpt, Integer isskipped, Boolean isprivate, Boolean isSentenceError) {
        super(Excerpt.EXCERPT);

        set(0, id);
        set(1, originalTextId);
        set(2, excerpt);
        set(3, isskipped);
        set(4, isprivate);
        set(5, isSentenceError);
    }
}
