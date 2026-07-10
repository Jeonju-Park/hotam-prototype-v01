// Supabase 클라이언트 (스펙 v2 §1)
// anon key 노출은 프로토타입 한정 허용 — RLS로 ia_* 4개 테이블 외 접근 차단, DELETE 차단.
import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://tilergvqxtfkdcdgjwlq.supabase.co'
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbGVyZ3ZxeHRma2RjZGdqd2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2ODA1NzMsImV4cCI6MjA5OTI1NjU3M30.nG9KODkgV9-kPQPJYUXTYZpgEl_GgSJ9KSWmjYmEgj4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
