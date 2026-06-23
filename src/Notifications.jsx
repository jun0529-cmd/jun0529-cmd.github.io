import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const DEFAULT_SCHEDULES = [
  { id: "morning",  title: "🌅 아침 루틴", body: "오늘 루틴을 시작해요!", time: "06:00", enabled: false },
  { id: "study",    title: "📖 공부 시작", body: "리트 공부 시간이에요!", time: "17:00", enabled: false },
  { id: "night1",   title: "🌙 점호 후 루틴", body: "보충 공부 시간이에요!", time: "22:00", enabled: false },
  { id: "sleep",    title: "💤 취침 준비", body: "오늘 루틴 마무리해요!", time: "23:30", enabled: false },
];

const T = {
  bg: "#0A0A0F", surface: "#13131A", card: "#1A1A24",
  border: "#2A2A3A", borderLight: "#333344",
  text: "#F0F0F8", textSub: "#8888AA", textDim: "#55556A",
};

async function requestPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  const result = await Notification.requestPermission();
  return result;
}

async function registerSW() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw-notification.js", { scope: "/" });
    return reg;
  } catch (e) {
    console.error("SW register failed", e);
    return null;
  }
}

function sendSchedulesToSW(schedules) {
  if (!navigator.serviceWorker?.controller) return;
  navigator.serviceWorker.controller.postMessage({ type: "SCHEDULE_NOTIFICATIONS", schedules });
}

// AlarmClock-based fallback: use setInterval to check time every 30s
let alarmInterval = null;
function startAlarmClock(schedules) {
  if (alarmInterval) clearInterval(alarmInterval);
  alarmInterval = setInterval(() => {
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    schedules.filter(s => s.enabled && s.time === hhmm).forEach(s => {
      if (Notification.permission === "granted") {
        new Notification(s.title, { body: s.body, icon: "/icon-192.png" });
      }
    });
  }, 30000);
}

export default function NotificationSettings({ onClose }) {
  const [schedules, setSchedules] = useState(DEFAULT_SCHEDULES);
  const [permission, setPermission] = useState(Notification?.permission || "default");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadFromFirebase();
  }, []);

  async function loadFromFirebase() {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid, "config", "notifications"));
    if (snap.exists()) setSchedules(snap.data().schedules || DEFAULT_SCHEDULES);
  }

  async function handlePermission() {
    const result = await requestPermission();
    setPermission(result);
    if (result === "granted") await registerSW();
  }

  async function saveSchedules(newSchedules) {
    setSchedules(newSchedules);
    if (!auth.currentUser) return;
    await setDoc(doc(db, "users", auth.currentUser.uid, "config", "notifications"), { schedules: newSchedules });
    sendSchedulesToSW(newSchedules);
    startAlarmClock(newSchedules);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleSchedule(id) {
    saveSchedules(schedules.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  }

  function updateTime(id, time) {
    saveSchedules(schedules.map(s => s.id === id ? { ...s, time } : s));
  }

  function updateCustom(id, field, value) {
    saveSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  function addSchedule() {
    const id = `custom-${Date.now()}`;
    saveSchedules([...schedules, { id, title: "루틴 알림", body: "루틴을 확인해요!", time: "09:00", enabled: true }]);
  }

  function removeSchedule(id) {
    saveSchedules(schedules.filter(s => s.id !== id));
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"flex-end", backdropFilter:"blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:T.surface, borderRadius:"20px 20px 0 0", padding:"24px 20px 40px", width:"100%", maxHeight:"85vh", overflowY:"auto", border:`1px solid ${T.border}` }}>
        {/* Handle */}
        <div style={{ width:40, height:4, background:T.border, borderRadius:2, margin:"0 auto 20px" }}/>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:18, fontWeight:700, color:T.text }}>🔔 알림 설정</div>
          {saved && <span style={{ fontSize:12, color:"#34D399", fontWeight:600 }}>저장됨 ✓</span>}
        </div>

        {/* Permission */}
        {permission !== "granted" && (
          <div style={{ background:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.3)", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
            <div style={{ fontSize:13, color:"#60A5FA", marginBottom:8 }}>알림 권한이 필요해요</div>
            <button onClick={handlePermission} style={{ background:"#60A5FA", border:"none", borderRadius:8, color:"#0A0A0F", padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              알림 허용하기
            </button>
          </div>
        )}

        {permission === "denied" && (
          <div style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#F87171" }}>
            브라우저 설정에서 알림을 허용해주세요
          </div>
        )}

        {/* Schedules */}
        {schedules.map(s => (
          <div key={s.id} style={{ background:T.card, border:`1px solid ${s.enabled?T.borderLight:T.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: s.enabled ? 10 : 0 }}>
              {/* Toggle */}
              <div onClick={() => toggleSchedule(s.id)} style={{
                width:44, height:24, borderRadius:12, flexShrink:0,
                background: s.enabled ? "#60A5FA" : T.border,
                position:"relative", cursor:"pointer", transition:"all 0.2s",
              }}>
                <div style={{
                  width:18, height:18, borderRadius:"50%", background:"#fff",
                  position:"absolute", top:3, left: s.enabled ? 23 : 3,
                  transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)",
                }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color: s.enabled ? T.text : T.textSub }}>{s.title}</div>
                <div style={{ fontSize:11, color:T.textDim }}>{s.body}</div>
              </div>
              {/* Time */}
              <input type="time" value={s.time} onChange={e => updateTime(s.id, e.target.value)}
                style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, padding:"5px 8px", color:T.text, fontSize:13, fontFamily:"inherit", outline:"none" }}/>
              {/* Delete custom */}
              {!["morning","study","night1","sleep"].includes(s.id) && (
                <button onClick={() => removeSchedule(s.id)} style={{ background:"none", border:"none", color:T.textDim, cursor:"pointer", fontSize:16, padding:"0 4px" }}>×</button>
              )}
            </div>
          </div>
        ))}

        {/* Add */}
        <button onClick={addSchedule} style={{
          width:"100%", background:"transparent", border:`1.5px dashed ${T.border}`,
          borderRadius:14, color:T.textDim, padding:"12px", cursor:"pointer",
          fontSize:13, marginTop:4, fontFamily:"inherit",
        }}>+ 알림 추가</button>
      </div>
    </div>
  );
}

export function initNotifications(schedules) {
  if (!schedules) return;
  startAlarmClock(schedules);
  sendSchedulesToSW(schedules);
}
