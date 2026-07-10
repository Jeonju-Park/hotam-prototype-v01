import React, { useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import GradeChip from '../components/GradeChip.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import { getRestaurant, tasteDNA } from '../data/dummy.js'

// S8 공유 카드 (M2) — 세로 카드 미리보기. 탭: Top10 | 이번 기록 | 취향 DNA(M3).
// 기록 부족 상태는 데모 스위치 '빈 상태 보기'로 전환.
const TABS = [
  { key: 'top10',  label: 'Top10' },
  { key: 'latest', label: '이번 기록' },
  { key: 'dna',    label: '취향 DNA', ms: 'M3' },
]

export default function S8ShareCard() {
  const { goBack, navigate, me, myListData, feedPosts, lastRecord, demoEmpty, showToast, lens } = useApp()
  const [tab, setTab] = useState('top10')

  // Top10: 등급 무관 전체를 점수 내림차순으로 — 점수는 리스트 데이터 그대로(계산 결과)
  const top10 = useMemo(() => {
    return Object.entries(myListData)
      .flatMap(([grade, items]) => items.map((it) => ({ ...it, grade })))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }, [myListData])

  const latest = lastRecord ?? (() => {
    const p = feedPosts.find((post) => post.userId === 'u1')
    return p ? { restaurantId: p.restaurantId, grade: p.grade, score: p.score } : null
  })()

  const dnaLocked = lens !== 'M3'

  return (
    <div className="entry step-screen share-screen">
      <header className="step-header">
        <button className="icon-btn" onClick={goBack} aria-label="뒤로">
          <ChevronLeft size={24} />
        </button>
        <span className="spacer" />
        <span className="t-title">공유 카드</span>
        <span className="spacer" />
        <span style={{ width: 44 }} />
      </header>

      {demoEmpty ? (
        /* 기록 부족 상태 — 데모 스위치 */
        <div className="uc-body">
          <div className="tami"><span className="t-caption">탐이</span></div>
          <p className="t-heading-sm">기록 4개만 더 모으면 카드가 켜져요</p>
          <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
            Top10은 채워야 자랑도 하죠.
          </p>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => navigate('S2')}>
            기록하러 가기
          </button>
        </div>
      ) : (
        <>
          <div className="seg-row">
            {TABS.map((t) => {
              const locked = t.ms === 'M3' && dnaLocked
              return (
                <button
                  key={t.key}
                  className={`seg-btn${tab === t.key ? ' is-active' : ''}${locked ? ' ms-locked' : ''}`}
                  disabled={locked}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                  {t.ms && <span className="seg-ms">{t.ms}</span>}
                </button>
              )
            })}
          </div>

          <div className="step-body share-body" key={tab}>
            {tab === 'top10' && (
              <div className="share-card">
                {/* 라이트박스풍 헤더 */}
                <div className="share-card-head">
                  <span className="share-logotype">hotam</span>
                  <span className="t-heading-sm" style={{ color: 'var(--text-on-button)' }}>
                    {me.nickname}의 인생맛집 Top10
                  </span>
                </div>
                <ol className="share-list">
                  {top10.map((it, i) => {
                    const r = getRestaurant(it.restaurantId)
                    return (
                      <li key={it.restaurantId} className="share-list-row">
                        <span className="share-rank">{i + 1}</span>
                        <div className="share-rest">
                          <span className="t-title">{r.name}</span>
                          <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{r.area}</span>
                        </div>
                        <ScoreBadge score={it.score} size="sm" />
                      </li>
                    )
                  })}
                </ol>
                <div className="share-sign">
                  <span className="tami-mini" />
                  <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>탐이가 봤다 갑니다</span>
                </div>
              </div>
            )}

            {tab === 'latest' && (
              <div className="share-card">
                <div className="share-card-head">
                  <span className="share-logotype">hotam</span>
                  <span className="t-heading-sm" style={{ color: 'var(--text-on-button)' }}>
                    {me.nickname}의 이번 기록
                  </span>
                </div>
                {latest ? (
                  <div className="share-latest">
                    <span className="t-heading-sm">{getRestaurant(latest.restaurantId)?.name}</span>
                    <GradeChip grade={latest.grade} />
                    <span className="score-hero">{latest.score.toFixed(1)}</span>
                  </div>
                ) : (
                  <p className="t-body share-latest" style={{ color: 'var(--text-secondary)' }}>
                    아직 이번 기록이 없어요
                  </p>
                )}
                <div className="share-sign">
                  <span className="tami-mini" />
                  <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>탐이가 봤다 갑니다</span>
                </div>
              </div>
            )}

            {tab === 'dna' && (
              <div className="share-card">
                <div className="share-card-head">
                  <span className="share-logotype">hotam</span>
                  <span className="t-heading-sm" style={{ color: 'var(--text-on-button)' }}>
                    {me.nickname}의 취향 DNA
                  </span>
                </div>
                <div className="share-dna">
                  {tasteDNA.categories.map((c) => (
                    <div key={c.name} className="dna-row">
                      <span className="t-caption dna-name">{c.name}</span>
                      <div className="dna-track">
                        <div className="dna-fill" style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className="t-caption dna-pct">{c.pct}%</span>
                    </div>
                  ))}
                  <div className="dna-grades">
                    <GradeChip grade="good" count={tasteDNA.gradeDist.good} />
                    <GradeChip grade="soso" count={tasteDNA.gradeDist.soso} />
                    <GradeChip grade="bad" count={tasteDNA.gradeDist.bad} />
                  </div>
                </div>
                <div className="share-sign">
                  <span className="tami-mini" />
                  <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>탐이가 봤다 갑니다</span>
                </div>
              </div>
            )}
          </div>

          <div className="step-footer">
            <MsGate ms="M2" data-func-id="HTM-S8-01">
              <button
                className="btn btn-primary"
                onClick={() => showToast('카드 이미지를 만들었어요 — 자랑만 남았네요')}
              >
                이미지로 공유하기
              </button>
            </MsGate>
          </div>
        </>
      )}
    </div>
  )
}
