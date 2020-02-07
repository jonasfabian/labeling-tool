/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.pojos;


import ch.fhnw.labeling_tool.jooq.enums.UserLicence;
import ch.fhnw.labeling_tool.jooq.enums.UserSex;

import java.io.Serializable;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class User implements Serializable {

    private static final long serialVersionUID = -1905675456;

    private Long        id;
    private String      firstName;
    private String      lastName;
    private String      email;
    private String      username;
    private String      password;
    private String      canton;
    private UserSex     sex;
    private UserLicence licence;
    private Boolean     enabled;

    public User() {}

    public User(User value) {
        this.id = value.id;
        this.firstName = value.firstName;
        this.lastName = value.lastName;
        this.email = value.email;
        this.username = value.username;
        this.password = value.password;
        this.canton = value.canton;
        this.sex = value.sex;
        this.licence = value.licence;
        this.enabled = value.enabled;
    }

    public User(
        Long        id,
        String      firstName,
        String      lastName,
        String      email,
        String      username,
        String      password,
        String      canton,
        UserSex     sex,
        UserLicence licence,
        Boolean     enabled
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
        this.canton = canton;
        this.sex = sex;
        this.licence = licence;
        this.enabled = enabled;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull
    @Size(max = 100)
    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @NotNull
    @Size(max = 100)
    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @NotNull
    @Size(max = 100)
    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @NotNull
    @Size(max = 100)
    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @NotNull
    @Size(max = 100)
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @NotNull
    @Size(max = 45)
    public String getCanton() {
        return this.canton;
    }

    public void setCanton(String canton) {
        this.canton = canton;
    }

    public UserSex getSex() {
        return this.sex;
    }

    public void setSex(UserSex sex) {
        this.sex = sex;
    }

    public UserLicence getLicence() {
        return this.licence;
    }

    public void setLicence(UserLicence licence) {
        this.licence = licence;
    }

    public Boolean getEnabled() {
        return this.enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("User (");

        sb.append(id);
        sb.append(", ").append(firstName);
        sb.append(", ").append(lastName);
        sb.append(", ").append(email);
        sb.append(", ").append(username);
        sb.append(", ").append(password);
        sb.append(", ").append(canton);
        sb.append(", ").append(sex);
        sb.append(", ").append(licence);
        sb.append(", ").append(enabled);

        sb.append(")");
        return sb.toString();
    }
}
