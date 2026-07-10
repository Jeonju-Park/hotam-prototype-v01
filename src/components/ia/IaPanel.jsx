import React, { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useApp } from '../../App.jsx'
import { ROLES } from '../../lib/useIaLive.js'
import MilestoneLens from '../MilestoneLens.jsx'
import MsAggregate from './MsAggregate.jsx'
import TableTab from './TableTab.jsx'
import MemoTab from './MemoTab.jsx'
import HistoryTab from './HistoryTab.jsx'

// ─────────────────────────────────────────────
// 라이브 IA 테이블 패널 (스펙 v2 §3 + v2.1) — 폭 fill
// 헤더: "IA Live" + 연결 점 + 작성자 칩(역할 3종) + CSV
// 하단: 탭 3 · 마일스톤 집계(§5) · 렌즈/데모 스위치
// ─────────────────────────────────────────────
const toCsv = (rows, columns) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [columns.join(','), ...rows.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n')
}
const download = (filename, text) => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function IaPanel() {
  const {
    iaStatus, author, setAuthor, unseenMemos,
    iaFeatureList, iaScreens, showToast,
    currentScreen, lens, demoEmpty, demoError,
  } = useApp()
  const [tab, setTab] = useState('table')
  const [selectedId, setSelectedId] = useState(null)
  const [pickingAuthor, setPickingAuthor] = useState(false)
  // 테이블 필터 (v2.1: scope 'screen'|'all'|'area:…' + milestone 버킷) — scope는 도구 설정으로 유지
  const [filter, setFilter] = useState(() => ({
    scope: localStorage.getItem('hotam_ia_showall') === '1' ? 'all' : 'screen',
    milestone: null,
  }))
  useEffect(() => {
    localStorage.setItem('hotam_ia_showall', filter.scope === 'all' ? '1' : '0')
  }, [filter.scope])

  // §4 미구현 동적 판정: 프레임 DOM의 data-func-id 스캔.
  // MutationObserver로 화면 내 상태 변화(탭·검색 결과 등)에도 추종 — 하드코딩 목록 없음.
  const [implementedIds, setImplementedIds] = useState(() => new Set())
  useEffect(() => {
    const frame = document.querySelector('.frame')
    if (!frame) return
    let timer = null
    const scan = () => {
      const next = new Set([...frame.querySelectorAll('[data-func-id]')].map((el) => el.dataset.funcId))
      setImplementedIds((prev) => {
        if (prev.size === next.size && [...next].every((id) => prev.has(id))) return prev
        return next
      })
    }
    const debounced = () => { clearTimeout(timer); timer = setTimeout(scan, 250) }
    debounced()
    const mo = new MutationObserver(debounced)
    mo.observe(frame, { childList: true, subtree: true })
    return () => { mo.disconnect(); clearTimeout(timer) }
  }, [currentScreen, lens, demoEmpty, demoError])

  const jumpTo = (targetId) => {
    setTab('table')
    setSelectedId(targetId)
  }

  const exportCsv = () => {
    const today = new Date().toISOString().slice(0, 10)
    const fCols = ['id', 'screen', 'area', 'screen_name', 'name', 'label', 'type', 'purpose',
      'milestone', 'importance', 'nav', 'copy', 'flags', 'note', 'memo', 'sort_order', 'archived', 'updated_at']
    const sCols = ['id', 'area', 'name', 'label', 'type', 'purpose', 'milestone', 'copy', 'flags', 'note', 'memo', 'archived', 'updated_at']
    download(`ia_features_${today}.csv`, toCsv(iaFeatureList, fCols))
    download(`ia_screens_${today}.csv`, toCsv(Object.values(iaScreens), sCols))
    showToast('CSV 2개(기능·화면)를 내려받았어요')
  }

  const needAuthor = !author || pickingAuthor

  return (
    <aside className="inspector ia-panel">
      <header className="insp-header">
        <span className={`ia-conn-dot ${iaStatus}`} title={iaStatus === 'live' ? '실시간 연결됨' : '오프라인'} />
        <span className="t-caption">IA Live · v2.1</span>
        <span className="spacer" />
        <button className="ia-author-chip t-micro" onClick={() => setPickingAuthor(true)} title="역할 변경">
          {author || '역할 선택'}
        </button>
        <button className="ia-tool-btn" onClick={exportCsv} title="CSV 내보내기">
          <Download size={13} /> CSV
        </button>
      </header>

      {iaStatus === 'offline' && (
        <div className="ia-offline-banner t-caption">오프라인 — 읽기 전용 (정적 IA 데이터 표시 중)</div>
      )}
      {iaStatus === 'connecting' && (
        <div className="ia-offline-banner is-connecting t-caption">Supabase 연결 중…</div>
      )}

      {needAuthor ? (
        <div className="ia-author-gate">
          <p className="t-heading-sm">어떤 역할로 참여하세요?</p>
          <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>편집·메모에 이 역할이 기록돼요</p>
          <div className="ia-author-options">
            {ROLES.map((n) => (
              <button
                key={n}
                className={`btn btn-secondary${author === n ? ' is-current' : ''}`}
                onClick={() => { setAuthor(n); setPickingAuthor(false) }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="ia-content">
            {tab === 'table' && (
              <TableTab
                selectedId={selectedId} setSelectedId={setSelectedId}
                filter={filter} setFilter={setFilter}
                implementedIds={implementedIds}
              />
            )}
            {tab === 'memo' && <MemoTab onJump={jumpTo} />}
            {tab === 'history' && <HistoryTab onJump={jumpTo} />}
          </div>

          <div className="ia-tabs">
            <button className={`ia-tab${tab === 'table' ? ' is-active' : ''}`} onClick={() => setTab('table')}>
              테이블
            </button>
            <button className={`ia-tab${tab === 'memo' ? ' is-active' : ''}`} onClick={() => setTab('memo')}>
              메모
              {unseenMemos > 0 && <span className="ia-badge">{unseenMemos}</span>}
            </button>
            <button className={`ia-tab${tab === 'history' ? ' is-active' : ''}`} onClick={() => setTab('history')}>
              히스토리
            </button>
          </div>
        </>
      )}

      {/* 렌즈·데모 스위치 + 마일스톤 집계 (v2.1 §5 — 렌즈 바로 아래) */}
      <MilestoneLens />
      {!needAuthor && <MsAggregate setFilter={setFilter} setTab={setTab} implementedIds={implementedIds} />}
    </aside>
  )
}
