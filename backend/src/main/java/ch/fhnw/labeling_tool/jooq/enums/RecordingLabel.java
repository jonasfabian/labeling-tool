/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.enums;


import org.jooq.Catalog;
import org.jooq.EnumType;
import org.jooq.Schema;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public enum RecordingLabel implements EnumType {

    SKIPPED("SKIPPED"),

    RECORDED("RECORDED"),

    PRIVATE("PRIVATE");

    private final String literal;

    private RecordingLabel(String literal) {
        this.literal = literal;
    }

    @Override
    public Catalog getCatalog() {
        return null;
    }

    @Override
    public Schema getSchema() {
        return null;
    }

    @Override
    public String getName() {
        return "recording_label";
    }

    @Override
    public String getLiteral() {
        return literal;
    }
}
