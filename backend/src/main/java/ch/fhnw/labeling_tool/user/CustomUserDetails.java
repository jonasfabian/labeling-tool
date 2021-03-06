package ch.fhnw.labeling_tool.user;

import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroupRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

public class CustomUserDetails extends User {
    public final List<UserGroupRole> userGroupRoles;
    public final ch.fhnw.labeling_tool.jooq.tables.pojos.User user;

    public CustomUserDetails(ch.fhnw.labeling_tool.jooq.tables.pojos.User user, List<GrantedAuthority> authorities, List<UserGroupRole> userGroupRoles) {
        super(user.getUsername(), user.getPassword(), user.getEnabled(), true, true, true, authorities);
        this.user = user;
        user.setPassword(null);
        this.userGroupRoles = userGroupRoles;
    }
}
