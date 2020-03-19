package ch.fhnw.labeling_tool.admin;

import ch.fhnw.labeling_tool.config.LabelingToolConfig;
import ch.fhnw.labeling_tool.jooq.enums.RecordingLabel;
import ch.fhnw.labeling_tool.jooq.enums.UserGroupRoleRole;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserGroupRoleDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.OriginalText;
import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroupRole;
import ch.fhnw.labeling_tool.jooq.tables.records.OriginalTextRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.TextAudioRecord;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import ch.fhnw.labeling_tool.user_group.OccurrenceMode;
import ch.fhnw.labeling_tool.user_group.OverviewOccurrence;
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
    private final DSLContext dslContext;
    private final LabelingToolConfig labelingToolConfig;
    private final Logger logger = LoggerFactory.getLogger(getClass());
    private final UserGroupRoleDao userGroupRoleDao;
    private final UserDao userDao;

    @Autowired
    public UserGroupAdminService(CustomUserDetailsService customUserDetailsService, DSLContext dslContext, LabelingToolConfig labelingToolConfig, UserGroupRoleDao userGroupRoleDao, UserDao userDao) {
        this.customUserDetailsService = customUserDetailsService;
        this.dslContext = dslContext;
        this.labelingToolConfig = labelingToolConfig;
        this.userGroupRoleDao = userGroupRoleDao;
        this.userDao = userDao;
    }

    public void postOriginalText(long groupId, long domainId, MultipartFile[] files) {
        isAllowed(groupId);
        var parser = new AutoDetectParser(TikaConfig.getDefaultConfig());
        var path = labelingToolConfig.getBasePath().resolve("extracted_text");
        try {
            Files.createDirectories(path);
        } catch (IOException e) {
            logger.error("unexpected Exception: ", e);
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
            Process process = Runtime.getRuntime().exec(labelingToolConfig.getCondaExec() + " 1 " + collect);
        } catch (Exception e) {
            logger.error("Exception Raised", e);
        }
    }


    public void putTextAudio(long groupId, TextAudio textAudio) {
        isAllowed(groupId);
        TextAudioRecord textAudioRecord = dslContext.newRecord(TEXT_AUDIO, textAudio);
        textAudioRecord.update();
        dslContext.delete(CHECKED_TEXT_AUDIO).where(CHECKED_TEXT_AUDIO.TEXT_AUDIO_ID.eq(textAudio.getId())).execute();
        try {
            var process = Runtime.getRuntime().exec(labelingToolConfig.getCondaExec() + " 2 " + textAudio.getId());
        } catch (IOException e) {
            logger.error("Exception Raised", e);
        }

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
                    .where(RECORDING.LABEL.eq(RecordingLabel.RECORDED).and(ORIGINAL_TEXT.USER_GROUP_ID.eq(groupId).and(RECORDING.CORRECT.plus(RECORDING.WRONG).ge(0L))))
                    .fetchInto(OverviewOccurrence.class);
        }
    }

    public List<UserGroupRoleDto> getUserGroupRole(UserGroupRoleRole mode, long groupId) {
        isAllowed(groupId);
        var conditionStep = dslContext.select(USER_GROUP_ROLE.ID, USER.USERNAME, USER.EMAIL)
                .from(USER_GROUP_ROLE.join(USER).onKey())
                .where(USER_GROUP_ROLE.ROLE.eq(mode));
        if (mode == UserGroupRoleRole.ADMIN) {
            if (!customUserDetailsService.isAdmin()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        } else {
            conditionStep = conditionStep.and(USER_GROUP_ROLE.USER_GROUP_ID.eq(groupId));
        }
        return conditionStep.fetchInto(UserGroupRoleDto.class);
    }

    public boolean postUserGroupRole(String email, UserGroupRoleRole mode, long groupId) {
        isAllowed(groupId);
        if (mode == UserGroupRoleRole.ADMIN) {
            if (!customUserDetailsService.isAdmin()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        var opt = Optional.ofNullable(userDao.fetchOneByEmail(email))
                .or(() -> Optional.ofNullable(userDao.fetchOneByUsername(email)));
        opt.ifPresent(user -> userGroupRoleDao.insert(new UserGroupRole(null, mode, user.getId(), groupId)));
        return opt.isPresent();
    }

    public void deleteUserGroupRole(long id) {
        var userGroupRole = userGroupRoleDao.fetchOneById(id);
        isAllowed(userGroupRole.getUserGroupId());
        userGroupRoleDao.deleteById(id);
    }

    private void isAllowed(long groupId) {
        if (!customUserDetailsService.isAllowedOnProject(groupId, true))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    public TextAudio getTextAudio(long groupId, Long textAudioId) {
        isAllowed(groupId);
        return dslContext.select(TEXT_AUDIO.fields()).from(TEXT_AUDIO).where(TEXT_AUDIO.ID.eq(textAudioId)).fetchOneInto(TextAudio.class);
    }

    public byte[] getTextAudioAudio(long groupId, Long textAudioId) throws IOException {
        isAllowed(groupId);
        var textAudio = dslContext.select(SOURCE.RAW_AUDIO_PATH).from(TEXT_AUDIO.join(SOURCE).onKey()).where(TEXT_AUDIO.ID.eq(textAudioId)).fetchOne(SOURCE.RAW_AUDIO_PATH);
        return Files.readAllBytes(labelingToolConfig.getBasePath().resolve(textAudio));
    }
}
