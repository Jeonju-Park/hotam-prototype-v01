import React, { useMemo, useState } from 'react'
import { useApp } from '../../App.jsx'
import { fieldLabel } from '../../lib/useIaLive.js'

// 히스토리 탭 — ia_change_log 최신순: "7/12 14:02 대표 · HTM-S5-02 · 마일스톤: M2→M1"
const fmtTime = (iso) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function HistoryTab({ onJump }) {
  const { iaChangeLog } = useApp()
  const [fieldFilter, setFieldFilter] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')

  const fields = useMemo(() => [...new Set(iaChangeLog.map((c) => c.field))], [iaChangeLog])
  const authors = useMemo(() => [...new Set(iaChangeLog.map((c) => c.author))], [iaChangeLog])
  const rows = iaChangeLog.filter(
    (c) => (!fieldFilter || c.field === fieldFilter) && (!authorFilter || c.author === authorFilter)
  )

  return (
    <div className="ia-stream">
      <div className="ia-toolbar">
        <select className="ia-ms-select" value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)}>
          <option value="">전체 필드</option>
          {fields.map((f) => <option key={f} value={f}>{fieldLabel(f)}</option>)}
        </select>
        <select className="ia-ms-select" value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)}>
          <option value="">전체 작성자</option>
          {authors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <span className="spacer" />
        <span className="t-micro" style={{ color: 'var(--text-tertiary)' }}>{rows.length}건</span>
      </div>
      {rows.map((c) => (
        <div className="ia-stream-row is-log" key={c.id}>
          <span className="t-micro" style={{ color: 'var(--text-tertiary)' }}>{fmtTime(c.created_at)}</span>
          <b className="t-caption">{c.author}</b>
          <button className="ia-id-chip t-micro" onClick={() => onJump(c.target_id)}>{c.target_id}</button>
          <span className="t-caption">
            {fieldLabel(c.field)}: {c.old_value ?? ''}→{c.new_value ?? ''}
          </span>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="t-caption" style={{ color: 'var(--text-tertiary)', padding: 'var(--sp-sm)' }}>
          기록이 없어요
        </p>
      )}
    </div>
  )
}
