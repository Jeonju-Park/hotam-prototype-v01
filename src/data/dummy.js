// ─────────────────────────────────────────────
// 호탐 프로토타입 더미데이터 (스펙 §5 스키마)
// 백엔드 없음 · 저장 없음. 점수 밴드 강제: good 7.0~9.8 / soso 4.0~6.9 / bad 0.5~3.9 (소수 1자리)
// ─────────────────────────────────────────────

// ── users 10명 ──────────────────────────────
export const users = [
  { id: 'u1',  nickname: '정주',       area: '성수',   initial: '정', reviewCount: 16, followers: 42,  following: 38, verified: false, bio: '좋은 집만 노려보다 확실할 때 기록합니다' },
  { id: 'u2',  nickname: '골목미식가', area: '을지로', initial: '골', reviewCount: 128, followers: 812, following: 95, verified: true,  bio: '을지로 골목은 제 구역입니다' },
  { id: 'u3',  nickname: '연남포크',   area: '연남',   initial: '연', reviewCount: 87,  followers: 341, following: 120, verified: false, bio: '돼지고기 앞에서 겸손해집니다' },
  { id: 'u4',  nickname: '면식수행자', area: '망원',   initial: '면', reviewCount: 214, followers: 1204, following: 66, verified: true,  bio: '국수 먹으러 지구 한 바퀴' },
  { id: 'u5',  nickname: '성수브레드', area: '성수',   initial: '성', reviewCount: 64,  followers: 233, following: 187, verified: false, bio: '빵은 식사입니다. 반박은 빵으로' },
  { id: 'u6',  nickname: '야식탐험대', area: '을지로', initial: '야', reviewCount: 45,  followers: 98,  following: 143, verified: false, bio: '밤 10시 이후에만 활동' },
  { id: 'u7',  nickname: '담백한입',   area: '연남',   initial: '담', reviewCount: 39,  followers: 76,  following: 52,  verified: false, bio: '자극적인 건 리뷰뿐' },
  { id: 'u8',  nickname: '매운맛수집', area: '망원',   initial: '매', reviewCount: 71,  followers: 187, following: 90,  verified: false, bio: '스코빌 지수로 기록하는 사람' },
  { id: 'u9',  nickname: '국물장인',   area: '성수',   initial: '국', reviewCount: 103, followers: 456, following: 71,  verified: false, bio: '국물 온도까지 평가합니다' },
  { id: 'u10', nickname: '디저트순례', area: '연남',   initial: '디', reviewCount: 58,  followers: 152, following: 204, verified: false, bio: '식사는 디저트를 위한 준비운동' },
]

// 내 계정 — "정주": 가본 곳 16(=myList 8+5+3) · 위시 6 · 팔로워 42 · 팔로잉 38
export const me = users[0]

