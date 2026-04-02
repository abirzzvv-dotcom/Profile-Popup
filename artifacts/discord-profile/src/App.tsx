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

function BadgePopup({ badge, style }: { badge: Badge; style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#111214",
        border: "1px solid #2e3035",
        borderRadius: "8px",
        padding: "12px",
        width: "220px",
        zIndex: 999,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
        <img
          src={`${BASE}badges/${badge.id}.${badge.ext}`}
          alt={badge.name}
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
        <div>
          <div style={{ color: "#dcddde", fontSize: "14px", fontWeight: 600 }}>{badge.name}</div>
        </div>
      </div>
      <div style={{ color: "#72767d", fontSize: "12px", lineHeight: 1.4 }}>{badge.description}</div>
      <div
        style={{
          position: "absolute",
          bottom: "-5px",
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: "8px",
          height: "8px",
          background: "#111214",
          border: "1px solid #2e3035",
          borderTop: "none",
          borderLeft: "none",
        }}
      />
    </div>
  );
}

function BadgeIcon({ badge }: { badge: Badge }) {
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function click() {
    setShake(true);
    setShow((v) => !v);
    setTimeout(() => setShake(false), 500);
  }

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <img
        src={`${BASE}badges/${badge.id}.${badge.ext}`}
        alt={badge.name}
        title={badge.name}
        onClick={click}
        style={{
          width: "22px",
          height: "22px",
          objectFit: "contain",
          cursor: "pointer",
          animation: shake ? "shake 0.4s ease" : "none",
          filter: "drop-shadow(0 0 4px rgba(0,0,0,0.6))",
        }}
      />
      {show && <BadgePopup badge={badge} style={{}} />}
    </div>
  );
}

