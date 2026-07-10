// ─────────────────────────────────────────────
// IA 동기화 스크립트 (스펙 v2.1 §0)
// docs/ia_inspector_data_v2_1.js(신규 IA) ↔ Supabase(현재)를 필드 단위 비교.
//   실행:  node scripts/sync_ia.js           → dry-run(변경 예정 목록만 출력)
//          node scripts/sync_ia.js --apply   → 실제 반영 + change_log 기록
// 3-way 비교(기준 = src/data/ia_inspector.js v0.1 원본):
//   파일만 변경          → 반영 대상
//   Supabase만 변경(도구) → 유지(건드리지 않음)
//   양쪽 모두 변경        → ⚠️ 충돌 — 덮어쓰지 않고 목록 출력, 사람이 결정
// 모든 update는 ia_change_log에 author '기획자(정주)'로 기록.
// ─────────────────────────────────────────────
import { supabase } from '../src/lib/supabase.js'
import * as base from '../src/data/ia_inspector.js'          // v0.1 원본(3-way 기준)
import * as incoming from '../docs/ia_inspector_data_v2_1.js' // v0.1.1 신규

const APPLY = process.argv.includes('--apply')
const AUTHOR = '기획자(정주)'
const norm = (v) => (v == null ? '' : String(v))

// 비교 대상 필드 (파일 필드명 → DB 컬럼명)
const SCREEN_FIELDS = ['area', 'name', 'label', 'type', 'purpose', 'milestone', 'copy', 'flags', 'note']
  .map((f) => [f, f])
const FEATURE_FIELDS = [
  ['screen', 'screen'], ['area', 'area'], ['screenName', 'screen_name'],
  ['name', 'name'], ['label', 'label'], ['type', 'type'], ['purpose', 'purpose'],
  ['milestone', 'milestone'], ['importance', 'importance'], ['nav', 'nav'],
  ['copy', 'copy'], ['flags', 'flags'], ['note', 'note'],
]

const plans = []      // { table, id, col, dbOld, fileNew }
const conflicts = []  // { table, id, col, base, db, fileNew }
const alreadyDone = []
const toolOnlyRows = [] // DB에만 있는 행(도구에서 추가) — 유지

async function diffTable(table, baseMap, incomingMap, fieldPairs) {
  const { data, error } = await supabase.from(table).select('*')
  if (error) throw new Error(`${table} 조회 실패: ${error.message}`)
  const dbMap = Object.fromEntries(data.map((r) => [r.id, r]))

  for (const [id, inc] of Object.entries(incomingMap)) {
    const db = dbMap[id]
    if (!db) { conflicts.push({ table, id, col: '(행 없음)', base: '', db: 'DB에 행이 없음', fileNew: inc.name ?? '' }); continue }
    const bas = baseMap[id] ?? {}
    for (const [fileKey, col] of fieldPairs) {
      const vNew = norm(inc[fileKey])
      const vBase = norm(bas[fileKey])
      const vDb = norm(db[col])
      if (vNew === vBase) continue            // 파일에 의도된 변경 없음 → 도구 수정이 있어도 유지
      if (vDb === vNew) { alreadyDone.push(`${id}.${col}`); continue }
      if (vDb === vBase) plans.push({ table, id, col, dbOld: vDb, fileNew: vNew })
      else conflicts.push({ table, id, col, base: vBase, db: vDb, fileNew: vNew })
    }
  }
  for (const id of Object.keys(dbMap)) {
    if (!incomingMap[id]) toolOnlyRows.push(`${table}:${id}`)
  }
}

await diffTable('ia_screens', base.SCREENS, incoming.SCREENS, SCREEN_FIELDS)
await diffTable('ia_features', base.FEATURES, incoming.FEATURES, FEATURE_FIELDS)

// ── 리포트 ──
const short = (s, n = 46) => (s.length > n ? s.slice(0, n) + '…' : s) || '(빈값)'
const rowIds = [...new Set(plans.map((p) => `${p.table}:${p.id}`))]
console.log(`\n═══ IA v${incoming.IA_META.version} 동기화 ${APPLY ? '(APPLY)' : '(dry-run)'} ═══`)
console.log(`변경 예정: ${plans.length}개 필드 / ${rowIds.length}개 행 · 이미 반영: ${alreadyDone.length} · 충돌: ${conflicts.length}`)
console.log(`도구 추가 행(유지): ${toolOnlyRows.join(', ') || '없음'}\n`)

let lastRow = ''
for (const p of plans) {
  if (`${p.table}:${p.id}` !== lastRow) { lastRow = `${p.table}:${p.id}`; console.log(`▸ ${p.id}`) }
  console.log(`    ${p.col}: "${short(p.dbOld)}" → "${short(p.fileNew)}"`)
}
if (conflicts.length) {
  console.log('\n⚠️  충돌 — 덮어쓰지 않음(사람이 결정):')
  for (const c of conflicts) {
    console.log(`  ${c.id}.${c.col}\n    원본: "${short(c.base)}"\n    도구: "${short(c.db)}"\n    파일: "${short(c.fileNew)}"`)
  }
}

if (!APPLY) {
  console.log('\n(dry-run — 반영하려면 --apply 로 재실행)')
  process.exit(conflicts.length ? 2 : 0)
}

// ── 실제 반영: 행별로 변경 필드 묶어 update + 필드별 change_log ──
if (conflicts.length) console.log('\n⚠️  충돌 필드는 건너뛰고 나머지만 반영합니다.')
const byRow = {}
for (const p of plans) (byRow[`${p.table}|${p.id}`] ??= []).push(p)

let applied = 0
for (const [key, fields] of Object.entries(byRow)) {
  const [table, id] = key.split('|')
  const patch = Object.fromEntries(fields.map((p) => [p.col, p.fileNew]))
  const { error } = await supabase.from(table).update(patch).eq('id', id)
  if (error) { console.error(`❌ ${id} 반영 실패: ${error.message}`); continue }
  const logs = fields.map((p) => ({
    target_id: id, field: p.col, old_value: p.dbOld, new_value: p.fileNew, author: AUTHOR,
  }))
  const { error: le } = await supabase.from('ia_change_log').insert(logs)
  if (le) console.error(`❌ ${id} change_log 기록 실패: ${le.message}`)
  applied += fields.length
}
console.log(`\n✅ 반영 완료: ${applied}개 필드 (change_log에 author='${AUTHOR}'로 기록)`)
console.log('다음 단계: src/data/ia_inspector.js를 v2_1 파일로 교체(오프라인 폴백 갱신)')
