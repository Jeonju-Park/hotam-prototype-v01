import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import InspectorPanel from './components/InspectorPanel.jsx'
import UnderConstruction from './screens/UnderConstruction.jsx'
import S13Splash from './screens/S13Splash.jsx'
import A0Login from './screens/A0Login.jsx'
import S14Signup from './screens/S14Signup.jsx'
import S1Onboarding from './screens/S1Onboarding.jsx'
import S2Record from './screens/S2Record.jsx'
import S3Compare from './screens/S3Compare.jsx'
import S19RecordDone from './screens/S19RecordDone.jsx'
import S8ShareCard from './screens/S8ShareCard.jsx'
import S5MyList from './screens/S5MyList.jsx'
import S7Home from './screens/S7Home.jsx'
import S15Search from './screens/S15Search.jsx'
import S16FollowSuggest from './screens/S16FollowSuggest.jsx'
import S12Noti from './screens/S12Noti.jsx'
import S17PostDetail from './screens/S17PostDetail.jsx'
import S9Explore from './screens/S9Explore.jsx'
import S18AddRestaurant from './screens/S18AddRestaurant.jsx'
import S4Restaurant from './screens/S4Restaurant.jsx'
import S11Ranking from './screens/S11Ranking.jsx'
import S10Profile from './screens/S10Profile.jsx'
import S21Follows from './screens/S21Follows.jsx'
import S6MyMap from './screens/S6MyMap.jsx'
import S20Settings from './screens/S20Settings.jsx'
import { me, posts, myList } from './data/dummy.js'

// ── 앱 전역 Context (스펙 §1: Context 1개) ──────────────
const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

// 하단 5탭 ↔ 화면ID (캐논 5탭 고정, 기록=중앙 FAB)
export const TABS = [
  { key: 'home',    screenId: 'S7',  label: '홈' },
  { key: 'explore', screenId: 'S9',  label: '탐색' },
  { key: 'record',  screenId: 'S2',  label: '기록', isFab: true },
  { key: 'ranking', screenId: 'S11', label: '랭킹' },
  { key: 'profile', screenId: 'S10', label: '프로필' },
]

// 하단 탭바 없는 화면: 진입 플로우 + 풀스크린 기록 플로우
const NO_NAV_SCREENS = ['S13', 'A0', 'S14', 'S1', 'S2', 'S3', 'S19', 'S8']

// 화면 레지스트리 — 미구현 화면은 UnderConstruction 폴백
const SCREEN_COMPONENTS = {
  S13: S13Splash,
  A0:  A0Login,
  S14: S14Signup,
  S1:  S1Onboarding,
  S2:  S2Record,
  S3:  S3Compare,
  S19: S19RecordDone,
  S8:  S8ShareCard,
  S5:  S5MyList,
  S7:  S7Home,
  S15: S15Search,
  S16: S16FollowSuggest,
  S12: S12Noti,
  S17: S17PostDetail,
  S9:  S9Explore,
  S18: S18AddRestaurant,
  S4:  S4Restaurant,
  S11: S11Ranking,
  S10: S10Profile,
  S21: S21Follows,
  S6:  S6MyMap,
  S20: S20Settings,
}

// ── 점수 밴드 (캐논: good 7.0~9.8 / soso 4.0~6.9 / bad 0.5~3.9) ──
export const GRADE_BANDS = { good: [7.0, 9.8], soso: [4.0, 6.9], bad: [0.5, 3.9] }
export const clampToBand = (grade, score) => {
  const [lo, hi] = GRADE_BANDS[grade]
  return Math.round(Math.min(hi, Math.max(lo, score)) * 10) / 10
}
export const bandCenter = (grade) => {
  const [lo, hi] = GRADE_BANDS[grade]
  return Math.round(((lo + hi) / 2) * 10) / 10
}

