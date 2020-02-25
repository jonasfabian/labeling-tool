package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.config.LabelingToolConfig;
import ch.fhnw.labeling_tool.jooq.enums.RecordingLabel;
import ch.fhnw.labeling_tool.jooq.tables.daos.CheckedTextAudioDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.RecordingDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.CheckedTextAudio;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Recording;
import ch.fhnw.labeling_tool.jooq.tables.records.RecordingRecord;
import ch.fhnw.labeling_tool.model.TextAudioDto;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.jooq.DSLContext;
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
    private final RecordingDao recordingDao;
    private final DSLContext dslContext;
    private final CheckedTextAudioDao checkedTextAudioDao;
    private final LabelingToolConfig labelingToolConfig;

    @Autowired
    public UserGroupService(CustomUserDetailsService customUserDetailsService, RecordingDao recordingDao, DSLContext dslContext, CheckedTextAudioDao checkedTextAudioDao, LabelingToolConfig labelingToolConfig) {
        this.customUserDetailsService = customUserDetailsService;
        this.recordingDao = recordingDao;
        this.dslContext = dslContext;
        this.checkedTextAudioDao = checkedTextAudioDao;
        this.labelingToolConfig = labelingToolConfig;
    }

    public void postRecording(long groupId, long excerptId, MultipartFile file) throws IOException {
        isAllowed(groupId);
        var r2 = new Recording(null, excerptId, customUserDetailsService.getLoggedInUserId(), null, RecordingLabel.RECORDED);
        RecordingRecord recordingRecord = dslContext.newRecord(RECORDING, r2);
        recordingRecord.store();
        Files.write(labelingToolConfig.getBasePath().resolve("recording/" + recordingRecord.getId() + ".webm"), file.getBytes());
        recordingDao.insert(r2);
    }

    public Excerpt getExcerpt(Long groupId) {
        isAllowed(groupId);
        // TODO maybe return 10 like check component
        // TODO maybe add direct foreign keys instead of join
        return dslContext.select(EXCERPT.fields())
                .from(EXCERPT.join(ORIGINAL_TEXT).onKey().join(USER_GROUP).onKey())
                .where(USER_GROUP.ID.eq(groupId)
                        .and(EXCERPT.ISSKIPPED.lessOrEqual(3))
                        .and(EXCERPT.ID.notIn(dslContext.select(RECORDING.EXCERPT_ID)
                                .from(RECORDING.join(USER).onKey())
                                .where(USER.DIALECT_ID.eq(customUserDetailsService.getLoggedInUserDialectId())))))
                .orderBy(DSL.rand())
                .limit(1).fetchOneInto(Excerpt.class);
    }

    public void postCheckedTextAudio(long groupId, CheckedTextAudio checkedTextAudio) {
        isAllowed(groupId);
        checkedTextAudio.setUserId(customUserDetailsService.getLoggedInUserId());
        checkedTextAudioDao.insert(checkedTextAudio);
    }

    public List<TextAudioDto> getNextTextAudios(long groupId) {
        isAllowed(groupId);
        // TODO maybe add user_group mapping for checked audio?
        // TODO maybe add ability to also check the recordings as the user_groups cannot upload anything else.
        // TODO maybe filter already checked ones e.g correct,wrong>10
        // TODO this probably needs a internal counter so we do not need to join each time
        return dslContext.select(TEXT_AUDIO.ID, TEXT_AUDIO.AUDIO_START, TEXT_AUDIO.AUDIO_END, TEXT_AUDIO.TEXT)
                .from(TEXT_AUDIO)
                .where(TEXT_AUDIO.ID.notIn(

                        dslContext.select(CHECKED_TEXT_AUDIO.TEXT_AUDIO_ID).from(CHECKED_TEXT_AUDIO)
                                .where(CHECKED_TEXT_AUDIO.USER_ID.eq(customUserDetailsService.getLoggedInUserId()))))
                .orderBy(DSL.rand())
                .limit(10).fetchInto(TextAudioDto.class);
    }

    public byte[] getAudio(long groupId, long audioId) throws IOException {
        isAllowed(groupId);
        //TODO check if audio is in the right group audioId
        return Files.readAllBytes(labelingToolConfig.getBasePath().resolve("./text_audio/" + audioId + ".flac"));
    }

    public void putExcerptSkipped(long groupId, long excerptId) {
        checkExcerpt(groupId, excerptId);

        dslContext.update(EXCERPT).set(EXCERPT.ISSKIPPED, EXCERPT.ISSKIPPED.plus(1)).where(EXCERPT.ID.eq(excerptId)).execute();
        RecordingRecord recordingRecord = dslContext.newRecord(RECORDING);
        recordingRecord.setUserId(customUserDetailsService.getLoggedInUserId());
        recordingRecord.setExcerptId(excerptId);
        recordingRecord.setLabel(RecordingLabel.SKIPPED);
        recordingRecord.store();
    }

    public void putExcerptPrivate(long groupId, long excerptId) {
        checkExcerpt(groupId, excerptId);

        dslContext.update(EXCERPT).set(EXCERPT.ISPRIVATE, true).where(EXCERPT.ID.eq(excerptId)).execute();
        RecordingRecord recordingRecord = dslContext.newRecord(RECORDING);
        recordingRecord.setUserId(customUserDetailsService.getLoggedInUserId());
        recordingRecord.setExcerptId(excerptId);
        recordingRecord.setLabel(RecordingLabel.PRIVATE);
        recordingRecord.store();
    }

    private void checkExcerpt(long groupId, long excerptId) {
        isAllowed(groupId);
        // TODO maybe add direct foreign keys instead of join
        boolean equals = dslContext.select(USER_GROUP.ID)
                .from(EXCERPT.join(ORIGINAL_TEXT).onKey().join(USER_GROUP).onKey())
                .where(EXCERPT.ID.eq(excerptId))
                .fetchOne().component1().equals(groupId);
        if (!equals) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    private void isAllowed(long userGroupId) {
        if (!customUserDetailsService.isAllowedOnProject(userGroupId, false))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
}
