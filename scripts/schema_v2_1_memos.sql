-- v2.1 마이그레이션 — 메모 확인/삭제 (Supabase SQL Editor에 붙여넣고 Run)
-- 삭제는 소프트 삭제(deleted 플래그): 기록 보존 원칙 유지, 목록에서만 숨김.
alter table public.ia_memos add column if not exists confirmed boolean not null default false;
alter table public.ia_memos add column if not exists deleted   boolean not null default false;

-- 메모 UPDATE 허용 (확인·삭제 플래그 변경용 — DELETE는 여전히 차단)
create policy "ia_memos_update" on public.ia_memos
  for update to anon, authenticated using (true) with check (true);
