package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.config.LabelingToolConfig;
import ch.fhnw.labeling_tool.jooq.enums.CheckedRecordingLabel;
import ch.fhnw.labeling_tool.jooq.enums.CheckedTextAudioLabel;
import ch.fhnw.labeling_tool.jooq.enums.RecordingLabel;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.records.CheckedRecordingRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.CheckedTextAudioRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.RecordingRecord;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.jooq.DSLContext;
import org.jooq.Record2;
import org.jooq.SelectConditionStep;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

import static ch.fhnw.labeling_tool.jooq.Tables.*;

@Service
public class UserGroupService {
    private final CustomUserDetailsService customUserDetailsService;
    private final DSLContext dslContext;
    private final LabelingToolConfig labelingToolConfig;

    @Autowired
    public UserGroupService(CustomUserDetailsService customUserDetailsService, DSLContext dslContext, LabelingToolConfig labelingToolConfig) {
        this.customUserDetailsService = customUserDetailsService;
        this.dslContext = dslContext;
        this.labelingToolConfig = labelingToolConfig;
    }

    public void postRecording(long groupId, long excerptId, MultipartFile file) throws IOException {
        isAllowed(groupId);
        RecordingRecord recordingRecord = storeRecord(RecordingLabel.RECORDED, excerptId);
        Files.write(labelingToolConfig.getBasePath().resolve("recording/" + recordingRecord.getId() + ".webm"), file.getBytes());
    }

    public Excerpt getExcerpt(Long groupId) {
        isAllowed(groupId);
        return dslContext.select(EXCERPT.fields())
                .from(EXCERPT.join(ORIGINAL_TEXT).onKey())
                .where(ORIGINAL_TEXT.USER_GROUP_ID.eq(groupId)
                        .and(EXCERPT.ISSKIPPED.lessOrEqual(3))
                        .and(EXCERPT.IS_SENTENCE_ERROR.isFalse())

                        .and(EXCERPT.ID.notIn(dslContext.select(RECORDING.EXCERPT_ID)
                                .from(RECORDING.join(USER).onKey())
                                .where(USER.DIALECT_ID.eq(customUserDetailsService.getLoggedInUserDialectId())))))
                .orderBy(DSL.rand())
                // TODO maybe return 10 like check component
                .limit(1).fetchOneInto(Excerpt.class);
    }

    public void postCheckedOccurrence(long groupId, CheckedOccurrence checkedOccurrence) {
        isAllowed(groupId);
        if (checkedOccurrence.mode == OccurrenceMode.TEXT_AUDIO)
            postCheckedOccurrenceTextAudio(checkedOccurrence);
        else postCheckedOccurrenceRecording(checkedOccurrence);
    }

    /**
     * returns the next occurrences to check based on the OccurrenceMode and groupId.
     * occurrences are labeled until it is clear that they clearly wrong|correct
     */
    public List<Occurrence> getNextOccurrences(long groupId, OccurrenceMode mode) {
        isAllowed(groupId);
        SelectConditionStep<Record2<Long, String>> res;
        if (mode == OccurrenceMode.TEXT_AUDIO) {
            res = dslContext.select(TEXT_AUDIO.ID, TEXT_AUDIO.TEXT)
                    .from(TEXT_AUDIO)
                    .where(DSL.abs(TEXT_AUDIO.WRONG.minus(TEXT_AUDIO.CORRECT)).le(3L)
                            .and(TEXT_AUDIO.ID.notIn(dslContext.select(CHECKED_TEXT_AUDIO.TEXT_AUDIO_ID).from(CHECKED_TEXT_AUDIO)
                                    .where(CHECKED_TEXT_AUDIO.USER_ID.eq(customUserDetailsService.getLoggedInUserId()))))
                    );
        } else {
            res = dslContext.select(RECORDING.ID, EXCERPT.EXCERPT_)
                    .from(RECORDING.join(EXCERPT).onKey().join(ORIGINAL_TEXT).onKey())
                    .where(ORIGINAL_TEXT.USER_GROUP_ID.eq(groupId)
                            .and(DSL.abs(RECORDING.WRONG.minus(RECORDING.CORRECT)).le(3L))
                            .and(RECORDING.LABEL.eq(RecordingLabel.RECORDED))
                            .and(RECORDING.ID.notIn(dslContext.select(CHECKED_RECORDING.RECORDING_ID).from(CHECKED_RECORDING)
                                    .where(CHECKED_RECORDING.USER_ID.eq(customUserDetailsService.getLoggedInUserId()))))
                    );
        }
        return res.orderBy(DSL.rand()).limit(10).fetchInto(Occurrence.class);

    }

