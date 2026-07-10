import React from 'react'
import { SCREENS } from '../data/ia_inspector.js'

// 아직 구현 전 화면의 공용 플레이스홀더.
// 화면을 실제로 만들 때 이 컴포넌트를 해당 화면 파일(S7Home 등)로 교체한다.
export default function UnderConstruction({ screenId }) {
  const screen = SCREENS[screenId]

  return (
    <div className="uc-screen">
      <header className="uc-appbar">
        <h1 className="t-heading-lg">{screen?.name ?? screenId}</h1>
      </header>
      <div className="uc-body">
        {/* 탐이 플레이스홀더 — 점선 원형 + 라벨, 화면당 1회 */}
        <div className="tami">
          <span className="t-caption">탐이</span>
        </div>
        <p className="t-heading-sm">여기는 아직 준비 중</p>
        <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
          탐이가 먼저 킁킁 맡아보고 있어요.
          <br />
          곧 열립니다 — {screenId}
        </p>
      </div>
    </div>
  )
}
