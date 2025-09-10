begin;


create or replace function SEARCH_UPSERT_ARTICLE(p_article_id bigint)
    returns void
    language plpgsql as
$$
declare
    a          record;
    v_lang     text;
    v_keywords text[];
begin
    select ID, TITLE, BODY, LANGUAGE
    into a
    from ARTICLES
    where ID = p_article_id;

    if not found then
        delete
        from search_index
        where ENTITY_CLASS_NAME = 'Article'
          and ENTITY_ID = p_article_id;
        return;
    end if;

    v_lang := a.LANGUAGE;
    select coalesce(array_agg(g.NAME order by g.NAME), '{}')
    into v_keywords
    from ARTICLE_TAGS at
             JOIN TAGS g on g.ID = at.TAG_ID
    where at.article_id = p_article_id
      AND (g.LANGUAGE is null or g.LANGUAGE ilike v_lang || '%');

    insert into SEARCH_INDEX
    (entity_class_name, ENTITY_ID, LANGUAGE, TITLE, SUMMARY, KEYWORDS, URL, indexed_at)
    VALUES ('Article', a.id, v_lang, a.title, a.body, v_keywords,
            '/articles/' || a.id, now())
    ON CONFLICT (ENTITY_CLASS_NAME, ENTITY_ID, LANGUAGE) DO UPDATE
        SET TITLE      = EXCLUDED.title,
            SUMMARY    = EXCLUDED.summary,
            KEYWORDS   = EXCLUDED.keywords,
            URL        = EXCLUDED.url,
            INDEXED_AT = now();
end
$$;

CREATE OR REPLACE FUNCTION trg_articles_to_search()
    RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    PERFORM search_upsert_article(NEW.id);
    RETURN NEW;
END $$;

drop trigger if exists upsert_article_search_index on ARTICLES;
create trigger upsert_article_search_index
    after insert or update
    on ARTICLES
    for each row
execute function trg_articles_to_search();

commit;




begin;
/* Thanks GPT :) */
-- -------------------------------------------------------------------
-- Seed TAGS for ARTICLES (run once).
-- -------------------------------------------------------------------
INSERT INTO tags (name, language) VALUES
                                      -- en-GB
                                      ('architecture', 'en-GB'),
                                      ('backend', 'en-GB'),
                                      ('frontend', 'en-GB'),
                                      ('api', 'en-GB'),
                                      ('database', 'en-GB'),
                                      ('security', 'en-GB'),
                                      ('performance', 'en-GB'),
                                      ('monitoring', 'en-GB'),
                                      ('documentation', 'en-GB'),
                                      ('testing', 'en-GB'),
                                      ('mobile', 'en-GB'),
                                      ('ux', 'en-GB'),
                                      ('devops', 'en-GB'),
                                      ('reliability', 'en-GB'),
                                      ('observability', 'en-GB'),
                                      ('release', 'en-GB'),
                                      -- de-AT
                                      ('Architektur', 'de-AT'),
                                      ('Backend', 'de-AT'),
                                      ('Frontend', 'de-AT'),
                                      ('Schnittstelle', 'de-AT'),
                                      ('Datenbank', 'de-AT'),
                                      ('Sicherheit', 'de-AT'),
                                      ('Leistung', 'de-AT'),
                                      ('Überwachung', 'de-AT'),
                                      ('Dokumentation', 'de-AT'),
                                      ('Tests', 'de-AT'),
                                      ('Mobil', 'de-AT'),
                                      ('Benutzeroberfläche', 'de-AT'),
                                      ('DevOps', 'de-AT'),
                                      ('Zuverlässigkeit', 'de-AT'),
                                      ('Beobachtbarkeit', 'de-AT'),
                                      ('Release', 'de-AT');

