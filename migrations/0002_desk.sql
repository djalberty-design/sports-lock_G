-- Sports Lock desk: allowlist, access requests, admin settings, per-user ledgers.

create table if not exists desk_allowlist (
  email      text primary key,
  role       text not null default 'user',
  created_at timestamptz not null default now(),
  created_by text
);

create table if not exists desk_access_requests (
  id         serial primary key,
  user_id    text not null,
  email      text not null unique,
  name       text,
  status     text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists desk_settings (
  id               integer primary key default 1 check (id = 1),
  safest_floor     numeric not null default 0.65,
  kelly_multiplier numeric not null default 1,
  sport_feeds      jsonb not null default '{"NFL":true,"NBA":true,"MLB":true,"NHL":true,"NCAAF":true,"NCAAB":true}',
  combo_leg_cap    integer not null default 18,
  pinned_pick_id   text,
  updated_at       timestamptz not null default now(),
  updated_by       text
);

create table if not exists desk_hidden_picks (
  pick_id    text primary key,
  hidden_by  text,
  hidden_at  timestamptz not null default now()
);

create table if not exists desk_ledger_bets (
  id                      text primary key,
  user_id                 text not null,
  timestamp               timestamptz not null,
  sport                   text not null default '',
  market_type             text not null,
  home                    text not null default '',
  away                    text not null default '',
  ticket_name             text not null,
  hard_rock_odds          numeric,
  desk_true_probability   numeric,
  expected_edge_pct       numeric,
  stake_dollars           numeric not null,
  result                  text not null default 'PENDING',
  post_mortem_notes       text,
  layer_snapshots         jsonb not null default '{}',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists desk_ledger_bets_user_id_idx on desk_ledger_bets (user_id);
create index if not exists desk_ledger_bets_result_idx on desk_ledger_bets (result);
create index if not exists desk_access_requests_status_idx on desk_access_requests (status);

insert into desk_allowlist (email, role)
values ('djalberty@gmail.com', 'admin')
on conflict (email) do update set role = 'admin';

insert into desk_settings (id)
values (1)
on conflict (id) do nothing;
