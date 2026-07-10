// ─────────────────────────────────────────────
// IA 시드 스크립트 (스펙 v2 §2) — ia_inspector.js → Supabase 1회 업로드
// 실행: node scripts/seed.js          (기존 데이터 있으면 경고 후 중단)
//       node scripts/seed.js --force  (덮어쓰기)
// ─────────────────────────────────────────────
import { supabase } from '../src/lib/supabase.js'
import { IA_META, SCREENS, FEATURES } from '../src/data/ia_inspector.js'

const force = process.argv.includes('--force')

// 기존 데이터 확인 — 재실행 시 덮어쓰기 경고 (스펙 §2)
const { count, error: countErr } = await supabase
  .from('ia_features')
  .select('id', { count: 'exact', head: true })
if (countErr) {
  console.error('❌ 테이블 조회 실패 — schema.sql을 먼저 실행했는지 확인하세요:', countErr.message)
  process.exit(1)
}
if (count > 0 && !force) {
  console.error(`⚠️  ia_features에 이미 ${count}행이 있습니다. 덮어쓰려면 --force를 붙여 재실행하세요.`)
  process.exit(1)
}

// 화면 27행 (기능의 FK 대상이므로 먼저)
const screenRows = Object.entries(SCREENS).map(([id, s]) => ({
  id,
  area: s.area ?? '',
  name: s.name ?? '',
  label: s.label ?? '',
  type: s.type ?? '',
  purpose: s.purpose ?? '',
  milestone: s.milestone ?? '',
  copy: s.copy ?? '',
  flags: s.flags ?? '',
  note: s.note ?? '',
}))
const { error: se } = await supabase.from('ia_screens').upsert(screenRows)
if (se) { console.error('❌ ia_screens 업로드 실패:', se.message); process.exit(1) }
console.log(`✅ ia_screens ${screenRows.length}행 업로드`)

// 기능 119행 — sort_order = IA 원본(xlsx) 행 순서
const featureRows = Object.entries(FEATURES).map(([id, f], i) => ({
  id,
  screen: f.screen ?? null,
  area: f.area ?? '',
  screen_name: f.screenName ?? '',
  name: f.name ?? '',
  label: f.label ?? '',
  type: f.type ?? '',
  purpose: f.purpose ?? '',
  milestone: f.milestone ?? '',
  importance: f.importance ?? '',
  nav: f.nav ?? '',
  copy: f.copy ?? '',
  flags: f.flags ?? '',
  note: f.note ?? '',
  sort_order: i,
}))
const { error: fe } = await supabase.from('ia_features').upsert(featureRows)
if (fe) { console.error('❌ ia_features 업로드 실패:', fe.message); process.exit(1) }
console.log(`✅ ia_features ${featureRows.length}행 업로드`)

// 검증: 행 수 재조회
const { count: sc } = await supabase.from('ia_screens').select('id', { count: 'exact', head: true })
const { count: fc } = await supabase.from('ia_features').select('id', { count: 'exact', head: true })
console.log(`\n📊 시드 완료 (IA v${IA_META.version} · ${IA_META.source})`)
console.log(`   ia_screens:  ${sc}행 (기대 ${screenRows.length})`)
console.log(`   ia_features: ${fc}행 (기대 ${featureRows.length})`)
if (fc !== featureRows.length || sc !== screenRows.length) {
  console.error('⚠️  행 수 불일치 — 확인 필요')
  process.exit(1)
}
