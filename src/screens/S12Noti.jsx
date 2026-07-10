import React from 'react'
import { UserPlus, Heart, MessageCircle, Trophy } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import MsGate from '../components/MsGate.jsx'
import { notifications } from '../data/dummy.js'

// S12 알림 — 최신순, 유형별 아이콘. 항목 탭 → 관련 화면. 빈 상태 탐이.
// M1 = 팔로우·좋아요 최소 세트 / 댓글·랭킹 = M2 알림 종류 확장(HTM-S12-02)
const TYPE_ICONS = { follow: UserPlus, like: Heart, comment: MessageCircle, ranking: Trophy }
const M2_TYPES = ['comment', 'ranking']

export default function S12Noti() {
  const { goBack, navigate, demoEmpty } = useApp()

  return (
    <div className="page">
      <AppBar title="알림" onBack={goBack} />

      {demoEmpty ? (
        <div className="feed-empty">
          <div className="tami"><span className="t-caption">탐이</span></div>
          <p className="t-heading-sm">조용하네요</p>
          <p className="t-body" style={{ color: 'var(--text-secondary)' }}>기록 하나면 금방 소란스러워질 거예요.</p>
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => navigate('S2')}>
            기록하러 가기
          </button>
        </div>
      ) : (
        <div className="noti-list" data-func-id="HTM-S12-01">
          {notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type]
            const row = (
              <button
                className="noti-row"
                key={n.id}
                onClick={() => navigate(n.targetScreen, { params: n.postId ? { postId: n.postId } : {} })}
              >
                <span className="noti-icon"><Icon size={18} strokeWidth={1.8} /></span>
                <span className="noti-text">
                  <span className="t-body">{n.text}</span>
                  <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>{n.createdAt}</span>
                </span>
              </button>
            )
            return M2_TYPES.includes(n.type) ? (
              <MsGate ms="M2" data-func-id="HTM-S12-02" key={n.id}>{row}</MsGate>
            ) : row
          })}
        </div>
      )}
    </div>
  )
}
