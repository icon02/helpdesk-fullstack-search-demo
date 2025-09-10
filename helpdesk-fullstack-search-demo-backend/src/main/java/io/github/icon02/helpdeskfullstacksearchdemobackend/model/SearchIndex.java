package io.github.icon02.helpdeskfullstacksearchdemobackend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Date;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "SEARCH_INDEX")
public class SearchIndex {
    @EmbeddedId
    private ID id;
    @Column(name = "TITLE", nullable = false)
    private String title;
    @Column(name = "SUMMARY", nullable = false)
    private String summary;
    @Column(
            name = "KEYWORDS",
            columnDefinition = "TEXT[]"
    )
    @JdbcTypeCode(SqlTypes.ARRAY)
    private String[] keywords;
    @Column(name = "URL",  nullable = false)
    private String url;
    @Column(name = "INDEXED_AT", nullable = false)
    private Date indexedAt;


    @Embeddable
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    @Builder
    public static class ID {
        @Column(name = "ENTITY_CLASS_NAME", nullable = false)
        private String entityClassName;
        @Column(name = "ENTITY_ID", nullable = false)
        private String entityId;
        @Column(name = "LANGUAGE", nullable = false)
        private String language;
    }
}
