/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables;


import ch.fhnw.labeling_tool.jooq.Indexes;
import ch.fhnw.labeling_tool.jooq.Keys;
import ch.fhnw.labeling_tool.jooq.LabelingTool;
import ch.fhnw.labeling_tool.jooq.enums.SpeakerSex;
import ch.fhnw.labeling_tool.jooq.tables.records.SpeakerRecord;

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
public class Speaker extends TableImpl<SpeakerRecord> {

    private static final long serialVersionUID = -521875401;

    public static final Speaker SPEAKER = new Speaker();

    @Override
    public Class<SpeakerRecord> getRecordType() {
        return SpeakerRecord.class;
    }

    public final TableField<SpeakerRecord, Long> ID = createField(DSL.name("id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false).identity(true), this, "");

    public final TableField<SpeakerRecord, String> NAME = createField(DSL.name("name"), org.jooq.impl.SQLDataType.VARCHAR(45).defaultValue(org.jooq.impl.DSL.inline("NULL", org.jooq.impl.SQLDataType.VARCHAR)), this, "");

    public final TableField<SpeakerRecord, String> LANGUAGE = createField(DSL.name("language"), org.jooq.impl.SQLDataType.VARCHAR(45).defaultValue(org.jooq.impl.DSL.inline("NULL", org.jooq.impl.SQLDataType.VARCHAR)), this, "");

    public final TableField<SpeakerRecord, String> DIALECT = createField(DSL.name("dialect"), org.jooq.impl.SQLDataType.VARCHAR(45).defaultValue(org.jooq.impl.DSL.inline("NULL", org.jooq.impl.SQLDataType.VARCHAR)), this, "");

    public final TableField<SpeakerRecord, SpeakerSex> SEX = createField(DSL.name("sex"), org.jooq.impl.SQLDataType.VARCHAR(4).defaultValue(org.jooq.impl.DSL.inline("'NONE'", org.jooq.impl.SQLDataType.VARCHAR)).asEnumDataType(ch.fhnw.labeling_tool.jooq.enums.SpeakerSex.class), this, "");

    public Speaker() {
        this(DSL.name("speaker"), null);
    }

    public Speaker(String alias) {
        this(DSL.name(alias), SPEAKER);
    }

    public Speaker(Name alias) {
        this(alias, SPEAKER);
    }

    private Speaker(Name alias, Table<SpeakerRecord> aliased) {
        this(alias, aliased, null);
    }

    private Speaker(Name alias, Table<SpeakerRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> Speaker(Table<O> child, ForeignKey<O, SpeakerRecord> key) {
        super(child, key, SPEAKER);
    }

    @Override
    public Schema getSchema() {
        return LabelingTool.LABELING_TOOL;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.<Index>asList(Indexes.SPEAKER_PRIMARY);
    }

    @Override
    public Identity<SpeakerRecord, Long> getIdentity() {
        return Keys.IDENTITY_SPEAKER;
    }

    @Override
    public UniqueKey<SpeakerRecord> getPrimaryKey() {
        return Keys.KEY_SPEAKER_PRIMARY;
    }

    @Override
    public List<UniqueKey<SpeakerRecord>> getKeys() {
        return Arrays.<UniqueKey<SpeakerRecord>>asList(Keys.KEY_SPEAKER_PRIMARY);
    }

    @Override
    public Speaker as(String alias) {
        return new Speaker(DSL.name(alias), this);
    }

    @Override
    public Speaker as(Name alias) {
        return new Speaker(alias, this);
    }

    @Override
    public Speaker rename(String name) {
        return new Speaker(DSL.name(name), null);
    }

    @Override
    public Speaker rename(Name name) {
        return new Speaker(name, null);
    }

    // -------------------------------------------------------------------------
    // Row5 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row5<Long, String, String, String, SpeakerSex> fieldsRow() {
        return (Row5) super.fieldsRow();
    }
}