    public byte[] getAudio(long groupId, long audioId, OccurrenceMode mode) throws IOException {
        isAllowed(groupId);
        if (mode == OccurrenceMode.RECORDING) checkAudio(groupId, audioId);
        var s = (mode == OccurrenceMode.TEXT_AUDIO) ? "text_audio/" + audioId + ".flac" : "recording/" + audioId + ".webm";
        return Files.readAllBytes(labelingToolConfig.getBasePath().resolve(s));

    }

    public void putExcerptSkipped(long groupId, long excerptId) {
        checkExcerpt(groupId, excerptId);
        dslContext.update(EXCERPT).set(EXCERPT.ISSKIPPED, EXCERPT.ISSKIPPED.plus(1)).where(EXCERPT.ID.eq(excerptId)).execute();
        storeRecord(RecordingLabel.SKIPPED, excerptId);
    }

    public void putExcerptPrivate(long groupId, long excerptId) {
        checkExcerpt(groupId, excerptId);
        dslContext.update(EXCERPT).set(EXCERPT.ISPRIVATE, true).where(EXCERPT.ID.eq(excerptId)).execute();
        storeRecord(RecordingLabel.PRIVATE, excerptId);
    }

    public void putExcerptSentenceError(long groupId, long excerptId) {
        checkExcerpt(groupId, excerptId);
        dslContext.update(EXCERPT).set(EXCERPT.IS_SENTENCE_ERROR, true).where(EXCERPT.ID.eq(excerptId)).execute();
        storeRecord(RecordingLabel.SENTENCE_ERROR, excerptId);

    }

    private void postCheckedOccurrenceRecording(CheckedOccurrence checkedOccurrence) {
        var label = CheckedRecordingLabel.valueOf(checkedOccurrence.label.toString());
        var record = new CheckedRecordingRecord();
        record.setRecordingId(checkedOccurrence.id);
        record.setUserId(customUserDetailsService.getLoggedInUserId());
        record.setLabel(label);
        dslContext.executeInsert(record);
        if (checkedOccurrence.label == CheckedOccurrenceLabel.WRONG) {
            dslContext.update(RECORDING).set(RECORDING.WRONG, RECORDING.WRONG.plus(1)).where(RECORDING.ID.eq(checkedOccurrence.id)).execute();
        } else if (checkedOccurrence.label == CheckedOccurrenceLabel.CORRECT) {
            dslContext.update(RECORDING).set(RECORDING.CORRECT, RECORDING.CORRECT.plus(1)).where(RECORDING.ID.eq(checkedOccurrence.id)).execute();
        }
    }

    private void postCheckedOccurrenceTextAudio(CheckedOccurrence checkedOccurrence) {
        var label = CheckedTextAudioLabel.valueOf(checkedOccurrence.label.toString());
        var record = new CheckedTextAudioRecord();
        record.setTextAudioId(checkedOccurrence.id);
        record.setUserId(customUserDetailsService.getLoggedInUserId());
        record.setLabel(label);
        dslContext.executeInsert(record);
        if (checkedOccurrence.label == CheckedOccurrenceLabel.WRONG) {
            dslContext.update(TEXT_AUDIO).set(TEXT_AUDIO.WRONG, TEXT_AUDIO.WRONG.plus(1)).where(TEXT_AUDIO.ID.eq(checkedOccurrence.id)).execute();
        } else if (checkedOccurrence.label == CheckedOccurrenceLabel.CORRECT) {
            dslContext.update(TEXT_AUDIO).set(TEXT_AUDIO.CORRECT, TEXT_AUDIO.CORRECT.plus(1)).where(TEXT_AUDIO.ID.eq(checkedOccurrence.id)).execute();
        }
    }

    private RecordingRecord storeRecord(RecordingLabel recordingLabel, long excerptId) {
        RecordingRecord recordingRecord = dslContext.newRecord(RECORDING);
        recordingRecord.setUserId(customUserDetailsService.getLoggedInUserId());
        recordingRecord.setExcerptId(excerptId);
        recordingRecord.setLabel(recordingLabel);
        recordingRecord.store();
        return recordingRecord;
    }

    private void checkExcerpt(long groupId, long excerptId) {
        isAllowed(groupId);
        boolean equals = dslContext.select(ORIGINAL_TEXT.USER_GROUP_ID)
                .from(EXCERPT.join(ORIGINAL_TEXT).onKey())
                .where(EXCERPT.ID.eq(excerptId))
                .fetchOne().component1().equals(groupId);
        if (!equals) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    private void checkAudio(long groupId, long audioId) {
        boolean equals = dslContext.select(ORIGINAL_TEXT.USER_GROUP_ID)
                .from(RECORDING.join(EXCERPT).onKey().join(ORIGINAL_TEXT).onKey())
                .where(RECORDING.ID.eq(audioId))
                .fetchOne().component1().equals(groupId);
        if (!equals) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    private void isAllowed(long userGroupId) {
        if (!customUserDetailsService.isAllowedOnProject(userGroupId, false))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
}
