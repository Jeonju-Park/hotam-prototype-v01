import React, { useEffect, useMemo, useState } from 'react'
import { useApp, bandCenter, clampToBand } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { getRestaurant } from '../data/dummy.js'

// S3 비교 — 같은 등급끼리만 A vs B (교차 등급 절대 금지, O9 결정대기 제외).
// 새 기록: 3쌍 / 재비교(S19 이의): 2쌍. 선택·스킵 전부 비교 이벤트 → 점수는 여기서만 계산된다.
const GRADE_WORD = { good: '좋았어요', soso: '그저그래요', bad: '별로였어요' }
const CRITERIA = ['맛', '가성비', '분위기', '재방문']
const STEP_DELTA = 0.3 // 비교 1회당 점수 이동 폭 (더미 엔진)

export default function S3Compare() {
  const { navigate, draft, lastRecord, myListData, finalizeRecord, updateRecordScore } = useApp()

  // 모드: 새 기록(draft) vs 재비교(lastRecord만 있음)
  const mode = draft ? 'new' : lastRecord ? 'recompare' : null
  const record = draft ?? lastRecord

  // 비교 상대: 반드시 같은 등급 그룹에서만 뽑는다 (교차 등급 금지)
  const pairs = useMemo(() => {
    if (!record) return []
    const pool = myListData[record.grade].filter((it) => it.restaurantId !== record.restaurantId)
    const count = Math.min(mode === 'recompare' ? 2 : 3, pool.length)
    if (count === 0) return []
    // 점수 분포에서 고르게: 상위·중간·하위
    const picks = count === 1 ? [0] : count === 2 ? [0, pool.length - 1] : [0, Math.floor(pool.length / 2), pool.length - 1]
    return [...new Set(picks)].slice(0, count).map((i) => pool[i])
  }, [record, myListData, mode])

  const [pairIdx, setPairIdx] = useState(0)
  const [delta, setDelta] = useState(0)
  const [criterion, setCriterion] = useState(null)

  // 비교쌍이 아예 없으면(같은 등급 첫 기록) 구간 중앙값으로 바로 완료
  const noPairs = !!record && pairs.length === 0
  useEffect(() => {
    if (noPairs) finish(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noPairs])

  if (!record) {
    // 진입 경로 이상 — 기록부터
    return (
      <div className="entry step-screen">
        <div className="uc-body">
          <div className="tami"><span className="t-caption">탐이</span></div>
          <p className="t-heading-sm">비교할 기록이 없어요</p>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => navigate('S2', { replace: true })}>
            기록부터 시작하기
          </button>
        </div>
      </div>
    )
  }

  const finish = (finalDelta) => {
    const base = mode === 'new' ? bandCenter(record.grade) : lastRecord.score
    const score = clampToBand(record.grade, base + finalDelta)
    if (mode === 'new') finalizeRecord(draft, score)
    else updateRecordScore(score)
    navigate('S19', { replace: true })
  }

  if (noPairs) return null

  // 탭 시 즉시 다음 쌍 (스펙 §6) — 쌍 전환 200ms 페이드가 선택 피드백 역할
  const advance = (d) => {
    const nextDelta = delta + d
    if (pairIdx >= pairs.length - 1) finish(nextDelta)
    else {
      setDelta(nextDelta)
      setPairIdx(pairIdx + 1)
    }
  }

  const pick = (side) => advance(side === 'new' ? +STEP_DELTA : -STEP_DELTA)

  const newRest = getRestaurant(record.restaurantId)
  const otherRest = getRestaurant(pairs[pairIdx].restaurantId)

  return (
    <div className="entry step-screen">
      <header className="step-header">
        <span style={{ width: 44 }} />
        <span className="spacer" />
        {/* 어휘: '좋았어요'끼리 비교 중 · 2/3 */}
        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>
          '{GRADE_WORD[record.grade]}'끼리 비교 중 · {pairIdx + 1}/{pairs.length}
        </span>
        <span className="spacer" />
        <button className="btn-text" data-func-id="HTM-S3-02" onClick={() => advance(0)}>
          건너뛰기
        </button>
      </header>

      <div className="step-body compare-body" key={pairIdx} data-func-id="HTM-S3-01">
        <h1 className="t-heading-lg compare-question">어디가 더 좋았어요?</h1>

        <div className="vs-wrap">
          <button className="vs-card" onClick={() => pick('new')}>
            <span className="vs-tag t-micro">이번 기록</span>
            <PhotoPlaceholder label={newRest.label} height={150} />
            <div className="vs-info">
              <span className="t-title">{newRest.name}</span>
              <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{newRest.area}</span>
            </div>
          </button>

          <span className="vs-circle t-title">vs</span>

          <button className="vs-card" onClick={() => pick('other')}>
            <PhotoPlaceholder label={otherRest.label} height={150} />
            <div className="vs-info">
              <span className="t-title">{otherRest.name}</span>
              <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{otherRest.area}</span>
            </div>
          </button>
        </div>

        {/* 비교 기준 칩 (M3) — 선택만 되는 데모 */}
        <MsGate ms="M3" data-func-id="HTM-S3-04" style={{ marginTop: 'auto' }}>
          <div className="criteria-row">
            {CRITERIA.map((c) => (
              <button
                key={c}
                className={`criteria-chip${criterion === c ? ' is-selected' : ''}`}
                onClick={() => setCriterion(criterion === c ? null : c)}
              >
                {c}
              </button>
            ))}
          </div>
        </MsGate>
      </div>
    </div>
  )
}
