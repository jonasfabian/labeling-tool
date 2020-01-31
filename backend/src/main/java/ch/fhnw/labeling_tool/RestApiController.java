package ch.fhnw.labeling_tool;

import ch.fhnw.labeling_tool.jooq.tables.daos.UserAndTextAudioDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserGroupDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.User;
import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController()
public class RestApiController {
    private final UserDao userDao;
    private final UserGroupDao userGroupDao;
    private final UserAndTextAudioDao userAndTextAudioDao;

    @Autowired
    public RestApiController(UserDao userDao, UserGroupDao userGroupDao, UserAndTextAudioDao userAndTextAudioDao) {
        this.userDao = userDao;
        this.userGroupDao = userGroupDao;
        this.userAndTextAudioDao = userAndTextAudioDao;
    }
//    TODO rest-endpoints taken from flask => replace and move to sub modules

    /**
     * endpoint used for user login validation
     */
    @GetMapping("/api/user")
    public Principal user(Principal user) {
        return user;
    }

    @PostMapping("/api/user")
    public void postUser(User user) {
        userDao.insert(user);
    }

    @PutMapping("/api/user")
    public void putUser(User user) {
        userDao.update(user);
    }

    @PostMapping("/api/user_group")
    public void postUserGroup(UserGroup userGroup) {
        userGroupDao.insert(userGroup);
    }
}
