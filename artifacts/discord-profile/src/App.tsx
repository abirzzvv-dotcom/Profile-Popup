import { useEffect, useRef, useState } from "react";

type Profile = {
  username: string;
  handle: string;
  initials: string;
  avatar: string;
  tagline: string;
  bio: string;
  description: string;
  status: string;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  accent: string;
  ext: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  link: string;
  language: string;
  langColor: string;
  tags: string[];
};

type Ongoing = Project & { progress: number };

const BASE = import.meta.env.BASE_URL;
const MAX_DESC = 65;

function clip(s: string) {
  return s.length > MAX_DESC ? s.slice(0, MAX_DESC) + "…" : s;
}

function BadgePopup({ badge }: { badge: Badge }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "calc(100% + 10px)",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#111214",
      border: `1px solid ${badge.accent}44`,
      borderRadius: "10px",
      padding: "12px 14px",
      width: "210px",
      zIndex: 999,
      pointerEvents: "none",
      boxShadow: `0 4px 20px rgba(0,0,0,0.7), 0 0 0 1px ${badge.accent}22`,
      animation: "popIn 0.18s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
        <div style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          background: badge.accent + "22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${badge.accent}44`,
          flexShrink: 0,
        }}>
          <img
            src={`${BASE}badges/${badge.id}.${badge.ext}`}
            alt={badge.name}
            style={{ width: "22px", height: "22px", objectFit: "contain" }}
          />
        </div>
        <div style={{ color: "#dcddde", fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}>
          {badge.name}
        </div>
      </div>
      <div style={{ color: "#72767d", fontSize: "11.5px", lineHeight: 1.5 }}>
        {badge.description}
      </div>
      <div style={{
        width: "100%",
        height: "2px",
        background: `linear-gradient(90deg, ${badge.accent}88, transparent)`,
        borderRadius: "2px",
        marginTop: "10px",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-5px",
        left: "50%",
        transform: "translateX(-50%) rotate(45deg)",
        width: "8px",
        height: "8px",
        background: "#111214",
        border: `1px solid ${badge.accent}44`,
        borderTop: "none",
        borderLeft: "none",
      }} />
    </div>
  );
}

