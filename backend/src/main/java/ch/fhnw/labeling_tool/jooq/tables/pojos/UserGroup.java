/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.pojos;


import java.io.Serializable;

import javax.validation.constraints.Size;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class UserGroup implements Serializable {

    private static final long serialVersionUID = -1696340921;

    private Long   id;
    private String name;

    public UserGroup() {}

    public UserGroup(UserGroup value) {
        this.id = value.id;
        this.name = value.name;
    }

    public UserGroup(
        Long   id,
        String name
    ) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Size(max = 100)
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("UserGroup (");

        sb.append(id);
        sb.append(", ").append(name);

        sb.append(")");
        return sb.toString();
    }
}
