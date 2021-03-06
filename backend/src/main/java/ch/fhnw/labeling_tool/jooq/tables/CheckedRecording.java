/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables;


import ch.fhnw.labeling_tool.jooq.Indexes;
import ch.fhnw.labeling_tool.jooq.Keys;
import ch.fhnw.labeling_tool.jooq.LabelingTool;
import ch.fhnw.labeling_tool.jooq.enums.CheckedRecordingLabel;
import ch.fhnw.labeling_tool.jooq.tables.records.CheckedRecordingRecord;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row5;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.TableImpl;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class CheckedRecording extends TableImpl<CheckedRecordingRecord> {

    private static final long serialVersionUID = 1067385558;

    public static final CheckedRecording CHECKED_RECORDING = new CheckedRecording();

    @Override
    public Class<CheckedRecordingRecord> getRecordType() {
        return CheckedRecordingRecord.class;
    }

    public final TableField<CheckedRecordingRecord, Long> ID = createField(DSL.name("id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false).identity(true), this, "");

    public final TableField<CheckedRecordingRecord, Long> RECORDING_ID = createField(DSL.name("recording_id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    public final TableField<CheckedRecordingRecord, Long> USER_ID = createField(DSL.name("user_id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    public final TableField<CheckedRecordingRecord, CheckedRecordingLabel> LABEL = createField(DSL.name("label"), org.jooq.impl.SQLDataType.VARCHAR(7).defaultValue(org.jooq.impl.DSL.inline("NULL", org.jooq.impl.SQLDataType.VARCHAR)).asEnumDataType(ch.fhnw.labeling_tool.jooq.enums.CheckedRecordingLabel.class), this, "");

    public final TableField<CheckedRecordingRecord, Timestamp> TIME = createField(DSL.name("time"), org.jooq.impl.SQLDataType.TIMESTAMP.nullable(false).defaultValue(org.jooq.impl.DSL.field("current_timestamp()", org.jooq.impl.SQLDataType.TIMESTAMP)), this, "");

    public CheckedRecording() {
        this(DSL.name("checked_recording"), null);
    }

    public CheckedRecording(String alias) {
        this(DSL.name(alias), CHECKED_RECORDING);
    }

    public CheckedRecording(Name alias) {
        this(alias, CHECKED_RECORDING);
    }

    private CheckedRecording(Name alias, Table<CheckedRecordingRecord> aliased) {
        this(alias, aliased, null);
    }

    private CheckedRecording(Name alias, Table<CheckedRecordingRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> CheckedRecording(Table<O> child, ForeignKey<O, CheckedRecordingRecord> key) {
        super(child, key, CHECKED_RECORDING);
    }

    @Override
    public Schema getSchema() {
        return LabelingTool.LABELING_TOOL;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.<Index>asList(Indexes.CHECKED_RECORDING_PRIMARY, Indexes.CHECKED_RECORDING_RECORDING_ID, Indexes.CHECKED_RECORDING_USER_ID);
    }

    @Override
    public Identity<CheckedRecordingRecord, Long> getIdentity() {
        return Keys.IDENTITY_CHECKED_RECORDING;
    }

    @Override
    public UniqueKey<CheckedRecordingRecord> getPrimaryKey() {
        return Keys.KEY_CHECKED_RECORDING_PRIMARY;
    }

    @Override
    public List<UniqueKey<CheckedRecordingRecord>> getKeys() {
        return Arrays.<UniqueKey<CheckedRecordingRecord>>asList(Keys.KEY_CHECKED_RECORDING_PRIMARY);
    }

    @Override
    public List<ForeignKey<CheckedRecordingRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<CheckedRecordingRecord, ?>>asList(Keys.CHECKED_RECORDING_IBFK_2, Keys.CHECKED_RECORDING_IBFK_1);
    }

    public Recording recording() {
        return new Recording(this, Keys.CHECKED_RECORDING_IBFK_2);
    }

    public User user() {
        return new User(this, Keys.CHECKED_RECORDING_IBFK_1);
    }

    @Override
    public CheckedRecording as(String alias) {
        return new CheckedRecording(DSL.name(alias), this);
    }

    @Override
    public CheckedRecording as(Name alias) {
        return new CheckedRecording(alias, this);
    }

    @Override
    public CheckedRecording rename(String name) {
        return new CheckedRecording(DSL.name(name), null);
    }

    @Override
    public CheckedRecording rename(Name name) {
        return new CheckedRecording(name, null);
    }

    // -------------------------------------------------------------------------
    // Row5 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row5<Long, Long, Long, CheckedRecordingLabel, Timestamp> fieldsRow() {
        return (Row5) super.fieldsRow();
    }
}
