// ─────────────────────────────────────────────
// v2.1 §2 메모 시딩 — 오픈이슈 8건(O9~O16, tag=이슈) + 소통성 메모 5건(tag=기능)
// 실행: node scripts/seed_memos.js  (이미 있는 항목은 건너뜀 — 멱등)
// ─────────────────────────────────────────────
import { supabase } from '../src/lib/supabase.js'
import { OPEN_ISSUES } from '../src/data/ia_inspector.js'

const AUTHOR = '기획자(정주)'

// 소통성 메모 5건 (스펙 v2.1 §2 — diff 리포트의 비고/카피)
const COMM_MEMOS = [
  ['HTM-S13-01', '카피 미사용/애니메이션 적용 가능성'],
  ['HTM-S14-04', '가입 완료 추가 필요'],
  ['HTM-S7-10', '게시물 상세로 갈지 인스타 형식으로 갈지 고민 필요'],
  ['HTM-S7-14', '이런 식으로 바텀시트로도 상세 표현 가능'],
  ['HTM-S9-05', '형식은 네이버지도 참고'],
]

const { data: existing, error: exErr } = await supabase.from('ia_memos').select('target_id, body')
if (exErr) { console.error('❌ 조회 실패 — schema_v2_2_memos.sql 실행 확인:', exErr.message); process.exit(1) }
const has = (t, b) => existing.some((m) => m.target_id === t && m.body === b)

const rows = []
for (const o of OPEN_ISSUES) {
  const target = (o.targets ?? '').match(/HTM-[A-Z0-9]+-\d+|S\d{1,2}|A0/)?.[0] ?? ''
  const body = `[${o.id}] ${o.body}`
    + (o.owner ? ` · 결정: ${o.owner}` : '')
    + (o.note ? ` · ${o.note}` : '')
  if (!has(target, body)) rows.push({ target_id: target, author: AUTHOR, body, tag: '이슈' })
}
for (const [t, b] of COMM_MEMOS) {
  if (!has(t, b)) rows.push({ target_id: t, author: AUTHOR, body: b, tag: '기능' })
}

if (rows.length === 0) { console.log('이미 시딩됨 — 추가할 메모 없음'); process.exit(0) }

const { data, error } = await supabase.from('ia_memos').insert(rows).select()
if (error) { console.error('❌ 시딩 실패:', error.message); process.exit(1) }

// change_log 기록
const logs = data.map((m) => ({
  target_id: m.target_id || '(전체)', field: 'memo_thread',
  old_value: null, new_value: m.body.slice(0, 40), author: AUTHOR,
}))
await supabase.from('ia_change_log').insert(logs)

console.log(`✅ 메모 ${data.length}건 시딩 (이슈 ${data.filter((r) => r.tag === '이슈').length} · 기능 ${data.filter((r) => r.tag === '기능').length})`)
const { count } = await supabase.from('ia_memos').select('id', { count: 'exact', head: true })
console.log(`   ia_memos 총 ${count}건`)
