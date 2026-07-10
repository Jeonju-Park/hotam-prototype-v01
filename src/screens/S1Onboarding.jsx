import React, { useState } from 'react'
import { ChevronLeft, MapPin, Bell, Camera, Check, UserRound } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { getRestaurant, regionOptions } from '../data/dummy.js'

// S1 온보딩 — 5스텝: ①프로필 ②권한 3종 ③지역 선택(M2) ④취향 선택(카드 스와이프 8장) ⑤완료.
// 이전/건너뛰기 상시. 온보딩 = 위트 배분 구역(브랜드 캐논). 선택 버튼 어휘: 좋았어요/그저그래요/별로였어요.
const PERMISSIONS = [
  { key: 'location', icon: MapPin, name: '위치',   desc: '근처 맛집을 찾을 때만 켭니다' },
  { key: 'noti',     icon: Bell,   name: '알림',   desc: '랭킹이 움직이면 슬쩍 알려드려요' },
  { key: 'camera',   icon: Camera, name: '카메라', desc: '기록에 사진을 붙일 때 필요해요' },
]

// 취향 카드 8장 — 동네·카테고리 골고루
const TASTE_IDS = ['r2', 'r13', 'r4', 'r19', 'r8', 'r10', 'r12', 'r22']

const GRADE_BUTTONS = [
  { grade: 'good', label: '좋았어요' },
  { grade: 'soso', label: '그저그래요' },
  { grade: 'bad',  label: '별로였어요' },
]

