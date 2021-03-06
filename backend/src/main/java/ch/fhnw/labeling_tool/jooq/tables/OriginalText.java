/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables;


import ch.fhnw.labeling_tool.jooq.Indexes;
import ch.fhnw.labeling_tool.jooq.Keys;
import ch.fhnw.labeling_tool.jooq.LabelingTool;
import ch.fhnw.labeling_tool.jooq.tables.records.OriginalTextRecord;

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
public class OriginalText extends TableImpl<OriginalTextRecord> {

    private static final long serialVersionUID = -684782233;

    public static final OriginalText ORIGINAL_TEXT = new OriginalText();

    @Override
    public Class<OriginalTextRecord> getRecordType() {
        return OriginalTextRecord.class;
    }

    public final TableField<OriginalTextRecord, Long> ID = createField(DSL.name("id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false).identity(true), this, "");

    public final TableField<OriginalTextRecord, Long> USER_GROUP_ID = createField(DSL.name("user_group_id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    public final TableField<OriginalTextRecord, Long> DOMAIN_ID = createField(DSL.name("domain_id"), org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    public final TableField<OriginalTextRecord, Long> USER_ID = createField(DSL.name("user_id"), org.jooq.impl.SQLDataType.BIGINT.defaultValue(org.jooq.impl.DSL.inline("1", org.jooq.impl.SQLDataType.BIGINT)), this, "");

    public final TableField<OriginalTextRecord, Timestamp> TIME = createField(DSL.name("time"), org.jooq.impl.SQLDataType.TIMESTAMP.nullable(false).defaultValue(org.jooq.impl.DSL.field("current_timestamp()", org.jooq.impl.SQLDataType.TIMESTAMP)), this, "");

    public OriginalText() {
        this(DSL.name("original_text"), null);
    }

    public OriginalText(String alias) {
        this(DSL.name(alias), ORIGINAL_TEXT);
    }

    public OriginalText(Name alias) {
        this(alias, ORIGINAL_TEXT);
    }

    private OriginalText(Name alias, Table<OriginalTextRecord> aliased) {
        this(alias, aliased, null);
    }

    private OriginalText(Name alias, Table<OriginalTextRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> OriginalText(Table<O> child, ForeignKey<O, OriginalTextRecord> key) {
        super(child, key, ORIGINAL_TEXT);
    }

    @Override
    public Schema getSchema() {
        return LabelingTool.LABELING_TOOL;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.<Index>asList(Indexes.ORIGINAL_TEXT_DOMAIN_ID, Indexes.ORIGINAL_TEXT_PRIMARY, Indexes.ORIGINAL_TEXT_USER_GROUP_ID, Indexes.ORIGINAL_TEXT_USER_ID);
    }

    @Override
    public Identity<OriginalTextRecord, Long> getIdentity() {
        return Keys.IDENTITY_ORIGINAL_TEXT;
    }

    @Override
    public UniqueKey<OriginalTextRecord> getPrimaryKey() {
        return Keys.KEY_ORIGINAL_TEXT_PRIMARY;
    }

    @Override
    public List<UniqueKey<OriginalTextRecord>> getKeys() {
        return Arrays.<UniqueKey<OriginalTextRecord>>asList(Keys.KEY_ORIGINAL_TEXT_PRIMARY);
    }

    @Override
    public List<ForeignKey<OriginalTextRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<OriginalTextRecord, ?>>asList(Keys.ORIGINAL_TEXT_IBFK_1, Keys.ORIGINAL_TEXT_IBFK_2, Keys.ORIGINAL_TEXT_IBFK_3);
    }

    public UserGroup userGroup() {
        return new UserGroup(this, Keys.ORIGINAL_TEXT_IBFK_1);
    }

    public Domain domain() {
        return new Domain(this, Keys.ORIGINAL_TEXT_IBFK_2);
    }

    public User user() {
        return new User(this, Keys.ORIGINAL_TEXT_IBFK_3);
    }

    @Override
    public OriginalText as(String alias) {
        return new OriginalText(DSL.name(alias), this);
    }

    @Override
    public OriginalText as(Name alias) {
        return new OriginalText(alias, this);
    }

    @Override
    public OriginalText rename(String name) {
        return new OriginalText(DSL.name(name), null);
    }

    @Override
    public OriginalText rename(Name name) {
        return new OriginalText(name, null);
    }

    // -------------------------------------------------------------------------
    // Row5 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row5<Long, Long, Long, Long, Timestamp> fieldsRow() {
        return (Row5) super.fieldsRow();
    }
}
