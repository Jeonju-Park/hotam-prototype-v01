import React from 'react'
import { Pin } from 'lucide-react'
import { useApp } from '../App.jsx'
import useInspector from './useInspector.js'
import MilestoneLens from './MilestoneLens.jsx'
import { IA_META } from '../data/ia_inspector.js'

// 마일스톤 문자열("M1", "M2", "M1·M2", "Later" 등) → 뱃지
function MsBadge({ ms }) {
  if (!ms) return null
  const cls = /later|결정대기/i.test(ms) ? 'later' : ms.includes('M3') ? 'm3' : ms.includes('M2') ? 'm2' : 'm1'
  return <span className={`ms-badge ${cls}`}>{ms}</span>
}

function Field({ label, value }) {
  return (
    <div className="insp-field">
      <span className="t-caption label">{label}</span>
      <span className={`t-body value${value ? '' : ' empty'}`}>{value || '—'}</span>
    </div>
  )
}

// ─────────────────────────────────────────────
// IA 인스펙터 패널 (스펙 §8) — 데스크톱 전용 리뷰 도구, 프레임 우측 360px
// 표시 내용은 전부 src/data/ia_inspector.js에서 온다(하드코딩 금지).
// ─────────────────────────────────────────────
export default function InspectorPanel() {
  const { setReverseFuncId } = useApp()
  const { pinned, togglePin, screenRecord, featureRecord, screenFeatures, content } = useInspector()

  return (
    <aside className="inspector">
      <header className="insp-header">
        <span className="t-caption">IA 인스펙터 · v{IA_META.version}</span>
        <span className="spacer" />
        <button
          className={`insp-pin-btn${pinned ? ' is-pinned' : ''}`}
          onClick={togglePin}
          title="스페이스바로도 고정/해제할 수 있어요"
        >
          <Pin size={14} />
          <span className="t-micro">{pinned ? '고정됨' : '고정'}</span>
        </button>
      </header>

      <div className="insp-body">
        {featureRecord && (
          <>
            {/* 기능 레코드 — 스펙 §8-1 표시 순서 */}
            <Field label="명칭" value={featureRecord.name} />
            <Field label="화면ID" value={`${featureRecord.screen} · ${featureRecord.screenName}`} />
            <Field label="기능ID" value={content.id} />
            <Field label="목적/기능 설명" value={featureRecord.purpose} />
            <Field label="UX 카피 노트" value={featureRecord.copy} />
            <Field label="진입→연결" value={featureRecord.nav} />
            <div className="insp-field">
              <span className="t-caption label">마일스톤</span>
              <MsBadge ms={featureRecord.milestone} />
            </div>
            <Field label="중요도" value={featureRecord.importance} />
            <Field label="이슈/색인" value={featureRecord.flags} />
            <Field label="비고" value={featureRecord.note} />
          </>
        )}

        {!featureRecord && screenRecord && (
          <>
            {/* 화면 레코드 (비호버 폴백) — §8-2 */}
            <Field label="화면명" value={`${screenRecord.name}${screenRecord.label && screenRecord.label !== '-' ? ` (${screenRecord.label})` : ''}`} />
            <Field label="화면ID" value={`${screenRecord.id} · ${screenRecord.area} · ${screenRecord.type}`} />
            <Field label="목적" value={screenRecord.purpose} />
            <div className="insp-field">
              <span className="t-caption label">마일스톤</span>
              <MsBadge ms={screenRecord.milestone} />
            </div>
            <Field label="UX 카피 노트" value={screenRecord.copy} />
            <Field label="이슈/색인" value={screenRecord.flags} />
            <Field label="비고" value={screenRecord.note} />

            <hr className="insp-divider" />
            <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>
              이 화면의 기능 {screenFeatures.length}
            </span>
            <div style={{ marginTop: 'var(--sp-xs)' }}>
              {screenFeatures.map((f) => (
                <button
                  key={f.fid}
                  className="insp-feature-row"
                  onMouseEnter={() => setReverseFuncId(f.fid)}
                  onMouseLeave={() => setReverseFuncId(null)}
                >
                  <span className="t-micro fid">{f.fid}</span>
                  <span className="t-body fname">{f.name}</span>
                  <MsBadge ms={f.milestone} />
                </button>
              ))}
              {screenFeatures.length === 0 && (
                <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>
                  이 화면에 등록된 기능이 없어요
                </span>
              )}
            </div>
          </>
        )}

        {!featureRecord && !screenRecord && (
          <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>
            IA에 등록되지 않은 화면이에요 — ia_inspector.js를 확인하세요
          </span>
        )}
      </div>

      {/* 렌즈·데모 스위치는 패널 하단으로 (스펙 §8-4) */}
      <MilestoneLens />
    </aside>
  )
}
