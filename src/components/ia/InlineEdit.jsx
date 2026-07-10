import React, { useState } from 'react'

// 셀 더블클릭 = 인라인 편집 (Enter 저장 · Esc 취소 · 포커스 이탈 = 취소)
export default function InlineEdit({ value, onSave, disabled, className = '', placeholder = '—' }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState('')

  if (!editing) {
    return (
      <span
        className={`inline-cell${value ? '' : ' is-empty'}${disabled ? '' : ' is-editable'} ${className}`}
        title={disabled ? undefined : '더블클릭해서 편집'}
        onDoubleClick={(e) => {
          if (disabled) return
          e.stopPropagation()
          setVal(value ?? '')
          setEditing(true)
        }}
      >
        {value || placeholder}
      </span>
    )
  }

  return (
    <input
      className={`inline-input ${className}`}
      autoFocus
      value={val}
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
