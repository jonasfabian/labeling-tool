package ch.fhnw.labeling_tool.user_group;

import ch.fhnw.labeling_tool.jooq.tables.pojos.Excerpt;
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

    @PutMapping("excerpt/{excerptId}/sentence_error")
    public void putExcerptSentenceError(@PathVariable long groupId, @PathVariable long excerptId) {
        userGroupService.putExcerptSentenceError(groupId, excerptId);
    }

    @GetMapping("excerpt")
    public Excerpt getExcerpt(@PathVariable long groupId) {
        return userGroupService.getExcerpt(groupId);
    }

    //    TODO maybe move into seperate service endpoint
//    TODO not sure it makes sense for this endpoint
    @PostMapping("occurrence/check")
    public void postCheckedOccurrence(@PathVariable long groupId, @RequestBody CheckedOccurrence checkedOccurrence) {
        userGroupService.postCheckedOccurrence(groupId, checkedOccurrence);
    }

    @GetMapping("occurrence/next")
    public List<Occurrence> getNextTextAudios(@PathVariable long groupId, @RequestParam OccurrenceMode mode) {
        return userGroupService.getNextTextAudios(groupId, mode);
    }

    @GetMapping(value = "occurrence/audio/{audioId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public byte[] getAudio(@PathVariable long groupId, @PathVariable long audioId, @RequestParam OccurrenceMode mode) throws IOException {
        return userGroupService.getAudio(groupId, audioId, mode);
    }
}
