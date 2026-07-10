import React, { useEffect } from 'react'
import { useApp } from '../App.jsx'

// S13 스플래시 — 탐이 플레이스홀더 + 로고타입 "hotam". 1.5초 후 A0 자동 이동 (M1)
export default function S13Splash() {
  const { navigate } = useApp()

  // HTM-S13-02 자동 로그인: 프로토타입은 세션 없음 → 항상 A0로
  useEffect(() => {
    const t = setTimeout(() => navigate('A0', { replace: true }), 1500)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="entry splash-screen">
      <div className="splash-signature" data-func-id="HTM-S13-01">
        {/* 탐이 — 점선 원형 플레이스홀더 (화면당 1회) */}
        <div className="tami">
          <span className="t-caption">탐이</span>
        </div>
        <span className="logotype">hotam</span>
      </div>
      <span className="t-caption splash-status" data-func-id="HTM-S13-02">
        로그인 확인 중…
      </span>
    </div>
  )
}