// ── restaurants 24곳 ────────────────────────
// 카테고리: 한식/중식/일식/양식/카페/디저트/분식 · 동네: 성수/연남/을지로/망원
// rating = 전체 평점(10점 소수1), label = 사진 플레이스홀더 좌하단 라벨
export const restaurants = [
  { id: 'r1',  name: '수제비 성수',     category: '한식',   area: '성수',   rating: 8.7, reviewCount: 214, label: '성수 수제비',   open: true,  menus: [{ name: '얼큰수제비', price: 9000 }, { name: '감자전', price: 12000 }], seats: '홀 24석', parking: false, reservation: false },
  { id: 'r2',  name: '온기제면소',      category: '일식',   area: '성수',   rating: 9.1, reviewCount: 452, label: '성수 라멘',     open: true,  menus: [{ name: '쇼유라멘', price: 11000 }, { name: '차슈동', price: 13000 }, { name: '교자', price: 7000 }], seats: '바 12석', parking: false, reservation: false },
  { id: 'r3',  name: '파스타집 회전',   category: '양식',   area: '성수',   rating: 8.2, reviewCount: 189, label: '성수 파스타',   open: false, menus: [{ name: '들기름크림파스타', price: 17000 }, { name: '뇨끼', price: 16000 }], seats: '홀 30석', parking: true,  reservation: true },
  { id: 'r4',  name: '베이커리 무명',   category: '디저트', area: '성수',   rating: 8.9, reviewCount: 673, label: '성수 베이커리', open: true,  menus: [{ name: '소금빵', price: 3800 }, { name: '휘낭시에', price: 3200 }], seats: '테이크아웃 위주', parking: false, reservation: false },
  { id: 'r5',  name: '성수반상',        category: '한식',   area: '성수',   rating: 7.8, reviewCount: 97,  label: '성수 백반',     open: true,  menus: [{ name: '제육반상', price: 11000 }, { name: '고등어반상', price: 12000 }], seats: '홀 20석', parking: false, reservation: false },
  { id: 'r6',  name: '카페 발치',       category: '카페',   area: '성수',   rating: 7.4, reviewCount: 261, label: '성수 카페',     open: true,  menus: [{ name: '플랫화이트', price: 5500 }, { name: '바스크치즈케이크', price: 7500 }], seats: '홀 40석', parking: true,  reservation: false },
  { id: 'r7',  name: '연남서식지',      category: '양식',   area: '연남',   rating: 8.5, reviewCount: 322, label: '연남 브런치',   open: true,  menus: [{ name: '에그베네딕트', price: 15000 }, { name: '프렌치토스트', price: 13000 }], seats: '홀 26석', parking: false, reservation: true },
  { id: 'r8',  name: '완탕집 홍',       category: '중식',   area: '연남',   rating: 8.8, reviewCount: 540, label: '연남 완탕면',   open: true,  menus: [{ name: '새우완탕면', price: 10000 }, { name: '마라완탕', price: 11000 }], seats: '홀 16석', parking: false, reservation: false },
  { id: 'r9',  name: '연남곱창',        category: '한식',   area: '연남',   rating: 8.0, reviewCount: 175, label: '연남 곱창',     open: true,  menus: [{ name: '모둠곱창', price: 28000 }, { name: '볶음밥', price: 3000 }], seats: '홀 22석', parking: false, reservation: true },
  { id: 'r10', name: '스시 준',         category: '일식',   area: '연남',   rating: 9.3, reviewCount: 88,  label: '연남 스시',     open: false, menus: [{ name: '런치오마카세', price: 55000 }, { name: '디너오마카세', price: 120000 }], seats: '바 8석', parking: false, reservation: true },
  { id: 'r11', name: '녹기 전에 연남',  category: '디저트', area: '연남',   rating: 8.4, reviewCount: 419, label: '연남 젤라또',   open: true,  menus: [{ name: '피스타치오 싱글', price: 4500 }, { name: '더블컵', price: 7000 }], seats: '테이크아웃 위주', parking: false, reservation: false },
  { id: 'r12', name: '떡볶이 연구소',   category: '분식',   area: '연남',   rating: 7.6, reviewCount: 233, label: '연남 떡볶이',   open: true,  menus: [{ name: '기본떡볶이', price: 5000 }, { name: '수제튀김', price: 4000 }, { name: '순대', price: 5000 }], seats: '홀 14석', parking: false, reservation: false },
  { id: 'r13', name: '을지면옥골목',    category: '한식',   area: '을지로', rating: 8.6, reviewCount: 611, label: '을지로 평양냉면', open: true, menus: [{ name: '물냉면', price: 13000 }, { name: '제육', price: 15000 }], seats: '홀 36석', parking: false, reservation: false },
  { id: 'r14', name: '노가리분식',      category: '분식',   area: '을지로', rating: 7.2, reviewCount: 142, label: '을지로 분식',   open: true,  menus: [{ name: '라볶이', price: 6000 }, { name: '김밥', price: 3500 }], seats: '홀 10석', parking: false, reservation: false },
  { id: 'r15', name: '을지다락',        category: '카페',   area: '을지로', rating: 7.9, reviewCount: 208, label: '을지로 카페',   open: true,  menus: [{ name: '핸드드립', price: 6000 }, { name: '크림라떼', price: 6500 }], seats: '홀 18석', parking: false, reservation: false },
  { id: 'r16', name: '양꼬치 백두',     category: '중식',   area: '을지로', rating: 8.1, reviewCount: 187, label: '을지로 양꼬치', open: true,  menus: [{ name: '양꼬치 10꼬치', price: 15000 }, { name: '꿔바로우', price: 18000 }], seats: '홀 28석', parking: false, reservation: true },
  { id: 'r17', name: '히노아지',        category: '일식',   area: '을지로', rating: 8.3, reviewCount: 96,  label: '을지로 규동',   open: true,  menus: [{ name: '규동', price: 9500 }, { name: '가라아게동', price: 10500 }], seats: '바 10석', parking: false, reservation: false },
  { id: 'r18', name: '을지로그릴',      category: '양식',   area: '을지로', rating: 7.7, reviewCount: 121, label: '을지로 스테이크', open: false, menus: [{ name: '부챗살스테이크', price: 29000 }, { name: '감바스', price: 16000 }], seats: '홀 24석', parking: true, reservation: true },
  { id: 'r19', name: '망원우동',        category: '일식',   area: '망원',   rating: 8.8, reviewCount: 356, label: '망원 우동',     open: true,  menus: [{ name: '냉붓카케', price: 9000 }, { name: '유부우동', price: 8500 }], seats: '홀 16석', parking: false, reservation: false },
  { id: 'r20', name: '망원시장 호떡',   category: '분식',   area: '망원',   rating: 8.0, reviewCount: 483, label: '망원 호떡',     open: true,  menus: [{ name: '씨앗호떡', price: 2000 }, { name: '꿀호떡', price: 1500 }], seats: '포장 전용', parking: false, reservation: false },
  { id: 'r21', name: '차이니즈 망',     category: '중식',   area: '망원',   rating: 7.5, reviewCount: 133, label: '망원 짬뽕',     open: true,  menus: [{ name: '고추짬뽕', price: 10000 }, { name: '멘보샤', price: 14000 }], seats: '홀 20석', parking: false, reservation: false },
  { id: 'r22', name: '망원동티라미수', category: '디저트', area: '망원',   rating: 8.2, reviewCount: 297, label: '망원 티라미수', open: true,  menus: [{ name: '클래식 티라미수', price: 6500 }, { name: '말차 티라미수', price: 7000 }], seats: '홀 12석', parking: false, reservation: false },
  { id: 'r23', name: '한강칼국수',      category: '한식',   area: '망원',   rating: 7.3, reviewCount: 84,  label: '망원 칼국수',   open: true,  menus: [{ name: '바지락칼국수', price: 9000 }, { name: '보리밥', price: 2000 }], seats: '홀 22석', parking: true, reservation: false },
  { id: 'r24', name: '카페 물결',       category: '카페',   area: '망원',   rating: 6.9, reviewCount: 59,  label: '망원 카페',     open: true,  menus: [{ name: '아메리카노', price: 4500 }, { name: '쑥라떼', price: 6000 }], seats: '홀 32석', parking: false, reservation: false },
]

