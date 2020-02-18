package ch.fhnw.labeling_tool.model;

public class TextAudioDto {
    public final Long id;
    public final Double audioStart;
    public final Double audioEnd;
    public final String text;

    public TextAudioDto(Long id, Double audioStart, Double audioEnd, String text) {
        this.id = id;
        this.audioStart = audioStart;
        this.audioEnd = audioEnd;
        this.text = text;
    }

}
