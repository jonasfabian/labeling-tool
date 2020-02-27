package ch.fhnw.labeling_tool;

import ch.fhnw.labeling_tool.jooq.enums.UserGroupRoleRole;
import ch.fhnw.labeling_tool.jooq.tables.daos.*;
import ch.fhnw.labeling_tool.jooq.tables.pojos.*;
import ch.fhnw.labeling_tool.model.ChangePassword;
import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import static ch.fhnw.labeling_tool.jooq.Tables.USER;
import static ch.fhnw.labeling_tool.jooq.Tables.USER_GROUP_ROLE;

@RestController
@RequestMapping("/api/")
public class RestApiController {
    private final UserGroupDao userGroupDao;
    private final CustomUserDetailsService customUserDetailsService;
    private final DomainDao domainDao;
    private final DialectDao dialectDao;
    private final UserGroupRoleDao userGroupRoleDao;
    private final UserDao userDao;
    private final DSLContext dslContext;

    @Autowired
    public RestApiController(UserGroupDao userGroupDao, CustomUserDetailsService customUserDetailsService, DomainDao domainDao, DialectDao dialectDao, UserGroupRoleDao userGroupRoleDao, UserDao userDao, DSLContext dslContext) {
        this.userGroupDao = userGroupDao;
        this.customUserDetailsService = customUserDetailsService;
        this.domainDao = domainDao;
        this.dialectDao = dialectDao;
        this.userGroupRoleDao = userGroupRoleDao;
        this.userDao = userDao;
        this.dslContext = dslContext;
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

    @DeleteMapping("user_group_role")
    public void deleteUserGroupRole(@RequestParam long id) {
        var userGroupRole = userGroupRoleDao.fetchOneById(id);
        customUserDetailsService.isAllowedOnProject(userGroupRole.getUserGroupId(), true);
        userGroupRoleDao.deleteById(id);
    }

    @PostMapping("user_group_role")
    public boolean postUserGroupRole(@RequestParam String email, @RequestParam UserGroupRoleRole mode, @RequestParam long userGroupId) {
        customUserDetailsService.isAllowedOnProject(userGroupId, true);
        var opt = Optional.ofNullable(userDao.fetchOneByEmail(email))
                .or(() -> Optional.ofNullable(userDao.fetchOneByUsername(email)));
        opt.ifPresent(user -> userGroupRoleDao.insert(new UserGroupRole(null, mode, user.getId(), userGroupId)));
        return opt.isPresent();
    }

    @GetMapping("user_group_role")
    public List<UserGroupRoleDto> user_group_role(@RequestParam UserGroupRoleRole mode, @RequestParam long userGroupId) {
        customUserDetailsService.isAllowedOnProject(userGroupId, true);
        if (userGroupId == 0)
            return dslContext.select(USER_GROUP_ROLE.ID, USER.USERNAME, USER.EMAIL)
                    .from(USER_GROUP_ROLE.join(USER).onKey())
                    .where(USER_GROUP_ROLE.ROLE.eq(mode))
                    .fetchInto(UserGroupRoleDto.class);
        else {
            return dslContext.select(USER_GROUP_ROLE.ID, USER.USERNAME, USER.EMAIL)
                    .from(USER_GROUP_ROLE.join(USER).onKey())
                    .where(USER_GROUP_ROLE.ROLE.eq(mode).and(USER_GROUP_ROLE.USER_GROUP_ID.eq(userGroupId)))
                    .fetchInto(UserGroupRoleDto.class);
        }
    }

    //TODO add enpoint to update the user_group_role (s)
    static class UserGroupRoleDto {
        public final Long id;
        public final String username, email;

        public UserGroupRoleDto(Long id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }
    }
}
