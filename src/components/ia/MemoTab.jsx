import React, { useEffect, useMemo, useState } from 'react'
import { Trash2, Plus, ExternalLink, MessageCircle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../App.jsx'
import { mapAuthor } from '../../lib/useIaLive.js'

// 메모 탭 (v2.1 §2) — 태그 4종·대상 칩(ID+이름)·바로가기·댓글 스레드·추가 폼·미해결 필터
const TAGS = ['이슈', 'QA', '기능', '화면']
const tagClass = { '이슈': 'tag-issue', 'QA': 'tag-qa', '기능': 'tag-func', '화면': 'tag-screen' }
const fmtTime = (iso) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function MemoTab({ onJump }) {
  const {
    iaMemos, iaMemoComments, iaScreens, iaFeatures, iaStatus,
    markMemosSeen, setReverseFuncId, navigate,
    addMemo, confirmMemo, deleteMemo, resolveMemo, addMemoComment, showToast, author,
  } = useApp()
  const readOnly = iaStatus !== 'live'

  const [tagFilter, setTagFilter] = useState(null)
  const [showResolved, setShowResolved] = useState(false)
  const [screenFilter, setScreenFilter] = useState('')
  const [openComments, setOpenComments] = useState(null)   // memo id
  const [commentDraft, setCommentDraft] = useState('')
  // 추가 폼
  const [composing, setComposing] = useState(false)
  const [cTag, setCTag] = useState('이슈')
  const [cTarget, setCTarget] = useState('')
  const [cQuery, setCQuery] = useState('')
  const [cBody, setCBody] = useState('')

  useEffect(() => { markMemosSeen() }, [markMemosSeen])

  const targetScreenOf = (m) => {
    if (!m.target_id) return null
    if (iaScreens[m.target_id]) return m.target_id
    return iaFeatures[m.target_id]?.screen ?? null
  }
  const targetName = (tid) => iaScreens[tid]?.name ?? iaFeatures[tid]?.name ?? ''

  const visible = useMemo(() => iaMemos.filter((m) =>
    !m.deleted &&
    (showResolved || !m.resolved) &&
    (!tagFilter || (m.tag ?? '기능') === tagFilter) &&
    (!screenFilter || targetScreenOf(m) === screenFilter)
  ), [iaMemos, showResolved, tagFilter, screenFilter, iaScreens, iaFeatures])

  // 상단 요약: 미해결 태그별 카운트
  const summary = useMemo(() => {
    const open = iaMemos.filter((m) => !m.deleted && !m.resolved)
    return TAGS.map((t) => [t, open.filter((m) => (m.tag ?? '기능') === t).length]).filter(([, n]) => n > 0)
  }, [iaMemos])

  const memoScreens = useMemo(() =>
    [...new Set(iaMemos.filter((m) => !m.deleted).map(targetScreenOf).filter(Boolean))], [iaMemos, iaScreens, iaFeatures])

  // 대상 자동완성 후보 (화면 + 기능)
  const candidates = useMemo(() => {
    const q = cQuery.trim().toLowerCase()
    if (!q) return []
    const s = Object.values(iaScreens).filter((r) => r.id !== '-' && (`${r.id} ${r.name}`.toLowerCase().includes(q)))
      .map((r) => ({ id: r.id, label: `${r.id} · ${r.name}`, kind: '화면' }))
    const f = Object.values(iaFeatures).filter((r) => (`${r.id} ${r.name}`.toLowerCase().includes(q)))
      .map((r) => ({ id: r.id, label: `${r.id} · ${r.name}`, kind: '기능' }))
    return [...s, ...f].slice(0, 6)
  }, [cQuery, iaScreens, iaFeatures])

  // [바로가기]: 화면 이동 + 기능이면 요소 하이라이트 플래시
  const goTo = (m) => {
    const scr = targetScreenOf(m)
    if (!scr) return showToast('대상이 지정되지 않은 메모예요')
    navigate(scr)
    if (iaFeatures[m.target_id]) {
      setTimeout(() => {
        setReverseFuncId(m.target_id)
        setTimeout(() => setReverseFuncId(null), 1600)
      }, 400)
    }
  }

  const submitMemo = async () => {
    if (!cBody.trim()) return showToast('내용을 입력해 주세요')
    if (['기능', '화면'].includes(cTag) && !cTarget) return showToast(`'${cTag}' 태그는 대상 선택이 필수예요`)
    const { error } = await addMemo(cTarget || '', cBody.trim(), cTag)
    if (error) return showToast(error)
    setComposing(false); setCBody(''); setCTarget(''); setCQuery('')
  }

  const submitComment = async (m) => {
    if (!commentDraft.trim()) return
    const { error } = await addMemoComment(m.id, m.target_id, commentDraft.trim())
    if (error) return showToast(error)
    setCommentDraft('')
  }

  return (
    <div className="ia-stream">
      {/* 요약 + 필터 */}
      <div className="ia-toolbar" style={{ flexWrap: 'wrap' }}>
        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>
          {summary.length ? summary.map(([t, n]) => `미해결 ${t} ${n}`).join(' · ') : '미해결 0'}
        </span>
        <span className="spacer" />
        <button className="ia-tool-btn" disabled={readOnly} onClick={() => setComposing(!composing)}>
          <Plus size={13} /> 메모
        </button>
      </div>
      <div className="ia-toolbar" style={{ paddingTop: 0, flexWrap: 'wrap' }}>
        {TAGS.map((t) => (
          <button key={t} className={`memo-tag ${tagClass[t]}${tagFilter === t ? ' is-on' : ''}`}
            onClick={() => setTagFilter(tagFilter === t ? null : t)}>
            {t}
          </button>
        ))}
        <select className="ia-ms-select" value={screenFilter} onChange={(e) => setScreenFilter(e.target.value)}>
          <option value="">전체 화면</option>
          {memoScreens.map((s) => <option key={s} value={s}>{s} · {iaScreens[s]?.name}</option>)}
        </select>
        <label className="memo-confirm t-micro">
          <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} />
          해결 포함
        </label>
      </div>

      {/* 메모 추가 폼 */}
      {composing && (
        <div className="memo-compose-form">
          <div className="ia-toolbar" style={{ padding: 0 }}>
            {TAGS.map((t) => (
              <button key={t} className={`memo-tag ${tagClass[t]}${cTag === t ? ' is-on' : ''}`} onClick={() => setCTag(t)}>{t}</button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <input className="inline-input" placeholder={`대상 검색 (${['기능', '화면'].includes(cTag) ? '필수' : '선택'}) — 예: S7, 좋아요`}
              value={cTarget ? `${cTarget} · ${targetName(cTarget)}` : cQuery}
              onChange={(e) => { setCTarget(''); setCQuery(e.target.value) }} />
            {candidates.length > 0 && !cTarget && (
              <div className="autocomplete">
                {candidates.map((c) => (
                  <button key={c.id} className="autocomplete-item t-caption"
                    onClick={() => { setCTarget(c.id); setCQuery('') }}>
                    <span className={`memo-tag ${c.kind === '화면' ? 'tag-screen' : 'tag-func'}`}>{c.kind}</span> {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input className="inline-input" placeholder="메모 내용" value={cBody}
            onChange={(e) => setCBody(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitMemo()} />
          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
            <button className="ia-tool-btn" onClick={submitMemo}>등록</button>
            <button className="ia-tool-btn" onClick={() => setComposing(false)}>취소</button>
          </div>
        </div>
      )}

      {/* 메모 목록 */}
      {visible.map((m) => {
        const comments = iaMemoComments.filter((c) => c.memo_id === m.id)
        const open = openComments === m.id
        return (
          <div className={`ia-stream-row${m.confirmed ? ' is-confirmed' : ''}${m.resolved ? ' is-resolved' : ''}`} key={m.id}>
            <div className="ia-stream-head">
              <span className={`memo-tag ${tagClass[m.tag ?? '기능']}`}>{m.tag ?? '기능'}</span>
              {m.target_id && (
                <button className="ia-id-chip t-micro" onClick={() => iaFeatures[m.target_id] ? onJump(m.target_id) : navigate(m.target_id)}
                  onMouseEnter={() => iaFeatures[m.target_id] && setReverseFuncId(m.target_id)}
                  onMouseLeave={() => setReverseFuncId(null)}>
                  {m.target_id}{targetName(m.target_id) ? ` · ${targetName(m.target_id)}` : ''}
                </button>
              )}
              <b className="t-caption">{mapAuthor(m.author)}</b>
              <span className="t-micro" style={{ color: 'var(--text-tertiary)' }}>{fmtTime(m.created_at)}</span>
              <span className="spacer" />
              {m.target_id && (
                <button className="icon-mini" title="바로가기 — 프로토타입 이동+하이라이트" onClick={() => goTo(m)}>
                  <ExternalLink size={13} strokeWidth={1.8} />
                </button>
              )}
            </div>
            <p className="t-body">{m.body}</p>
            <div className="memo-actions">
              <button className={`memo-resolve t-micro${m.resolved ? ' is-on' : ''}`} disabled={readOnly}
                onClick={async () => { const { error } = await resolveMemo(m.id, !m.resolved); if (error) showToast(error) }}>
                <CheckCircle2 size={12} /> {m.resolved ? '해결됨' : '해결'}
              </button>
              <button className="memo-resolve t-micro" onClick={() => { setOpenComments(open ? null : m.id); setCommentDraft('') }}>
                <MessageCircle size={12} /> 댓글 {comments.length}
              </button>
              <span className="spacer" />
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
                <Trash2 size={13} strokeWidth={1.8} />
              </button>
            </div>
            {open && (
              <div className="memo-comments">
                {comments.map((c) => (
                  <div className="memo-comment t-caption" key={c.id}>
                    <b>{mapAuthor(c.author)}</b>
                    <span style={{ color: 'var(--text-tertiary)' }}>{fmtTime(c.created_at)}</span>
                    <span className="ia-memo-body">{c.body}</span>
                  </div>
                ))}
                <input className="inline-input" placeholder={readOnly ? '오프라인' : `${author}(으)로 댓글 달기`}
                  disabled={readOnly} value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment(m)} />
              </div>
            )}
          </div>
        )
      })}
      {visible.length === 0 && (
        <p className="t-caption" style={{ color: 'var(--text-tertiary)', padding: 'var(--sp-sm)' }}>
          조건에 맞는 메모가 없어요
        </p>
      )}
    </div>
  )
}
