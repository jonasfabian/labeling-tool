package ch.fhnw.labeling_tool.admin;

import ch.fhnw.labeling_tool.jooq.enums.UserGroupRoleRole;
import ch.fhnw.labeling_tool.jooq.tables.daos.DomainDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Domain;
import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import ch.fhnw.labeling_tool.user_group.OccurrenceMode;
import ch.fhnw.labeling_tool.user_group.OverviewOccurrence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/user_group/{groupId}/admin")
public class UserGroupAdminRestApiController {
    private final UserGroupAdminService userGroupAdminService;
    private final DomainDao domainDao;

    @Autowired
    public UserGroupAdminRestApiController(UserGroupAdminService userGroupAdminService, DomainDao domainDao) {
        this.userGroupAdminService = userGroupAdminService;
        this.domainDao = domainDao;
    }

    @PutMapping("text_audio")
    public void putTextAudio(@PathVariable long groupId, @RequestBody TextAudio textAudio) {
        userGroupAdminService.putTextAudio(groupId, textAudio);
    }

    @GetMapping("text_audio/{textAudioId}")
    public TextAudio getTextAudio(@PathVariable long groupId, @PathVariable Long textAudioId) {
        return userGroupAdminService.getTextAudio(groupId, textAudioId);
    }

    @GetMapping(value = "text_audio/audio/{textAudioId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public byte[] getTextAudioAudio(@PathVariable long groupId, @PathVariable Long textAudioId) throws IOException {
        return userGroupAdminService.getTextAudioAudio(groupId, textAudioId);
    }

    @PostMapping("original_text")
    public void postOriginalText(@PathVariable long groupId, @RequestParam long domainId, @RequestParam MultipartFile[] files) {
        userGroupAdminService.postOriginalText(groupId, domainId, files);
    }

    @GetMapping("overview_occurrence")
    public List<OverviewOccurrence> getOverviewOccurrence(@PathVariable long groupId, @RequestParam OccurrenceMode mode) {
        return userGroupAdminService.getOverviewOccurrence(groupId, mode);
    }

    @DeleteMapping("user_group_role")
    public void deleteUserGroupRole(@RequestParam long id) {
        userGroupAdminService.deleteUserGroupRole(id);
    }

    @PostMapping("user_group_role")
    public boolean postUserGroupRole(@PathVariable long groupId, @RequestParam String email, @RequestParam UserGroupRoleRole mode) {
        return userGroupAdminService.postUserGroupRole(email, mode, groupId);
    }

    @GetMapping("user_group_role")
    public List<UserGroupRoleDto> getUserGroupRole(@PathVariable long groupId, @RequestParam UserGroupRoleRole mode) {
        return userGroupAdminService.getUserGroupRole(mode, groupId);
    }

    @GetMapping("domain")
    public List<Domain> getDomain() {
        return domainDao.findAll();
    }

}
