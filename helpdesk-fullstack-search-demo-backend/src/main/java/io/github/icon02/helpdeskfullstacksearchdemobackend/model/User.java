package io.github.icon02.helpdeskfullstacksearchdemobackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "USERS")
public class User {
    @Id
    @Column(name = "ID")
    private Long id;
    @Column(name = "EMAIL")
    private String email;
    @Column(name = "NAME")
    private String name;
    @Column(name = "CREATED_AT")
    private Date createdAt;


    @PrePersist()
    void prePersist() {
        trim();
        this.createdAt = null;
    }

    @PreUpdate()
    void preUpdate() {
        trim();
    }

    private void trim() {
        if(this.name != null) {
            this.name = this.name.trim();
        }
        if(this.email != null) {
            this.email = this.email.trim();
        }
    }
}
