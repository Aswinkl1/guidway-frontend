import {
  useState,
  useRef,
  useEffect,
  type CSSProperties,
  type FC,
} from "react";
import {
  Search,
  ShieldCheck,
  Lock,
  BadgeCheck,
  ChevronRight,
  Bell,
  LayoutDashboard,
  CalendarDays,
  User,
  Settings,
  LogOut,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useAppSelector } from "@/app/store/store";
import { useNavigate } from "react-router";
import { logout as reduxLogout } from "@/features/auth/redux/UserAuthSlice";

import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "@/features/auth/services/authService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Mentor {
  id: number;
  name: string;
  role: string;
  tag: string;
  rate: string;
  rating: number;
  initials: string;
  bg: string;
  fg: string;
}

interface Step {
  n: string;
  title: string;
  desc: string;
}

interface TrustItem {
  Icon: LucideIcon;
  label: string;
}

interface DropdownItem {
  Icon: LucideIcon;
  label: string;
}

interface HeaderProps {
  isLoggedIn: boolean;
  onToggleLogin: () => void;
}

interface MentorCardProps {
  mentor: Mentor;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MENTORS: Mentor[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "VP of Engineering at TechCorp",
    tag: "Engineering Leadership",
    rate: "$250/hr",
    rating: 4.9,
    initials: "SJ",
    bg: "#e0e7ff",
    fg: "#4338ca",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Founder, YC Startup",
    tag: "Startup Strategy",
    rate: "$300/hr",
    rating: 5.0,
    initials: "DC",
    bg: "#dbeafe",
    fg: "#1d4ed8",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Senior Product Manager",
    tag: "Product Management",
    rate: "$180/hr",
    rating: 4.8,
    initials: "ER",
    bg: "#fce7f3",
    fg: "#be185d",
  },
];

const CHIPS: string[] = [
  "Career Transition",
  "Leadership Skills",
  "Technical Interview Prep",
  "Startup Guidance",
];

