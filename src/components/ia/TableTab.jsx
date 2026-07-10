import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Archive, ArchiveRestore, Trash2, X, ChevronDown } from 'lucide-react'
import { useApp } from '../../App.jsx'
import InlineEdit from './InlineEdit.jsx'
import { msBucket } from '../../lib/useIaLive.js'

// 테이블 탭 (스펙 v2 §3 + v2.1 §1·§4)
// - 상단 현재 화면 카드(브레드크럼·Type·마일스톤·목적, 클릭 아코디언 — 화면도 편집·메모 대상)
// - 진입→연결의 S#/HTM ID → 클릭 칩(화면=프로토타입 이동 / 기능=행 점프)
// - 프로토타입에 없는 행은 [미구현] 뱃지 (DOM data-func-id 동적 판정)
const MS_OPTIONS = ['M1', 'M2', 'M3', 'Later', '결정대기']
const msClass = (ms) => (/결정대기|later/i.test(ms) ? 'later' : /M3/.test(ms) ? 'm3' : /M2/.test(ms) ? 'm2' : 'm1')

const DETAIL_FIELDS = [
  { key: 'purpose', label: '목적/기능 설명' },
  { key: 'copy', label: 'UX 카피 노트' },
  { key: 'nav', label: '진입→연결', chips: true },
  { key: 'flags', label: '이슈/색인' },
  { key: 'note', label: '비고' },
]

