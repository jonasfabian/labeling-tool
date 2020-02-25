package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.config.Config;
import ch.fhnw.labeling_tool.jooq.enums.RecordingLabel;
import ch.fhnw.labeling_tool.jooq.tables.daos.CheckedTextAudioDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.ExcerptDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.RecordingDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.*;
import ch.fhnw.labeling_tool.jooq.tables.records.OriginalTextRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.RecordingRecord;
import ch.fhnw.labeling_tool.model.TextAudioDto;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import edu.stanford.nlp.simple.Document;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
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
    private final Logger logger = LoggerFactory.getLogger(getClass());

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
        var r2 = new Recording(null, excerptId, customUserDetailsService.getLoggedInUserId(), null, RecordingLabel.RECORDED);
        RecordingRecord recordingRecord = dslContext.newRecord(RECORDING, r2);
        recordingRecord.store();
        Files.write(config.getBasePath().resolve("recording/" + recordingRecord.getId() + ".webm"), file.getBytes());
        recordingDao.insert(r2);
    }

    public Excerpt getExcerpt(Long groupId) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
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

    public void postOriginalText(long groupId, long domainId, MultipartFile[] files) {
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

                OriginalText originalText = new OriginalText(null, groupId, domainId);
                OriginalTextRecord textRecord = dslContext.newRecord(ORIGINAL_TEXT, originalText);
                textRecord.store();
                // TODO replace corenlp with spacy
                // TODO instead use this: "conda run -n labeling-tool python data-import.py"
                // TODO not sure if we want to directly insert the data from the python site?
                // TODO not sure about the syncronication or atomic integer
                var exps = new Document(text).sentences().stream().map(s -> new Excerpt(null, textRecord.getId(), s.text(), 0, false)).collect(Collectors.toList());
                excerptDao.insert(exps);
                Files.write(config.getBasePath().resolve("original_text/" + textRecord.getId() + ".bin"), file.getBytes());
            } catch (IOException | TikaException | SAXException ex) {
                logger.error("failed to parse original text: ", ex);
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
                        /*TODO maybe filter already checked ones e.g correct,wrong>10*/
                        /*TODO this probably needs a internal counter so we do not need to join each time*/
                        dslContext.select(CHECKED_TEXT_AUDIO.TEXT_AUDIO_ID).from(CHECKED_TEXT_AUDIO)
                                .where(CHECKED_TEXT_AUDIO.USER_ID.eq(customUserDetailsService.getLoggedInUserId()))))
                .orderBy(DSL.rand())
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

    public void putExcerptSkipped(long groupId, long excerptId) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
//        TODO check if excerpt is in group
        dslContext.update(EXCERPT).set(EXCERPT.ISSKIPPED, EXCERPT.ISSKIPPED.plus(1)).where(EXCERPT.ID.eq(excerptId)).execute();
        RecordingRecord recordingRecord = dslContext.newRecord(RECORDING);
        recordingRecord.setUserId(customUserDetailsService.getLoggedInUserId());
        recordingRecord.setExcerptId(excerptId);
        recordingRecord.setLabel(RecordingLabel.SKIPPED);
        recordingRecord.store();
    }

    public void putExcerptPrivate(long groupId, long excerptId) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        //        TODO check if excerpt is in group
//        TODO probably add an private method for it
        dslContext.update(EXCERPT).set(EXCERPT.ISPRIVATE, true).where(EXCERPT.ID.eq(excerptId)).execute();
        RecordingRecord recordingRecord = dslContext.newRecord(RECORDING);
        recordingRecord.setUserId(customUserDetailsService.getLoggedInUserId());
        recordingRecord.setExcerptId(excerptId);
        recordingRecord.setLabel(RecordingLabel.PRIVATE);
        recordingRecord.store();
    }
}
