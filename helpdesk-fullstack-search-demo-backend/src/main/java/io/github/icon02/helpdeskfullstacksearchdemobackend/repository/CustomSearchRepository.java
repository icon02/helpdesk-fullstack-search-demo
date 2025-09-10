package io.github.icon02.helpdeskfullstacksearchdemobackend.repository;

import io.github.icon02.helpdeskfullstacksearchdemobackend.model.SearchIndex;

public interface CustomSearchRepository {
    void upsert(SearchIndex row);

    int deleteByEntity(String entityClassName, String entityId);
}
