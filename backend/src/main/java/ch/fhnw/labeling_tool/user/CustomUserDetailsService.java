package ch.fhnw.labeling_tool.user;

import ch.fhnw.labeling_tool.jooq.enums.UserGroupRoleRole;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserDao;
import ch.fhnw.labeling_tool.jooq.tables.daos.UserGroupRoleDao;
import ch.fhnw.labeling_tool.jooq.tables.pojos.User;
import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroupRole;
import ch.fhnw.labeling_tool.model.ChangePassword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import static ch.fhnw.labeling_tool.jooq.Tables.USER;

@Component
public class CustomUserDetailsService implements UserDetailsService {
    private final UserDao userDao;
    private final UserGroupRoleDao userGroupRoleDao;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CustomUserDetailsService(UserDao userDao, UserGroupRoleDao userGroupRoleDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.userGroupRoleDao = userGroupRoleDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userDao.fetchOptional(USER.USERNAME, username)
                .map(user -> {
                    var userGroupRoles = userGroupRoleDao.fetchByUserId(user.getId());
                    var authorities = userGroupRoles.stream().map(userGroupRole -> userGroupRole.getRole().toString()).distinct().toArray(String[]::new);
                    return new CustomUserDetails(user, AuthorityUtils.createAuthorityList(authorities), userGroupRoles);
                })
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

    public boolean isAdmin() {
        return getLoggedInUser().getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> r.equals("ADMIN"));
    }

    public Long getLoggedInUserId() {
        return getLoggedInUser().user.getId();
    }

    public Long getLoggedInUserDialectId() {
        return getLoggedInUser().user.getDialectId();
    }

    public boolean isAllowedOnProject(long userGroupId, boolean checkAdminPermission) {
        return isAdmin() || getLoggedInUser().userGroupRoles.stream()
                .anyMatch(userGroupRole -> userGroupRole.getUserGroupId() == userGroupId && (!checkAdminPermission || userGroupRole.getRole() == UserGroupRoleRole.GROUP_ADMIN));
    }

    public CustomUserDetails getLoggedInUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public User getUser(long id) {
        return userDao.findById(id);
    }

    public void putUser(User user) {
        if (!getLoggedInUserId().equals(user.getId()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        userDao.update(user);
    }

    public void putPassword(ChangePassword changePassword) {
        User user = userDao.fetchOneById(getLoggedInUserId());
        if (passwordEncoder.matches(changePassword.getPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(changePassword.getNewPassword()));
            userDao.update(user);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "BAD_REQUEST");
        }
    }

    public void register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        userDao.insert(user);
        Long id = userDao.fetchOneByUsername(user.getUsername()).getId();
        //add user to public group
        userGroupRoleDao.insert(new UserGroupRole(null, UserGroupRoleRole.USER, id, 1L));

    }
}
