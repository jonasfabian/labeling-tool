/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.pojos;


import ch.fhnw.labeling_tool.jooq.enums.RecordingLabel;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.validation.constraints.NotNull;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Recording implements Serializable {

    private static final long serialVersionUID = -1423879176;

    private Long           id;
    private Long           excerptId;
    private Long           userId;
    private Timestamp      time;
    private RecordingLabel label;
    private Long           wrong;
    private Long           correct;

    public Recording() {}

    public Recording(Recording value) {
        this.id = value.id;
        this.excerptId = value.excerptId;
        this.userId = value.userId;
        this.time = value.time;
        this.label = value.label;
        this.wrong = value.wrong;
        this.correct = value.correct;
    }

    public Recording(
        Long           id,
        Long           excerptId,
        Long           userId,
        Timestamp      time,
        RecordingLabel label,
        Long           wrong,
        Long           correct
    ) {
        this.id = id;
        this.excerptId = excerptId;
        this.userId = userId;
        this.time = time;
        this.label = label;
        this.wrong = wrong;
        this.correct = correct;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull
    public Long getExcerptId() {
        return this.excerptId;
    }

    public void setExcerptId(Long excerptId) {
        this.excerptId = excerptId;
    }

    @NotNull
    public Long getUserId() {
        return this.userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Timestamp getTime() {
        return this.time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    public RecordingLabel getLabel() {
        return this.label;
    }

    public void setLabel(RecordingLabel label) {
        this.label = label;
    }

    public Long getWrong() {
        return this.wrong;
    }

    public void setWrong(Long wrong) {
        this.wrong = wrong;
    }

    public Long getCorrect() {
        return this.correct;
    }

    public void setCorrect(Long correct) {
        this.correct = correct;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Recording (");

        sb.append(id);
        sb.append(", ").append(excerptId);
        sb.append(", ").append(userId);
        sb.append(", ").append(time);
        sb.append(", ").append(label);
        sb.append(", ").append(wrong);
        sb.append(", ").append(correct);

        sb.append(")");
        return sb.toString();
    }
}
