package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.daos.ExcerptDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.RecordingDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Recording;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static ch.fhnw.labeling_tool.jooq.Tables.*;

@Service
public class UserGroupService {
    private final CustomUserDetailsService customUserDetailsService;
    private final RecordingDao recordingDao;
    private final ExcerptDao excerptDao;
    private final DSLContext dslContext;

    @Autowired
    public UserGroupService(CustomUserDetailsService customUserDetailsService, RecordingDao recordingDao, ExcerptDao excerptDao, DSLContext dslContext) {
        this.customUserDetailsService = customUserDetailsService;
        this.recordingDao = recordingDao;
        this.excerptDao = excerptDao;
        this.dslContext = dslContext;
    }

    public void postRecording(long excerptId, MultipartFile file) throws IOException {
//        TODO check logic
        var r2 = new Recording(null, excerptId, customUserDetailsService.getLoggedInUserId(), file.getBytes(), null);
        recordingDao.insert(r2);
    }

    public Excerpt getExcerpt(Long groupId) {
        // TODO limit based on what was already labeled by user and/or based on dialect .
        return dslContext.select(EXCERPT.fields())
                .from(EXCERPT.join(USER_GROUP).onKey())
                .where(USER_GROUP.ID.eq(groupId)
                        .and(EXCERPT.ID.notIn(dslContext.select(RECORDING.ID).from(RECORDING).where(RECORDING.USER_ID.eq(customUserDetailsService.getLoggedInUserId())))))
                .limit(1).fetchOneInto(Excerpt.class);
    }

    public void postOriginalText(long groupId, MultipartFile[] files) {
        //TODO implement file parsing using tika

    }
}
