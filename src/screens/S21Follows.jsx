import React, { useState } from 'react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import Avatar from '../components/Avatar.jsx'
import BottomSheet from '../components/BottomSheet.jsx'
import { getUser } from '../data/dummy.js'

// S21 팔로워/팔로잉 — 상단 세그먼트 + 리스트(아바타·닉네임·평가 수·팔로잉 버튼).
// 팔로잉 해제 시 확인 시트.
const FOLLOWER_IDS = ['u2', 'u3', 'u5', 'u7', 'u9', 'u10'] // 더미 팔로워

export default function S21Follows() {
  const { goBack, followedUserIds, toggleFollow, navigate } = useApp()
  const [tab, setTab] = useState('followers')
  const [confirmUser, setConfirmUser] = useState(null) // 해제 확인 대상

  const rows = (tab === 'followers' ? FOLLOWER_IDS : followedUserIds).map(getUser).filter(Boolean)

  const onFollowClick = (u) => {
    if (followedUserIds.includes(u.id)) setConfirmUser(u)  // 해제는 확인 시트 경유
    else toggleFollow(u.id)
  }

  return (
    <div className="page">
      <AppBar title="팔로워/팔로잉" onBack={goBack} />

      <div className="seg-row page-pad-x" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button className={`seg-btn${tab === 'followers' ? ' is-active' : ''}`} onClick={() => setTab('followers')}>
          팔로워
        </button>
        <button className={`seg-btn${tab === 'following' ? ' is-active' : ''}`} onClick={() => setTab('following')}>
          팔로잉
        </button>
      </div>

      <div className="user-list" data-func-id="HTM-S21-01">
        {rows.map((u) => {
          const following = followedUserIds.includes(u.id)
          return (
            <div className="user-row" key={u.id}>
              <button className="user-row-main" onClick={() => navigate('S10', { params: { userId: u.id } })}>
                <Avatar user={u} size={44} />
                <span className="user-row-text">
                  <span className="t-title">{u.nickname}</span>
                  <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>평가 {u.reviewCount}</span>
                </span>
              </button>
              <button
                className={`follow-btn${following ? ' is-following' : ''}`}
                onClick={() => onFollowClick(u)}
              >
                {following ? '팔로잉' : '팔로우'}
              </button>
            </div>
          )
        })}
        {rows.length === 0 && (
          <p className="t-body" style={{ color: 'var(--text-secondary)', padding: 'var(--sp-md) 0' }}>
            아직 아무도 없어요
          </p>
        )}
      </div>

      {/* 팔로잉 해제 확인 시트 */}
      <BottomSheet open={confirmUser !== null} onClose={() => setConfirmUser(null)} title={`${confirmUser?.nickname ?? ''}님 팔로우를 해제할까요?`}>
        <p className="t-body sheet-body">해제해도 상대에게 알리지 않아요.</p>
        <button
          className="btn btn-secondary"
          onClick={() => { toggleFollow(confirmUser.id); setConfirmUser(null) }}
        >
          해제하기
        </button>
        <button className="btn-text" style={{ alignSelf: 'center' }} onClick={() => setConfirmUser(null)}>
          그대로 둘래요
        </button>
      </BottomSheet>
    </div>
  )
}