// ── posts 30건 ──────────────────────────────
// grade별 표시 점수는 반드시 밴드 안: good 7.0~9.8 / soso 4.0~6.9 / bad 0.5~3.9
// body 없음 3건(p9, p18, p27) · photos 0~3 · comments 2~5개
const COMMENT_POOL = [
  { userId: 'u2',  text: '여기 저도 다음 주에 갑니다. 좌표 감사해요' },
  { userId: 'u3',  text: '점수 보고 바로 위시에 넣었어요' },
  { userId: 'u4',  text: '오 이 집 웨이팅 어땠나요?' },
  { userId: 'u5',  text: '사진만 봐도 배고파지네요' },
  { userId: 'u6',  text: '이 동네에서 이 점수면 가야죠' },
  { userId: 'u7',  text: '저는 그저였는데 취향 차이인가 봐요' },
  { userId: 'u8',  text: '매운 옵션 있나요?' },
  { userId: 'u9',  text: '국물 온도 몇 점인가요 (진지)' },
  { userId: 'u10', text: '디저트 라인업도 궁금해요' },
]
const commentsFor = (seed, count) =>
  Array.from({ length: count }, (_, i) => {
    const c = COMMENT_POOL[(seed + i * 3) % COMMENT_POOL.length]
    return { id: `c${seed}-${i}`, userId: c.userId, text: c.text, createdAt: `${(i + 1) * 2}시간 전` }
  })

