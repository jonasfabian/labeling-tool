package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/user_group/{groupId}/")
public class UserGroupRestApiController {
    private final UserGroupService userGroupService;

    @Autowired
    public UserGroupRestApiController(UserGroupService userGroupService) {
        System.out.println("this is actually used?");
        this.userGroupService = userGroupService;
    }

    @PostMapping("recording")
    public void postRecording(@RequestParam long excerptId, @RequestParam MultipartFile file) throws IOException {
        userGroupService.postRecording(excerptId, file);
    }

    @GetMapping("excerpt")
    public Excerpt getExcerpt(@PathVariable long groupId) {
        return userGroupService.getExcerpt(groupId);
    }

    @PostMapping("original_text")
    //TODO implemnt frontend so multiple files can be selected -> d.h normal input select logic ;)
    public void postOriginalText(@PathVariable long groupId, @RequestParam MultipartFile[] files) throws IOException {
        userGroupService.postOriginalText(groupId, files);
    }

}
