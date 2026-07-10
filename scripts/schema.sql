-- ─────────────────────────────────────────────────────────────
-- 호탐 프로토타입 v2 — 라이브 IA 테이블 스키마 (스펙 v2 §2)
-- Supabase Dashboard → SQL Editor에 통째로 붙여넣고 Run.
-- 테이블 4개 + RLS(anon: SELECT/INSERT/UPDATE 허용, DELETE 차단) + Realtime.
-- ─────────────────────────────────────────────────────────────

-- 1) 화면 테이블
create table if not exists public.ia_screens (
  id         text primary key,          -- 예: "S7", "A0", "-"
  area       text not null default '',
  name       text not null default '',
  label      text not null default '',
  type       text not null default '',
  purpose    text not null default '',
  milestone  text not null default '',
  copy       text not null default '',
  flags      text not null default '',
  note       text not null default '',
  memo       text not null default '',  -- 신규: 행 상시 한 줄 메모
  archived   boolean not null default false, -- 삭제 없음 원칙: 보관 처리
  updated_at timestamptz not null default now()
);

-- 2) 기능 테이블
create table if not exists public.ia_features (
  id          text primary key,         -- 예: "HTM-S7-13"
  screen      text references public.ia_screens(id),
  area        text not null default '',
  screen_name text not null default '',
  name        text not null default '',
  label       text not null default '',
  type        text not null default '',
  purpose     text not null default '',
  milestone   text not null default '',
  importance  text not null default '',
  nav         text not null default '',
  copy        text not null default '',
  flags       text not null default '',
  note        text not null default '',
  memo        text not null default '',  -- 신규
  sort_order  int not null default 0,    -- IA 원본 행 순서
  archived    boolean not null default false,
  updated_at  timestamptz not null default now()
);

-- 3) 메모 스레드 (소통 채널)
create table if not exists public.ia_memos (
  id         uuid primary key default gen_random_uuid(),
  target_id  text not null,              -- 화면ID 또는 기능ID
  author     text not null default '게스트',
  body       text not null,
  created_at timestamptz not null default now()
);

-- 4) 변경 로그 (누가·언제·무엇을·어떻게)
create table if not exists public.ia_change_log (
  id         uuid primary key default gen_random_uuid(),
  target_id  text not null,
  field      text not null,
  old_value  text,
  new_value  text,
  author     text not null default '게스트',
  created_at timestamptz not null default now()
);

-- updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_ia_screens_updated on public.ia_screens;
create trigger trg_ia_screens_updated
  before update on public.ia_screens
  for each row execute function public.set_updated_at();

drop trigger if exists trg_ia_features_updated on public.ia_features;
create trigger trg_ia_features_updated
  before update on public.ia_features
  for each row execute function public.set_updated_at();

-- ── RLS: anon은 읽기·쓰기(추가/수정)만, DELETE 정책 없음 = DB 차원 차단 ──
alter table public.ia_screens    enable row level security;
alter table public.ia_features   enable row level security;
alter table public.ia_memos      enable row level security;
alter table public.ia_change_log enable row level security;

-- ia_screens
create policy "ia_screens_select" on public.ia_screens for select to anon, authenticated using (true);
create policy "ia_screens_insert" on public.ia_screens for insert to anon, authenticated with check (true);
create policy "ia_screens_update" on public.ia_screens for update to anon, authenticated using (true) with check (true);

-- ia_features
create policy "ia_features_select" on public.ia_features for select to anon, authenticated using (true);
create policy "ia_features_insert" on public.ia_features for insert to anon, authenticated with check (true);
create policy "ia_features_update" on public.ia_features for update to anon, authenticated using (true) with check (true);

-- ia_memos (수정도 불가 — 기록 보존: SELECT/INSERT만)
create policy "ia_memos_select" on public.ia_memos for select to anon, authenticated using (true);
create policy "ia_memos_insert" on public.ia_memos for insert to anon, authenticated with check (true);

-- ia_change_log (기록 보존: SELECT/INSERT만)
create policy "ia_change_log_select" on public.ia_change_log for select to anon, authenticated using (true);
create policy "ia_change_log_insert" on public.ia_change_log for insert to anon, authenticated with check (true);

-- ── Realtime 발행 등록 (실시간 동기화 대상) ──
alter publication supabase_realtime add table public.ia_screens;
alter publication supabase_realtime add table public.ia_features;
alter publication supabase_realtime add table public.ia_memos;
alter publication supabase_realtime add table public.ia_change_log;
