package io.github.icon02.helpdeskfullstacksearchdemobackend.repository;

import io.github.icon02.helpdeskfullstacksearchdemobackend.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepo extends JpaRepository<Article, Long> {
}
