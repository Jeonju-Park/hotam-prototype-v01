import React from 'react'
import { useApp } from '../App.jsx'

// A0 로그인 — 로고 + 메인/서브 카피, 소셜·이메일 로그인 4버튼(전부 secondary h48).
// 아무 버튼이나 누르면 더미 인증 → S1. "이메일 회원가입" 링크 → S14.
// 버튼 색은 secondary(흰 면+border), 컬러는 프로바이더 브랜드 로고 점만 (스펙 A0).
const LOGIN_BUTTONS = [
  { funcId: 'HTM-A0-01', label: '카카오로 시작', dot: '#FEE500' },
  { funcId: 'HTM-A0-02', label: 'Google로 시작', dot: '#4285F4' },
  { funcId: 'HTM-A0-03', label: 'Apple로 시작', dot: 'var(--text-primary)' },
  { funcId: 'HTM-A0-04', label: '이메일로 시작', dot: 'var(--main-primary)' },
]

export default function A0Login() {
  const { navigate } = useApp()

  return (
    <div className="entry login-screen">
      <div className="login-hero">
        <span className="logotype">hotam</span>
        {/* 메인 카피 = 브랜드 화법 1줄, 서브 카피 = 담백 1줄 */}
        <h1 className="t-display">맛집 하나 알려주면<br />안 잡아먹지</h1>
        <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
          가본 맛집을 비교로 기록하는 미식 소셜
        </p>
      </div>

      <div className="login-actions">
        {LOGIN_BUTTONS.map((btn) => (
          <button
            key={btn.funcId}
            className="btn btn-secondary"
            data-func-id={btn.funcId}
            onClick={() => navigate('S1', { replace: true })}
          >
            <span className="brand-dot" style={{ background: btn.dot }} />
            {btn.label}
          </button>
        ))}
        <button
          className="btn-text"
          data-func-id="HTM-A0-05"
          onClick={() => navigate('S14')}
        >
          이메일 회원가입
        </button>
      </div>
    </div>
  )
}
