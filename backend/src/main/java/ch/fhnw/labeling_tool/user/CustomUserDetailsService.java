package ch.fhnw.labeling_tool.user;

import ch.fhnw.labeling_tool.jooq.tables.daos.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import static ch.fhnw.labeling_tool.jooq.Tables.USER;

@Component
public class CustomUserDetailsService implements UserDetailsService {
    private final UserDao userDao;

    @Autowired
    public CustomUserDetailsService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userDao.fetchOptional(USER.USERNAME, username)
//                TODO instead fetch all roles from the group repositories and only add admin if it is the super admin
//                TODO we need to add a manual check anyway if the group is allowed
                .map(user -> new CustomUserDetails(user.getUsername(), user.getPassword(), AuthorityUtils.createAuthorityList("ADMIN", "GROUP_ADMIN"), user.getId()))
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
