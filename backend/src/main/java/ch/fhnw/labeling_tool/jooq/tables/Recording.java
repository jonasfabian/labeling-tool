/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables;


import ch.fhnw.labeling_tool.jooq.Indexes;
import ch.fhnw.labeling_tool.jooq.Keys;
import ch.fhnw.labeling_tool.jooq.LabelingTool;
import ch.fhnw.labeling_tool.jooq.enums.RecordingLabel;
import ch.fhnw.labeling_tool.jooq.tables.records.RecordingRecord;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row7;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.TableImpl;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Recording extends TableImpl<RecordingRecord> {

    private static final long serialVersionUID = -564650421;

    public static final Recording RECORDING = new Recording();

    @Override
    public Class<RecordingRecord> getRecordType() {
        return RecordingRecord.class;
    }

    public final TableField<RecordingRecord, Long> ID = createField(DSL.name("id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false).identity(true), this, "");

    public final TableField<RecordingRecord, Long> EXCERPT_ID = createField(DSL.name("excerpt_id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    public final TableField<RecordingRecord, Long> USER_ID = createField(DSL.name("user_id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    public final TableField<RecordingRecord, Timestamp> TIME = createField(DSL.name("time"), org.jooq.impl.SQLDataType.TIMESTAMP.nullable(false).defaultValue(org.jooq.impl.DSL.field("current_timestamp()", org.jooq.impl.SQLDataType.TIMESTAMP)), this, "");

    public final TableField<RecordingRecord, RecordingLabel> LABEL = createField(DSL.name("label"), org.jooq.impl.SQLDataType.VARCHAR(14).defaultValue(org.jooq.impl.DSL.inline("NULL", org.jooq.impl.SQLDataType.VARCHAR)).asEnumDataType(ch.fhnw.labeling_tool.jooq.enums.RecordingLabel.class), this, "");

    public final TableField<RecordingRecord, Long> WRONG = createField(DSL.name("wrong"), org.jooq.impl.SQLDataType.BIGINT.defaultValue(org.jooq.impl.DSL.inline("0", org.jooq.impl.SQLDataType.BIGINT)), this, "");

    public final TableField<RecordingRecord, Long> CORRECT = createField(DSL.name("correct"), org.jooq.impl.SQLDataType.BIGINT.defaultValue(org.jooq.impl.DSL.inline("0", org.jooq.impl.SQLDataType.BIGINT)), this, "");

    public Recording() {
        this(DSL.name("recording"), null);
    }

    public Recording(String alias) {
        this(DSL.name(alias), RECORDING);
    }

    public Recording(Name alias) {
        this(alias, RECORDING);
    }

    private Recording(Name alias, Table<RecordingRecord> aliased) {
        this(alias, aliased, null);
    }

    private Recording(Name alias, Table<RecordingRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> Recording(Table<O> child, ForeignKey<O, RecordingRecord> key) {
        super(child, key, RECORDING);
    }

    @Override
    public Schema getSchema() {
        return LabelingTool.LABELING_TOOL;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.<Index>asList(Indexes.RECORDING_EXCERPT_ID, Indexes.RECORDING_PRIMARY, Indexes.RECORDING_USER_ID);
    }

    @Override
    public Identity<RecordingRecord, Long> getIdentity() {
        return Keys.IDENTITY_RECORDING;
    }

    @Override
    public UniqueKey<RecordingRecord> getPrimaryKey() {
        return Keys.KEY_RECORDING_PRIMARY;
    }

    @Override
    public List<UniqueKey<RecordingRecord>> getKeys() {
        return Arrays.<UniqueKey<RecordingRecord>>asList(Keys.KEY_RECORDING_PRIMARY);
    }

    @Override
    public List<ForeignKey<RecordingRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<RecordingRecord, ?>>asList(Keys.RECORDING_IBFK_2, Keys.RECORDING_IBFK_1);
    }

    public Excerpt excerpt() {
        return new Excerpt(this, Keys.RECORDING_IBFK_2);
    }

    public User user() {
        return new User(this, Keys.RECORDING_IBFK_1);
    }

    @Override
    public Recording as(String alias) {
        return new Recording(DSL.name(alias), this);
    }

    @Override
    public Recording as(Name alias) {
        return new Recording(alias, this);
    }

    @Override
    public Recording rename(String name) {
        return new Recording(DSL.name(name), null);
    }

    @Override
    public Recording rename(Name name) {
        return new Recording(name, null);
    }

    // -------------------------------------------------------------------------
    // Row7 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row7<Long, Long, Long, Timestamp, RecordingLabel, Long, Long> fieldsRow() {
        return (Row7) super.fieldsRow();
    }
}
