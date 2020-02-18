/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables;


import ch.fhnw.labeling_tool.jooq.Indexes;
import ch.fhnw.labeling_tool.jooq.Keys;
import ch.fhnw.labeling_tool.jooq.LabelingTool;
import ch.fhnw.labeling_tool.jooq.enums.CheckedTextAudioLabel;
import ch.fhnw.labeling_tool.jooq.tables.records.CheckedTextAudioRecord;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.TableImpl;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class CheckedTextAudio extends TableImpl<CheckedTextAudioRecord> {

    private static final long serialVersionUID = 1720315944;

    public static final CheckedTextAudio CHECKED_TEXT_AUDIO = new CheckedTextAudio();

    @Override
    public Class<CheckedTextAudioRecord> getRecordType() {
        return CheckedTextAudioRecord.class;
    }

    public final TableField<CheckedTextAudioRecord, Long> ID = createField("id", org.jooq.impl.SQLDataType.BIGINT.nullable(false).identity(true), this, "");

    public final TableField<CheckedTextAudioRecord, Long> TEXT_AUDIO_ID = createField("text_audio_id", org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    public final TableField<CheckedTextAudioRecord, Long> USER_ID = createField("user_id", org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    public final TableField<CheckedTextAudioRecord, CheckedTextAudioLabel> LABEL = createField("label", org.jooq.impl.SQLDataType.VARCHAR(7).defaultValue(org.jooq.impl.DSL.inline("NULL", org.jooq.impl.SQLDataType.VARCHAR)).asEnumDataType(ch.fhnw.labeling_tool.jooq.enums.CheckedTextAudioLabel.class), this, "");

    public final TableField<CheckedTextAudioRecord, Timestamp> TIME = createField("time", org.jooq.impl.SQLDataType.TIMESTAMP.nullable(false).defaultValue(org.jooq.impl.DSL.field("current_timestamp()", org.jooq.impl.SQLDataType.TIMESTAMP)), this, "");

    public CheckedTextAudio() {
        this(DSL.name("checked_text_audio"), null);
    }

    public CheckedTextAudio(String alias) {
        this(DSL.name(alias), CHECKED_TEXT_AUDIO);
    }

    public CheckedTextAudio(Name alias) {
        this(alias, CHECKED_TEXT_AUDIO);
    }

    private CheckedTextAudio(Name alias, Table<CheckedTextAudioRecord> aliased) {
        this(alias, aliased, null);
    }

    private CheckedTextAudio(Name alias, Table<CheckedTextAudioRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> CheckedTextAudio(Table<O> child, ForeignKey<O, CheckedTextAudioRecord> key) {
        super(child, key, CHECKED_TEXT_AUDIO);
    }

    @Override
    public Schema getSchema() {
        return LabelingTool.LABELING_TOOL;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.<Index>asList(Indexes.CHECKED_TEXT_AUDIO_PRIMARY, Indexes.CHECKED_TEXT_AUDIO_TEXT_AUDIO_ID, Indexes.CHECKED_TEXT_AUDIO_USER_ID);
    }

    @Override
    public Identity<CheckedTextAudioRecord, Long> getIdentity() {
        return Keys.IDENTITY_CHECKED_TEXT_AUDIO;
    }

    @Override
    public UniqueKey<CheckedTextAudioRecord> getPrimaryKey() {
        return Keys.KEY_CHECKED_TEXT_AUDIO_PRIMARY;
    }

    @Override
    public List<UniqueKey<CheckedTextAudioRecord>> getKeys() {
        return Arrays.<UniqueKey<CheckedTextAudioRecord>>asList(Keys.KEY_CHECKED_TEXT_AUDIO_PRIMARY);
    }

    @Override
    public List<ForeignKey<CheckedTextAudioRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<CheckedTextAudioRecord, ?>>asList(Keys.CHECKED_TEXT_AUDIO_IBFK_2, Keys.CHECKED_TEXT_AUDIO_IBFK_1);
    }

    public TextAudio textAudio() {
        return new TextAudio(this, Keys.CHECKED_TEXT_AUDIO_IBFK_2);
    }

    public User user() {
        return new User(this, Keys.CHECKED_TEXT_AUDIO_IBFK_1);
    }

    @Override
    public CheckedTextAudio as(String alias) {
        return new CheckedTextAudio(DSL.name(alias), this);
    }

    @Override
    public CheckedTextAudio as(Name alias) {
        return new CheckedTextAudio(alias, this);
    }

    @Override
    public CheckedTextAudio rename(String name) {
        return new CheckedTextAudio(DSL.name(name), null);
    }

    @Override
    public CheckedTextAudio rename(Name name) {
        return new CheckedTextAudio(name, null);
    }
}
