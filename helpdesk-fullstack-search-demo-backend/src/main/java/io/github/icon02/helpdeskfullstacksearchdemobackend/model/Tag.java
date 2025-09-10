package io.github.icon02.helpdeskfullstacksearchdemobackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "TAGS")
public class Tag implements LanguageAware {
    @Id
    @Column(name = "ID")
    private Long id;
    @Column(name = "NAME")
    private String name;
    @Column(name = "LANGUAGE")
    private String language;

    @PrePersist
    @PreUpdate
    void prePersistOrUpdate() {
        if(name != null) {
            name = name.trim();
        }
    }
}