export default function App() {
  // ── 자체 라우터: {화면, 파라미터} + 히스토리 배열 (react-router 금지) ──
  // 앱 첫 실행은 항상 S13 스플래시부터
  const [route, setRoute] = useState({ screen: 'S13', params: {} })
  const [history, setHistory] = useState([])
  const currentScreen = route.screen
  const params = route.params

  const navigate = useCallback((screenId, { replace = false, params: p = {} } = {}) => {
    setRoute((prev) => {
      if (prev.screen === screenId && JSON.stringify(prev.params) === JSON.stringify(p)) return prev
      if (!replace) setHistory((h) => [...h, prev])
      return { screen: screenId, params: p }
    })
  }, [])

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      setRoute(h[h.length - 1])
      return h.slice(0, -1)
    })
  }, [])

  // ── 콘텐츠 상태: 피드·내 리스트 (기록 완료 시 실시간 반영) ──
  const [feedPosts, setFeedPosts] = useState(posts)
  const [myListData, setMyListData] = useState(myList)

  // ── 소셜 토글: 좋아요·저장(→위시)·팔로우 ──
  const [likedPostIds, setLikedPostIds] = useState([])
  const [savedPostIds, setSavedPostIds] = useState(['p20', 'p3', 'p19'])   // 더미 wishes w1~w3와 동일 출발
  const [followedUserIds, setFollowedUserIds] = useState(['u2', 'u3', 'u4', 'u5', 'u6', 'u8', 'u9'])

  const toggleLike = useCallback((id) =>
    setLikedPostIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), [])
  const toggleSave = useCallback((id) =>
    setSavedPostIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), [])
  const toggleFollow = useCallback((id) =>
    setFollowedUserIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), [])

  // 가게 찜 (S9·S4) — 더미 wishes w4~w6와 동일 출발
  const [wishedRestaurantIds, setWishedRestaurantIds] = useState(['r11', 'r22', 'r16'])
  const toggleWish = useCallback((id) =>
    setWishedRestaurantIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), [])

  // ── 기록 플로우 상태 ──
  const [draft, setDraft] = useState(null)          // S2에서 작성 중인 기록 {restaurantId, photoCount, body, grade}
  const [lastRecord, setLastRecord] = useState(null) // S3 완료 후 {postId, restaurantId, grade, score}

  // 기록 확정: 점수는 비교 결과로만 계산돼 들어온다(직접 수정 경로 없음 — 캐논 불변)
  const finalizeRecord = useCallback((recordDraft, score) => {
    const postId = `p-my-${Date.now()}`
    const post = {
      id: postId,
      userId: 'u1',
      restaurantId: recordDraft.restaurantId,
      grade: recordDraft.grade,
      score,
      body: recordDraft.body,
      photoCount: recordDraft.photoCount,
      likes: 0,
      commentCount: 0,
      createdAt: '방금',
      comments: [],
    }
    setFeedPosts((prev) => [post, ...prev])          // 홈 피드 맨 위에 추가
    setMyListData((prev) => {
      // 재방문이면 기존 항목 제거 후(O12: 이전 평가 대체) 새 등급 그룹에 점수순 삽입
      const next = {}
      for (const g of Object.keys(prev)) next[g] = prev[g].filter((it) => it.restaurantId !== recordDraft.restaurantId)
      next[recordDraft.grade] = [...next[recordDraft.grade], { restaurantId: recordDraft.restaurantId, score }]
        .sort((a, b) => b.score - a.score)
      return next
    })
    setLastRecord({ postId, restaurantId: recordDraft.restaurantId, grade: recordDraft.grade, score })
    setDraft(null)
  }, [])

  // 재비교(S19 "점수가 마음에 안들어요") 결과 반영 — 역시 비교 이벤트 경유
  const updateRecordScore = useCallback((newScore) => {
    setLastRecord((prev) => {
      if (!prev) return prev
      setFeedPosts((list) => list.map((p) => (p.id === prev.postId ? { ...p, score: newScore } : p)))
      setMyListData((data) => ({
        ...data,
        [prev.grade]: data[prev.grade]
          .map((it) => (it.restaurantId === prev.restaurantId ? { ...it, score: newScore } : it))
          .sort((a, b) => b.score - a.score),
      }))
      return { ...prev, score: newScore }
    })
  }, [])

  // 내 리스트 드래그 재정렬 (S5, M2) — 순서만 바꾼다. 점수는 건드리지 않음(캐논:
  // 순위 이의는 이후 비교 이벤트로 점수에 반영 — 스낵바 카피가 이를 암시)
  const reorderMyList = useCallback((grade, from, to) => {
    setMyListData((prev) => {
      const arr = [...prev[grade]]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...prev, [grade]: arr }
    })
  }, [])

  // ── 토스트 ──
  const [toast, setToast] = useState(null)
  const showToast = useCallback((msg) => setToast({ msg, key: Date.now() }), [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  // ── 인스펙터 상태 (호버 기능ID · 고정 스냅샷 · 역하이라이트) ──
  const [hoveredFuncId, setHoveredFuncId] = useState(null)
  const [reverseFuncId, setReverseFuncId] = useState(null)
  const [pinnedContent, setPinnedContent] = useState(null)

  // ── 마일스톤 렌즈 + 데모 스위치 (스펙 §7) ──
  const [lens, setLens] = useState('M3')
  const [demoEmpty, setDemoEmpty] = useState(false)
  const [demoError, setDemoError] = useState(false)

  // ── 기능 호버 → 하이라이트 + 인스펙터 연동 (스펙 §8-1) ──
  const frameRef = useRef(null)
  const hotElRef = useRef(null)
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const setHot = (el) => {
      if (el === hotElRef.current) return
      hotElRef.current?.classList.remove('ia-hot')
      hotElRef.current = el
      if (el) {
        el.classList.add('ia-hot')
        setHoveredFuncId(el.dataset.funcId)
      } else {
        setHoveredFuncId(null)
      }
    }
    const onOver = (e) => {
      const el = e.target.closest('[data-func-id]')
      setHot(el && frame.contains(el) ? el : null)
    }
    const onLeave = () => setHot(null)
    frame.addEventListener('mouseover', onOver)
    frame.addEventListener('mouseleave', onLeave)
    return () => {
      frame.removeEventListener('mouseover', onOver)
      frame.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    hotElRef.current?.classList.remove('ia-hot')
    hotElRef.current = null
    setHoveredFuncId(null)
  }, [route])

  useEffect(() => {
    if (!reverseFuncId || !frameRef.current) return
    const els = [...frameRef.current.querySelectorAll(`[data-func-id="${reverseFuncId}"]`)]
    els.forEach((el) => el.classList.add('ia-hot'))
    return () => els.forEach((el) => el.classList.remove('ia-hot'))
  }, [reverseFuncId])

  // 개발용 상태 검증 훅 (프로덕션 빌드에는 영향 없음)
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__HOTAM__ = { feedPosts, myListData, lastRecord, draft, likedPostIds, savedPostIds, followedUserIds, wishedRestaurantIds, route }
    }
  }, [feedPosts, myListData, lastRecord, draft, likedPostIds, savedPostIds, followedUserIds, wishedRestaurantIds, route])

  const value = useMemo(() => ({
    me,
    currentScreen, params, navigate, goBack, canGoBack: history.length > 0,
    feedPosts, myListData,
    likedPostIds, toggleLike, savedPostIds, toggleSave, followedUserIds, toggleFollow,
    wishedRestaurantIds, toggleWish,
    draft, setDraft, lastRecord, finalizeRecord, updateRecordScore, reorderMyList,
    showToast,
    hoveredFuncId, setHoveredFuncId,
    reverseFuncId, setReverseFuncId,
    pinnedContent, setPinnedContent,
    lens, setLens,
    demoEmpty, setDemoEmpty,
    demoError, setDemoError,
  }), [currentScreen, params, navigate, goBack, history.length, feedPosts, myListData,
       likedPostIds, toggleLike, savedPostIds, toggleSave, followedUserIds, toggleFollow,
       wishedRestaurantIds, toggleWish,
       draft, lastRecord, finalizeRecord, updateRecordScore, reorderMyList, showToast,
       hoveredFuncId, reverseFuncId, pinnedContent, lens, demoEmpty, demoError])

  const Screen = SCREEN_COMPONENTS[currentScreen] ?? UnderConstruction
  const showNav = !NO_NAV_SCREENS.includes(currentScreen)

  return (
    <AppContext.Provider value={value}>
      <div className="shell">
        <div className="frame" ref={frameRef}>
          {/* key로 화면 전환 시 200ms 페이드/슬라이드 재생 (파라미터 변경도 전환으로 취급) */}
          <div className="frame-screen" key={`${route.screen}:${JSON.stringify(route.params)}`}>
            <Screen screenId={currentScreen} />
          </div>
          {showNav && <BottomNav />}
          {toast && (
            <div className="toast t-caption" key={toast.key}>{toast.msg}</div>
          )}
        </div>
        <InspectorPanel />
      </div>
    </AppContext.Provider>
  )
}
