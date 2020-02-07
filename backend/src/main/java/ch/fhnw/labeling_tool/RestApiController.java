package ch.fhnw.labeling_tool;

import ch.fhnw.labeling_tool.jooq.tables.daos.ExcerptDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.RecordingDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserGroupDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.TextAudio;
import ch.fhnw.labeling_tool.jooq.tables.pojos.User;
import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup;
import ch.fhnw.labeling_tool.model.ChangePassword;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/")
public class RestApiController {
    private final UserGroupDao userGroupDao;
    private final RecordingDao recordingDao;
    private final CustomUserDetailsService customUserDetailsService;
    private final ExcerptDao excerptDao;

    @Autowired
    public RestApiController(UserGroupDao userGroupDao, RecordingDao recordingDao, CustomUserDetailsService customUserDetailsService, ExcerptDao excerptDao) {
        this.userGroupDao = userGroupDao;
        this.recordingDao = recordingDao;
        this.customUserDetailsService = customUserDetailsService;
        this.excerptDao = excerptDao;
    }

    //    TODO rest-endpoints taken from flask => replace and move to sub modules


    @PostMapping("register")
    public void register(@RequestBody User user) {
        customUserDetailsService.register(user);
    }

    /**
     * endpoint used for user login validation
     */
    @GetMapping("user")
    public Principal getPrincipal(Principal user) {
        return user;
    }

    @GetMapping("user/{id}")
    public User getUser(@PathVariable long id) {
        return customUserDetailsService.getUser(id);
    }

    @PostMapping("user")
    public void postUser(@RequestBody User user) {
        customUserDetailsService.postUser(user);
    }

    @PutMapping("user")
    public void putUser(@RequestBody User user) {
        customUserDetailsService.putUser(user);
    }

    @PutMapping("user/password")
    public void putPassword(@RequestBody ChangePassword changePassword) {
        customUserDetailsService.putPassword(changePassword);
    }

    @GetMapping("user_group")
    public List<UserGroup> getUserGroup() {
        return userGroupDao.findAll();
    }

    @PostMapping("user_group")
    public void postUserGroup(@RequestBody UserGroup userGroup) {
        userGroupDao.insert(userGroup);
    }

    //    TODO replace with real logic -> dummy taken from flask
    @GetMapping("getTenNonLabeledTextAudios")
    public List<TextAudio> getTenNonLabeledTextAudios() {
        return IntStream.range(0, 10)
                .mapToObj(i -> new TextAudio(1L, 0.0, 1.0, "Hallo welt", 1, "nobody", 0, 0L, 0L))
                .collect(Collectors.toList());
    }

    @GetMapping("getAudio")
    public byte[] getAudio() throws IOException {
        return Files.readAllBytes(Paths.get("./data/23/audio.wav"));
    }

    //    TODO instead insert a new record in checked-occurence
    @PostMapping("updateTextAudio")
    public void updateTextAudio(@RequestBody UserGroup userGroup) {
        userGroupDao.insert(userGroup);
    }
}
