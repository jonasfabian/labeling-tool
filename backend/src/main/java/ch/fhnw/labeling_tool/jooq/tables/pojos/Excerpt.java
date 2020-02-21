/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq.tables.pojos;


import java.io.Serializable;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Excerpt implements Serializable {

    private static final long serialVersionUID = -1353214465;

    private Long    id;
    private Long    originalTextId;
    private String  excerpt;
    private Integer isskipped;
    private Boolean isprivate;

    public Excerpt() {}

    public Excerpt(Excerpt value) {
        this.id = value.id;
        this.originalTextId = value.originalTextId;
        this.excerpt = value.excerpt;
        this.isskipped = value.isskipped;
        this.isprivate = value.isprivate;
    }

    public Excerpt(
        Long    id,
        Long    originalTextId,
        String  excerpt,
        Integer isskipped,
        Boolean isprivate
    ) {
        this.id = id;
        this.originalTextId = originalTextId;
        this.excerpt = excerpt;
        this.isskipped = isskipped;
        this.isprivate = isprivate;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull
    public Long getOriginalTextId() {
        return this.originalTextId;
    }

    public void setOriginalTextId(Long originalTextId) {
        this.originalTextId = originalTextId;
    }

    @NotNull
    @Size(max = 65535)
    public String getExcerpt() {
        return this.excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public Integer getIsskipped() {
        return this.isskipped;
    }

    public void setIsskipped(Integer isskipped) {
        this.isskipped = isskipped;
    }

    public Boolean getIsprivate() {
        return this.isprivate;
    }

    public void setIsprivate(Boolean isprivate) {
        this.isprivate = isprivate;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Excerpt (");

        sb.append(id);
        sb.append(", ").append(originalTextId);
        sb.append(", ").append(excerpt);
        sb.append(", ").append(isskipped);
        sb.append(", ").append(isprivate);

        sb.append(")");
        return sb.toString();
    }
}
