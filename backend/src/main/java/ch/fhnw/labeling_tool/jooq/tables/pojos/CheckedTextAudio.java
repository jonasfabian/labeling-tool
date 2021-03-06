/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.pojos;


import ch.fhnw.labeling_tool.jooq.enums.CheckedTextAudioLabel;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.validation.constraints.NotNull;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class CheckedTextAudio implements Serializable {

    private static final long serialVersionUID = 1365522360;

    private Long                  id;
    private Long                  textAudioId;
    private Long                  userId;
    private CheckedTextAudioLabel label;
    private Timestamp             time;

    public CheckedTextAudio() {}

    public CheckedTextAudio(CheckedTextAudio value) {
        this.id = value.id;
        this.textAudioId = value.textAudioId;
        this.userId = value.userId;
        this.label = value.label;
        this.time = value.time;
    }

    public CheckedTextAudio(
        Long                  id,
        Long                  textAudioId,
        Long                  userId,
        CheckedTextAudioLabel label,
        Timestamp             time
    ) {
        this.id = id;
        this.textAudioId = textAudioId;
        this.userId = userId;
        this.label = label;
        this.time = time;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull
    public Long getTextAudioId() {
        return this.textAudioId;
    }

    public void setTextAudioId(Long textAudioId) {
        this.textAudioId = textAudioId;
    }

    @NotNull
    public Long getUserId() {
        return this.userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public CheckedTextAudioLabel getLabel() {
        return this.label;
    }

    public void setLabel(CheckedTextAudioLabel label) {
        this.label = label;
    }

    public Timestamp getTime() {
        return this.time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("CheckedTextAudio (");

        sb.append(id);
        sb.append(", ").append(textAudioId);
        sb.append(", ").append(userId);
        sb.append(", ").append(label);
        sb.append(", ").append(time);

        sb.append(")");
        return sb.toString();
    }
}
