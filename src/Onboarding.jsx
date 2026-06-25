import { useState } from "react";

const T = {
  bg: "#0A0A0F", surface: "#13131A", card: "#1A1A24",
  border: "#2A2A3A", borderLight: "#333344",
  text: "#F0F0F8", textSub: "#8888AA", textDim: "#55556A",
};

const TEMPLATES = [
  {
    id: "empty",
    emoji: "✏️",
    title: "직접 만들기",
    desc: "빈 루틴에서 처음부터 나만의 루틴을 설계해요",
    color: "#8888AA",
    routines: {
      weekday: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
    },
  },
  {
    id: "godlife",
    emoji: "⚡",
    title: "갓생형",
    desc: "공부 · 운동 · 독서 · 루틴 관리까지 완벽한 하루",
    color: "#FBBF24",
    routines: {
      weekday: [
        { id: "g-read",    category: "공부", label: "독서 30분",         note: "아침 자투리", time: "" },
        { id: "g-news",    category: "공부", label: "뉴스 & 시사",       note: "자투리 시간", time: "" },
        { id: "g-study1",  category: "공부", label: "주요 과목 공부",    note: "2시간",       time: "19:00" },
        { id: "g-study2",  category: "공부", label: "복습 & 정리",       note: "1시간",       time: "21:00" },
        { id: "g-journal", category: "공부", label: "하루 일기 & 회고",  note: "10분",        time: "23:00" },
        { id: "g-sleep",   category: "휴식", label: "취침",              note: "",            time: "23:30" },
      ],
      mon: [
        { id: "g-ex-mon", category: "운동", label: "전신 웨이트",  note: "1시간", time: "07:00" },
        { id: "g-m-mon",  category: "식단", label: "고단백 식단",  note: "3끼",   time: "" },
      ],
      tue: [
        { id: "g-ex-tue", category: "운동", label: "유산소 30분",  note: "달리기", time: "07:00" },
        { id: "g-m-tue",  category: "식단", label: "고단백 식단",  note: "3끼",   time: "" },
      ],
      wed: [
        { id: "g-ex-wed", category: "운동", label: "상체 웨이트",  note: "1시간", time: "07:00" },
        { id: "g-m-wed",  category: "식단", label: "고단백 식단",  note: "3끼",   time: "" },
      ],
      thu: [
        { id: "g-ex-thu", category: "운동", label: "유산소 30분",  note: "달리기", time: "07:00" },
        { id: "g-m-thu",  category: "식단", label: "고단백 식단",  note: "3끼",   time: "" },
      ],
      fri: [
        { id: "g-ex-fri", category: "운동", label: "하체 웨이트",  note: "1시간", time: "07:00" },
        { id: "g-m-fri",  category: "식단", label: "고단백 식단",  note: "3끼",   time: "" },
      ],
      sat: [
        { id: "g-ex-sat",   category: "운동", label: "주말 액티비티", note: "등산 · 자전거 등", time: "" },
        { id: "g-read-sat", category: "공부", label: "독서 1시간",    note: "",               time: "" },
        { id: "g-rest-sat", category: "휴식", label: "충분한 휴식",   note: "",               time: "" },
      ],
      sun: [
        { id: "g-plan-sun", category: "공부", label: "주간 계획 세우기", note: "30분",  time: "" },
        { id: "g-read-sun", category: "공부", label: "독서 1시간",       note: "",     time: "" },
        { id: "g-rest-sun", category: "휴식", label: "충분한 휴식",      note: "",     time: "" },
      ],
    },
  },
  {
    id: "diet",
    emoji: "🔥",
    title: "다이어트형",
    desc: "운동 · 식단 관리 중심의 체중 감량 루틴",
    color: "#F87171",
    routines: {
      weekday: [
        { id: "d-water",  category: "식단", label: "기상 후 물 500ml",  note: "공복",        time: "" },
        { id: "d-meal1",  category: "식단", label: "아침 단백질 식사",  note: "달걀·닭가슴살", time: "" },
        { id: "d-meal2",  category: "식단", label: "점심 저칼로리식",   note: "샐러드·현미",  time: "" },
        { id: "d-meal3",  category: "식단", label: "저녁 가볍게",       note: "야채 위주",    time: "18:00" },
        { id: "d-steps",  category: "운동", label: "만보 걷기",         note: "목표 10,000보", time: "" },
        { id: "d-log",    category: "식단", label: "칼로리 기록",       note: "앱 기록",      time: "21:00" },
      ],
      mon: [{ id: "d-ex-mon", category: "운동", label: "전신 유산소",  note: "40분", time: "07:00" }],
      tue: [{ id: "d-ex-tue", category: "운동", label: "하체 근력",    note: "40분", time: "07:00" }],
      wed: [{ id: "d-ex-wed", category: "운동", label: "유산소 인터벌",note: "30분", time: "07:00" }],
      thu: [{ id: "d-ex-thu", category: "운동", label: "상체 근력",    note: "40분", time: "07:00" }],
      fri: [{ id: "d-ex-fri", category: "운동", label: "전신 유산소",  note: "40분", time: "07:00" }],
      sat: [
        { id: "d-ex-sat",  category: "운동", label: "야외 운동",       note: "등산 · 자전거", time: "" },
        { id: "d-cheat",   category: "식단", label: "치팅밀 (선택)",   note: "주 1회 허용",  time: "" },
        { id: "d-rest-sat",category: "휴식", label: "충분한 휴식",     note: "",             time: "" },
      ],
      sun: [
        { id: "d-prep-sun", category: "식단", label: "주간 식단 준비", note: "밀프렙",        time: "" },
        { id: "d-rest-sun", category: "휴식", label: "충분한 휴식",    note: "",              time: "" },
      ],
    },
  },
  {
    id: "study",
    emoji: "📚",
    title: "열공형",
    desc: "시험 · 자격증 준비를 위한 집중 학습 루틴",
    color: "#60A5FA",
    routines: {
      weekday: [
        { id: "s-review",  category: "공부", label: "전날 복습",       note: "30분",     time: "" },
        { id: "s-main1",   category: "공부", label: "주요 과목 1",     note: "2시간",    time: "09:00" },
        { id: "s-break1",  category: "휴식", label: "휴식 & 산책",     note: "15분",     time: "11:00" },
        { id: "s-main2",   category: "공부", label: "주요 과목 2",     note: "2시간",    time: "14:00" },
        { id: "s-vocab",   category: "공부", label: "단어 & 암기",     note: "30분",     time: "17:00" },
        { id: "s-mock",    category: "공부", label: "모의고사 / 문제풀이", note: "1시간", time: "19:00" },
        { id: "s-summary", category: "공부", label: "오늘 내용 정리",  note: "30분",     time: "21:00" },
        { id: "s-sleep",   category: "휴식", label: "취침",            note: "",         time: "23:00" },
      ],
      mon: [], tue: [], wed: [], thu: [], fri: [],
      sat: [
        { id: "s-fullday-sat", category: "공부", label: "전과목 총복습", note: "4시간", time: "" },
        { id: "s-rest-sat",    category: "휴식", label: "충분한 휴식",   note: "",     time: "" },
      ],
      sun: [
        { id: "s-weak-sun",  category: "공부", label: "취약 파트 집중", note: "3시간", time: "" },
        { id: "s-plan-sun",  category: "공부", label: "주간 학습 계획", note: "30분",  time: "" },
        { id: "s-rest-sun",  category: "휴식", label: "충분한 휴식",    note: "",      time: "" },
      ],
    },
  },
  {
    id: "balance",
    emoji: "🌿",
    title: "밸런스형",
    desc: "일 · 운동 · 취미 · 휴식의 균형 잡힌 루틴",
    color: "#34D399",
    routines: {
      weekday: [
        { id: "b-morning", category: "휴식", label: "아침 명상 & 스트레칭", note: "10분",  time: "" },
        { id: "b-work",    category: "공부", label: "집중 업무 & 공부",      note: "3시간", time: "10:00" },
        { id: "b-hobby",   category: "휴식", label: "취미 활동",             note: "30분",  time: "19:00" },
        { id: "b-book",    category: "공부", label: "독서",                  note: "30분",  time: "21:00" },
        { id: "b-sleep",   category: "휴식", label: "취침",                  note: "",      time: "23:00" },
      ],
      mon: [{ id: "b-ex-mon", category: "운동", label: "유산소 운동", note: "30분", time: "07:00" }],
      tue: [{ id: "b-ex-tue", category: "운동", label: "근력 운동",   note: "40분", time: "07:00" }],
      wed: [{ id: "b-ex-wed", category: "운동", label: "요가 & 스트레칭", note: "30분", time: "07:00" }],
      thu: [{ id: "b-ex-thu", category: "운동", label: "유산소 운동", note: "30분", time: "07:00" }],
      fri: [{ id: "b-ex-fri", category: "운동", label: "근력 운동",   note: "40분", time: "07:00" }],
      sat: [
        { id: "b-social-sat", category: "휴식", label: "사람 만나기 & 소셜", note: "",     time: "" },
        { id: "b-hobby-sat",  category: "휴식", label: "취미 & 여가",        note: "2시간", time: "" },
        { id: "b-rest-sat",   category: "휴식", label: "충분한 휴식",         note: "",     time: "" },
      ],
      sun: [
        { id: "b-prep-sun", category: "공부", label: "주간 계획 & 준비", note: "30분", time: "" },
        { id: "b-rest-sun", category: "휴식", label: "완전한 휴식",       note: "",     time: "" },
      ],
    },
  },
];