export const posts = [
  { id: 'p1',  userId: 'u2',  restaurantId: 'r13', grade: 'good', score: 9.2, body: '평양냉면은 여기서 끝났다. 육수가 소름 돋게 맑은데 감칠맛은 다 있다.', photoCount: 2, likes: 48, commentCount: 5, createdAt: '10분 전',  comments: commentsFor(1, 5) },
  { id: 'p2',  userId: 'u4',  restaurantId: 'r19', grade: 'good', score: 8.9, body: '냉붓카케 면발이 살아있음. 웨이팅 20분 값은 한다.', photoCount: 1, likes: 35, commentCount: 3, createdAt: '32분 전',  comments: commentsFor(2, 3) },
  { id: 'p3',  userId: 'u5',  restaurantId: 'r4',  grade: 'good', score: 9.5, body: '소금빵 겉바속촉의 교과서. 오전 11시 전에 가야 따뜻한 걸 잡는다.', photoCount: 3, likes: 87, commentCount: 4, createdAt: '1시간 전', comments: commentsFor(3, 4) },
  { id: 'p4',  userId: 'u3',  restaurantId: 'r8',  grade: 'good', score: 8.4, body: '새우완탕 여섯 개가 전부 실하다. 혼밥 최적.', photoCount: 1, likes: 22, commentCount: 2, createdAt: '2시간 전', comments: commentsFor(4, 2) },
  { id: 'p5',  userId: 'u9',  restaurantId: 'r1',  grade: 'good', score: 8.1, body: '수제비 국물이 걸쭉하지 않고 개운한 쪽. 감자전은 필수 주문.', photoCount: 2, likes: 31, commentCount: 3, createdAt: '3시간 전', comments: commentsFor(5, 3) },
  { id: 'p6',  userId: 'u7',  restaurantId: 'r24', grade: 'soso', score: 5.8, body: '분위기는 좋은데 커피가 평범했다. 자리 잡고 일하기엔 괜찮음.', photoCount: 1, likes: 9,  commentCount: 2, createdAt: '4시간 전', comments: commentsFor(6, 2) },
  { id: 'p7',  userId: 'u8',  restaurantId: 'r21', grade: 'soso', score: 6.2, body: '고추짬뽕이 맵기만 하고 깊이가 아쉬움. 멘보샤는 훌륭.', photoCount: 2, likes: 14, commentCount: 3, createdAt: '5시간 전', comments: commentsFor(7, 3) },
  { id: 'p8',  userId: 'u6',  restaurantId: 'r16', grade: 'good', score: 7.8, body: '새벽 1시에 먹는 양꼬치는 반칙이다.', photoCount: 3, likes: 41, commentCount: 4, createdAt: '6시간 전', comments: commentsFor(8, 4) },
  { id: 'p9',  userId: 'u10', restaurantId: 'r11', grade: 'good', score: 8.6, body: '', photoCount: 2, likes: 27, commentCount: 2, createdAt: '7시간 전', comments: commentsFor(9, 2) },
  { id: 'p10', userId: 'u2',  restaurantId: 'r14', grade: 'bad',  score: 3.1, body: '라볶이 면이 다 불어서 나옴. 김밥은 무난했다.', photoCount: 1, likes: 6,  commentCount: 3, createdAt: '9시간 전', comments: commentsFor(10, 3) },
  { id: 'p11', userId: 'u4',  restaurantId: 'r2',  grade: 'good', score: 9.0, body: '쇼유라멘 국물이 무겁지 않아서 마지막 한 방울까지 갔다.', photoCount: 2, likes: 53, commentCount: 5, createdAt: '11시간 전', comments: commentsFor(11, 5) },
  { id: 'p12', userId: 'u1',  restaurantId: 'r3',  grade: 'soso', score: 6.5, body: '들기름크림은 반쯤 먹으면 물린다. 뇨끼가 더 나았음.', photoCount: 1, likes: 12, commentCount: 2, createdAt: '12시간 전', comments: commentsFor(12, 2) },
  { id: 'p13', userId: 'u5',  restaurantId: 'r22', grade: 'good', score: 8.3, body: '클래식 티라미수 크림 비율이 완벽. 말차는 호불호.', photoCount: 2, likes: 33, commentCount: 3, createdAt: '14시간 전', comments: commentsFor(13, 3) },
  { id: 'p14', userId: 'u3',  restaurantId: 'r9',  grade: 'good', score: 7.6, body: '곱창 초벌이 잘 돼 나와서 냄새 없이 고소하다. 볶음밥 마무리 국룰.', photoCount: 3, likes: 45, commentCount: 4, createdAt: '16시간 전', comments: commentsFor(14, 4) },
  { id: 'p15', userId: 'u9',  restaurantId: 'r23', grade: 'soso', score: 5.4, body: '바지락은 실한데 육수가 좀 밍밍. 보리밥 추가는 옳다.', photoCount: 0, likes: 8,  commentCount: 2, createdAt: '18시간 전', comments: commentsFor(15, 2) },
  { id: 'p16', userId: 'u6',  restaurantId: 'r17', grade: 'good', score: 8.0, body: '규동 위 온센타마고가 다 했다. 회전 빨라서 혼밥 좋음.', photoCount: 1, likes: 19, commentCount: 3, createdAt: '20시간 전', comments: commentsFor(16, 3) },
  { id: 'p17', userId: 'u8',  restaurantId: 'r12', grade: 'good', score: 7.4, body: '기본떡볶이가 맵찔이도 매운맛 러버도 다 잡는 밸런스.', photoCount: 2, likes: 26, commentCount: 4, createdAt: '어제', comments: commentsFor(17, 4) },
  { id: 'p18', userId: 'u7',  restaurantId: 'r15', grade: 'soso', score: 6.0, body: '', photoCount: 1, likes: 7,  commentCount: 2, createdAt: '어제', comments: commentsFor(18, 2) },
  { id: 'p19', userId: 'u10', restaurantId: 'r20', grade: 'good', score: 8.8, body: '씨앗호떡 2천 원의 행복. 시장 안쪽 줄이 진짜다.', photoCount: 1, likes: 62, commentCount: 5, createdAt: '어제', comments: commentsFor(19, 5) },
  { id: 'p20', userId: 'u2',  restaurantId: 'r10', grade: 'good', score: 9.6, body: '런치 오마카세 가성비 미쳤다. 예약은 한 달 전에.', photoCount: 3, likes: 94, commentCount: 5, createdAt: '어제', comments: commentsFor(20, 5) },
  { id: 'p21', userId: 'u4',  restaurantId: 'r5',  grade: 'soso', score: 6.7, body: '반찬이 정갈한데 메인 임팩트가 약함. 점심으론 합격.', photoCount: 1, likes: 11, commentCount: 2, createdAt: '2일 전', comments: commentsFor(21, 2) },
  { id: 'p22', userId: 'u1',  restaurantId: 'r2',  grade: 'good', score: 8.7, body: '재방문. 역시 바 자리에서 먹어야 제맛.', photoCount: 1, likes: 17, commentCount: 3, createdAt: '2일 전', comments: commentsFor(22, 3) },
  { id: 'p23', userId: 'u5',  restaurantId: 'r6',  grade: 'soso', score: 5.1, body: '케이크는 좋았지만 커피가 아쉬웠다.', photoCount: 2, likes: 10, commentCount: 2, createdAt: '2일 전', comments: commentsFor(23, 2) },
  { id: 'p24', userId: 'u9',  restaurantId: 'r18', grade: 'bad',  score: 2.8, body: '스테이크가 주문한 굽기보다 한참 오버. 다시 갈 일은 없을 듯.', photoCount: 1, likes: 5,  commentCount: 3, createdAt: '3일 전', comments: commentsFor(24, 3) },
  { id: 'p25', userId: 'u3',  restaurantId: 'r7',  grade: 'good', score: 8.2, body: '에그베네딕트 소스가 안 느끼한 게 포인트. 주말은 예약 추천.', photoCount: 2, likes: 29, commentCount: 4, createdAt: '3일 전', comments: commentsFor(25, 4) },
  { id: 'p26', userId: 'u6',  restaurantId: 'r13', grade: 'good', score: 8.5, body: '냉면 앞에 제육 하나는 국룰. 겨울 냉면이 진짜다.', photoCount: 0, likes: 21, commentCount: 2, createdAt: '4일 전', comments: commentsFor(26, 2) },
  { id: 'p27', userId: 'u8',  restaurantId: 'r19', grade: 'good', score: 8.4, body: '', photoCount: 3, likes: 38, commentCount: 3, createdAt: '4일 전', comments: commentsFor(27, 3) },
  { id: 'p28', userId: 'u7',  restaurantId: 'r4',  grade: 'good', score: 8.9, body: '휘낭시에는 이 집이 서울 상위권. 포장해도 다음 날까지 촉촉.', photoCount: 1, likes: 44, commentCount: 4, createdAt: '5일 전', comments: commentsFor(28, 4) },
  { id: 'p29', userId: 'u10', restaurantId: 'r24', grade: 'bad',  score: 3.6, body: '쑥라떼가 가루 맛이 너무 강했다. 뷰 하나는 인정.', photoCount: 1, likes: 4,  commentCount: 2, createdAt: '5일 전', comments: commentsFor(29, 2) },
  { id: 'p30', userId: 'u1',  restaurantId: 'r20', grade: 'good', score: 7.9, body: '퇴근길에 하나 물고 걸으면 하루가 리셋된다.', photoCount: 1, likes: 15, commentCount: 2, createdAt: '6일 전', comments: commentsFor(30, 2) },
]

