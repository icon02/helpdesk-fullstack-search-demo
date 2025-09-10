package io.github.icon02.helpdeskfullstacksearchdemobackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "ARTICLES")
public class Article implements LanguageAware, UpdatedAtAware {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    @Column(name = "TITLE")
    private String title = "";
    @Column(name = "BODY")
    private String body = "";
    @Column(name = "UPDATED_AT")
    private Date updatedAt;
    @ManyToOne(fetch = FetchType.EAGER, targetEntity = User.class)
    @JoinColumn(
            name = "UPDATED_BY",
            referencedColumnName = "ID",
            nullable = false
    )
    private User updatedBy;
    @Column(name = "LANGUAGE")
    private String language = "";
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "ARTICLE_TAGS",
            joinColumns = @JoinColumn(name = "ARTICLE_ID"),
            inverseJoinColumns = @JoinColumn(name = "TAG_ID"),
            uniqueConstraints = @UniqueConstraint(name = "pk_article_tags", columnNames = {"ARTICLE_ID", "TAG_ID"})
    )
    @OrderBy("name ASC")
    private List<Tag> tags = new ArrayList<>();

    @PrePersist()
    @PreUpdate()
    void preSave() {
        trim();
        this.updatedAt = new Date();
    }

    private void trim() {
        if(this.title != null) {
            this.title = this.title.trim();
        }
        if(this.body != null) {
            this.body = this.body.trim();
        }
    }
}
