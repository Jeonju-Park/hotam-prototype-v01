import React, { useMemo, useState } from 'react'
import { X, ChevronLeft, Search, Image } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import { restaurants, getRestaurant } from '../data/dummy.js'

// S2 기록 — 스텝형 4단계: ①가게 선택 ②사진(0~3장) ③본문(선택) ④만족도 택1(필수) → S3 비교.
// 인풋·라벨은 담백(브랜드 캐논). 만족도 어휘: 좋았어요/그저그래요/별로였어요.
const STEP_FUNC_IDS = ['HTM-S2-04', 'HTM-S2-03', 'HTM-S2-02', 'HTM-S2-01']

const GRADE_OPTIONS = [
  { grade: 'good', label: '좋았어요' },
  { grade: 'soso', label: '그저그래요' },
  { grade: 'bad',  label: '별로였어요' },
]

const GALLERY_SIZE = 12 // 갤러리 흉내 그리드

export default function S2Record() {
  const { navigate, goBack, setDraft, myListData, params } = useApp()
  const [step, setStep] = useState(0)
  const [query, setQuery] = useState('')
  // S4 "방문 기록하기"로 진입하면 식당 프리셋 (①스텝에 선택된 상태로 시작)
  const [restaurantId, setRestaurantId] = useState(params.restaurantId ?? null)
  const [photos, setPhotos] = useState([])   // 선택된 갤러리 타일 인덱스(최대 3)
  const [body, setBody] = useState('')
  const [grade, setGrade] = useState(null)

  // 현 위치 추천 3곳 (M2) — 더미: 성수 기준
  const nearby = useMemo(() => restaurants.filter((r) => r.area === '성수').slice(0, 3), [])
  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return restaurants
    return restaurants.filter((r) => r.name.includes(q) || r.area.includes(q) || r.category.includes(q))
  }, [query])

  // 재방문 여부: 내 리스트에 이미 있는 식당인가 (이전 평가는 숨김 — O12)
  const isRevisit = restaurantId != null &&
    Object.values(myListData).some((group) => group.some((it) => it.restaurantId === restaurantId))

  const canNext = [restaurantId !== null, true, true, grade !== null][step]

  const next = () => {
    if (step < 3) return setStep(step + 1)
    // 만족도까지 확정 → 초안 저장 후 비교로 (점수는 S3 비교 결과로만 계산)
    setDraft({ restaurantId, photoCount: photos.length, body: body.trim(), grade })
    navigate('S3')
  }

  const togglePhoto = (i) => {
    setPhotos((prev) => {
      if (prev.includes(i)) return prev.filter((p) => p !== i)
      if (prev.length >= 3) return prev
      return [...prev, i]
    })
  }

  const RestaurantRow = ({ r }) => (
    <button
      className={`rest-row${restaurantId === r.id ? ' is-selected' : ''}`}
      onClick={() => setRestaurantId(r.id)}
    >
      <div className="rest-row-thumb"><Image size={16} strokeWidth={1.5} /></div>
      <div className="rest-row-text">
        <span className="t-title">{r.name}</span>
        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{r.area} · {r.category}</span>
      </div>
      <ScoreBadge score={r.rating} size="sm" />
    </button>
  )

  return (
    <div className="entry step-screen">
      <header className="step-header">
        {step === 0 ? (
          <button className="icon-btn" onClick={goBack} aria-label="닫기"><X size={24} /></button>
        ) : (
          <button className="icon-btn" onClick={() => setStep(step - 1)} aria-label="이전"><ChevronLeft size={24} /></button>
        )}
        <span className="spacer" />
        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{step + 1}/4</span>
      </header>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>

      {/* ① 가게 선택 — 검색(HTM-S2-04) + 현 위치 추천(HTM-S2-05 M2) + 없는 식당 추가(HTM-S2-06) */}
      {step === 0 && (
        <div className="step-body" key="st0" data-func-id="HTM-S2-04">
          <h1 className="t-heading-lg step-title">어느 집이었나요?</h1>
          <div className="search-box">
            <Search size={20} strokeWidth={1.8} />
            <input
              className="search-input"
              placeholder="식당 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {!query.trim() && (
            <MsGate ms="M2" data-func-id="HTM-S2-05">
              <span className="t-caption section-label">지금 근처</span>
              <div className="rest-list">
                {nearby.map((r) => <RestaurantRow key={r.id} r={r} />)}
              </div>
            </MsGate>
          )}

          <span className="t-caption section-label">{query.trim() ? '검색 결과' : '전체'}</span>
          <div className="rest-list">
            {results.map((r) => <RestaurantRow key={r.id} r={r} />)}
            {results.length === 0 && (
              <span className="t-body" style={{ color: 'var(--text-secondary)' }}>결과가 없어요</span>
            )}
          </div>
          <button className="btn-text" data-func-id="HTM-S2-06" onClick={() => navigate('S18')}>
            여기 없어요? 식당 추가
          </button>
        </div>
      )}

      {/* ② 사진 — 갤러리 흉내 그리드에서 0~3장 (HTM-S2-03) */}
      {step === 1 && (
        <div className="step-body" key="st1" data-func-id="HTM-S2-03">
          <h1 className="t-heading-lg step-title">사진을 골라주세요</h1>
          <p className="t-caption field-help">최대 3장 · 건너뛰어도 돼요</p>
          <div className="gallery-grid">
            {Array.from({ length: GALLERY_SIZE }, (_, i) => {
              const order = photos.indexOf(i)
              return (
                <button
                  key={i}
                  className={`photo-tile${order >= 0 ? ' is-selected' : ''}`}
                  onClick={() => togglePhoto(i)}
                  aria-label={`사진 ${i + 1}`}
                >
                  <Image size={20} strokeWidth={1.5} />
                  {order >= 0 && <span className="photo-order">{order + 1}</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ③ 본문(선택) — HTM-S2-02 */}
      {step === 2 && (
        <div className="step-body" key="st2" data-func-id="HTM-S2-02">
          <h1 className="t-heading-lg step-title">한마디 남길까요?</h1>
          <div className="form-group">
            <label className="t-caption field-label" htmlFor="record-body">본문 (선택)</label>
            <textarea
              id="record-body"
              className="input textarea"
              rows={5}
              placeholder="다녀온 소감을 적어주세요"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ④ 만족도 택1 (필수) — HTM-S2-01 + 재방문 배너(HTM-S2-07 M2) */}
      {step === 3 && (
        <div className="step-body" key="st3" data-func-id="HTM-S2-01">
          <h1 className="t-heading-lg step-title">
            {getRestaurant(restaurantId)?.name}, 어땠어요?
          </h1>
          {isRevisit && (
            <MsGate ms="M2" data-func-id="HTM-S2-07">
              <div className="revisit-banner">
                <span className="t-title">재방문이네요!</span>
                <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>
                  이번 방문 기준으로만 골라주세요
                </span>
              </div>
            </MsGate>
          )}
          <div className="grade-select-list">
            {GRADE_OPTIONS.map((g) => (
              <button
                key={g.grade}
                className={`grade-select ${g.grade}${grade === g.grade ? ' is-selected' : ''}`}
                onClick={() => setGrade(g.grade)}
              >
                <span className={`grade-dot ${g.grade}`} />
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="step-footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={next}>
          다음
        </button>
      </div>
    </div>
  )
}