// ── myList: 내 리스트 (S5) — good 8 · soso 5 · bad 3, 그룹 내 점수 내림차순 ──
// 밴드 강제: good 7.0~9.8 / soso 4.0~6.9 / bad 0.5~3.9
export const myList = {
  good: [
    { restaurantId: 'r10', score: 9.4 },
    { restaurantId: 'r2',  score: 9.1 },
    { restaurantId: 'r4',  score: 8.8 },
    { restaurantId: 'r13', score: 8.6 },
    { restaurantId: 'r19', score: 8.3 },
    { restaurantId: 'r8',  score: 8.0 },
    { restaurantId: 'r20', score: 7.7 },
    { restaurantId: 'r9',  score: 7.2 },
  ],
  soso: [
    { restaurantId: 'r7',  score: 6.8 },
    { restaurantId: 'r3',  score: 6.3 },
    { restaurantId: 'r15', score: 5.7 },
    { restaurantId: 'r23', score: 5.0 },
    { restaurantId: 'r6',  score: 4.4 },
  ],
  bad: [
    { restaurantId: 'r24', score: 3.5 },
    { restaurantId: 'r18', score: 2.6 },
    { restaurantId: 'r14', score: 1.8 },
  ],
}

// ── wishes 6건 (게시물 저장 3 + 가게 찜 3) ──
export const wishes = [
  { id: 'w1', type: 'post',       postId: 'p20',      savedAt: '어제' },
  { id: 'w2', type: 'post',       postId: 'p3',       savedAt: '2일 전' },
  { id: 'w3', type: 'post',       postId: 'p19',      savedAt: '4일 전' },
  { id: 'w4', type: 'restaurant', restaurantId: 'r11', savedAt: '3일 전' },
  { id: 'w5', type: 'restaurant', restaurantId: 'r22', savedAt: '5일 전' },
  { id: 'w6', type: 'restaurant', restaurantId: 'r16', savedAt: '1주 전' },
]

