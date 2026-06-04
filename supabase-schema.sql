-- ═══════════════════════════════════════════════
--   AREYA WATER GAME — Schema Supabase
--   Pega esto en: Supabase > SQL Editor > New Query
-- ═══════════════════════════════════════════════

-- Sesiones de juego
create table if not exists game_sessions (
  id                uuid primary key default gen_random_uuid(),
  status            text not null default 'waiting',  -- waiting | playing | finished
  current_question  integer not null default -1,
  created_at        timestamptz default now()
);

-- Jugadores registrados en una sesión
create table if not exists players (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references game_sessions(id) on delete cascade,
  name        text not null,
  water_level float not null default 0,
  score       integer not null default 0,
  joined_at   timestamptz default now()
);

-- Respuestas de cada jugador
create table if not exists answers (
  id                uuid primary key default gen_random_uuid(),
  session_id        uuid not null references game_sessions(id) on delete cascade,
  player_id         uuid not null references players(id) on delete cascade,
  question_index    integer not null,
  answer_index      integer not null,
  is_correct        boolean not null default false,
  response_time_ms  integer not null default 0,
  speed_rank        integer not null default -1,
  created_at        timestamptz default now()
);

-- Índices para performance
create index if not exists idx_players_session on players(session_id);
create index if not exists idx_answers_session on answers(session_id);
create index if not exists idx_answers_player  on answers(player_id);
create index if not exists idx_answers_question on answers(session_id, question_index);

-- Habilitar Realtime en las 3 tablas
alter publication supabase_realtime add table game_sessions;
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table answers;

-- Row Level Security (RLS) — acceso público para el juego
alter table game_sessions enable row level security;
alter table players        enable row level security;
alter table answers        enable row level security;

create policy "Public read game_sessions"  on game_sessions for select using (true);
create policy "Public insert game_sessions" on game_sessions for insert with check (true);
create policy "Public update game_sessions" on game_sessions for update using (true);

create policy "Public read players"   on players for select using (true);
create policy "Public insert players" on players for insert with check (true);
create policy "Public update players" on players for update using (true);

create policy "Public read answers"   on answers for select using (true);
create policy "Public insert answers" on answers for insert with check (true);
