package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.config.Config;
import ch.fhnw.labeling_tool.jooq.tables.daos.CheckedTextAudioDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.ExcerptDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.RecordingDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.jooq.DSLContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserGroupAdminService {

    private final CustomUserDetailsService customUserDetailsService;
    private final RecordingDao recordingDao;
    private final ExcerptDao excerptDao;
    private final DSLContext dslContext;
    private final CheckedTextAudioDao checkedTextAudioDao;
    private final Config config;
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    public UserGroupAdminService(CustomUserDetailsService customUserDetailsService, RecordingDao recordingDao, ExcerptDao excerptDao, DSLContext dslContext, CheckedTextAudioDao checkedTextAudioDao, Config config) {
        this.customUserDetailsService = customUserDetailsService;
        this.recordingDao = recordingDao;
        this.excerptDao = excerptDao;
        this.dslContext = dslContext;
        this.checkedTextAudioDao = checkedTextAudioDao;
        this.config = config;
    }

    private void isAllowed(long userGroupId) {
        if (!customUserDetailsService.isAllowedOnProject(userGroupId, true))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    public void putTextAudio(long groupId, TextAudio textAudio) {
        isAllowed(groupId);
        //TODO implement logic to update text audio etc.
        //TODO we also need to update the audio segment on the file system.
        //or
        //    TODO instead insert a new record instead
    }
}
