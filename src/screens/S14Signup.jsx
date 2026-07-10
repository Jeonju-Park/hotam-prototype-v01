import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useApp } from '../App.jsx'

// S14 이메일 회원가입 — 4스텝(이메일→인증코드→비밀번호→약관), 상단 진행 표시.
// 인증코드는 아무 6자리나 통과. 완료 → S1. 카피는 담백(인풋·라벨 구역).
const STEP_TITLES = ['이메일을 입력해 주세요', '인증코드를 입력해 주세요', '비밀번호를 만들어 주세요', '약관에 동의해 주세요']
const STEP_FUNC_IDS = ['HTM-S14-01', 'HTM-S14-02', 'HTM-S14-03', 'HTM-S14-04']

export default function S14Signup() {
  const { navigate, goBack } = useApp()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [agree, setAgree] = useState({ tos: false, privacy: false, marketing: false })

  const emailOk = /^\S+@\S+\.\S+$/.test(email)
  const codeOk = /^\d{6}$/.test(code)          // 아무 6자리나 통과
  const pwOk = pw.length >= 8 && pw === pw2
  const agreeOk = agree.tos && agree.privacy
  const canNext = [emailOk, codeOk, pwOk, agreeOk][step]

  const next = () => (step < 3 ? setStep(step + 1) : navigate('S1', { replace: true }))
  const back = () => (step > 0 ? setStep(step - 1) : goBack())

  const setAll = (on) => setAgree({ tos: on, privacy: on, marketing: on })
  const allOn = agree.tos && agree.privacy && agree.marketing

  return (
    <div className="entry step-screen">
      <header className="step-header">
        <button className="icon-btn" onClick={back} aria-label="이전">
          <ChevronLeft size={24} />
        </button>
        <span className="spacer" />
        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{step + 1}/4</span>
      </header>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>

      <div className="step-body" key={step} data-func-id={STEP_FUNC_IDS[step]}>
        <h1 className="t-heading-lg step-title">{STEP_TITLES[step]}</h1>

        {step === 0 && (
          <div className="form-group">
            <label className="t-caption field-label" htmlFor="signup-email">이메일</label>
            <input
              id="signup-email"
              className="input"
              type="email"
              placeholder="hotam@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <span className="t-caption field-help">로그인과 알림에 쓰는 주소예요</span>
          </div>
        )}

        {step === 1 && (
          <div className="form-group">
            <label className="t-caption field-label" htmlFor="signup-code">인증코드 6자리</label>
            <input
              id="signup-code"
              className="input code-input"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
            <span className="t-caption field-help">{email || '입력한 주소'}로 코드를 보냈어요</span>
            <button className="btn-text" style={{ alignSelf: 'flex-start' }}>코드 다시 받기</button>
          </div>
        )}

        {step === 2 && (
          <div className="form-group">
            <label className="t-caption field-label" htmlFor="signup-pw">비밀번호</label>
            <input
              id="signup-pw"
              className="input"
              type="password"
              placeholder="8자 이상"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
            />
            <label className="t-caption field-label" htmlFor="signup-pw2">비밀번호 확인</label>
            <input
              id="signup-pw2"
              className="input"
              type="password"
              placeholder="한 번 더 입력"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
            {pw2.length > 0 && pw !== pw2 && (
              <span className="t-caption" style={{ color: 'var(--status-danger)' }}>비밀번호가 서로 달라요</span>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="form-group">
            <label className="agree-row agree-all">
              <input type="checkbox" checked={allOn} onChange={(e) => setAll(e.target.checked)} />
              <span className="t-title">전체 동의</span>
            </label>
            <hr className="insp-divider" style={{ margin: 'var(--sp-xs) 0' }} />
            <label className="agree-row">
              <input type="checkbox" checked={agree.tos} onChange={(e) => setAgree({ ...agree, tos: e.target.checked })} />
              <span className="t-body">[필수] 서비스 이용약관</span>
            </label>
            <label className="agree-row">
              <input type="checkbox" checked={agree.privacy} onChange={(e) => setAgree({ ...agree, privacy: e.target.checked })} />
              <span className="t-body">[필수] 개인정보 처리방침</span>
            </label>
            <label className="agree-row">
              <input type="checkbox" checked={agree.marketing} onChange={(e) => setAgree({ ...agree, marketing: e.target.checked })} />
              <span className="t-body">[선택] 신상 맛집 소식 받기</span>
            </label>
          </div>
        )}
      </div>

      <div className="step-footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={next}>
          {step < 3 ? '다음' : '가입 완료'}
        </button>
      </div>
    </div>
  )
}