-- -------------------------------------------------------------------
-- Create 10 ARTICLES for each user id 1..21 (total 210).
-- Alternate languages per article (odd=en-GB, even=de-AT).
-- BODY has >= 200 words via repeated paragraphs.
-- Titles start with 'SeedU<user>-A<seq>:' for traceability.
-- -------------------------------------------------------------------
WITH users AS (
    SELECT generate_series(1, 21) AS user_id
),
     per_user AS (
         SELECT user_id, generate_series(1, 10) AS seq
         FROM users
     ),
     rows AS (
         SELECT
             user_id,
             seq,
             CASE WHEN seq % 2 = 1 THEN 'en-GB' ELSE 'de-AT' END AS language,
             /* Base titles per language, rotate over 12 items */
             CASE
                 WHEN seq % 2 = 1 THEN
                     (ARRAY[
                         'Scaling the notifications service',
                         'Designing resilient payments retries',
                         'Optimising Postgres queries',
                         'API versioning strategy v2',
                         'Frontend performance checklist',
                         'Zero-downtime deployments',
                         'Observability with OpenTelemetry',
                         'Access control and roles',
                         'Mobile app release process',
                         'Caching strategies that work',
                         'Incident response playbook',
                         'Data migrations at scale'
                         ])[((seq - 1) % 12) + 1]
                 ELSE
                     (ARRAY[
                         'Benachrichtigungsdienst skalieren',
                         'Zahlungs-Retries robust entwerfen',
                         'Postgres-Abfragen optimieren',
                         'API-Versionierung für v2',
                         'Frontend Performance Checkliste',
                         'Deployments ohne Downtime',
                         'Observability mit OpenTelemetry',
                         'Zugriffssteuerung und Rollen',
                         'Release-Prozess der mobilen App',
                         'Caching-Strategien, die funktionieren',
                         'Leitfaden für Incident Response',
                         'Datenmigrationen im großen Maßstab'
                         ])[((seq - 1) % 12) + 1]
                 END AS base_title
         FROM per_user
     ),
     rows_titled AS (
         SELECT
             user_id,
             seq,
             language,
             base_title,
             'SeedU' || user_id || '-A' || lpad(seq::text, 2, '0') || ': ' || base_title AS title_final
         FROM rows
             ),
             ins AS (
         INSERT INTO articles (title, body, updated_by, language)
         SELECT
             title_final AS title,
             CASE
             WHEN language = 'en-GB' THEN
             title_final || E'\n\n'
             || 'This article provides a practical, engineering-focused deep dive, written for developers, SREs, and product-minded stakeholders who need clear guidance they can apply today.' || E'\n\n'
             || repeat(
             'In this article we examine architecture, data models, testing strategy, deployment practices, monitoring, and team workflows that make our platform reliable, secure, and fast today. '
             'The discussion includes context, problem statement, constraints, alternatives, benchmarks, failure modes, and clear steps to reproduce and verify each change in a realistic environment. ',
             8
             )
             ELSE
             title_final || E'\n\n'
             || 'Dieser Artikel bietet eine praxisnahe, ingenieurgetriebene Vertiefung – geschrieben für Entwickler:innen, SREs und produktorientierte Stakeholder, die sofort anwendbare Leitlinien benötigen.' || E'\n\n'
             || repeat(
             'In diesem Artikel beleuchten wir Architektur, Datenmodelle, Teststrategie, Deployment-Praktiken, Monitoring sowie Team-Workflows, die unsere Plattform zuverlässig, sicher und schnell machen. '
             'Die Darstellung umfasst Kontext, Problemstellung, Randbedingungen, Alternativen, Benchmarks, Fehlermodi sowie klare Schritte, um jede Änderung realistisch nachzustellen und zu verifizieren. ',
             8
             )
             END AS body,
             user_id        AS updated_by,
             language
         FROM rows_titled
             RETURNING id, language, updated_by, title
             )
         -- -------------------------------------------------------------------
-- Attach 3 language-matched tags to every article deterministically.
-- -------------------------------------------------------------------
         INSERT INTO article_tags (article_id, tag_id)
         SELECT i.id,
             pick.id
         FROM ins i
             CROSS JOIN LATERAL (
             WITH lang_tags AS (
             SELECT id,
             row_number() OVER (ORDER BY id) AS rn,
             count(*)     OVER ()           AS cnt
             FROM tags
             WHERE language = i.language
             )
             SELECT id
             FROM lang_tags
             WHERE rn IN (
             ((i.id + i.updated_by    ) % cnt) + 1,
             ((i.id + i.updated_by + 1) % cnt) + 1,
             ((i.id + i.updated_by + 2) % cnt) + 1
             )
             ) AS pick;


commit;


begin;

drop trigger if exists upsert_article_search_index on ARTICLES;
drop function if exists trg_articles_to_search;
drop function if exists SEARCH_UPSERT_ARTICLE;

commit;