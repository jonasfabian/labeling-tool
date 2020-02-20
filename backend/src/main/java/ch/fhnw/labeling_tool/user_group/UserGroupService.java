package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.config.Config;
import ch.fhnw.labeling_tool.jooq.tables.daos.CheckedTextAudioDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.ExcerptDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.RecordingDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.*;
import ch.fhnw.labeling_tool.jooq.tables.records.OriginalTextRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.RecordingRecord;
import ch.fhnw.labeling_tool.model.TextAudioDto;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static ch.fhnw.labeling_tool.jooq.Tables.*;

@Service
public class UserGroupService {
    private final CustomUserDetailsService customUserDetailsService;
    private final RecordingDao recordingDao;
    private final ExcerptDao excerptDao;
    private final DSLContext dslContext;
    private final CheckedTextAudioDao checkedTextAudioDao;
    private final Config config;

    @Autowired
    public UserGroupService(CustomUserDetailsService customUserDetailsService, RecordingDao recordingDao, ExcerptDao excerptDao, DSLContext dslContext, CheckedTextAudioDao checkedTextAudioDao, Config config) {
        this.customUserDetailsService = customUserDetailsService;
        this.recordingDao = recordingDao;
        this.excerptDao = excerptDao;
        this.dslContext = dslContext;
        this.checkedTextAudioDao = checkedTextAudioDao;
        this.config = config;
    }

    public void postRecording(long groupId, long excerptId, MultipartFile file) throws IOException {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        var r2 = new Recording(null, excerptId, customUserDetailsService.getLoggedInUserId(), null);
        RecordingRecord recordingRecord = dslContext.newRecord(RECORDING, r2);
        recordingRecord.store();
        Files.write(config.getBasePath().resolve("recording/" + recordingRecord.getId() + ".ogg"), file.getBytes());
        recordingDao.insert(r2);
    }

    public Excerpt getExcerpt(Long groupId) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        // TODO limit based on what was already labeled by user and/or based on dialect .
//        TODO not sure about the performance of this query -> maybe return 10 like check component
        return dslContext.select(EXCERPT.fields())
                .from(EXCERPT.join(ORIGINAL_TEXT).onKey().join(USER_GROUP).onKey())
                .where(USER_GROUP.ID.eq(groupId)
                        .and(EXCERPT.ID.notIn(dslContext.select(RECORDING.ID).from(RECORDING).where(RECORDING.USER_ID.eq(customUserDetailsService.getLoggedInUserId())))))
                .limit(1).fetchOneInto(Excerpt.class);
    }

    public void postOriginalText(long groupId, MultipartFile[] files) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        var parser = new AutoDetectParser(TikaConfig.getDefaultConfig());
        for (MultipartFile file : files) {
            try {
                var bodyContentHandler = new BodyContentHandler();
                var metadata = new Metadata();
                metadata.add(Metadata.RESOURCE_NAME_KEY, file.getOriginalFilename());
                metadata.add(Metadata.CONTENT_TYPE, file.getContentType());
                parser.parse(new ByteArrayInputStream(file.getBytes()), bodyContentHandler, metadata);
                var text = bodyContentHandler.toString();
                String[] sentences = (text.split("[.?!]"));
                OriginalText originalText = new OriginalText(null, groupId);
                OriginalTextRecord textRecord = dslContext.newRecord(ORIGINAL_TEXT, originalText);
                textRecord.store();
                var exps = Arrays.stream(sentences).map(s -> new Excerpt(null, textRecord.getId(), s, 0, (byte) 0)).collect(Collectors.toList());
                excerptDao.insert(exps);
                Files.write(config.getBasePath().resolve("original_text/" + textRecord.getId() + ".bin"), file.getBytes());
                //TODO maybe return result for validation / post processing before saving & publishing
            } catch (IOException | TikaException | SAXException ex) {
                //TODO maybe add a success wrapper for each file? and return them afterwards?
            }

        }

    }

    public void postCheckedTextAudio(long groupId, CheckedTextAudio checkedTextAudio) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        checkedTextAudio.setUserId(customUserDetailsService.getLoggedInUserId());
        checkedTextAudioDao.insert(checkedTextAudio);
    }

    public List<TextAudioDto> getNextTextAudios(long groupId) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
//        TODO maybe add user_group mapping for checked audio?
//        TODO maybe add ability to also check the recordings as the user_groups cannot upload anything else.
        return dslContext.select(TEXT_AUDIO.ID, TEXT_AUDIO.AUDIO_START, TEXT_AUDIO.AUDIO_END, TEXT_AUDIO.TEXT)
                .from(TEXT_AUDIO)
                .where(TEXT_AUDIO.ID.notIn(
                        dslContext.select(CHECKED_TEXT_AUDIO.TEXT_AUDIO_ID).from(CHECKED_TEXT_AUDIO)
                                .where(CHECKED_TEXT_AUDIO.USER_ID.eq(customUserDetailsService.getLoggedInUserId()))))
                .limit(10).fetchInto(TextAudioDto.class);
    }

    public byte[] getAudio(long groupId, long audioId) throws IOException {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
//        TODO check if audio is in the right group audioId
//        TODO add config for path
        return Files.readAllBytes(config.getBasePath().resolve("./text_audio/" + audioId + ".flac"));
    }

    public void putTextAudio(long groupId, TextAudio textAudio) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, true);
        //TODO implement logic to update text audio etc.
        //TODO we also need to update the audio segment on the file system.
        //or
        //    TODO instead insert a new record instead
    }
}
