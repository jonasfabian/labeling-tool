package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.daos.ExcerptDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.OriginalTextDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.RecordingDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.pojos.OriginalText;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Recording;
import ch.fhnw.labeling_tool.jooq.tables.records.OriginalTextRecord;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.jooq.DSLContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

import static ch.fhnw.labeling_tool.jooq.Tables.*;

@Service
public class UserGroupService {
    private final CustomUserDetailsService customUserDetailsService;
    private final RecordingDao recordingDao;
    private final ExcerptDao excerptDao;
    private final OriginalTextDao originalTextDao;
    private final DSLContext dslContext;
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    public UserGroupService(CustomUserDetailsService customUserDetailsService, RecordingDao recordingDao, ExcerptDao excerptDao, OriginalTextDao originalTextDao, DSLContext dslContext) {
        this.customUserDetailsService = customUserDetailsService;
        this.recordingDao = recordingDao;
        this.excerptDao = excerptDao;
        this.originalTextDao = originalTextDao;
        this.dslContext = dslContext;
    }

    public void postRecording(long excerptId, MultipartFile file) throws IOException {
//        TODO check logic e.g. if user has even access to the group etc.
//        TODO probably save the recording in a file locally.
        var r2 = new Recording(null, excerptId, customUserDetailsService.getLoggedInUserId(), file.getBytes(), null);
        recordingDao.insert(r2);
    }

    public Excerpt getExcerpt(Long groupId) {
        // TODO limit based on what was already labeled by user and/or based on dialect .
//        TODO not sure about the performance of this query -> maybe return 10 like check component
        return dslContext.select(EXCERPT.fields())
                .from(EXCERPT.join(ORIGINAL_TEXT).onKey().join(USER_GROUP).onKey())
                .where(USER_GROUP.ID.eq(groupId)
                        .and(EXCERPT.ID.notIn(dslContext.select(RECORDING.ID).from(RECORDING).where(RECORDING.USER_ID.eq(customUserDetailsService.getLoggedInUserId())))))
                .limit(1).fetchOneInto(Excerpt.class);
    }

    public void postOriginalText(long groupId, MultipartFile[] files) {
        var parser = new AutoDetectParser(TikaConfig.getDefaultConfig());
        for (MultipartFile file : files) {
            try {
                var bodyContentHandler = new BodyContentHandler();
                var metadata = new Metadata();
                metadata.add(Metadata.RESOURCE_NAME_KEY, file.getOriginalFilename());
                metadata.add(Metadata.CONTENT_TYPE, file.getContentType());
                parser.parse(new ByteArrayInputStream(file.getBytes()), bodyContentHandler, metadata);
                var text = bodyContentHandler.toString();
                //TODO maybe split using corenlp etc.
                String[] sentences = (text.split("[.?!]"));
                OriginalText originalText = new OriginalText(null, groupId, file.getBytes(), text);
                OriginalTextRecord textRecord = dslContext.newRecord(ORIGINAL_TEXT, originalText);
                textRecord.store();
                var exps = Arrays.stream(sentences).map(s -> new Excerpt(null, textRecord.getId(), s, 0, (byte) 0)).collect(Collectors.toList());
                //TODO probably return result for validation / post processing before saving/publishing
                excerptDao.insert(exps);
            } catch (IOException | TikaException | SAXException ex) {
                //TODO not sure how we want to handle this e.g. maybe add a succes wrapper for each file? and return them afterwards?
            }

        }

    }

}
