import React, { useState } from 'react'
import { Check, CircleHelp } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import BottomSheet from '../components/BottomSheet.jsx'
import GradeChip from '../components/GradeChip.jsx'
import { getRestaurant } from '../data/dummy.js'

// S19 기록 완료 — 체크 모션 + "오늘도 하나 낚아챘어요" + 점수 뱃지 크게.
// 점수는 표시만 한다(직접 수정 UI 없음 — 캐논 불변). 이의는 재비교(S3)로만.
export default function S19RecordDone() {
  const { navigate, lastRecord } = useApp()
  const [sheet, setSheet] = useState(null) // 'score' | 'recompare' | null

  if (!lastRecord) {
    return (
      <div className="entry step-screen">
        <div className="uc-body">
          <div className="tami"><span className="t-caption">탐이</span></div>
          <p className="t-heading-sm">완료된 기록이 없어요</p>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => navigate('S2', { replace: true })}>
            기록하러 가기
          </button>
        </div>
      </div>
    )
  }

  const restaurant = getRestaurant(lastRecord.restaurantId)

  return (
    <div className="entry step-screen done-screen">
      <div className="step-body step-done" key={lastRecord.score}>
        <div className="done-check">
          <Check size={32} strokeWidth={3} />
        </div>
        {/* 완료 = 위트 배분 구역 */}
        <h1 className="t-heading-lg">오늘도 하나 낚아챘어요</h1>

        <div className="done-score-block" data-func-id="HTM-S19-01">
          <span className="score-hero">{lastRecord.score.toFixed(1)}</span>
          <MsGate ms="M2" data-func-id="HTM-S19-03" style={{ display: 'inline-flex' }}>
            <button className="icon-btn" aria-label="점수 산정 방식" onClick={() => setSheet('score')}>
              <CircleHelp size={20} strokeWidth={1.8} />
            </button>
          </MsGate>
        </div>

        <div className="done-rest-row">
          <span className="t-title">{restaurant?.name}</span>
          <GradeChip grade={lastRecord.grade} />
        </div>
      </div>

      <div className="step-footer done-footer">
        <button className="btn btn-primary" data-func-id="HTM-S19-02" onClick={() => navigate('S5')}>
          내 리스트 보기
        </button>
        <MsGate ms="M2" data-func-id="HTM-S19-04">
          <button className="btn btn-secondary" onClick={() => navigate('S2', { replace: true })}>
            계속 기록
          </button>
        </MsGate>
        <div className="done-text-actions">
          <MsGate ms="M2" data-func-id="HTM-S19-05" style={{ display: 'inline-flex' }}>
            <button className="btn-text" onClick={() => setSheet('recompare')}>
              점수가 마음에 안들어요
            </button>
          </MsGate>
          <MsGate ms="M2" style={{ display: 'inline-flex' }}>
            {/* S8 진입은 원래 S5·S10 경유(M2) — 리뷰 편의용 프로토타입 지름길 */}
            <button className="btn-text" onClick={() => navigate('S8')}>
              공유 카드 보기
            </button>
          </MsGate>
        </div>
      </div>

      {/* 점수 산정 방식 시트 (HTM-S19-03) — 내부어(Elo·밴드) 노출 금지 */}
      <BottomSheet open={sheet === 'score'} onClose={() => setSheet(null)} title="점수는 이렇게 정해져요">
        <p className="t-body sheet-body">
          호탐엔 직접 매기는 별점이 없어요. 같은 만족도끼리 비교한 결과로 점수가 계산돼요.
          비교가 쌓일수록 점수는 점점 정확해져요.
        </p>
        <button className="btn btn-secondary" onClick={() => setSheet(null)}>알겠어요</button>
      </BottomSheet>

      {/* 점수 이의 시트 (HTM-S19-05) — 교정도 비교 이벤트로만 */}
      <BottomSheet open={sheet === 'recompare'} onClose={() => setSheet(null)} title="비교 2번으로 바로잡아요">
        <p className="t-body sheet-body">
          점수를 직접 고칠 수는 없어요. 대신 같은 만족도의 다른 집과 두 번만 더 비교하면
          점수가 제자리를 찾아가요.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => { setSheet(null); navigate('S3') }}
        >
          비교하러 가기
        </button>
      </BottomSheet>
    </div>
  )
}