const STEPS: Step[] = [
  {
    n: "1",
    title: "Discover mentors",
    desc: "Browse profiles to find the perfect expert for your goals.",
  },
  {
    n: "2",
    title: "Book a session",
    desc: "Schedule a time that works for you with secure payment.",
  },
  {
    n: "3",
    title: "Meet 1-on-1",
    desc: "Connect via video call and get personalized guidance.",
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const navLinkStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#374151",
  textDecoration: "none",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  padding: 0,
};

// ─── Header ───────────────────────────────────────────────────────────────────

const Header: FC<HeaderProps> = ({ isLoggedIn = true, onToggleLogin }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dropdownItems: DropdownItem[] = [
    { Icon: LayoutDashboard, label: "My Dashboard" },
    { Icon: CalendarDays, label: "My Sessions" },
    { Icon: User, label: "Profile", link: "/mentor/profile" },
    { Icon: Settings, label: "Settings" },
  ];
  async function handleLogout() {
    try {
      const res = await logout();
      dispatch(reduxLogout());
      toast.success("logout successfull");
    } catch {
      console.log("error");
    }
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#fff",
        borderBottom: "1px solid #F1F5F9",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 28px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            // visibility: "hidden",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="2.5" fill="#2563EB" />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <line
                key={i}
                x1="11"
                y1="11"
                x2={11 + 8 * Math.cos((deg * Math.PI) / 180)}
                y2={11 + 8 * Math.sin((deg * Math.PI) / 180)}
                stroke="#2563EB"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ))}
          </svg>
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "#111827",
              letterSpacing: "-0.3px",
            }}
          >
            GuidWay
          </span>
        </div>

        {/* Logged-out nav */}
        {!isLoggedIn && (
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a href="#" style={navLinkStyle}>
              Browse mentors
            </a>
            <button
              onClick={() => navigate("/auth/login")}
              style={navLinkStyle}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
              style={{
                backgroundColor: "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Sign up
            </button>
          </nav>
        )}

        {/* Logged-in nav */}
        {isLoggedIn && (
          <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {["Message", "Find Mentors", "My Sessions"].map((l) => (
              <a key={l} href="#" style={navLinkStyle}>
                {l}
              </a>
            ))}

            {/* Bell */}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                padding: 4,
              }}
            >
              <Bell size={17} color="#6B7280" />
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#2563EB",
                  border: "1.5px solid #fff",
                }}
              />
            </button>

            {/* Avatar + dropdown */}
            <div style={{ position: "relative" }} ref={ref}>
              <button
                onClick={() => setOpen((p) => !p)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#93c5fd,#2563EB)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "2px solid #BFDBFE",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "inherit",
                }}
              >
                JD
              </button>

              {open && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: 196,
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    animation: "ddFade 0.12s ease",
                  }}
                >
                  {dropdownItems.map(({ Icon, label, link }) => (
                    <button
                      key={label}
                      onClick={() => navigate(link)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 16px",
                        fontSize: 13,
                        color: "#374151",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#F9FAFB")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <Icon size={14} color="#9CA3AF" /> {label}
                    </button>
                  ))}

                  <div style={{ height: 1, backgroundColor: "#F1F5F9" }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px",
                      fontSize: 13,
                      color: "#EF4444",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                      fontFamily: "inherit",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#FFF5F5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

// ─── MentorCard ───────────────────────────────────────────────────────────────

const MentorCard: FC<MentorCardProps> = ({ mentor }) => {
  const [hov, setHov] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "box-shadow 0.18s, transform 0.18s",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
        transform: hov ? "translateY(-2px)" : "none",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: mentor.bg,
            color: mentor.fg,
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {mentor.initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 14,
              color: "#111827",
            }}
          >
            {mentor.name}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#6B7280",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {mentor.role}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            color: "#F59E0B",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          <Star size={11} fill="#F59E0B" stroke="none" /> {mentor.rating}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            backgroundColor: "#F3F4F6",
            color: "#374151",
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 20,
          }}
        >
          {mentor.tag}
        </span>
        <span style={{ color: "#2563EB", fontWeight: 700, fontSize: 13 }}>
          {mentor.rate}
        </span>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const GuidWayHomePage: FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const naviage = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const trustItems: TrustItem[] = [
    { Icon: BadgeCheck, label: "Verified mentors" },
    { Icon: Lock, label: "Secure payments" },
    { Icon: ShieldCheck, label: "10,000+ sessions completed" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        fontFamily: "'Plus Jakarta Sans','Nunito',sans-serif",
        color: "#111827",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes ddFade{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .u1{animation:up .5s ease both}
        .u2{animation:up .5s .08s ease both}
        .u3{animation:up .5s .15s ease both}
        .u4{animation:up .5s .22s ease both}
        input:focus{outline:none}
        a:hover{color:#2563EB!important}
      `}</style>

      <Header
        isLoggedIn={isLoggedIn}
        onToggleLogin={() => setIsLoggedIn((p) => !p)}
      />

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "72px 24px 52px",
          textAlign: "center",
        }}
      >
        <h1
          className="u1"
          style={{
            fontSize: "clamp(30px,4.8vw,50px)",
            fontWeight: 800,
            lineHeight: 1.18,
            color: "#111827",
            letterSpacing: "-1px",
          }}
        >
          Book 1-on-1 sessions with
          <br />
          experienced mentors.
        </h1>

        <p
          className="u2"
          style={{
            marginTop: 16,
            fontSize: 15.5,
            color: "#6B7280",
            lineHeight: 1.65,
          }}
        >
          Connect directly with experts to achieve your professional goals.
        </p>

        {/* CTA buttons */}
        <div
          className="u3"
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              backgroundColor: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 22px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
            }}
          >
            Discover Mentors
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              color: "#374151",
              border: "1.5px solid #E5E7EB",
              borderRadius: 8,
              padding: "11px 22px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Become a mentor
          </button>
        </div>

        {/* Search */}
        <div className="u4" style={{ marginTop: 34 }}>
          <div
            style={{ position: "relative", maxWidth: 490, margin: "0 auto" }}
          >
            <Search
              size={14}
              color="#9CA3AF"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your goal (e.g. Crack FAANG interview)"
              style={{
                width: "100%",
                padding: "11px 16px 11px 38px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 13,
                color: "#374151",
                fontFamily: "inherit",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            />
          </div>

          {/* Chips */}
          <div
            style={{
              marginTop: 13,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => setQuery(c)}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#6B7280",
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 20,
                  padding: "5px 13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2563EB";
                  e.currentTarget.style.color = "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.color = "#6B7280";
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            style={{
              marginTop: 14,
              fontSize: 13,
              fontWeight: 600,
              color: "#2563EB",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            Find Mentors for My Goal <ChevronRight size={13} />
          </button>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div
        style={{
          backgroundColor: "#F9FAFB",
          borderTop: "1px solid #F1F5F9",
          borderBottom: "1px solid #F1F5F9",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px 48px",
          }}
        >
          {trustItems.map(({ Icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                fontWeight: 500,
                color: "#6B7280",
              }}
            >
              <Icon size={15} color="#9CA3AF" /> {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Mentors ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 28px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 26,
          }}
        >
          <h2
            style={{
              fontSize: 21,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.4px",
            }}
          >
            Featured Mentors
          </h2>
          <button
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#2563EB",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            View all
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {MENTORS.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        style={{
          backgroundColor: "#F9FAFB",
          borderTop: "1px solid #F1F5F9",
          borderBottom: "1px solid #F1F5F9",
          padding: "52px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 21,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.4px",
            marginBottom: 44,
          }}
        >
          How it works
        </h2>

        <div
          style={{
            maxWidth: 740,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
            gap: 32,
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 11,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1.5px solid #BFDBFE",
                  backgroundColor: "#EFF6FF",
                  color: "#2563EB",
                  fontWeight: 700,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.n}
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                {s.title}
              </p>
              <p
                style={{
                  fontSize: 12.5,
                  color: "#6B7280",
                  lineHeight: 1.65,
                  maxWidth: 190,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "26px 28px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontWeight: 700,
            fontSize: 13,
            color: "#374151",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="2.5" fill="#2563EB" />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <line
                key={i}
                x1="11"
                y1="11"
                x2={11 + 8 * Math.cos((deg * Math.PI) / 180)}
                y2={11 + 8 * Math.sin((deg * Math.PI) / 180)}
                stroke="#2563EB"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ))}
          </svg>
          MentorPlatform
        </div>

        <div style={{ display: "flex", gap: 22 }}>
          {["Terms", "Privacy", "Support"].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {l}
            </a>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#9CA3AF" }}>
          © 2024 MentorPlatform Inc.
        </p>
      </footer>
    </div>
  );
};

export default GuidWayHomePage;
