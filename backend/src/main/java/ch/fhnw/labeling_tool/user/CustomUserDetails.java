package ch.fhnw.labeling_tool.user;

import ch.fhnw.labeling_tool.jooq.tables.pojos.UserGroupRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails extends User {
    public final Long id;
    public final List<UserGroupRole> userGroupRoles;

    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities, Long id, List<UserGroupRole> userGroupRoles) {
        super(username, password, authorities);
        this.id = id;
        this.userGroupRoles = userGroupRoles;
    }
}
