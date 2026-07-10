import React from 'react'
import { BadgeCheck } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { users } from '../data/dummy.js'

// S16 팔로우 추천 (M2) — 아바타·닉네임·인증 뱃지·소개·팔로우 버튼(토글)
export default function S16FollowSuggest() {
  const { goBack, navigate } = useApp()
  const candidates = users.filter((u) => u.id !== 'u1')

  return (
    <div className="page">
      <AppBar title="미식가 추천" onBack={goBack} />
      <div className="user-list" data-func-id="HTM-S16-01">
        {candidates.map((u) => (
          <div className="user-row" key={u.id}>
            <button className="user-row-main" onClick={() => navigate('S10', { params: { userId: u.id } })}>
              <Avatar user={u} size={44} />
              <span className="user-row-text">
                <span className="t-title user-row-name">
                  {u.nickname}
                  {u.verified && <BadgeCheck size={16} color="var(--status-info)" />}
                </span>
                <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{u.bio}</span>
              </span>
            </button>
            <FollowButton userId={u.id} data-func-id="HTM-S16-02" />
          </div>
        ))}
      </div>
    </div>
  )
}
