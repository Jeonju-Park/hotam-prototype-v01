import React, { useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { useApp } from '../../App.jsx'

// 메모 탭 — ia_memos 전체 최신순 스레드 (작성자·시간·대상 ID 칩 → 행/요소 점프)
// 각 메모: 확인 체크박스 + 삭제(소프트 — 기록은 보존, 목록에서 숨김)
const fmtTime = (iso) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function MemoTab({ onJump }) {
  const { iaMemos, iaStatus, markMemosSeen, setReverseFuncId, confirmMemo, deleteMemo, showToast } = useApp()
  const readOnly = iaStatus !== 'live'
  const visible = iaMemos.filter((m) => !m.deleted)

  // 탭 열람 = 새 메모 뱃지 해제
  useEffect(() => { markMemosSeen() }, [markMemosSeen])

  const onConfirm = async (m) => {
    const { error } = await confirmMemo(m.id, !m.confirmed)
    if (error) showToast(error)
  }
  const onDelete = async (m) => {
    const { error } = await deleteMemo(m.id, m.body)
    if (error) return showToast(error)
    showToast('메모를 숨겼어요 (기록은 히스토리에 보존)')
  }

  return (
    <div className="ia-stream">
      {visible.map((m) => (
        <div className={`ia-stream-row${m.confirmed ? ' is-confirmed' : ''}`} key={m.id}>
          <div className="ia-stream-head">
            <b className="t-caption">{m.author}</b>
            <span className="t-micro" style={{ color: 'var(--text-tertiary)' }}>{fmtTime(m.created_at)}</span>
            <button
              className="ia-id-chip t-micro"
              onClick={() => onJump(m.target_id)}
              onMouseEnter={() => setReverseFuncId(m.target_id)}
              onMouseLeave={() => setReverseFuncId(null)}
            >
              {m.target_id}
            </button>
            <span className="spacer" />
            <label className="memo-confirm t-micro" title="확인했다는 표시">
              <input
                type="checkbox"
                checked={!!m.confirmed}
                disabled={readOnly}
                onChange={() => onConfirm(m)}
              />
              확인
            </label>
            <button
              className="icon-mini"
              aria-label="메모 삭제"
              disabled={readOnly}
              onClick={() => onDelete(m)}
            >
              <Trash2 size={13} strokeWidth={1.8} />
            </button>
          </div>
          <p className="t-body">{m.body}</p>
        </div>
      ))}
      {visible.length === 0 && (
        <p className="t-caption" style={{ color: 'var(--text-tertiary)', padding: 'var(--sp-sm)' }}>
          아직 메모가 없어요 — 테이블에서 행을 열고 첫 메모를 남겨보세요
        </p>
      )}
    </div>
  )
}