export default function S1Onboarding() {
  const { navigate } = useApp()
  const [step, setStep] = useState(1)
  const [nickname, setNickname] = useState('')
  const [perms, setPerms] = useState({ location: false, noti: false, camera: false })
  const [region, setRegion] = useState(null)
  const [tasteIdx, setTasteIdx] = useState(0)

  const nextStep = () => setStep((s) => Math.min(s + 1, 5))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  // 취향 카드: 평가/모름/건너뛰기 전부 다음 장으로, 8장 끝나면 완료 스텝
  const advanceCard = () => {
    if (tasteIdx >= TASTE_IDS.length - 1) setStep(5)
    else setTasteIdx(tasteIdx + 1)
  }

  const canNext = step === 1 ? nickname.trim().length > 0 : step === 3 ? region !== null : true
  const restaurant = getRestaurant(TASTE_IDS[tasteIdx])

  return (
    <div className="entry step-screen">
      <header className="step-header">
        {step > 1 && step < 5 ? (
          <button className="icon-btn" onClick={prevStep} aria-label="이전">
            <ChevronLeft size={24} />
          </button>
        ) : <span style={{ width: 44 }} />}
        <span className="spacer" />
        <div className="step-dots" aria-label={`5단계 중 ${step}단계`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`dot${n === step ? ' is-active' : ''}`} />
          ))}
        </div>
        <span className="spacer" />
        {step < 5 ? (
          <button className="btn-text" onClick={nextStep}>건너뛰기</button>
        ) : <span style={{ width: 44 }} />}
      </header>

      {/* ① 프로필 — HTM-S1-01 */}
      {step === 1 && (
        <div className="step-body" key="s1" data-func-id="HTM-S1-01">
          <h1 className="t-heading-lg step-title">뭐라고 불러드릴까요?</h1>
          <div className="profile-ph">
            <UserRound size={36} strokeWidth={1.5} />
          </div>
          <div className="form-group">
            <label className="t-caption field-label" htmlFor="onb-nickname">닉네임</label>
            <input
              id="onb-nickname"
              className="input"
              placeholder="탐이가 부를 이름"
              maxLength={12}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <span className="t-caption field-help">언제든 바꿀 수 있어요</span>
          </div>
        </div>
      )}

      {/* ② 권한 3종 — HTM-S1-02 (실제 권한 요청 없음) */}
      {step === 2 && (
        <div className="step-body" key="s2" data-func-id="HTM-S1-02">
          <h1 className="t-heading-lg step-title">탐이가 쓸 도구 세 가지</h1>
          <p className="t-caption field-help">허용하지 않아도 시작할 수 있어요</p>
          <div className="perm-list">
            {PERMISSIONS.map((p) => {
              const Icon = p.icon
              const allowed = perms[p.key]
              return (
                <div className="perm-row" key={p.key}>
                  <Icon size={24} strokeWidth={1.8} />
                  <div className="perm-text">
                    <span className="t-title">{p.name}</span>
                    <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{p.desc}</span>
                  </div>
                  <button
                    className={`perm-allow${allowed ? ' is-allowed' : ''}`}
                    onClick={() => setPerms({ ...perms, [p.key]: !allowed })}
                  >
                    {allowed ? <><Check size={14} /> 허용됨</> : '허용'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ③ 지역 선택 — HTM-S1-03 (M2): 칩 그리드 택1 */}
      {step === 3 && (
        <MsGate ms="M2" className="step-body" key="s3" data-func-id="HTM-S1-03">
          <h1 className="t-heading-lg step-title">주로 어디서 드세요?</h1>
          <p className="t-caption field-help">동네 랭킹의 기준이 돼요</p>
          <div className="chip-grid">
            {regionOptions.map((r) => (
              <button
                key={r}
                className={`chip${region === r ? ' is-selected' : ''}`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </MsGate>
      )}

      {/* ④ 취향 선택 — HTM-S1-04: 카드 스와이프 8장, 진행 "3/8" */}
      {step === 4 && (
        <div className="step-body" key="s4" data-func-id="HTM-S1-04">
          <div className="taste-head">
            <h1 className="t-heading-lg step-title">가본 집인가요? 솔직하게</h1>
            <span className="t-caption taste-count">{tasteIdx + 1}/{TASTE_IDS.length}</span>
          </div>
          <div className="taste-card" key={restaurant.id}>
            <PhotoPlaceholder label={restaurant.label} height={240} />
            <div className="taste-card-info">
              <span className="t-heading-sm">{restaurant.name}</span>
              <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>
                {restaurant.area} · {restaurant.category}
              </span>
            </div>
          </div>
          {/* 선택 버튼 어휘 강제: 좋았어요/그저그래요/별로였어요 (스펙 §3) */}
          <div className="grade-btn-row">
            {GRADE_BUTTONS.map((g) => (
              <button key={g.grade} className={`grade-btn ${g.grade}`} onClick={advanceCard}>
                <span className={`grade-dot ${g.grade}`} />
                {g.label}
              </button>
            ))}
          </div>
          <div className="taste-sub-actions">
            <button className="btn-text" onClick={advanceCard}>가본 적 없어요</button>
            <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>·</span>
            <button className="btn-text" onClick={advanceCard}>건너뛰기</button>
          </div>
        </div>
      )}

      {/* ⑤ 완료 — HTM-S1-06 시작하기 (+ HTM-S1-05 가본 식당 추가 권고 M2) */}
      {step === 5 && (
        <div className="step-body step-done" key="s5">
          <div className="tami">
            <span className="t-caption">탐이</span>
          </div>
          <h1 className="t-heading-lg step-title">취향 접수 완료</h1>
          <p className="t-body" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            이제 맛집을 호시탐탐 노려볼 차례예요.
            <br />
            첫 기록은 3초면 끝나요.
          </p>
          <MsGate ms="M2" data-func-id="HTM-S1-05" style={{ alignSelf: 'center' }}>
            <button className="btn-text" onClick={() => navigate('S18')}>
              가본 식당 먼저 추가할래요
            </button>
          </MsGate>
        </div>
      )}

      <div className="step-footer">
        {step < 4 && (
          <button className="btn btn-primary" disabled={!canNext} onClick={nextStep}>
            다음
          </button>
        )}
        {step === 5 && (
          <button
            className="btn btn-primary"
            data-func-id="HTM-S1-06"
            onClick={() => navigate('S7', { replace: true })}
          >
            시작하기
          </button>
        )}
      </div>
    </div>
  )
}
