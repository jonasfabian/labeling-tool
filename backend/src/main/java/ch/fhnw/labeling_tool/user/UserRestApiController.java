package ch.fhnw.labeling_tool.user;

import ch.fhnw.labeling_tool.jooq.tables.daos.DialectDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserGroupDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.Dialect;
import ch.fhnw.labeling_tool.jooq.tables.pojos.User;
import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroup;
import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroupRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/")
public class UserRestApiController {
    private final CustomUserDetailsService customUserDetailsService;
    private final DialectDao dialectDao;
    private final UserGroupDao userGroupDao;

    @Autowired
    public UserRestApiController(CustomUserDetailsService customUserDetailsService, DialectDao dialectDao, UserGroupDao userGroupDao) {
        this.customUserDetailsService = customUserDetailsService;
        this.dialectDao = dialectDao;
        this.userGroupDao = userGroupDao;
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

    @PutMapping("user")
    public void putUser(@RequestBody User user) {
        customUserDetailsService.putUser(user);
    }

    @PutMapping("user/password")
    public void putPassword(@RequestBody ChangePassword changePassword) {
        customUserDetailsService.putPassword(changePassword);
    }

    @PostMapping("public/register")
    public void register(@RequestBody User user) {
        customUserDetailsService.register(user);
    }

    @GetMapping("public/dialect")
    public List<Dialect> getDialect() {
        return dialectDao.findAll();
    }

    @GetMapping("user_group")
    public List<UserGroup> getUserGroup() {
        if (customUserDetailsService.isAdmin()) {
            return userGroupDao.findAll();
        } else {
            var ids = customUserDetailsService.getLoggedInUser().userGroupRoles.stream().map(UserGroupRole::getUserGroupId).distinct();
            return userGroupDao.fetchById(ids.toArray(Long[]::new));
        }
    }
}
