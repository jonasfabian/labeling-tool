package ch.fhnw.labeling_tool;

import ch.fhnw.labeling_tool.jooq.tables.daos.ExcerptDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.RecordingDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserGroupDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.User;
import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup;
import ch.fhnw.labeling_tool.model.ChangePassword;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

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
    public void postUserGroup(UserGroup userGroup) {
        userGroupDao.insert(userGroup);
    }

@
}
