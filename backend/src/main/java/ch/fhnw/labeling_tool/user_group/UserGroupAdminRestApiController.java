package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user_group/{groupId}/admin")
public class UserGroupAdminRestApiController {
    private final UserGroupAdminService userGroupAdminService;

    @Autowired
    public UserGroupAdminRestApiController(UserGroupAdminService userGroupAdminService) {
        this.userGroupAdminService = userGroupAdminService;
    }

    @PutMapping("text_audio")
    public void putTextAudio(@PathVariable long groupId, @RequestBody TextAudio textAudio) {
        userGroupAdminService.putTextAudio(groupId, textAudio);
    }

    @PostMapping("original_text")
    public void postOriginalText(@PathVariable long groupId, @RequestParam long domainId, @RequestParam MultipartFile[] files) {
        userGroupAdminService.postOriginalText(groupId, domainId, files);
    }

    //TODO add enpdoints for overview etc.
    //TODO add endponints for user_group administration

}
