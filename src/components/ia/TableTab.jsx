import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Archive, ArchiveRestore } from 'lucide-react'
import { useApp } from '../../App.jsx'
import InlineEdit from './InlineEdit.jsx'

// 테이블 탭 (스펙 v2 §3)
// - 기본 = 현재 화면 기능만(토글로 전체) · 컬럼: 기능ID/명칭/마일스톤 드롭다운/중요도/메모
// - 행 클릭 = 아코디언 상세 + 선택 고정(재클릭 해제) · 셀 더블클릭 = 인라인 편집
// - 기능 추가(HTM 형식 검증) · 삭제 대신 보관
const MS_OPTIONS = ['M1', 'M2', 'M3', 'Later', '결정대기']
const msClass = (ms) => (/결정대기|later/i.test(ms) ? 'later' : /M3/.test(ms) ? 'm3' : /M2/.test(ms) ? 'm2' : 'm1')

const DETAIL_FIELDS = [
  { key: 'purpose', label: '목적/기능 설명' },
  { key: 'copy', label: 'UX 카피 노트' },
  { key: 'nav', label: '진입→연결' },
  { key: 'flags', label: '이슈/색인' },
  { key: 'note', label: '비고' },
]

export default function TableTab({ selectedId, setSelectedId }) {
  const {
    currentScreen, iaStatus, iaScreens, iaFeatureList, iaFlashId,
    hoveredFuncId, setReverseFuncId,
    updateFeatureField, addFeature, archiveFeature, addMemo, iaMemos,
    showToast, author,
  } = useApp()

  // 필터 상태 — 도구 설정이라 localStorage 허용
  const [showAll, setShowAll] = useState(() => localStorage.getItem('hotam_ia_showall') === '1')
  const toggleShowAll = () => {
    setShowAll((v) => {
      localStorage.setItem('hotam_ia_showall', v ? '0' : '1')
      return !v
    })
  }
  const [adding, setAdding] = useState(false)
  const [newId, setNewId] = useState('')
  const [newName, setNewName] = useState('')
  const [memoDraft, setMemoDraft] = useState('')
  const readOnly = iaStatus !== 'live'
  const bodyRef = useRef(null)

  const rows = useMemo(() => {
    const list = showAll ? iaFeatureList : iaFeatureList.filter((f) => f.screen === currentScreen)
    return [...list.filter((f) => !f.archived), ...list.filter((f) => f.archived)]
  }, [iaFeatureList, showAll, currentScreen])

  const screenRec = iaScreens[currentScreen]

  // ④ 프로토타입 호버 → 해당 행 자동 스크롤 (하이라이트는 클래스로)
  useEffect(() => {
    if (!hoveredFuncId || !bodyRef.current) return
    bodyRef.current
      .querySelector(`[data-row="${hoveredFuncId}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [hoveredFuncId])

  // 메모/히스토리 탭에서 점프해 온 선택 행으로 스크롤
  useEffect(() => {
    if (!selectedId || !bodyRef.current) return
    bodyRef.current.querySelector(`[data-row="${selectedId}"]`)?.scrollIntoView({ block: 'center' })
  }, [selectedId])

  const save = async (id, field, value) => {
    const { error } = await updateFeatureField(id, field, value)
    if (error) showToast(error)
  }

  const submitAdd = async () => {
    const { error } = await addFeature(newId.trim(), newName.trim() || '(이름 없음)', currentScreen)
    if (error) return showToast(error)
    setAdding(false); setNewId(''); setNewName('')
    setSelectedId(newId.trim())
  }

  const submitMemo = async (targetId) => {
    if (!memoDraft.trim()) return
    const { error } = await addMemo(targetId, memoDraft.trim())
    if (error) return showToast(error)
    setMemoDraft('')
  }

  return (
    <div className="ia-table">
      {/* 툴바: 화면 필터 + 기능 추가 */}
      <div className="ia-toolbar">
        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>
          {showAll ? `전체 화면 · ${rows.length}행` : `${screenRec?.name ?? currentScreen} (${currentScreen}) · ${rows.length}행`}
        </span>
        <span className="spacer" />
        <button className="ia-tool-btn" onClick={toggleShowAll}>
          {showAll ? '현재 화면만' : '전체 화면 보기'}
        </button>
        <button className="ia-tool-btn" disabled={readOnly} onClick={() => setAdding(!adding)}>
          <Plus size={13} /> 기능 추가
        </button>
      </div>

      {adding && (
        <div className="ia-add-row">
          <input
            className="inline-input" style={{ width: 120 }} placeholder="HTM-S7-18"
            value={newId} onChange={(e) => setNewId(e.target.value.toUpperCase())} autoFocus
          />
          <input
            className="inline-input" style={{ flex: 1 }} placeholder="기능 명칭"
            value={newName} onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
          />
          <button className="ia-tool-btn" onClick={submitAdd}>추가</button>
          <button className="ia-tool-btn" onClick={() => setAdding(false)}>취소</button>
        </div>
      )}

      {/* 헤더 행 */}
      <div className="ia-row ia-row-head">
        <span>기능ID</span><span>명칭</span><span>마일스톤</span><span>중요도</span><span>메모</span>
      </div>

      <div className="ia-table-body" ref={bodyRef}>
        {rows.map((f) => {
          const selected = selectedId === f.id
          const hot = hoveredFuncId === f.id
          const rowMemos = selected ? iaMemos.filter((m) => m.target_id === f.id).slice(0, 2) : []
          if (f.archived && !selected) {
            return (
              <div key={f.id} data-row={f.id} className="ia-row is-archived" onClick={() => setSelectedId(f.id)}>
                <span className="ia-id">{f.id}</span>
                <span className="ia-archived-label">보관됨 · {f.name}</span>
                <button
                  className="ia-tool-btn" disabled={readOnly} title="복원"
                  onClick={(e) => { e.stopPropagation(); archiveFeature(f.id, false) }}
                >
                  <ArchiveRestore size={13} />
                </button>
              </div>
            )
          }
          return (
            <div key={f.id} data-row={f.id}>
              <div
                className={`ia-row${selected ? ' is-selected' : ''}${hot ? ' is-hot' : ''}${iaFlashId === f.id ? ' is-flash' : ''}`}
                onClick={() => setSelectedId(selected ? null : f.id)}          // 행 클릭 = 선택 고정/해제
                onMouseEnter={() => setReverseFuncId(f.id)}                    // ④ 행 호버 → 요소 아웃라인
                onMouseLeave={() => setReverseFuncId(null)}
              >
                <span className="ia-id t-micro">{f.id}</span>
                <InlineEdit value={f.name} disabled={readOnly} onSave={(v) => save(f.id, 'name', v)} />
                {/* ③ 마일스톤 드롭다운 — 저장 즉시 렌즈·뱃지 재계산(MsGate가 라이브 조회) */}
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

              {/* 아코디언 상세 */}
              {selected && (
                <div className="ia-detail">
                  {DETAIL_FIELDS.map(({ key, label }) => (
                    <div className="ia-detail-field" key={key}>
                      <span className="t-micro ia-detail-label">{label}</span>
                      <InlineEdit value={f[key]} disabled={readOnly} onSave={(v) => save(f.id, key, v)} />
                    </div>
                  ))}
                  {/* 메모 스레드 미리보기 (최근 2 + 입력) */}
                  <div className="ia-detail-field">
                    <span className="t-micro ia-detail-label">메모 스레드</span>
                    {rowMemos.map((m) => (
                      <div className="ia-memo-line t-caption" key={m.id}>
                        <b>{m.author}</b> {m.body}
                      </div>
                    ))}
                    <div className="ia-memo-compose">
                      <input
                        className="inline-input" style={{ flex: 1 }}
                        placeholder={readOnly ? '오프라인 — 읽기 전용' : `${author || '게스트'}(으)로 메모 남기기`}
                        disabled={readOnly}
                        value={memoDraft}
                        onChange={(e) => setMemoDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitMemo(f.id)}
                      />
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
            이 화면에 등록된 기능이 없어요 — "기능 추가"로 시작하세요
          </p>
        )}
      </div>
    </div>
  )
}
