-- Company workspace memory: dossier + briefing archive per authenticated user.
-- user_id is TEXT (matches Better Auth / preview 'dev-user').

create table if not exists company_workspace (
  user_id text not null primary key,
  company_name text not null default '',
  dossier_json text not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists company_briefing (
  id text not null primary key,
  user_id text not null,
  briefing_date text not null,
  company_name text not null default '',
  briefing_json text not null,
  created_at timestamptz not null default now(),
  unique (user_id, briefing_date)
);

create index if not exists company_briefing_user_date_idx
  on company_briefing (user_id, briefing_date desc);
