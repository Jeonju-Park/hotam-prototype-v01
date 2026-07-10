import React, { useMemo, useState } from 'react'
import { useApp } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import RestaurantRow from '../components/RestaurantRow.jsx'
import { ranking, restaurantRanking, getUser, getRestaurant, me } from '../data/dummy.js'

// S11 랭킹 — 내 순위 카드 + 친구|동네(M2)|전체 + 기간 칩(M2) + 리스트(내 행 wash 하이라이트).
// 상단 미식|식당(M3) 전환. 하위권 데모(빈 상태 스위치): 상위 5 + "…" + 내 행.
const SCOPES = [
  { key: 'friends', label: '친구' },
  { key: 'area',    label: '동네', ms: 'M2' },
  { key: 'all',     label: '전체' },
]
const PERIODS = ['주간', '월간', '전체']
const R_AREAS = ['성수', '연남', '을지로', '망원']
const fmtDelta = (d) => (d > 0 ? `▲${d}` : d < 0 ? `▼${-d}` : '—')

export default function S11Ranking() {
  const { followedUserIds, demoEmpty, lens, navigate } = useApp()
  const [mode, setMode] = useState('people')     // 미식 | 식당(M3)
  const [scope, setScope] = useState('friends')
  const [period, setPeriod] = useState('주간')
  const [rArea, setRArea] = useState(null)
  const m2Locked = lens === 'M1'
  const m3Locked = lens !== 'M3'

  const myRow = ranking.find((r) => r.isMe)
  // 하위권 데모: 내 순위를 47위로
  const myCard = demoEmpty
    ? { rank: 47, percentile: 81, delta: -3, reviewCount: myRow.reviewCount }
    : myRow

  const peopleRows = useMemo(() => {
    let rows = ranking
    if (scope === 'friends') rows = rows.filter((r) => r.isMe || (r.userId && followedUserIds.includes(r.userId)))
    if (scope === 'area') rows = rows.filter((r) => r.isMe || (r.userId && getUser(r.userId)?.area === me.area))
    return rows
  }, [scope, followedUserIds])

  const restRows = useMemo(() => {
    let rows = restaurantRanking.map((r) => ({ ...r, restaurant: getRestaurant(r.restaurantId) }))
    if (rArea) rows = rows.filter((r) => r.restaurant.area === rArea)
    return rows
  }, [rArea])

  const PersonRow = ({ row }) => (
    <div className={`rank-row${row.isMe ? ' is-me' : ''}`}>
      <span className="rank-num t-title">{row.rank}</span>
      <Avatar user={row.userId ? getUser(row.userId) : { initial: row.nickname[0] }} size={36} />
      <div className="rank-text">
        <span className="t-title">{row.nickname}{row.isMe && ' (나)'}</span>
        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>평가 {row.reviewCount} · {fmtDelta(row.delta)}</span>
      </div>
      {!row.isMe && row.userId && (
        <MsGate ms="M2" data-func-id="HTM-S11-06" style={{ display: 'inline-flex' }}>
          <FollowButton userId={row.userId} />
        </MsGate>
      )}
    </div>
  )

  return (
    <div className="page">
      <header className="appbar">
        <span className="t-heading-lg" style={{ paddingLeft: 'var(--sp-sm)' }}>랭킹</span>
        <span className="spacer" />
        {/* 미식 | 식당 범위 전환 (식당 = M3) */}
        <div className="seg-row" data-func-id="HTM-S11-08" style={{ margin: 0, width: 160, gridTemplateColumns: '1fr 1fr' }}>
          <button className={`seg-btn${mode === 'people' ? ' is-active' : ''}`} onClick={() => setMode('people')}>미식</button>
          <button
            className={`seg-btn${mode === 'rest' ? ' is-active' : ''}${m3Locked ? ' ms-locked' : ''}`}
            disabled={m3Locked}
            onClick={() => setMode('rest')}
          >
            식당<span className="seg-ms">M3</span>
          </button>
        </div>
      </header>

      {mode === 'people' && (
        <>
          {/* 내 순위 카드 */}
          <div className="myrank-card" data-func-id="HTM-S11-01">
            <span className="myrank-num">{myCard.rank}위</span>
            <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>
              상위 {myCard.percentile}% · 이번 주 {fmtDelta(myCard.delta)} · 평가 {myCard.reviewCount}
            </span>
          </div>

          {/* 범위 세그먼트: 친구 | 동네(M2) | 전체 */}
          <div className="seg-row page-pad-x" data-func-id="HTM-S11-02">
            {SCOPES.map((s) => {
              const locked = s.ms === 'M2' && m2Locked
              return (
                <button
                  key={s.key}
                  className={`seg-btn${scope === s.key ? ' is-active' : ''}${locked ? ' ms-locked' : ''}`}
                  disabled={locked}
                  data-func-id={s.ms ? 'HTM-S11-03' : undefined}
                  onClick={() => setScope(s.key)}
                >
                  {s.label}{s.ms && <span className="seg-ms m2">M2</span>}
                </button>
              )
            })}
          </div>

          {/* 기간 칩 (M2) */}
          <MsGate ms="M2" data-func-id="HTM-S11-04" className="page-pad-x" style={{ marginTop: 'var(--sp-xs)' }}>
            <div className="chip-row">
              {PERIODS.map((p) => (
                <button key={p} className={`criteria-chip${period === p ? ' is-selected' : ''}`} onClick={() => setPeriod(p)}>
                  {p}
                </button>
              ))}
            </div>
          </MsGate>

          {/* 사람 랭킹 리스트 */}
          <div className="rank-list page-pad-x" data-func-id="HTM-S11-05">
            {demoEmpty ? (
              <>
                {ranking.slice(0, 5).map((row) => <PersonRow key={row.rank} row={row} />)}
                <div className="rank-ellipsis t-caption">⋯</div>
                <PersonRow row={{ ...myCard, isMe: true, nickname: me.nickname, userId: 'u1' }} />
              </>
            ) : (
              peopleRows.map((row) => <PersonRow key={row.rank} row={row} />)
            )}
          </div>
        </>
      )}

      {mode === 'rest' && (
        /* 식당 랭킹 (M3) — 기간/지역 필터 + RestaurantRow */
        <MsGate ms="M3" data-func-id="HTM-S11-07" className="page-pad-x" style={{ marginTop: 'var(--sp-xs)' }}>
          <div className="chip-row" style={{ marginBottom: 'var(--sp-xs)' }}>
            {PERIODS.map((p) => (
              <button key={p} className={`criteria-chip${period === p ? ' is-selected' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <div className="chip-row" style={{ marginBottom: 'var(--sp-xs)' }}>
            {R_AREAS.map((a) => (
              <button key={a} className={`criteria-chip${rArea === a ? ' is-selected' : ''}`} onClick={() => setRArea(rArea === a ? null : a)}>{a}</button>
            ))}
          </div>
          {restRows.map((row) => (
            <div key={row.restaurantId} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-xs)' }}>
              <span className="rank-num t-title">{row.rank}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <RestaurantRow
                  restaurant={row.restaurant}
                  withFuncIds={false}
                  onClick={() => navigate('S4', { params: { restaurantId: row.restaurantId } })}
                />
              </div>
            </div>
          ))}
        </MsGate>
      )}
    </div>
  )
}
