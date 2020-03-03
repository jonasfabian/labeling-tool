package ch.fhnw.labeling_tool.user_group;

public class OverviewOccurrence {
    public final Long id, correct, wrong;
    public final String text;

    public OverviewOccurrence(Long id, Long correct, Long wrong, String text) {
        this.id = id;
        this.correct = correct;
        this.wrong = wrong;
        this.text = text;
    }
}
