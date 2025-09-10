package io.github.icon02.helpdeskfullstacksearchdemobackend.model;

public interface SearchHit {
    String getEntityClassName();
    String getEntityId();
    String getLanguage();
    String getTitle();
    String getUrl();
    String getSnippet();
    Float getScore();
}
