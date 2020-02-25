package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.pojos.CheckedTextAudio;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import ch.fhnw.labeling_tool.model.TextAudioDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/user_group/{groupId}/")
public class UserGroupRestApiController {
    private final UserGroupService userGroupService;

    @Autowired
    public UserGroupRestApiController(UserGroupService userGroupService) {
        this.userGroupService = userGroupService;
    }

    @PostMapping("recording")
    public void postRecording(@PathVariable long groupId, @RequestParam long excerptId, @RequestParam MultipartFile file) throws IOException {
        userGroupService.postRecording(groupId, excerptId, file);
    }

    @PutMapping("excerpt/{excerptId}/private")
    public void putExcerptPrivate(@PathVariable long groupId, @PathVariable long excerptId) {
        userGroupService.putExcerptPrivate(groupId, excerptId);
    }

    @PutMapping("excerpt/{excerptId}/skipped")
    public void putExcerptSkipped(@PathVariable long groupId, @PathVariable long excerptId) {
        userGroupService.putExcerptSkipped(groupId, excerptId);
    }

    @GetMapping("excerpt")
    public Excerpt getExcerpt(@PathVariable long groupId) {
        return userGroupService.getExcerpt(groupId);
    }

    @PostMapping("original_text")
    public void postOriginalText(@PathVariable long groupId, @RequestParam long domainId, @RequestParam MultipartFile[] files) {
        userGroupService.postOriginalText(groupId, domainId, files);
    }

    @PostMapping("checked_text_audio")
    public void postCheckedTextAudio(@PathVariable long groupId, @RequestBody CheckedTextAudio checkedTextAudio) {
        userGroupService.postCheckedTextAudio(groupId, checkedTextAudio);
    }

    @GetMapping("text_audio/next")
    public List<TextAudioDto> getNextTextAudios(@PathVariable long groupId) {
        return userGroupService.getNextTextAudios(groupId);
    }

    @GetMapping(value = "text_audio/audio/{audioId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public byte[] getAudio(@PathVariable long groupId, @PathVariable long audioId) throws IOException {
        return userGroupService.getAudio(groupId, audioId);
    }
}