export default function Onboarding({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1); // 1: select, 2: confirm

  function handleSelect(t) {
    setSelected(t);
    setStep(2);
  }

  function handleConfirm() {
    onSelect(selected.routines);
  }

  return (
    <div style={{ minHeight:"100dvh", background:T.bg, color:T.text, display:"flex", flexDirection:"column", padding:"40px 20px 60px" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {step === 1 && (
        <div style={{ animation:"fadeIn 0.4s ease", maxWidth:480, margin:"0 auto", width:"100%" }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👋</div>
            <div style={{ fontSize:24, fontWeight:800, marginBottom:8, letterSpacing:"-0.5px" }}>어떤 루틴으로 시작할까요?</div>
            <div style={{ fontSize:14, color:T.textSub, lineHeight:1.6 }}>나중에 언제든지 루틴 편집에서<br/>수정하거나 추가할 수 있어요</div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {TEMPLATES.map(t => (
              <div key={t.id} onClick={() => handleSelect(t)} style={{
                background:T.surface, border:`1px solid ${T.border}`,
                borderRadius:16, padding:"18px 20px", cursor:"pointer",
                transition:"all 0.2s", display:"flex", alignItems:"center", gap:16,
              }}>
                <div style={{ fontSize:32, flexShrink:0, width:48, height:48, background:T.card, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>{t.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:700, color:t.color, marginBottom:4 }}>{t.title}</div>
                  <div style={{ fontSize:13, color:T.textSub, lineHeight:1.5 }}>{t.desc}</div>
                </div>
                <div style={{ color:T.textDim, fontSize:20 }}>›</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selected && (
        <div style={{ animation:"fadeIn 0.3s ease", maxWidth:480, margin:"0 auto", width:"100%" }}>
          <button onClick={() => setStep(1)} style={{ background:"none", border:"none", color:T.textSub, cursor:"pointer", fontSize:14, marginBottom:20, fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>‹ 뒤로</button>

          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>{selected.emoji}</div>
            <div style={{ fontSize:22, fontWeight:800, color:selected.color, marginBottom:6 }}>{selected.title}</div>
            <div style={{ fontSize:13, color:T.textSub }}>{selected.desc}</div>
          </div>

          {/* Preview */}
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"16px", marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.textDim, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>루틴 미리보기</div>
            {selected.id === "empty" ? (
              <div style={{ textAlign:"center", padding:"20px 0", color:T.textDim, fontSize:13 }}>빈 루틴에서 시작해요<br/>직접 항목을 추가해보세요 ✏️</div>
            ) : (
              <>
                {selected.routines.weekday.length > 0 && (
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:11, color:T.textDim, marginBottom:6 }}>📅 평일 공통</div>
                    {selected.routines.weekday.slice(0,4).map(item => (
                      <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid ${T.border}` }}>
                        <div style={{ width:4, height:4, borderRadius:"50%", background: item.category==="공부"?"#60A5FA":item.category==="운동"?"#34D399":item.category==="식단"?"#FBBF24":"#A78BFA", flexShrink:0 }}/>
                        <span style={{ fontSize:13, color:T.textSub }}>{item.label}</span>
                        {item.time && <span style={{ fontSize:11, color:T.textDim, marginLeft:"auto" }}>{item.time}</span>}
                      </div>
                    ))}
                    {selected.routines.weekday.length > 4 && (
                      <div style={{ fontSize:11, color:T.textDim, marginTop:6, textAlign:"center" }}>+{selected.routines.weekday.length-4}개 더...</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <button onClick={handleConfirm} style={{
            width:"100%", background:selected.color, border:"none", borderRadius:14,
            color: "#0A0A0F", padding:"16px", fontSize:15, fontWeight:800,
            cursor:"pointer", fontFamily:"inherit", transition:"opacity 0.2s",
          }}>
            이 루틴으로 시작하기 →
          </button>
        </div>
      )}
    </div>
  );
}
