-- v2.1 §2 마이그레이션 — 메모 태그·해결 + 댓글 테이블 (SQL Editor에 붙여넣고 Run)
alter table public.ia_memos add column if not exists tag text not null default '기능';
alter table public.ia_memos add column if not exists resolved boolean not null default false;

create table if not exists public.ia_memo_comments (
  id         uuid primary key default gen_random_uuid(),
  memo_id    uuid not null references public.ia_memos(id),
  author     text not null default '개발',
  body       text not null,
  created_at timestamptz not null default now()
);

alter table public.ia_memo_comments enable row level security;
create policy "ia_memo_comments_select" on public.ia_memo_comments for select to anon, authenticated using (true);
create policy "ia_memo_comments_insert" on public.ia_memo_comments for insert to anon, authenticated with check (true);

alter publication supabase_realtime add table public.ia_memo_comments;
