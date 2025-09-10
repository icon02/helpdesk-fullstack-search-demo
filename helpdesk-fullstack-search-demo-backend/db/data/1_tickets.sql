begin;


create or replace function SEARCH_UPSERT_TICKET(p_ticket_id bigint)
    returns void
    language plpgsql as
$$
declare
    t          record;
    v_lang     text;
    v_keywords text[];
begin
    select ID, TITLE, DESCRIPTION, LANGUAGE
    into t
    from TICKETS
    where ID = p_ticket_id;

    if not found then
        delete
        from search_index
        where ENTITY_CLASS_NAME = 'Ticket'
          and ENTITY_ID = p_ticket_id;
        return;
    end if;

    v_lang := t.LANGUAGE;
    select coalesce(array_agg(g.NAME order by g.NAME), '{}')
    into v_keywords
    from TICKET_TAGS tt
             JOIN TAGS g on g.ID = tt.TAG_ID
    where tt.ticket_id = p_ticket_id
      AND (g.LANGUAGE is null or g.LANGUAGE ilike v_lang || '%');

    insert into SEARCH_INDEX
    (entity_class_name, ENTITY_ID, LANGUAGE, TITLE, SUMMARY, KEYWORDS, URL, indexed_at)
    VALUES ('Ticket', t.id, v_lang, t.title, t.description, v_keywords,
            '/tickets/' || t.id, now())
    ON CONFLICT (ENTITY_CLASS_NAME, ENTITY_ID, LANGUAGE) DO UPDATE
        SET TITLE      = EXCLUDED.title,
            SUMMARY    = EXCLUDED.summary,
            KEYWORDS   = EXCLUDED.keywords,
            URL        = EXCLUDED.url,
            INDEXED_AT = now();
end
$$;

CREATE OR REPLACE FUNCTION trg_tickets_to_search()
    RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    PERFORM search_upsert_ticket(NEW.id);
    RETURN NEW;
END $$;

drop trigger if exists upsert_ticket_search_index on TICKETS;
create trigger upsert_ticket_search_index
    after insert or update
    on TICKETS
    for each row
execute function trg_tickets_to_search();

commit;



begin;
/* Thanks GPT :) */
-- -------------------------------------------------------------------
-- Seed TAGS (en-GB and de-AT). Run once (no ON CONFLICT here).
-- -------------------------------------------------------------------
INSERT INTO tags (name, language) VALUES
                                      -- English
                                      ('bug', 'en-GB'),
                                      ('frontend', 'en-GB'),
                                      ('backend', 'en-GB'),
                                      ('urgent', 'en-GB'),
                                      ('documentation', 'en-GB'),
                                      ('performance', 'en-GB'),
                                      ('security', 'en-GB'),
                                      ('payments', 'en-GB'),
                                      ('translation', 'en-GB'),
                                      ('ux', 'en-GB'),
                                      ('database', 'en-GB'),
                                      ('api', 'en-GB'),
                                      ('monitoring', 'en-GB'),
                                      ('mobile', 'en-GB'),
                                      -- German (Austria)
                                      ('Fehler', 'de-AT'),
                                      ('Frontend', 'de-AT'),
                                      ('Backend', 'de-AT'),
                                      ('Dringend', 'de-AT'),
                                      ('Dokumentation', 'de-AT'),
                                      ('Leistung', 'de-AT'),
                                      ('Sicherheit', 'de-AT'),
                                      ('Zahlungen', 'de-AT'),
                                      ('Übersetzung', 'de-AT'),
                                      ('Benutzeroberfläche', 'de-AT'),
                                      ('Datenbank', 'de-AT'),
                                      ('Schnittstelle', 'de-AT'),
                                      ('Überwachung', 'de-AT'),
                                      ('Mobil', 'de-AT');

