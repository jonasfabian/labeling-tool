package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.config.LabelingToolConfig;
import ch.fhnw.labeling_tool.jooq.tables.daos.ExcerptDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.OriginalText;
import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.xml.sax.SAXException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ch.fhnw.labeling_tool.jooq.Tables.*;

@Service
public class UserGroupAdminService {

    private final CustomUserDetailsService customUserDetailsService;
    private final ExcerptDao excerptDao;
    private final DSLContext dslContext;
    private final LabelingToolConfig labelingToolConfig;
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    public UserGroupAdminService(CustomUserDetailsService customUserDetailsService, ExcerptDao excerptDao, DSLContext dslContext, LabelingToolConfig labelingToolConfig) {
        this.customUserDetailsService = customUserDetailsService;
        this.excerptDao = excerptDao;
        this.dslContext = dslContext;
        this.labelingToolConfig = labelingToolConfig;
    }

    public void postOriginalText(long groupId, long domainId, MultipartFile[] files) {
        isAllowed(groupId);
        var parser = new AutoDetectParser(TikaConfig.getDefaultConfig());
        var path = labelingToolConfig.getBasePath().resolve("extracted_text");
        try {
            Files.createDirectories(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String collect = Arrays.stream(files).map(file -> {
            try {
                var bodyContentHandler = new BodyContentHandler();
                var metadata = new Metadata();
                metadata.add(Metadata.RESOURCE_NAME_KEY, file.getOriginalFilename());
                metadata.add(Metadata.CONTENT_TYPE, file.getContentType());
                parser.parse(new ByteArrayInputStream(file.getBytes()), bodyContentHandler, metadata);
                var text = bodyContentHandler.toString();

                OriginalText originalText = new OriginalText(null, groupId, domainId, customUserDetailsService.getLoggedInUserId(), null);
                OriginalTextRecord textRecord = dslContext.newRecord(ORIGINAL_TEXT, originalText);
                textRecord.store();
                Long id = textRecord.getId();
                Files.writeString(path.resolve(id + ".txt"), text, StandardCharsets.UTF_8);
                Files.write(labelingToolConfig.getBasePath().resolve("original_text/" + id + ".bin"), file.getBytes());
                return Optional.of(id);
            } catch (IOException | TikaException | SAXException ex) {
                logger.error("failed to parse original text: ", ex);
                return Optional.empty();
            }
        }).flatMap(Optional::stream).map(Object::toString).collect(Collectors.joining(","));
        try {
            Process process = Runtime.getRuntime().exec(labelingToolConfig.getCondaExec() + " " + collect);

        } catch (Exception e) {
            logger.error("Exception Raised", e);
        }
    }

    private void isAllowed(long userGroupId) {
        //TODO for now the admin permission is not checked -> activate once group admin page etc. is ready
        if (!customUserDetailsService.isAllowedOnProject(userGroupId, false))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    public void putTextAudio(long groupId, TextAudio textAudio) {
        isAllowed(groupId);
        //TODO implement logic to update text audio etc.
        //TODO we also need to update the audio segment on the file system.
        //or
        //    TODO instead insert a new record instead

        //TODO maybe also add ability to delete not correct recordings -> based on record labels
    }

    public List<OverviewOccurrence> getOverviewOccurrence(long groupId, OccurrenceMode mode) {
        isAllowed(groupId);
        if (mode == OccurrenceMode.TEXT_AUDIO) {
            if (labelingToolConfig.getPublicGroupId().equals(groupId))
                return dslContext.select(TEXT_AUDIO.ID, TEXT_AUDIO.CORRECT, TEXT_AUDIO.WRONG, TEXT_AUDIO.TEXT)
                        .from(TEXT_AUDIO)
                        .where(TEXT_AUDIO.CORRECT.plus(TEXT_AUDIO.WRONG).ge(0L))
                        .fetchInto(OverviewOccurrence.class);
            else return List.of();
        } else {
            return dslContext.select(RECORDING.ID, RECORDING.CORRECT, RECORDING.WRONG, EXCERPT.EXCERPT_)
                    .from(RECORDING.join(EXCERPT).onKey().join(ORIGINAL_TEXT).onKey())
                    .where(ORIGINAL_TEXT.USER_GROUP_ID.eq(groupId).and(RECORDING.CORRECT.plus(RECORDING.WRONG).ge(0L)))
                    .fetchInto(OverviewOccurrence.class);
        }
    }
}
