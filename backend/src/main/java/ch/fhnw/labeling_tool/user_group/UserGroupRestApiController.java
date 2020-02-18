package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import ch.fhnw.labeling_tool.model.TextAudioDto;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/user_group/{groupId}/")
public class UserGroupRestApiController {
    private final UserGroupService userGroupService;
    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    public UserGroupRestApiController(UserGroupService userGroupService, CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
        System.out.println("this is actually used?");
        this.userGroupService = userGroupService;
    }

    @PostMapping("recording")
    public void postRecording(@PathVariable long groupId, @RequestParam long excerptId, @RequestParam MultipartFile file) throws IOException {
        customUserDetailsService.isAllowedOnProject(groupId, false);
        userGroupService.postRecording(excerptId, file);
    }

    @GetMapping("excerpt")
    public Excerpt getExcerpt(@PathVariable long groupId) {
        customUserDetailsService.isAllowedOnProject(groupId, false);
        return userGroupService.getExcerpt(groupId);
    }

    @PostMapping("original_text")
    public void postOriginalText(@PathVariable long groupId, @RequestParam MultipartFile[] files) throws IOException {
        customUserDetailsService.isAllowedOnProject(groupId, false);
        userGroupService.postOriginalText(groupId, files);
    }

    //TODO add missing logic here -> frontend needs to be refactored so it uses the right user_id
    // TODO can be a dummy for now
    @GetMapping("text_audio/next")
    public List<TextAudioDto> getNextTextAudios(@PathVariable long groupId) {
        customUserDetailsService.isAllowedOnProject(groupId, false);
        //TODO get real ones
        return IntStream.range(0, 10)
                .mapToObj(i -> new TextAudioDto(1L, 0.0, 1.0, "Hallo welt"))
                .collect(Collectors.toList());
    }

    @GetMapping("getAudio")
    public byte[] getAudio(@PathVariable long groupId) throws IOException {
        customUserDetailsService.isAllowedOnProject(groupId, false);
        return Files.readAllBytes(Paths.get("./data/23/audio.wav"));
    }

    //    TODO instead insert a new record in checked-occurence
    @PostMapping("updateTextAudio")
    public void updateTextAudio(@PathVariable long groupId, @RequestBody TextAudio textAudio) {
        customUserDetailsService.isAllowedOnProject(groupId, true);
        //TODO implement logic to update text audio etc.
        //TODO we also need to update the audio segment on the file system.
    }
}
