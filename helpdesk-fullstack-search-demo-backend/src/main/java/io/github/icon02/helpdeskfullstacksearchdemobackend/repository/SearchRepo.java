package io.github.icon02.helpdeskfullstacksearchdemobackend.repository;

import io.github.icon02.helpdeskfullstacksearchdemobackend.model.SearchHit;
import io.github.icon02.helpdeskfullstacksearchdemobackend.model.SearchIndex;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

@org.springframework.stereotype.Repository
public interface SearchRepo extends Repository<SearchIndex, SearchIndex.ID>, CustomSearchRepository {
    Map<String, String> languageMap = Map.of(
            "de-AT", "public.german_unaccent"
    );

    @Query(value = """
        WITH tsq as (SELECT to_tsquery('public.german_unaccent'::regconfig, :tsQuery) q)
            SELECT ENTITY_CLASS_NAME as entityClassName,
                   ENTITY_ID                            as entityId,
                   LANGUAGE                             as language,
                   TITLE                                as title,
                   URL                                  as url,
                   ts_headline(
                       'public.german_unaccent'::regconfig,
                        si.summary,
                        q,
                        'StartSel=<b>,StopSel=</b>,MaxFragments=3,MinWords=3,MaxWords=6,ShortWord=1,FragmentDelimiter= E'' ... '''
                       )   as snippet,
                   ts_rank(search_doc, q)               as score
            FROM SEARCH_INDEX si, tsq
            WHERE search_doc @@ q
            ORDER BY score desc
            LIMIT :limit OFFSET :offset
    """, nativeQuery = true)
    List<SearchHit> find(@Param("tsQuery") String tsQuery, @Param("config") String config, @Param("limit") int limit, @Param("offset") int offset);
}
