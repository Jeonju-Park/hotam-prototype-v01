import React, { useEffect } from 'react'
import { useApp } from '../../App.jsx'

// 메모 탭 — ia_memos 전체 최신순 스레드 (작성자·시간·대상 ID 칩 → 행/요소 점프)
const fmtTime = (iso) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function MemoTab({ onJump }) {
  const { iaMemos, markMemosSeen, setReverseFuncId } = useApp()

  // 탭 열람 = 새 메모 뱃지 해제
  useEffect(() => { markMemosSeen() }, [markMemosSeen])

  return (
    <div className="ia-stream">
      {iaMemos.map((m) => (
        <div className="ia-stream-row" key={m.id}>
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
          </div>
          <p className="t-body">{m.body}</p>
        </div>
      ))}
      {iaMemos.length === 0 && (
        <p className="t-caption" style={{ color: 'var(--text-tertiary)', padding: 'var(--sp-sm)' }}>
          아직 메모가 없어요 — 테이블에서 행을 열고 첫 메모를 남겨보세요
        </p>
      )}
    </div>
  )
}