// ── notifications 8건 (팔로우/좋아요/댓글/랭킹) ──
export const notifications = [
  { id: 'n1', type: 'follow',  userId: 'u4',  text: '면식수행자님이 나를 팔로우하기 시작했어요',            createdAt: '5분 전',  targetScreen: 'S10' },
  { id: 'n2', type: 'like',    userId: 'u2',  text: '골목미식가님이 내 기록을 좋아해요 — 온기제면소',        createdAt: '1시간 전', targetScreen: 'S17', postId: 'p22' },
  { id: 'n3', type: 'comment', userId: 'u9',  text: '국물장인님이 댓글을 남겼어요 — "국물 온도 몇 점인가요"', createdAt: '3시간 전', targetScreen: 'S17', postId: 'p22' },
  { id: 'n4', type: 'ranking', text: '이번 주 친구 랭킹 7위 — 2계단 올랐어요',                              createdAt: '5시간 전', targetScreen: 'S11' },
  { id: 'n5', type: 'like',    userId: 'u5',  text: '성수브레드님이 내 기록을 좋아해요 — 망원시장 호떡',      createdAt: '어제',    targetScreen: 'S17', postId: 'p30' },
  { id: 'n6', type: 'follow',  userId: 'u10', text: '디저트순례님이 나를 팔로우하기 시작했어요',              createdAt: '2일 전',  targetScreen: 'S10' },
  { id: 'n7', type: 'comment', userId: 'u7',  text: '담백한입님이 댓글을 남겼어요 — "취향 차이인가 봐요"',    createdAt: '3일 전',  targetScreen: 'S17', postId: 'p12' },
  { id: 'n8', type: 'ranking', text: '성수 동네 랭킹에 진입했어요 — 12위',                                  createdAt: '4일 전',  targetScreen: 'S11' },
]