function ProjCard({ p }: { p: Project }) {
  const MAX = 65;
  const desc = p.description.length > MAX ? p.description.slice(0, MAX) + "…" : p.description;
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: "#18191c",
        borderRadius: "8px",
        padding: "12px 14px",
        textDecoration: "none",
        border: "1px solid #2e3035",
        transition: "border-color 0.15s",
        marginBottom: "8px",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#5865f2")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2e3035")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{ color: "#9c84fc", fontWeight: 600, fontSize: "13px" }}>{p.name}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#72767d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>
      <div style={{ color: "#72767d", fontSize: "12px", marginBottom: "8px", lineHeight: 1.4 }}>{desc}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: p.langColor,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span style={{ color: "#9ea8b3", fontSize: "11px", marginRight: "4px" }}>{p.language}</span>
        {p.tags.map((t) => (
          <span
            key={t}
            style={{
              background: "#2e3035",
              color: "#9ea8b3",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

function OngoingCard({ p }: { p: Ongoing }) {
  const MAX = 65;
  const desc = p.description.length > MAX ? p.description.slice(0, MAX) + "…" : p.description;
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: "#18191c",
        borderRadius: "8px",
        padding: "12px 14px",
        textDecoration: "none",
        border: "1px solid #2e3035",
        transition: "border-color 0.15s",
        marginBottom: "8px",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#5865f2")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2e3035")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{ color: "#9c84fc", fontWeight: 600, fontSize: "13px" }}>{p.name}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#72767d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>
      <div style={{ color: "#72767d", fontSize: "12px", marginBottom: "8px", lineHeight: 1.4 }}>{desc}</div>
      <div style={{ marginBottom: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ color: "#9ea8b3", fontSize: "11px" }}>Progress</span>
          <span style={{ color: "#9ea8b3", fontSize: "11px" }}>{p.progress}%</span>
        </div>
        <div style={{ background: "#2e3035", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
          <div
            style={{
              width: `${p.progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #5865f2, #9c84fc)",
              borderRadius: "4px",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: p.langColor,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span style={{ color: "#9ea8b3", fontSize: "11px", marginRight: "4px" }}>{p.language}</span>
        {p.tags.map((t) => (
          <span
            key={t}
            style={{
              background: "#2e3035",
              color: "#9ea8b3",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
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

  useEffect(() => {
    fetch(`${BASE}data/profile.json`).then((r) => r.json()).then(setProfile);
    fetch(`${BASE}data/badges.json`).then((r) => r.json()).then(setBadges);
    fetch(`${BASE}data/projects.json`).then((r) => r.json()).then(setProjects);
    fetch(`${BASE}data/ongoing.json`).then((r) => r.json()).then(setOngoing);
  }, []);

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f0f10", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#72767d", fontSize: "14px" }}>Loading...</div>
      </div>
    );
  }

  const dot = profile.status === "online" ? "#3ba55c" : profile.status === "idle" ? "#faa81a" : "#747f8d";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        padding: "24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shake {
          0%,100% { transform: rotate(0deg); }
          15% { transform: rotate(-10deg); }
          30% { transform: rotate(10deg); }
          45% { transform: rotate(-8deg); }
          60% { transform: rotate(8deg); }
          75% { transform: rotate(-4deg); }
          90% { transform: rotate(4deg); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2e3035; border-radius: 4px; }
      `}</style>

      <div
        style={{
          background: "#1e1f22",
          borderRadius: "12px",
          width: "340px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            height: "96px",
            background: "#000000",
            position: "relative",
            flexShrink: 0,
          }}
        />

        <div style={{ padding: "0 16px 16px", position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block", marginTop: "-40px", marginBottom: "8px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "5px solid #1e1f22",
                overflow: "hidden",
                background: "#5865f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {!imgErr ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  onError={() => setImgErr(true)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#fff", fontSize: "22px", fontWeight: 700 }}>{profile.initials}</span>
              )}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "3px",
                right: "3px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: dot,
                border: "3px solid #1e1f22",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ color: "#dcddde", fontWeight: 700, fontSize: "20px", lineHeight: 1.2 }}>
                {profile.username}
              </span>
              <span style={{ color: "#72767d", fontSize: "14px" }}>@{profile.handle}</span>
            </div>
            <div style={{ color: "#72767d", fontSize: "12px", marginTop: "3px" }}>{profile.tagline}</div>
          </div>

          <div
            style={{
              background: "#111214",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
              border: "1px solid #2e3035",
            }}
          >
            <div style={{ color: "#dcddde", fontWeight: 700, fontSize: "12px", marginBottom: "4px" }}>
              {profile.bio}
            </div>
            <div style={{ color: "#72767d", fontSize: "12px", lineHeight: 1.5 }}>{profile.description}</div>

            {badges.length > 0 && (
              <>
                <div
                  style={{
                    height: "1px",
                    background: "#2e3035",
                    margin: "10px 0",
                  }}
                />
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  {badges.map((b) => (
                    <BadgeIcon key={b.id} badge={b} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #2e3035", marginBottom: "12px" }}>
            {(["projects", "ongoing"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 14px",
                  color: tab === t ? "#dcddde" : "#72767d",
                  fontSize: "13px",
                  fontWeight: tab === t ? 600 : 400,
                  borderBottom: tab === t ? "2px solid #5865f2" : "2px solid transparent",
                  marginBottom: "-1px",
                  transition: "color 0.15s",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (tab !== t) (e.currentTarget as HTMLElement).style.color = "#9ea8b3";
                }}
                onMouseLeave={(e) => {
                  if (tab !== t) (e.currentTarget as HTMLElement).style.color = "#72767d";
                }}
              >
                {t === "projects" ? "Projects" : "Ongoing"}
                <span
                  style={{
                    marginLeft: "5px",
                    background: tab === t ? "#5865f2" : "#2e3035",
                    color: tab === t ? "#fff" : "#72767d",
                    borderRadius: "10px",
                    padding: "1px 6px",
                    fontSize: "10px",
                    fontWeight: 600,
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {t === "projects" ? projects.length : ongoing.length}
                </span>
              </button>
            ))}
          </div>

          <div style={{ maxHeight: "260px", overflowY: "auto", paddingRight: "2px" }}>
            {tab === "projects" ? (
              projects.length === 0 ? (
                <div style={{ color: "#72767d", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                  No projects yet.
                </div>
              ) : (
                projects.map((p) => <ProjCard key={p.id} p={p} />)
              )
            ) : ongoing.length === 0 ? (
              <div style={{ color: "#72767d", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                Nothing ongoing.
              </div>
            ) : (
              ongoing.map((p) => <OngoingCard key={p.id} p={p} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
