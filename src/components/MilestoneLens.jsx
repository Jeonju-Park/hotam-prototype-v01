import React from 'react'
import { useApp } from '../App.jsx'

// ─────────────────────────────────────────────
// 마일스톤 렌즈 + 데모 스위치 (스펙 §7 — 인스펙터 패널 하단 배치)
// 지금은 상태만 Context에 저장. opacity 0.25/클릭 잠금·빈 상태·에러 전환은
// 화면을 만들면서 lens/demoEmpty/demoError 값을 소비해 연결한다.
// ─────────────────────────────────────────────
const LENS_OPTIONS = [
  { value: 'M1', label: 'M1만' },
  { value: 'M2', label: 'M1+M2' },
  { value: 'M3', label: '전체(M3)' },
]

export default function MilestoneLens() {
  const { lens, setLens, demoEmpty, setDemoEmpty, demoError, setDemoError } = useApp()

  return (
    <div className="insp-tools">
      <div>
        <span className="t-caption tool-label">마일스톤 렌즈</span>
        <div className="lens-seg" role="group" aria-label="마일스톤 렌즈">
          {LENS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={lens === opt.value ? 'is-active' : ''}
              onClick={() => setLens(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className="t-caption tool-label">데모 스위치</span>
        <div className="demo-switches">
          <label>
            <input type="checkbox" checked={demoEmpty} onChange={(e) => setDemoEmpty(e.target.checked)} />
            빈 상태 보기
          </label>
          <label>
            <input type="checkbox" checked={demoError} onChange={(e) => setDemoError(e.target.checked)} />
            에러 보기
          </label>
        </div>
      </div>
    </div>
  )
}