-- -------------------------------------------------------------------
-- Create 10 tickets for each user id 1..21 (total 210 tickets).
-- Alternate languages per ticket (odd=en-GB, even=de-AT).
-- Titles/descriptions are picked from rotating arrays.
-- Titles start with 'SeedU<user>-T<seq>:' to make this batch easy to identify.
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
             CASE
                 WHEN seq % 2 = 1 THEN
                     (ARRAY[
                         'Checkout page fails on Safari',
                         'Add rate limiting to login',
                         'Slow query on orders report',
                         'Update API docs for v2',
                         'Localise profile page to French',
                         'Dark mode toggle broken',
                         'Migrate to Postgres 16',
                         'Webhooks retry policy',
                         'GDPR data export improvements',
                         'Payment refund rounding error',
                         'Improve 2FA enrolment UX',
                         'Add health check endpoint'
                         ])[((seq - 1) % 12) + 1]
                 ELSE
                     (ARRAY[
                         'Safari: Kasse schlägt fehl',
                         'Rate Limiting für Login-Endpunkt',
                         'Langsame Abfrage im Bestellbericht',
                         'API-Dokumentation für v2 aktualisieren',
                         'Profilseite auf Französisch lokalisieren',
                         'Dark-Mode-Schalter defekt',
                         'Migration auf Postgres 16',
                         'Webhook-Retry-Strategie',
                         'DSGVO-Datenexport verbessern',
                         'Rundungsfehler bei Rückerstattung',
                         '2FA-Einrichtung verbessern',
                         'Health-Check-Endpunkt hinzufügen'
                         ])[((seq - 1) % 12) + 1]
                 END AS base_title,
             CASE
                 WHEN seq % 2 = 1 THEN
                     (ARRAY[
                         'Customers report blank page after submitting card details on Safari 16.',
                         'Throttle repeated login attempts to mitigate brute-force attacks.',
                         'Monthly orders report takes >30s due to missing index/aggregation.',
                         'Document new pagination rules and deprecations for /v2 endpoints.',
                         'Add fr-FR translations for profile and settings.',
                         'Toggle state not persisted across reloads; visual flash on load.',
                         'Plan and execute upgrade from 14 to 16 with minimal downtime.',
                         'Define exponential backoff and DLQ for failed webhooks.',
                         'Bundle per-user exports and include processing status.',
                         'Minor rounding discrepancy on multi-currency refunds.',
                         'Clarify QR vs manual code and recovery codes flow.',
                         'Lightweight /healthz for k8s liveness/readiness.'
                         ])[((seq - 1) % 12) + 1]
                 ELSE
                     (ARRAY[
                         'Leere Seite nach Eingabe der Kartendaten auf Safari 16.',
                         'Wiederholte Login-Versuche drosseln, um Brute-Force zu verhindern.',
                         'Monatsbericht dauert >30s wegen fehlendem Index/Aggregation.',
                         'Neue Paginierung und Deprecations der /v2-Endpunkte dokumentieren.',
                         'fr-FR Übersetzungen für Profil & Einstellungen ergänzen.',
                         'Umschalter bleibt nicht erhalten; kurzes Flackern beim Laden.',
                         'Upgrade von 14 auf 16 mit minimaler Downtime planen.',
                         'Exponential Backoff und DLQ für fehlgeschlagene Webhooks.',
                         'Exporte pro Benutzer bündeln und Status anzeigen.',
                         'Kleine Rundungsdifferenzen bei Mehrwährungs-Rückerstattungen.',
                         'QR vs manueller Code und Wiederherstellungscodes klarstellen.',
                         'Leichtgewichtiges /healthz für k8s Liveness/Readiness.'
                         ])[((seq - 1) % 12) + 1]
                 END AS base_desc
         FROM per_user
     ),
     ins AS (
         INSERT INTO tickets (title, description, language, updated_by)
             SELECT
                 'SeedU' || user_id || '-T' || lpad(seq::text, 2, '0') || ': ' || base_title AS title,
                 base_desc,
                 language,
                 user_id
             FROM rows
                              RETURNING id, language, updated_by, title
     )
-- -------------------------------------------------------------------
-- For every seeded ticket, attach 3 tags in the matching language.
-- We deterministically pick 3 different tags based on (ticket.id + updated_by).
-- -------------------------------------------------------------------
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT i.id,
       tsel.id
FROM ins i
         CROSS JOIN LATERAL (
    -- Choose 3 distinct tags (consecutive positions in language-specific list)
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
    ) AS tsel;

commit;



begin;

drop trigger if exists upsert_ticket_search_index on TICKETS;
drop function if exists trg_tickets_to_search;
drop function if exists SEARCH_UPSERT_TICKET;

commit;