function BadgeIcon({ badge, delay }: { badge: Badge; delay: number }) {
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  function click() {
    setShake(true);
    setShow(v => !v);
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div ref={ref} style={{
      position: "relative",
      opacity: entered ? 1 : 0,
      transform: entered ? "scale(1) translateY(0)" : "scale(0.5) translateY(6px)",
      transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div
        onClick={click}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          animation: shake ? "shake 0.42s ease" : "none",
          transition: "box-shadow 0.2s",
          position: "relative",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 10px ${badge.accent}88`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        <img
          src={`${BASE}badges/${badge.id}.${badge.ext}`}
          alt={badge.name}
          style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }}
        />
      </div>
      {show && <BadgePopup badge={badge} />}
    </div>
  );
}

function ProjCard({ p, delay }: { p: Project; delay: number }) {
  const [entered, setEntered] = useState(false);
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        background: hov ? "#1c1e21" : "#18191c",
        borderRadius: "10px",
        padding: "13px 15px",
        textDecoration: "none",
        border: `1px solid ${hov ? "#5865f2" : "#2e3035"}`,
        marginBottom: "8px",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.35s ease, transform 0.35s ease, border-color 0.2s, background 0.2s, box-shadow 0.2s",
        boxShadow: hov ? "0 4px 20px rgba(88,101,242,0.18), 0 1px 6px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hov && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #5865f2, #9c84fc)",
          borderRadius: "10px 10px 0 0",
        }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
        <span style={{ color: "#9c84fc", fontWeight: 700, fontSize: "13px", letterSpacing: "0.01em" }}>
          {p.name}
        </span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? "#9c84fc" : "#72767d"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px", transition: "stroke 0.2s" }}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </div>
      <div style={{ color: "#72767d", fontSize: "12px", marginBottom: "10px", lineHeight: 1.5 }}>
        {clip(p.description)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginRight: "4px" }}>
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: p.langColor, display: "inline-block", flexShrink: 0, boxShadow: `0 0 5px ${p.langColor}66` }} />
          <span style={{ color: "#9ea8b3", fontSize: "11px", fontWeight: 500 }}>{p.language}</span>
        </div>
        {p.tags.map(t => (
          <span key={t} style={{
            background: "#2a2b2f",
            color: "#9ea8b3",
            fontSize: "10px",
            padding: "2px 7px",
            borderRadius: "4px",
            border: "1px solid #2e3035",
            fontWeight: 500,
          }}>
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

function OngoingCard({ p, delay }: { p: Ongoing; delay: number }) {
  const [entered, setEntered] = useState(false);
  const [hov, setHov] = useState(false);
  const [barW, setBarW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setBarW(p.progress), 200);
    return () => clearTimeout(t);
  }, [entered, p.progress]);

  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        background: hov ? "#1c1e21" : "#18191c",
        borderRadius: "10px",
        padding: "13px 15px",
        textDecoration: "none",
        border: `1px solid ${hov ? "#9c84fc" : "#2e3035"}`,
        marginBottom: "8px",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.35s ease, transform 0.35s ease, border-color 0.2s, background 0.2s, box-shadow 0.2s",
        boxShadow: hov ? "0 4px 20px rgba(156,132,252,0.18), 0 1px 6px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hov && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #9c84fc, #5865f2)",
          borderRadius: "10px 10px 0 0",
        }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
        <span style={{ color: "#9c84fc", fontWeight: 700, fontSize: "13px" }}>{p.name}</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? "#9c84fc" : "#72767d"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px", transition: "stroke 0.2s" }}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </div>
      <div style={{ color: "#72767d", fontSize: "12px", marginBottom: "10px", lineHeight: 1.5 }}>
        {clip(p.description)}
      </div>
      <div ref={ref} style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span style={{ color: "#72767d", fontSize: "10.5px", fontWeight: 500, letterSpacing: "0.03em", textTransform: "uppercase" }}>
            Progress
          </span>
          <span style={{ color: "#9c84fc", fontSize: "10.5px", fontWeight: 700 }}>{p.progress}%</span>
        </div>
        <div style={{ background: "#2a2b2f", borderRadius: "6px", height: "7px", overflow: "hidden", position: "relative" }}>
          <div style={{
            width: `${barW}%`,
            height: "100%",
            background: "linear-gradient(90deg, #5865f2, #9c84fc)",
            borderRadius: "6px",
            transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "60%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              animation: "shimmer 2.2s ease-in-out infinite",
            }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginRight: "4px" }}>
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: p.langColor, display: "inline-block", flexShrink: 0, boxShadow: `0 0 5px ${p.langColor}66` }} />
          <span style={{ color: "#9ea8b3", fontSize: "11px", fontWeight: 500 }}>{p.language}</span>
        </div>
        {p.tags.map(t => (
          <span key={t} style={{
            background: "#2a2b2f",
            color: "#9ea8b3",
            fontSize: "10px",
            padding: "2px 7px",
            borderRadius: "4px",
            border: "1px solid #2e3035",
            fontWeight: 500,
          }}>
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [ongoing, setOngoing] = useState<Ongoing[]>([]);
  const [tab, setTab] = useState<"projects" | "ongoing">("projects");
  const [imgErr, setImgErr] = useState(false);
  const [cardIn, setCardIn] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}data/profile.json`).then(r => r.json()),
      fetch(`${BASE}data/badges.json`).then(r => r.json()),
      fetch(`${BASE}data/projects.json`).then(r => r.json()),
      fetch(`${BASE}data/ongoing.json`).then(r => r.json()),
    ]).then(([p, b, pr, on]) => {
      setProfile(p);
      setBadges(b);
      setProjects(pr);
      setOngoing(on);
      setTimeout(() => setCardIn(true), 60);
    });
  }, []);

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f0f10", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#5865f2",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
    );
  }

  const dot = profile.status === "online" ? "#3ba55c" : profile.status === "idle" ? "#faa81a" : "#747f8d";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f10",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes shake {
          0%,100% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-12deg) scale(1.1); }
          30% { transform: rotate(12deg) scale(1.1); }
          45% { transform: rotate(-8deg) scale(1.05); }
          60% { transform: rotate(8deg) scale(1.05); }
          75% { transform: rotate(-4deg) scale(1.02); }
          90% { transform: rotate(4deg) scale(1.02); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: translateX(-50%) scale(0.85) translateY(6px); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bioShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2e3035; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #5865f2; }
      `}</style>

      <div style={{
        background: "#1e1f22",
        borderRadius: "14px",
        width: "340px",
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)",
        opacity: cardIn ? 1 : 0,
        transform: cardIn ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
        transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          height: "96px",
          background: "linear-gradient(180deg, #000000 0%, #0a0a0b 100%)",
          position: "relative",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 30% 50%, rgba(88,101,242,0.08) 0%, transparent 60%)",
          }} />
        </div>

        <div style={{ padding: "0 16px 16px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-44px", marginBottom: "12px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{
                width: "84px",
                height: "84px",
                borderRadius: "50%",
                padding: "4px",
                background: "linear-gradient(135deg, #5865f244 0%, #9c84fc44 100%)",
                boxShadow: "0 0 0 3px #1e1f22, 0 0 16px rgba(88,101,242,0.25)",
              }}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#5865f2",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {!imgErr ? (
                    <img
                      src={profile.avatar}
                      alt={profile.username}
                      onError={() => setImgErr(true)}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#fff", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>
                      {profile.initials}
                    </span>
                  )}
                </div>
              </div>
              <div style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: dot,
                border: "3px solid #1e1f22",
                boxShadow: `0 0 8px ${dot}88`,
              }} />
            </div>
          </div>

          <div style={{ marginBottom: "13px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "7px", flexWrap: "wrap" }}>
              <span style={{ color: "#f2f3f5", fontWeight: 800, fontSize: "19px", letterSpacing: "-0.3px" }}>
                {profile.username}
              </span>
              <span style={{ color: "#72767d", fontSize: "13px", fontWeight: 400 }}>@{profile.handle}</span>
            </div>
            <div style={{
              color: "#9ea8b3",
              fontSize: "12px",
              marginTop: "3px",
              fontStyle: "italic",
              opacity: 0.85,
            }}>
              {profile.tagline}
            </div>
          </div>

          <div style={{
            background: "#111214",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "14px",
            border: "1px solid #25262a",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
          }}>
            <div style={{
              padding: "12px 14px 10px",
              borderLeft: "3px solid #5865f2",
              background: "linear-gradient(90deg, rgba(88,101,242,0.07) 0%, transparent 80%)",
            }}>
              <div style={{
                color: "#f2f3f5",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "5px",
                letterSpacing: "-0.1px",
              }}>
                {profile.bio}
              </div>
              <div style={{
                color: "#72767d",
                fontSize: "12.5px",
                lineHeight: 1.6,
              }}>
                {profile.description}
              </div>
            </div>

            {badges.length > 0 && (
              <div style={{
                borderTop: "1px solid #25262a",
                padding: "10px 14px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
                background: "rgba(0,0,0,0.15)",
              }}>
                <span style={{ color: "#4e5058", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginRight: "2px" }}>
                  Badges
                </span>
                {badges.map((b, i) => (
                  <BadgeIcon key={b.id} badge={b} delay={i * 80 + 200} />
                ))}
              </div>
            )}
          </div>

          <div style={{
            display: "flex",
            borderBottom: "1px solid #25262a",
            marginBottom: "12px",
            gap: "2px",
          }}>
            {(["projects", "ongoing"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                  color: tab === t ? "#f2f3f5" : "#72767d",
                  fontSize: "13px",
                  fontWeight: tab === t ? 600 : 400,
                  borderBottom: `2px solid ${tab === t ? "#5865f2" : "transparent"}`,
                  marginBottom: "-1px",
                  transition: "color 0.15s, border-color 0.15s",
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseEnter={e => { if (tab !== t) (e.currentTarget as HTMLElement).style.color = "#9ea8b3"; }}
                onMouseLeave={e => { if (tab !== t) (e.currentTarget as HTMLElement).style.color = "#72767d"; }}
              >
                {t === "projects" ? "Projects" : "Ongoing"}
                <span style={{
                  background: tab === t ? "#5865f2" : "#25262a",
                  color: tab === t ? "#fff" : "#72767d",
                  borderRadius: "10px",
                  padding: "0 6px",
                  fontSize: "10px",
                  fontWeight: 700,
                  minWidth: "18px",
                  lineHeight: "18px",
                  textAlign: "center",
                  transition: "background 0.15s, color 0.15s",
                }}>
                  {t === "projects" ? projects.length : ongoing.length}
                </span>
              </button>
            ))}
          </div>

          <div style={{ maxHeight: "280px", overflowY: "auto", paddingRight: "2px" }}>
            {tab === "projects" ? (
              projects.length === 0 ? (
                <div style={{ color: "#72767d", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>
                  no projects yet
                </div>
              ) : (
                projects.map((p, i) => <ProjCard key={p.id} p={p} delay={i * 80} />)
              )
            ) : ongoing.length === 0 ? (
              <div style={{ color: "#72767d", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>
                nothing ongoing
              </div>
            ) : (
              ongoing.map((p, i) => <OngoingCard key={p.id} p={p} delay={i * 80} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
