package io.github.icon02.helpdeskfullstacksearchdemobackend.repository.impl;

import io.github.icon02.helpdeskfullstacksearchdemobackend.model.SearchIndex;
import io.github.icon02.helpdeskfullstacksearchdemobackend.repository.CustomSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;

@Repository
@RequiredArgsConstructor
public class CustomSearchRepositoryImpl implements CustomSearchRepository {
    private final JdbcTemplate jdbc;

    private static final String UPSERT_SQL = """
            INSERT INTO search_index
              (entity_class_name, entity_id, language, title, summary, keywords, url, indexed_at)
            VALUES
              (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (entity_class_name, entity_id, language) DO UPDATE
            SET title = EXCLUDED.title,
                summary = EXCLUDED.summary,
                keywords = EXCLUDED.keywords,
                url = EXCLUDED.url,
                indexed_at = EXCLUDED.indexed_at
            """;

    @Override
    public void upsert(SearchIndex row) {
        // jdbc.execute((ConnectionCallback<Object>) con -> {
        var callback = jdbc.execute((ConnectionCallback<PreparedStatement>) con -> {
            var ps = con.prepareStatement(UPSERT_SQL);
            int i = 1;
            ps.setString(i++, row.getId().getEntityClassName());
            ps.setString(i++, row.getId().getEntityId());
            ps.setString(i++, row.getId().getLanguage());
            ps.setString(i++, row.getTitle());
            ps.setString(i++, row.getSummary());

            // text[] -> JDBC Array
            var kw = row.getKeywords() == null ? new String[0] : row.getKeywords();
            ps.setArray(i++, con.createArrayOf("text", kw));

            ps.setString(i++, row.getUrl());

            ps.setTimestamp(i++, new Timestamp(System.currentTimeMillis()));

            return ps;
        });

        try {
            if (callback != null) {
                callback.execute();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public int deleteByEntity(String entityClassName, String entityId) {
        return jdbc.update(
                "DELETE FROM search_index WHERE entity_class_name=? AND entity_id=?",
                entityClassName, entityId
        );
    }
}
