package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.pojos.CheckedTextAudio;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import ch.fhnw.labeling_tool.model.TextAudioDto;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/user_group/{groupId}/")
public class UserGroupRestApiController {
    private final UserGroupService userGroupService;
    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    public UserGroupRestApiController(UserGroupService userGroupService, CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
        this.userGroupService = userGroupService;
    }

    @PostMapping("recording")
    public void postRecording(@PathVariable long groupId, @RequestParam long excerptId, @RequestParam MultipartFile file) throws IOException {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        userGroupService.postRecording(excerptId, file);
    }

    @GetMapping("excerpt")
    public Excerpt getExcerpt(@PathVariable long groupId) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        return userGroupService.getExcerpt(groupId);
    }

    @PostMapping("original_text")
    public void postOriginalText(@PathVariable long groupId, @RequestParam MultipartFile[] files) throws IOException {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        userGroupService.postOriginalText(groupId, files);
    }

    @PostMapping("checked_text_audio")
    public void postCheckedTextAudio(@PathVariable long groupId, @RequestBody CheckedTextAudio checkedTextAudio) throws IOException {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        userGroupService.postCheckedTextAudio(groupId, checkedTextAudio);
    }

    @GetMapping("text_audio/next")
    public List<TextAudioDto> getNextTextAudios(@PathVariable long groupId) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
        return userGroupService.getNextTextAudios(groupId,customUserDetailsService.getLoggedInUserId());
    }

    @GetMapping(value = "text_audio/audio/{audioId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public byte[] getAudio(@PathVariable long groupId, @PathVariable long audioId) throws IOException {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, false);
//        TODO check if audio is in the right group audioId
//        TODO add config for path
        return Files.readAllBytes(Paths.get("./data/text_audio/" + audioId + ".flac"));
    }

    //    TODO instead insert a new record in checked-occurence
    @PostMapping("updateTextAudio")
    public void updateTextAudio(@PathVariable long groupId, @RequestBody TextAudio textAudio) {
        customUserDetailsService.isAllowedOnProjectThrow(groupId, true);
        //TODO implement logic to update text audio etc.
        //TODO we also need to update the audio segment on the file system.
    }
}
