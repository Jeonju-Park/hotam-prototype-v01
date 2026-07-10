import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import MsGate from '../components/MsGate.jsx'
import BottomSheet from '../components/BottomSheet.jsx'

// S20 설정 — 그룹 리스트. 로그아웃 → A0, 회원 탈퇴 = danger + 확인 시트 2단.
export default function S20Settings() {
  const { goBack, navigate, showToast } = useApp()
  const [toggles, setToggles] = useState({ feedPublic: true, showReviews: true, push: true, email: false })
  const [quitStep, setQuitStep] = useState(0) // 0=닫힘, 1·2=탈퇴 확인 단계

  const flip = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }))
  const stub = () => showToast('프로토타입에선 구경만 할 수 있어요')

  const Toggle = ({ on, onChange }) => (
    <button className={`switch${on ? ' is-on' : ''}`} role="switch" aria-checked={on} onClick={onChange}>
      <span className="switch-knob" />
    </button>
  )

  return (
    <div className="page">
      <AppBar title="설정" onBack={goBack} />

      <div className="settings-list page-pad-x">
        {/* 공개 설정 (M1·M2) */}
        <span className="t-caption section-label" style={{ marginTop: 'var(--sp-sm)' }}>공개 설정</span>
        <div className="settings-group" data-func-id="HTM-S20-01">
          <div className="setting-row">
            <span className="t-body">피드 공개</span>
            <Toggle on={toggles.feedPublic} onChange={() => flip('feedPublic')} />
          </div>
          <MsGate ms="M2">
            <div className="setting-row">
              <span className="t-body">내 리뷰 표시</span>
              <Toggle on={toggles.showReviews} onChange={() => flip('showReviews')} />
            </div>
          </MsGate>
        </div>

        {/* 계정 */}
        <span className="t-caption section-label">계정</span>
        <div className="settings-group">
          <button className="setting-row" data-func-id="HTM-S20-02" onClick={stub}>
            <span className="t-body">프로필 정보 변경</span>
            <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
          </button>
          <button className="setting-row" data-func-id="HTM-S20-03" onClick={stub}>
            <span className="t-body">비밀번호 변경</span>
            <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
          </button>
          <MsGate ms="M2" data-func-id="HTM-S20-04">
            <button className="setting-row" onClick={stub}>
              <span className="t-body">연결 계정 관리</span>
              <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
            </button>
          </MsGate>
        </div>

        {/* 알림 설정 (M1·M2) */}
        <span className="t-caption section-label">알림</span>
        <div className="settings-group" data-func-id="HTM-S20-05">
          <div className="setting-row">
            <span className="t-body">푸시 알림</span>
            <Toggle on={toggles.push} onChange={() => flip('push')} />
          </div>
          <MsGate ms="M2">
            <div className="setting-row">
              <span className="t-body">이메일 수신</span>
              <Toggle on={toggles.email} onChange={() => flip('email')} />
            </div>
          </MsGate>
        </div>

        {/* 정보 */}
        <span className="t-caption section-label">정보</span>
        <div className="settings-group" data-func-id="HTM-S20-06">
          <button className="setting-row" onClick={stub}>
            <span className="t-body">약관 · 개인정보 처리방침</span>
            <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
          </button>
          <div className="setting-row">
            <span className="t-body">버전</span>
            <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>v0.1 (프로토타입)</span>
          </div>
        </div>

        {/* 로그아웃 / 회원 탈퇴 */}
        <div className="settings-group" style={{ marginTop: 'var(--sp-md)' }}>
          <button className="setting-row" data-func-id="HTM-S20-07" onClick={() => navigate('A0', { replace: true })}>
            <span className="t-body">로그아웃</span>
          </button>
          <button className="setting-row" data-func-id="HTM-S20-08" onClick={() => setQuitStep(1)}>
            <span className="t-body" style={{ color: 'var(--status-danger)' }}>회원 탈퇴</span>
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 — 확인 시트 2단 */}
      <BottomSheet open={quitStep === 1} onClose={() => setQuitStep(0)} title="정말 탈퇴하시겠어요?">
        <p className="t-body sheet-body">쌓아온 기록과 비교 이력이 모두 사라져요. 되돌릴 수 없어요.</p>
        <button className="btn btn-secondary" onClick={() => setQuitStep(2)}>계속 진행</button>
        <button className="btn-text" style={{ alignSelf: 'center' }} onClick={() => setQuitStep(0)}>남을래요</button>
      </BottomSheet>
      <BottomSheet open={quitStep === 2} onClose={() => setQuitStep(0)} title="마지막 확인이에요">
        <p className="t-body sheet-body">탈퇴 즉시 계정과 모든 데이터가 삭제돼요.</p>
        <button
          className="btn btn-secondary"
          style={{ color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
          onClick={() => { setQuitStep(0); showToast('탈퇴 처리를 흉내냈어요 (프로토타입)'); navigate('A0', { replace: true }) }}
        >
          탈퇴하기
        </button>
        <button className="btn-text" style={{ alignSelf: 'center' }} onClick={() => setQuitStep(0)}>남을래요</button>
      </BottomSheet>
    </div>
  )
}
