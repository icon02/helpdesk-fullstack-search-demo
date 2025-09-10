create table USERS
(
    ID         bigserial primary key,
    EMAIL      varchar(321) unique not null,
    NAME       varchar(63),
    CREATED_AT timestamp default now()
);

create table TICKETS
(
    ID          bigserial primary key,
    TITLE       varchar(255) not null,
    DESCRIPTION text         not null default '',
    LANGUAGE    varchar(7),
    UPDATED_AT  timestamp    not null default now(),
    UPDATED_BY  bigint       not null references USERS (ID) on delete cascade
);

create table ARTICLES
(
    ID         bigserial primary key,
    TITLE      varchar(127) not null,
    BODY       text         not null default '',
    UPDATED_AT timestamp             default now(),
    UPDATED_BY bigint       not null references USERS (ID),
    LANGUAGE   varchar(7)
);

create table TAGS
(
    ID       bigserial primary key,
    NAME     varchar(127),
    LANGUAGE varchar(7)
);

create table TICKET_TAGS
(
    TICKET_ID bigint not null references TICKETS (ID) on delete cascade,
    TAG_ID    bigint not null references TAGS (ID) on delete cascade
);

create table ARTICLE_TAGS
(
    ARTICLE_ID bigint not null references ARTICLES (ID) on delete cascade,
    TAG_ID     bigint not null references TAGS (ID) on delete cascade
);