// ── ranking 15명 (미식가 랭킹, 내 계정 7위) ──
export const ranking = [
  { rank: 1,  userId: 'u4',  nickname: '면식수행자', reviewCount: 214, delta: 0,  isMe: false },
  { rank: 2,  userId: 'u2',  nickname: '골목미식가', reviewCount: 128, delta: 1,  isMe: false },
  { rank: 3,  userId: 'u9',  nickname: '국물장인',   reviewCount: 103, delta: -1, isMe: false },
  { rank: 4,  userId: 'u3',  nickname: '연남포크',   reviewCount: 87,  delta: 0,  isMe: false },
  { rank: 5,  userId: 'u8',  nickname: '매운맛수집', reviewCount: 71,  delta: 2,  isMe: false },
  { rank: 6,  userId: 'u5',  nickname: '성수브레드', reviewCount: 64,  delta: 0,  isMe: false },
  { rank: 7,  userId: 'u1',  nickname: '정주',       reviewCount: 16,  delta: 2,  isMe: true, percentile: 12 },
  { rank: 8,  userId: 'u10', nickname: '디저트순례', reviewCount: 58,  delta: -2, isMe: false },
  { rank: 9,  userId: 'u6',  nickname: '야식탐험대', reviewCount: 45,  delta: 1,  isMe: false },
  { rank: 10, userId: 'u7',  nickname: '담백한입',   reviewCount: 39,  delta: -1, isMe: false },
  { rank: 11, nickname: '오늘도국밥',  reviewCount: 34, delta: 0,  isMe: false },
  { rank: 12, nickname: '초밥지킴이',  reviewCount: 29, delta: 3,  isMe: false },
  { rank: 13, nickname: '골목빵순이',  reviewCount: 25, delta: -1, isMe: false },
  { rank: 14, nickname: '한입만줘',    reviewCount: 21, delta: 0,  isMe: false },
  { rank: 15, nickname: '늦은저녁',    reviewCount: 18, delta: -2, isMe: false },
]

// ── restaurantRanking 10곳 (식당 랭킹 M3) ──
export const restaurantRanking = [
  { rank: 1,  restaurantId: 'r10', delta: 0 },
  { rank: 2,  restaurantId: 'r2',  delta: 1 },
  { rank: 3,  restaurantId: 'r4',  delta: -1 },
  { rank: 4,  restaurantId: 'r19', delta: 0 },
  { rank: 5,  restaurantId: 'r8',  delta: 2 },
  { rank: 6,  restaurantId: 'r13', delta: -1 },
  { rank: 7,  restaurantId: 'r1',  delta: 0 },
  { rank: 8,  restaurantId: 'r7',  delta: 1 },
  { rank: 9,  restaurantId: 'r11', delta: -2 },
  { rank: 10, restaurantId: 'r22', delta: 0 },
]

// ── tasteDNA (S10 취향 DNA — 카테고리 5 + 가격대 3 + 등급 분포) ──
export const tasteDNA = {
  categories: [
    { name: '일식',   pct: 31 },
    { name: '한식',   pct: 25 },
    { name: '디저트', pct: 19 },
    { name: '분식',   pct: 13 },
    { name: '양식',   pct: 12 },
  ],
  priceBands: [
    { name: '1만원 미만',  pct: 44 },
    { name: '1~3만원',    pct: 38 },
    { name: '3만원 이상',  pct: 18 },
  ],
  gradeDist: { good: 8, soso: 5, bad: 3 },
}

// ── 검색 추천어 / 지역 옵션 ──
export const searchSuggests = ['평양냉면', '성수 베이커리', '오마카세', '연남 브런치', '망원시장', '을지로 노포']

export const regionOptions = ['성수', '연남', '을지로', '망원', '한남', '서촌', '익선동', '송리단길']

// ── 조회 헬퍼 ──
export const getUser = (id) => users.find((u) => u.id === id)
export const getRestaurant = (id) => restaurants.find((r) => r.id === id)
export const getPost = (id) => posts.find((p) => p.id === id)
