import React from 'react'
import { Home, Compass, Plus, Trophy, CircleUserRound } from 'lucide-react'
import { useApp, TABS } from '../App.jsx'

const TAB_ICONS = {
  home: Home,
  explore: Compass,
  ranking: Trophy,
  profile: CircleUserRound,
}

// 바텀 내비게이션 (NAV_GLOBAL_01) — 5탭 고정, 가운데 기록=56px 주황 FAB
export default function BottomNav() {
  const { currentScreen, navigate } = useApp()

  return (
    <nav className="bottom-nav" data-func-id="NAV_GLOBAL_01">
      {TABS.map((tab) => {
        if (tab.isFab) {
          return (
            <div key={tab.key} style={{ position: 'relative' }}>
              <button
                className="nav-fab"
                aria-label="방문 기록하기"
                onClick={() => navigate(tab.screenId)}
              >
                <Plus size={28} strokeWidth={2.5} />
              </button>
            </div>
          )
        }
        const Icon = TAB_ICONS[tab.key]
        const active = currentScreen === tab.screenId
        return (
          <button
            key={tab.key}
            className={`nav-item${active ? ' is-active' : ' is-disabled-look'}`}
            onClick={() => navigate(tab.screenId)}
          >
            <Icon size={24} strokeWidth={active ? 2.2 : 1.8} />
            <span className="t-micro">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
