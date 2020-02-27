package ch.fhnw.labeling_tool;

import ch.fhnw.labeling_tool.jooq.tables.daos.DialectDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.DomainDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserGroupDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.*;
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
    private final CustomUserDetailsService customUserDetailsService;
    private final DomainDao domainDao;
    private final DialectDao dialectDao;

    @Autowired
    public RestApiController(UserGroupDao userGroupDao, CustomUserDetailsService customUserDetailsService, DomainDao domainDao, DialectDao dialectDao) {
        this.userGroupDao = userGroupDao;
        this.customUserDetailsService = customUserDetailsService;
        this.domainDao = domainDao;
        this.dialectDao = dialectDao;
    }

    @PostMapping("public/register")
    public void register(@RequestBody User user) {
        customUserDetailsService.register(user);
    }

    @GetMapping("public/dialect")
    public List<Dialect> getDialect() {
        return dialectDao.findAll();
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

    //TODO not  sure this is needed anymore -> maybe move to admin
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

    @GetMapping("domain")
    public List<Domain> getDomain() {
        return domainDao.findAll();
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
