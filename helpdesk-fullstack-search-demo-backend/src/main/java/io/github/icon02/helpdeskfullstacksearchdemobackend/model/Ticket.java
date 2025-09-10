package io.github.icon02.helpdeskfullstacksearchdemobackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "TICKETS")
public class Ticket implements LanguageAware, UpdatedAtAware {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id = null;
    @Column(name = "TITLE")
    @NotNull
    private String title = "";
    @Column(name = "DESCRIPTION")
    private String description = "";
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "TICKET_TAGS",
            joinColumns = @JoinColumn(name = "TICKET_ID"),
            inverseJoinColumns = @JoinColumn(name = "TAG_ID"),
            uniqueConstraints = @UniqueConstraint(name = "pk_ticket_tags", columnNames = {"TICKET_ID", "TAG_ID"})
    )
    @OrderBy("name ASC")
    private List<Tag> tags = new ArrayList<>();
    @Column(name = "LANGUAGE")
    private String language = "de-AT";
    @Column(name = "UPDATED_AT")
    private Date updatedAt;
    @ManyToOne(fetch = FetchType.EAGER, targetEntity = User.class)
    @JoinColumn(
            name = "UPDATED_BY",
            referencedColumnName = "ID",
            nullable = false
    )
    private User updatedBy;

    @PreUpdate
    @PrePersist()
    void preSave() {
        trim();
        this.updatedAt = new Date();
    }

    private void trim() {
        if(this.title != null) {
            this.title = this.title.trim();
        }
        if(this.description != null) {
            this.description = this.description.trim();
        }
    }
}