// 진입→연결 텍스트의 S#/HTM ID를 클릭 칩으로 (v2.1 §1)
const TOKEN_RE = /(HTM-[A-Z0-9]+-\d+|S\d{1,2}(?![\d)])|A0)/g
export function NavChips({ text, onScreenChip, onFeatureChip, screens, features }) {
  if (!text) return <span className="inline-cell is-empty">—</span>
  const parts = text.split(TOKEN_RE)
  return (
    <span className="nav-chips">
      {parts.map((part, i) => {
        if (features?.[part]) {
          return <button key={i} className="ia-id-chip t-micro" onClick={(e) => { e.stopPropagation(); onFeatureChip(part) }}>{part}</button>
        }
        if (screens?.[part]) {
          return <button key={i} className="ia-id-chip is-screen t-micro" onClick={(e) => { e.stopPropagation(); onScreenChip(part) }}>{part}</button>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

// 진입→연결 셀: 표시는 칩, 더블클릭 시 원문 인라인 편집
function NavEditableCell({ value, disabled, onSave, screens, features, onScreenChip, onFeatureChip }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState('')
  if (editing) {
    return (
      <input
        className="inline-input" autoFocus value={val} placeholder="예: → S4(식당 상세)"
        onChange={(e) => setVal(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { onSave(val.trim()); setEditing(false) }
          if (e.key === 'Escape') setEditing(false)
        }}
        onBlur={() => setEditing(false)}
      />
    )
  }
  return (
    <div
      className={`nav-cell${disabled ? '' : ' is-editable'}`}
      title={disabled ? undefined : '더블클릭해서 편집 (병기 형식: S4(식당 상세))'}
      onDoubleClick={(e) => { if (disabled) return; e.stopPropagation(); setVal(value ?? ''); setEditing(true) }}
    >
      <NavChips text={value} screens={screens} features={features} onScreenChip={onScreenChip} onFeatureChip={onFeatureChip} />
    </div>
  )
}

export default function TableTab({ selectedId, setSelectedId, filter, setFilter, implementedIds }) {
  const {
    currentScreen, navigate, iaStatus, iaScreens, iaFeatures, iaFeatureList, iaFlashId,
    hoveredFuncId, setReverseFuncId,
    updateFeatureField, updateScreenField, addFeature, archiveFeature,
    addMemo, confirmMemo, deleteMemo, iaMemos,
    showToast, author,
  } = useApp()

  const [adding, setAdding] = useState(false)
  const [newId, setNewId] = useState('')
  const [newName, setNewName] = useState('')
  const [memoDraft, setMemoDraft] = useState('')
  const [screenOpen, setScreenOpen] = useState(false)
  const readOnly = iaStatus !== 'live'
  const bodyRef = useRef(null)

  const screenRec = iaScreens[currentScreen]

  // 필터 적용 (scope: 'screen' | 'all' | 'area:영역명' + milestone 버킷)
  const rows = useMemo(() => {
    let list = iaFeatureList
    if (filter.scope === 'screen') list = list.filter((f) => f.screen === currentScreen)
    else if (filter.scope.startsWith('area:')) list = list.filter((f) => f.area === filter.scope.slice(5))
    if (filter.milestone) list = list.filter((f) => msBucket(f.milestone) === filter.milestone)
    return [...list.filter((f) => !f.archived), ...list.filter((f) => f.archived)]
  }, [iaFeatureList, filter, currentScreen])

  const scopeLabel = filter.scope === 'screen'
    ? `${screenRec?.name ?? currentScreen} (${currentScreen})`
    : filter.scope === 'all' ? '전체 화면' : `영역: ${filter.scope.slice(5)}`

  // 기능 칩/메모 점프: 행 선택 + 필터 밖이면 전체로 전환
  const jumpToFeature = (fid) => {
    const f = iaFeatures[fid]
    if (!f) return
    if (filter.scope === 'screen' && f.screen !== currentScreen) setFilter((p) => ({ ...p, scope: 'all' }))
    setSelectedId(fid)
  }

  // ④ 프로토타입 호버 → 해당 행 자동 스크롤
  useEffect(() => {
    if (!hoveredFuncId || !bodyRef.current) return
    bodyRef.current.querySelector(`[data-row="${hoveredFuncId}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [hoveredFuncId])
  useEffect(() => {
    if (!selectedId || !bodyRef.current) return
    bodyRef.current.querySelector(`[data-row="${selectedId}"]`)?.scrollIntoView({ block: 'center' })
  }, [selectedId])

  const save = async (id, field, value) => {
    const { error } = await updateFeatureField(id, field, value)
    if (error) showToast(error)
  }
  const saveScreen = async (field, value) => {
    const { error } = await updateScreenField(currentScreen, field, value)
    if (error) showToast(error)
  }

  const submitAdd = async () => {
    const { error } = await addFeature(newId.trim(), newName.trim() || '(이름 없음)')
    if (error) return showToast(error)
    setAdding(false); setNewId(''); setNewName('')
    setSelectedId(newId.trim())
  }

  const submitMemo = async (targetId) => {
    if (!memoDraft.trim()) return
    const { error } = await addMemo(targetId, memoDraft.trim(), '기능')
    if (error) return showToast(error)
    setMemoDraft('')
  }

  const screenMemos = iaMemos.filter((m) => m.target_id === currentScreen && !m.deleted).slice(0, 2)

  return (
    <div className="ia-table">
      {/* ── 현재 화면 카드 (v2.1 §1) ── */}
      {screenRec && (
        <div className="screen-card">
          {/* 브레드크럼: 영역 › 화면 */}
          <div className="breadcrumb t-micro">
            <button className="crumb" onClick={() => setFilter((p) => ({ ...p, scope: `area:${screenRec.area}` }))}>
              {screenRec.area}
            </button>
            <span className="crumb-sep">›</span>
            <button className="crumb" onClick={() => navigate(currentScreen)}>{screenRec.name}</button>
          </div>
          <button className="screen-card-main" onClick={() => setScreenOpen(!screenOpen)}>
            <span className="ia-id-chip is-screen t-micro">{screenRec.id}</span>
            <span className="t-title">{screenRec.name}</span>
            {screenRec.type && <span className="type-chip t-micro">{screenRec.type}</span>}
            <span className={`ms-badge ${msClass(screenRec.milestone)}`}>{screenRec.milestone}</span>
            <span className="spacer" />
            <ChevronDown size={14} style={{ transform: screenOpen ? 'rotate(180deg)' : 'none', color: 'var(--text-tertiary)' }} />
          </button>
          <p className="t-caption screen-card-purpose">{screenRec.purpose}</p>
          {screenOpen && (
            <div className="ia-detail screen-detail">
              {[['copy', 'UX 카피 노트'], ['flags', '이슈/색인'], ['note', '비고']].map(([key, label]) => (
                <div className="ia-detail-field" key={key}>
                  <span className="t-micro ia-detail-label">{label}</span>
                  <InlineEdit value={screenRec[key]} disabled={readOnly} onSave={(v) => saveScreen(key, v)} />
                </div>
              ))}
              <div className="ia-detail-field">
                <span className="t-micro ia-detail-label">메모 스레드</span>
                {screenMemos.map((m) => (
                  <div className="ia-memo-line t-caption" key={m.id}><b>{m.author}</b><span className="ia-memo-body">{m.body}</span></div>
                ))}
                <div className="ia-memo-compose">
                  <input
                    className="inline-input" style={{ flex: 1 }}
                    placeholder={readOnly ? '오프라인 — 읽기 전용' : '화면에 메모 남기기'}
                    disabled={readOnly}
                    value={memoDraft}
                    onChange={(e) => setMemoDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (async () => {
                      const { error } = await addMemo(currentScreen, memoDraft.trim(), '화면')
                      if (error) showToast(error); else setMemoDraft('')
                    })()}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 툴바 */}
      <div className="ia-toolbar">
        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{scopeLabel} · {rows.length}행</span>
        {filter.milestone && (
          <button className="criteria-chip is-selected" style={{ minHeight: 22, padding: '0 6px' }}
            onClick={() => setFilter((p) => ({ ...p, milestone: null }))}>
            {filter.milestone} <X size={11} />
          </button>
        )}
        <span className="spacer" />
        <button className="ia-tool-btn" onClick={() => setFilter((p) => ({ ...p, scope: p.scope === 'screen' ? 'all' : 'screen' }))}>
          {filter.scope === 'screen' ? '전체 화면 보기' : '현재 화면만'}
        </button>
        <button className="ia-tool-btn" disabled={readOnly} onClick={() => setAdding(!adding)}>
          <Plus size={13} /> 기능 추가
        </button>
      </div>

      {adding && (
        <div className="ia-add-row">
          <input className="inline-input" style={{ width: 120 }} placeholder="HTM-S7-18"
            value={newId} onChange={(e) => setNewId(e.target.value.toUpperCase())} autoFocus />
          <input className="inline-input" style={{ flex: 1 }} placeholder="기능 명칭"
            value={newName} onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()} />
          <button className="ia-tool-btn" onClick={submitAdd}>추가</button>
          <button className="ia-tool-btn" onClick={() => setAdding(false)}>취소</button>
        </div>
      )}

      <div className="ia-row ia-row-head">
        <span>기능ID</span><span>명칭</span><span>마일스톤</span><span>중요도</span><span>메모</span>
      </div>

      <div className="ia-table-body" ref={bodyRef}>
        {rows.map((f) => {
          const selected = selectedId === f.id
          const hot = hoveredFuncId === f.id
          // §4 미구현: 현재 화면 행인데 프로토타입 DOM에 data-func-id 없음 (동적 판정)
          const unimplemented = f.screen === currentScreen && !f.archived && !implementedIds.has(f.id)
          const rowMemos = selected ? iaMemos.filter((m) => m.target_id === f.id && !m.deleted).slice(0, 2) : []

          if (f.archived && !selected) {
            return (
              <div key={f.id} data-row={f.id} className="ia-row is-archived" onClick={() => setSelectedId(f.id)}>
                <span className="ia-id">{f.id}</span>
                <span className="ia-archived-label">보관됨 · {f.name}</span>
                <button className="ia-tool-btn" disabled={readOnly} title="복원"
                  onClick={(e) => { e.stopPropagation(); archiveFeature(f.id, false) }}>
                  <ArchiveRestore size={13} />
                </button>
              </div>
            )
          }
          return (
            <div key={f.id} data-row={f.id}>
              <div
                className={`ia-row${selected ? ' is-selected' : ''}${hot ? ' is-hot' : ''}${iaFlashId === f.id ? ' is-flash' : ''}${unimplemented ? ' is-unimpl' : ''}`}
                title={unimplemented ? '프로토타입 미구현 — IA에만 존재' : undefined}
                onClick={() => setSelectedId(selected ? null : f.id)}
                onMouseEnter={() => { if (!unimplemented) setReverseFuncId(f.id) }}  // §4: 미구현은 하이라이트 없음
                onMouseLeave={() => setReverseFuncId(null)}
              >
                <span className="ia-id t-micro">
                  {unimplemented && <span className="unimpl-badge">미구현</span>}
                  {f.id}
                </span>
                <InlineEdit value={f.name} disabled={readOnly} onSave={(v) => save(f.id, 'name', v)} />
                <select
                  className={`ia-ms-select ${msClass(f.milestone)}`}
                  value={MS_OPTIONS.includes(f.milestone) ? f.milestone : f.milestone || 'M1'}
                  disabled={readOnly}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => save(f.id, 'milestone', e.target.value)}
                >
                  {!MS_OPTIONS.includes(f.milestone) && f.milestone && <option value={f.milestone}>{f.milestone}</option>}
                  {MS_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <InlineEdit value={f.importance} disabled={readOnly} onSave={(v) => save(f.id, 'importance', v)} />
                <InlineEdit value={f.memo} disabled={readOnly} onSave={(v) => save(f.id, 'memo', v)} />
              </div>

              {selected && (
                <div className="ia-detail">
                  {/* 브레드크럼: 영역 › 화면 › 기능명 */}
                  <div className="breadcrumb t-micro">
                    <button className="crumb" onClick={() => setFilter((p) => ({ ...p, scope: `area:${f.area}` }))}>{f.area}</button>
                    <span className="crumb-sep">›</span>
                    <button className="crumb" onClick={() => navigate(f.screen)}>{f.screen_name || f.screen}</button>
                    <span className="crumb-sep">›</span>
                    <span className="crumb is-current">{f.name}</span>
                  </div>
                  {DETAIL_FIELDS.map(({ key, label, chips }) => (
                    <div className="ia-detail-field" key={key}>
                      <span className="t-micro ia-detail-label">{label}</span>
                      {chips ? (
                        <NavEditableCell
                          value={f[key]}
                          disabled={readOnly}
                          screens={iaScreens}
                          features={iaFeatures}
                          onScreenChip={(sid) => navigate(sid)}
                          onFeatureChip={jumpToFeature}
                          onSave={(v) => save(f.id, key, v)}
                        />
                      ) : (
                        <InlineEdit value={f[key]} disabled={readOnly} onSave={(v) => save(f.id, key, v)} />
                      )}
                    </div>
                  ))}
                  <div className="ia-detail-field">
                    <span className="t-micro ia-detail-label">메모 스레드</span>
                    {rowMemos.map((m) => (
                      <div className={`ia-memo-line t-caption${m.confirmed ? ' is-confirmed' : ''}`} key={m.id}>
                        <b>{m.author}</b>
                        <span className="ia-memo-body">{m.body}</span>
                        <label className="memo-confirm t-micro">
                          <input type="checkbox" checked={!!m.confirmed} disabled={readOnly}
                            onChange={async () => { const { error } = await confirmMemo(m.id, !m.confirmed); if (error) showToast(error) }} />
                          확인
                        </label>
                        <button className="icon-mini" aria-label="메모 삭제" disabled={readOnly}
                          onClick={async () => {
                            const { error } = await deleteMemo(m.id, m.body)
                            showToast(error ?? '메모를 숨겼어요 (기록은 히스토리에 보존)')
                          }}>
                          <Trash2 size={12} strokeWidth={1.8} />
                        </button>
                      </div>
                    ))}
                    <div className="ia-memo-compose">
                      <input className="inline-input" style={{ flex: 1 }}
                        placeholder={readOnly ? '오프라인 — 읽기 전용' : `${author || '개발'}(으)로 메모 남기기`}
                        disabled={readOnly}
                        value={memoDraft}
                        onChange={(e) => setMemoDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitMemo(f.id)} />
                    </div>
                  </div>
                  <div className="ia-detail-actions">
                    <button className="ia-tool-btn" disabled={readOnly} onClick={() => archiveFeature(f.id, !f.archived)}>
                      {f.archived ? <><ArchiveRestore size={13} /> 복원</> : <><Archive size={13} /> 보관</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {rows.length === 0 && (
          <p className="t-caption" style={{ color: 'var(--text-tertiary)', padding: 'var(--sp-sm)' }}>
            조건에 맞는 기능이 없어요
          </p>
        )}
      </div>
    </div>
  )
}
