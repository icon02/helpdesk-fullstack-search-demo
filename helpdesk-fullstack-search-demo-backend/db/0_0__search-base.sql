CREATE EXTENSION IF NOT EXISTS unaccent;

-- English/German examples; add more as you need.
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'english_unaccent') THEN
            CREATE TEXT SEARCH CONFIGURATION public.english_unaccent (COPY = pg_catalog.english);
            ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
                ALTER MAPPING FOR hword, hword_part, word WITH unaccent, english_stem;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'german_unaccent') THEN
            CREATE TEXT SEARCH CONFIGURATION public.german_unaccent (COPY = pg_catalog.german);
            ALTER TEXT SEARCH CONFIGURATION public.german_unaccent
                ALTER MAPPING FOR hword, hword_part, word WITH unaccent, german_stem;
        END IF;
    END
$$;

CREATE OR REPLACE FUNCTION lang_to_tsconfig(l text)
    RETURNS regconfig
    LANGUAGE sql
    IMMUTABLE
AS
$$
SELECT CASE
           WHEN l ~* '^de' THEN 'public.german_unaccent'::regconfig -- de, de-AT, de-DE, …
           WHEN l ~* '^en' THEN 'public.english_unaccent'::regconfig -- en, en-GB, …
    -- WHEN l ~* '^fr' THEN 'pg_catalog.french'::regconfig       -- add your languages here
           ELSE 'pg_catalog.simple'::regconfig
           END;
$$;

CREATE OR REPLACE FUNCTION make_search_doc(
    l text, -- language code stored in the row
    title text,
    summary text,
    keywords text[]
)
    RETURNS tsvector
    LANGUAGE sql
    IMMUTABLE
    PARALLEL SAFE
AS
$$
SELECT setweight(to_tsvector(lang_to_tsconfig(l), coalesce(title, '')), 'A')
           || setweight(to_tsvector(lang_to_tsconfig(l), coalesce(summary, '')), 'B')
           || setweight(to_tsvector(lang_to_tsconfig(l),
                                    array_to_string(coalesce(keywords, '{}'), ' ')), 'C');
$$;



CREATE TABLE SEARCH_INDEX
(
    ENTITY_CLASS_NAME varchar(63)  not null,
    ENTITY_ID         varchar(63)  not null,
    LANGUAGE          varchar(7)   not null,
    TITLE             varchar(255) not null,
    SUMMARY           text         not null,
    KEYWORDS          text[],
    URL               varchar(255),
    INDEXED_AT        timestamptz  not null default now(),
    SEARCH_DOC        tsvector GENERATED ALWAYS AS (make_search_doc(LANGUAGE, TITLE, SUMMARY, KEYWORDS)) STORED,
    primary key (ENTITY_CLASS_NAME, ENTITY_ID, LANGUAGE)
);

CREATE INDEX IF NOT EXISTS idx_search_fts ON SEARCH_INDEX USING GIN (SEARCH_DOC);
CREATE INDEX IF NOT EXISTS idx_search_lang ON SEARCH_INDEX (LANGUAGE);
