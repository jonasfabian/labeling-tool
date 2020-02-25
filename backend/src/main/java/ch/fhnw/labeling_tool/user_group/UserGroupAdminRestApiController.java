package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    //TODO add enpdoints for overview etc.
    //TODO add endponints for user_group administration

}
