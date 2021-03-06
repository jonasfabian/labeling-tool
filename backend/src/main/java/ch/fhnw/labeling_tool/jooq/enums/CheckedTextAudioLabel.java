/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.enums;


import org.jooq.Catalog;
import org.jooq.EnumType;
import org.jooq.Schema;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public enum CheckedTextAudioLabel implements EnumType {

    SKIPPED("SKIPPED"),

    CORRECT("CORRECT"),

    WRONG("WRONG");

    private final String literal;

    private CheckedTextAudioLabel(String literal) {
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
        return "checked_text_audio_label";
    }

    @Override
    public String getLiteral() {
        return literal;
    }
}
