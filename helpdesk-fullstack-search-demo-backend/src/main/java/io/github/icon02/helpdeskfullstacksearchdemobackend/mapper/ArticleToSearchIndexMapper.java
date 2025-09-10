package io.github.icon02.helpdeskfullstacksearchdemobackend.mapper;

import io.github.icon02.helpdeskfullstacksearchdemobackend.model.Article;
import io.github.icon02.helpdeskfullstacksearchdemobackend.model.SearchIndex;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class ArticleToSearchIndexMapper extends BaseMapper<Article, SearchIndex> {
    @Override
    public SearchIndex map(Article article) {
        String[] tags = new String[0];
        if (article.getTags() != null) {
            final String[] newTags = new String[article.getTags().size()];
            AtomicInteger index = new AtomicInteger();
            article.getTags().forEach((tag) -> {
                newTags[index.getAndIncrement()] = tag.getName();
            });

            tags = newTags;
        }

        return new SearchIndex(
                new SearchIndex.ID(Article.class.getSimpleName(), String.valueOf(article.getId()), article.getLanguage()),
                article.getTitle(),
                article.getBody(),
                tags,
                "/articles/" + article.getId(),
                new Date()
        );
    }

    @Override
    public Article unmap(SearchIndex searchIndex) {
        throw new UnsupportedOperationException("Cannot map from Article to SearchIndex");
    }

    @Override
    public <T extends Collection<SearchIndex>> List<Article> unmapAsList(T collection) {
        throw new UnsupportedOperationException("Cannot map from Article to SearchIndex");
    }

    @Override
    public <T extends Collection<SearchIndex>> Set<Article> unmapAsSet(T collection) {
        throw new UnsupportedOperationException("Cannot map from Article to SearchIndex");
    }
}
