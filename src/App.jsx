import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  FileHeart,
  HeartPulse,
  History,
  Home,
  Hospital,
  MapPin,
  Menu,
  Phone,
  Plus,
  ShieldCheck,
  Siren,
  Smartphone,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

const C = {
  green: "#12855f",
  greenDark: "#0a3d2e",
  greenMuted: "#5a7368",
  greenSoft: "#e8f3ee",
  line: "#c9dad2",
  red: "#c8322a",
  redDark: "#a82a23",
  redSoft: "#fff3f1",
  white: "#ffffff",
};

const seedProfiles = [
  {
    id: "self",
    name: "Suvan Pantina",
    relation: "My profile",
    age: 20,
    initials: "SP",
    usual: true,
    bloodGroup: "B+",
    conditions: ["No condition added"],
    allergies: ["No allergy added"],
    medicines: ["No medicine added"],
    contact: "Aarav · +91 90000 00001",
    hospital: "Preferred hospital not added",
    mediclaim: "Mediclaim not added",
    updated: "Today",
  },
  {
    id: "parent",
    name: "Raman Pantina",
    relation: "Father",
    age: 58,
    initials: "RP",
    usual: false,
    bloodGroup: "O+",
    conditions: ["Type 2 diabetes"],
    allergies: ["Penicillin"],
    medicines: ["Metformin"],
    contact: "Suvan · +91 90000 00002",
    hospital: "City Care Hospital",
    mediclaim: "Policy ending 4821",
    updated: "18 Sep 2026",
  },
];

const sosPresets = [
  {
    id: "hyper",
    title: "Hyper SOS",
    subtitle: "Medical emergency",
    number: "112",
    mode: "hyper",
    alerts: true,
  },
  {
    id: "reach",
    title: "Reach Me",
    subtitle: "Call me and alert my circle",
    number: null,
    mode: "reach",
    alerts: true,
  },
  {
    id: "ambulance",
    title: "Ambulance helpline",
    subtitle: "Configured emergency number",
    number: "102",
    mode: "call",
    alerts: false,
  },
  {
    id: "family",
    title: "Family emergency",
    subtitle: "Call primary family contact",
    number: "+919000000002",
    mode: "call",
    alerts: true,
  },
];

function cx(...values) {
  return values.filter(Boolean).join(" ");
}

function timeNow() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random()}`;
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5" aria-label="ResQ">
      <div className="grid h-10 w-10 place-items-center border-2 border-[#12855f] bg-white text-[#12855f]">
        <HeartPulse className="h-6 w-6" strokeWidth={2.3} />
      </div>
      <div
        className="text-[25px] font-extrabold tracking-[-0.04em] text-[#0a3d2e]"
        style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
      >
        Res<span className="text-[#c8322a]">Q</span>
      </div>
    </div>
  );
}

function TapButton({ children, tone = "green", onClick, disabled = false, className = "" }) {
  const toneClass =
    tone === "red"
      ? "border-[#c8322a] bg-[#c8322a] text-white active:bg-[#a82a23]"
      : tone === "redOutline"
      ? "border-2 border-[#c8322a] bg-white text-[#c8322a]"
      : tone === "plain"
      ? "border border-[#c9dad2] bg-white text-[#0a3d2e]"
      : "border border-[#12855f] bg-[#12855f] text-white active:bg-[#0a3d2e]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "flex min-h-14 w-full items-center justify-center gap-2 rounded-[4px] px-5 text-[16px] font-bold transition disabled:opacity-40",
        toneClass,
        className
      )}
    >
      {children}
    </button>
  );
}

function Row({ label, value, action, onClick, urgent = false, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex min-h-[76px] w-full items-center gap-3 border-b border-[#c9dad2] px-4 py-3 text-left",
        urgent && "border-l-4 border-l-[#c8322a]"
      )}
    >
      {Icon && <Icon className={cx("h-5 w-5 shrink-0", urgent ? "text-[#c8322a]" : "text-[#12855f]")} />}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#5a7368]">{label}</p>
        <p className="mt-1 truncate text-[17px] font-bold text-[#0a3d2e]">{value}</p>
      </div>
      {action && <span className={cx("min-h-12 px-2 text-[14px] font-bold leading-[48px]", urgent ? "text-[#c8322a]" : "text-[#12855f]")}>{action}</span>}
    </button>
  );
}

function Drawer({ open, close, page, setPage, profile, active }) {
  const sections = [
    {
      title: "Emergency",
      items: [
        ["home", "Home", Home],
        ...(active ? [["active", "Active SOS", Siren]] : []),
        ["history", "Emergency history", History],
      ],
    },
    {
      title: "People",
      items: [
        ["medicard", "My MediCard", FileHeart],
        ["family", "Family profiles", UsersRound],
        ["contacts", "Emergency contacts", Phone],
      ],
    },
    {
      title: "Health & cover",
      items: [
        ["mediclaim", "Mediclaim", ShieldCheck],
        ["hospitals", "Preferred hospitals", Hospital],
      ],
    },
    {
      title: "Settings",
      items: [["settings", "Permissions & privacy", Smartphone]],
    },
  ];

  return (
    <>
      <div
        onClick={close}
        className={cx(
          "fixed inset-0 z-50 bg-[#0a3d2e]/25 transition-opacity duration-200",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={cx(
          "fixed bottom-0 left-0 top-0 z-[60] w-[84%] max-w-[340px] overflow-y-auto bg-white transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#c9dad2] px-4">
          <Logo />
          <button onClick={close} className="grid h-12 w-12 place-items-center text-[#12855f]" aria-label="Close menu"><X /></button>
        </div>

        <button onClick={() => { setPage("medicard"); close(); }} className="flex w-full items-center gap-3 border-b border-[#c9dad2] bg-[#e8f3ee] p-4 text-left">
          <div className="grid h-12 w-12 place-items-center bg-white font-extrabold text-[#12855f]">{profile.initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-bold text-[#0a3d2e]">{profile.name}</p>
            <p className="mt-1 text-[13px] text-[#5a7368]">Usual SOS profile</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#12855f]" />
        </button>

        <div className="pb-8">
          {sections.map((section) => (
            <div key={section.title} className="pt-5">
              <p className="px-4 pb-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#5a7368]">{section.title}</p>
              {section.items.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => { setPage(id); close(); }}
                  className={cx(
                    "flex min-h-14 w-full items-center gap-3 border-b border-[#e8f3ee] px-4 text-left text-[15px] font-bold",
                    page === id ? "bg-[#e8f3ee] text-[#12855f]" : "text-[#0a3d2e]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

function AppHeader({ openMenu, location = "Finding location…" }) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-[#c9dad2] bg-white px-3">
      <button onClick={openMenu} className="grid h-12 w-12 place-items-center text-[#12855f]" aria-label="Open menu"><Menu /></button>
      <Logo />
      <div className="ml-auto flex max-w-[135px] items-center gap-1.5 text-right text-[12px] font-semibold text-[#5a7368]">
        <MapPin className="h-4 w-4 shrink-0 text-[#12855f]" />
        <span className="truncate">{location}</span>
      </div>
    </header>
  );
}

function LaunchRail({ onHyper }) {
  const railRef = useRef(null);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);

  function start(clientX) {
    setDragging(true);
    setX(clientX);
  }

  function end(clientX) {
    if (!dragging) return;
    const delta = clientX - x;
    setDragging(false);
    if (delta < -90) onHyper();
  }

  return (
    <div
      ref={railRef}
      onTouchStart={(e) => start(e.touches[0].clientX)}
      onTouchEnd={(e) => end(e.changedTouches[0].clientX)}
      onMouseDown={(e) => start(e.clientX)}
      onMouseUp={(e) => end(e.clientX)}
      className="relative flex min-h-[228px] select-none flex-col items-center justify-center overflow-hidden rounded-[6px] bg-[#c8322a] px-6 text-center text-white"
      role="button"
      tabIndex={0}
      aria-label="Swipe left to start Hyper SOS"
    >
      <Siren className="h-10 w-10" strokeWidth={2.1} />
      <p className="mt-4 text-[48px] font-extrabold leading-none tracking-[-0.04em]" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>SOS</p>
      <p className="mt-3 text-[18px] font-bold">Swipe left for Hyper SOS</p>
      <div className="mt-7 flex items-center gap-3 text-[14px] font-semibold text-white/90">
        <ArrowLeft className="h-5 w-5" />
        Medical help · location · family alerts
      </div>
    </div>
  );
}

function HomePage({ profile, location, setPage, startAlert }) {
  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col overflow-hidden px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
      <button onClick={() => setPage("location")} className="flex min-h-[66px] items-center gap-3 border-b border-[#c9dad2] text-left">
        <MapPin className="h-6 w-6 shrink-0 text-[#12855f]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-bold text-[#0a3d2e]">{location}</p>
          <p className="mt-1 text-[13px] text-[#5a7368]">Your phone's location</p>
        </div>
        <span className="min-h-12 px-2 text-[14px] font-bold leading-[48px] text-[#12855f]">Edit</span>
      </button>

      <div className="flex min-h-0 flex-1 flex-col justify-center py-3">
        <LaunchRail onHyper={() => startAlert(sosPresets[0])} />
        <button onClick={() => startAlert(sosPresets[0])} className="mt-2 min-h-12 text-[14px] font-bold text-[#c8322a]">Tap instead to start Hyper SOS</button>
      </div>

      <div className="shrink-0">
        <a href="tel:112" className="flex min-h-[68px] w-full items-center justify-center gap-3 rounded-[6px] border-2 border-[#c8322a] bg-white text-[22px] font-extrabold text-[#c8322a]">
          <Phone className="h-6 w-6" /> Call 112
        </a>
        <button onClick={() => setPage("personPicker")} className="mt-3 flex min-h-[78px] w-full items-center gap-3 border-t border-[#c9dad2] text-left">
          <div className="grid h-11 w-11 place-items-center bg-[#e8f3ee] font-extrabold text-[#12855f]">{profile.initials}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-[#5a7368]">Patient</p>
            <p className="mt-1 truncate text-[18px] font-bold text-[#0a3d2e]">{profile.name} · {profile.age}</p>
          </div>
          <span className="min-h-12 px-2 text-[14px] font-bold leading-[48px] text-[#12855f]">Change</span>
        </button>
      </div>
    </div>
  );
}

function Countdown({ preset, cancel, complete }) {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds <= 0) {
      complete();
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      <div className="mx-auto flex h-[100dvh] max-w-[430px] flex-col px-5 pb-[max(22px,env(safe-area-inset-bottom))] pt-9">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#c8322a]">Starting</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#c8322a]">{preset.title}</p>
          <div className="mt-7 text-[112px] font-extrabold leading-none text-[#c8322a]" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>{seconds}</div>
          <h1 className="mt-6 text-[28px] font-extrabold tracking-[-0.035em] text-[#0a3d2e]" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>Starting in {seconds} seconds</h1>
          <p className="mt-4 max-w-sm text-[16px] leading-6 text-[#5a7368]">
            {preset.mode === "hyper" ? "Location, MediCard and connected family alerts will initialize." : preset.mode === "reach" ? "Your trusted contacts will be alerted and ResQ will call you." : `ResQ will call ${preset.number}.`}
          </p>
        </div>
        <TapButton tone="redOutline" onClick={cancel}><X className="h-5 w-5" /> Cancel</TapButton>
      </div>
    </div>
  );
}

function ActiveSOS({ session, location, cancel, openPicker, addDetail }) {
  const [elapsed, setElapsed] = useState(0);
  const [scriptOpen, setScriptOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#c9dad2] px-4">
        <Logo />
        <button onClick={cancel} className="min-h-12 px-2 text-[14px] font-bold text-[#c8322a]">Cancel SOS</button>
      </header>

      <section className="shrink-0 border-l-4 border-[#c8322a] bg-[#e8f3ee] px-4 py-4" aria-live="assertive">
        <p className="text-[13px] font-bold text-[#5a7368]">SOS active · {mm}:{ss}</p>
        <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-[#0a3d2e]" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>
          {session.statusTitle}
        </h1>
        <p className="mt-1 text-[16px] leading-6 text-[#5a7368]">{session.statusDetail}</p>
      </section>

      <div className="shrink-0 border-b border-[#c9dad2] px-4 py-3">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.11em] text-[#12855f]">What ResQ has done</p>
        <div className="mt-3 grid grid-cols-4 gap-1">
          {session.steps.map((step) => (
            <div key={step.label} className="text-center">
              <div className={cx("mx-auto grid h-7 w-7 place-items-center border", step.done ? "border-[#12855f] bg-[#12855f] text-white" : "border-[#c9dad2] text-[#5a7368]")}>{step.done ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}</div>
              <p className="mt-1 text-[10px] font-semibold text-[#5a7368]">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Row label="Location" value={location} action="Fix" icon={MapPin} />
        <Row label="Patient" value={`${session.profile.name} · Allergy: ${session.profile.allergies[0]}`} action="Change" onClick={openPicker} icon={UserRound} />
        <Row label="Family" value={session.familyStatus} action="View" icon={UsersRound} />
        <Row label="Tell the operator" value="Read this summary to 112" action={scriptOpen ? "Close" : "Open"} onClick={() => setScriptOpen(!scriptOpen)} icon={FileHeart} />
        {scriptOpen && (
          <div className="border-b border-[#c9dad2] bg-[#e8f3ee] p-4 text-[15px] leading-7 text-[#0a3d2e]">
            <p className="font-bold">My name is {session.profile.name}. I am at {location}.</p>
            <p>Known condition: {session.profile.conditions[0]}.</p>
            <p>Allergy: {session.profile.allergies[0]}.</p>
            <p>Current medicine: {session.profile.medicines[0]}.</p>
            <p className="mt-2 font-semibold">Confirm the location and emergency details directly with the operator.</p>
          </div>
        )}
        <Row label="What is happening?" value={session.detail || "Not added"} action="Add" onClick={addDetail} icon={AlertCircle} />
      </div>

      <div className="shrink-0 border-t border-[#c9dad2] bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
        <p className="mb-2 border-l-4 border-[#c8322a] pl-3 text-[14px] font-bold text-[#c8322a]">Call 112 for an ambulance.</p>
        <a href="tel:112" className="flex min-h-[72px] w-full items-center justify-center gap-3 rounded-[6px] bg-[#c8322a] text-[23px] font-extrabold text-white">
          <Phone className="h-6 w-6" /> Call 112
        </a>
      </div>
    </div>
  );
}

function PersonPicker({ selected, choose, close }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-[#0a3d2e]/25" onClick={close}>
      <section onClick={(e) => e.stopPropagation()} className="max-h-[82dvh] w-full overflow-y-auto rounded-t-[8px] bg-white pb-[max(18px,env(safe-area-inset-bottom))]">
        <div className="flex h-16 items-center justify-between border-b border-[#c9dad2] px-4">
          <h2 className="text-[22px] font-extrabold text-[#0a3d2e]" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>Who needs help?</h2>
          <button onClick={close} className="grid h-12 w-12 place-items-center text-[#12855f]"><X /></button>
        </div>
        {seedProfiles.map((person) => (
          <button key={person.id} onClick={() => choose(person)} className="flex min-h-[76px] w-full items-center gap-3 border-b border-[#c9dad2] px-4 text-left">
            <div className="grid h-11 w-11 place-items-center bg-[#e8f3ee] font-extrabold text-[#12855f]">{person.initials}</div>
            <div className="flex-1"><p className="text-[17px] font-bold text-[#0a3d2e]">{person.name}</p><p className="mt-1 text-[13px] text-[#5a7368]">{person.relation} · {person.age} years</p></div>
            {selected.id === person.id && <Check className="h-5 w-5 text-[#12855f]" />}
          </button>
        ))}
        <button onClick={() => choose({ ...seedProfiles[0], id: "someone", name: "Someone else", relation: "Unknown person", age: "Adult", initials: "?", conditions: ["Unknown"], allergies: ["Unknown"], medicines: ["Unknown"] })} className="flex min-h-[64px] w-full items-center gap-3 border-b border-[#c9dad2] px-4 text-left text-[16px] font-bold text-[#12855f]">Someone else</button>
        <button onClick={() => choose({ ...seedProfiles[0], id: "unknown", name: "Unknown person", relation: "No profile", age: "Unknown", initials: "?", conditions: ["Unknown"], allergies: ["Unknown"], medicines: ["Unknown"] })} className="flex min-h-[64px] w-full items-center gap-3 px-4 text-left text-[16px] font-bold text-[#12855f]">I don't know this person</button>
      </section>
    </div>
  );
}

function PlainPage({ title, subtitle, children, back }) {
  return (
    <div className="px-4 pb-10 pt-5">
      {back && <button onClick={back} className="mb-4 flex min-h-12 items-center gap-2 text-[15px] font-bold text-[#12855f]"><ArrowLeft className="h-4 w-4" /> Back</button>}
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#12855f]">ResQ</p>
      <h1 className="mt-2 text-[30px] font-extrabold tracking-[-0.04em] text-[#0a3d2e]" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>{title}</h1>
      {subtitle && <p className="mt-3 text-[15px] leading-6 text-[#5a7368]">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function MediCard({ profile }) {
  const groups = [
    ["Identity", [["Name", profile.name], ["Age", String(profile.age)], ["Blood group", profile.bloodGroup]]],
    ["Medical", [["Conditions", profile.conditions.join(", ")], ["Allergies", profile.allergies.join(", ")], ["Medicines", profile.medicines.join(", ")]]],
    ["Emergency support", [["Contact", profile.contact], ["Hospital", profile.hospital], ["Mediclaim", profile.mediclaim]]],
  ];
  return (
    <PlainPage title="My MediCard" subtitle="The essential information needed during a medical situation.">
      <div className="border-y border-[#c9dad2] bg-[#e8f3ee] p-4">
        <p className="text-[19px] font-bold text-[#0a3d2e]">{profile.name}</p>
        <p className="mt-1 text-[13px] text-[#5a7368]">Last updated {profile.updated}</p>
      </div>
      {groups.map(([group, rows]) => (
        <section key={group} className="mt-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#12855f]">{group}</p>
          <div className="mt-2 border-t border-[#c9dad2]">{rows.map(([label, value]) => <Row key={label} label={label} value={value} action="Edit" />)}</div>
        </section>
      ))}
      <div className="mt-6"><TapButton>Edit MediCard</TapButton></div>
    </PlainPage>
  );
}

function FamilyPage() {
  return (
    <PlainPage title="Family profiles" subtitle="Create a managed profile or link an independent ResQ account.">
      <div className="border-t border-[#c9dad2]">
        {seedProfiles.map((profile) => <Row key={profile.id} label={`${profile.relation} · ${profile.age} years`} value={profile.name} action="Open" icon={UserRound} />)}
      </div>
      <div className="mt-5"><TapButton><Plus className="h-5 w-5" /> Add or link family member</TapButton></div>
    </PlainPage>
  );
}

function SimpleListPage({ title, subtitle, rows }) {
  return (
    <PlainPage title={title} subtitle={subtitle}>
      <div className="border-t border-[#c9dad2]">{rows.map((row) => <Row key={row[0]} label={row[0]} value={row[1]} action={row[2] || "Edit"} />)}</div>
    </PlainPage>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [drawer, setDrawer] = useState(false);
  const [profile, setProfile] = useState(seedProfiles[0]);
  const [location, setLocation] = useState("Finding location…");
  const [countdownPreset, setCountdownPreset] = useState(null);
  const [session, setSession] = useState(null);
  const [picker, setPicker] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`),
      () => setLocation("Location is off"),
      { timeout: 7000, enableHighAccuracy: true }
    );
  }, []);

  function startAlert(preset) {
    setCountdownPreset(preset);
  }

  function initializeAlert() {
    const preset = countdownPreset;
    setCountdownPreset(null);
    if (!preset) return;

    if (preset.mode === "call") {
      if (preset.alerts) {
        setSession({
          id: `RQ-${Math.floor(1000 + Math.random() * 9000)}`,
          profile,
          preset,
          statusTitle: `Calling ${preset.title}`,
          statusDetail: "Opening the phone calling flow.",
          familyStatus: "Alerts initializing",
          detail: "",
          steps: [
            { label: "Started", done: true },
            { label: "Location", done: location !== "Location is off" },
            { label: "MediCard", done: true },
            { label: "Family", done: true },
          ],
        });
      }
      if (preset.number) window.location.href = `tel:${preset.number}`;
      return;
    }

    if (preset.mode === "reach") {
      setSession({
        id: `RQ-${Math.floor(1000 + Math.random() * 9000)}`,
        profile,
        preset,
        statusTitle: "Reach Me is active",
        statusDetail: "Sharing your location with selected contacts.",
        familyStatus: "Connected contacts are being alerted",
        detail: "",
        steps: [
          { label: "Started", done: true },
          { label: "Location", done: location !== "Location is off" },
          { label: "Contacts", done: true },
          { label: "Callback", done: true },
        ],
      });
      return;
    }

    setSession({
      id: `RQ-${Math.floor(1000 + Math.random() * 9000)}`,
      profile,
      preset,
      statusTitle: "SOS started",
      statusDetail: "Your location and MediCard are being prepared. Now call 112.",
      familyStatus: "Connected family alerts initialized",
      detail: "",
      steps: [
        { label: "Started", done: true },
        { label: "Location", done: location !== "Location is off" },
        { label: "MediCard", done: true },
        { label: "Family", done: true },
      ],
    });
  }

  function choosePerson(person) {
    setProfile(person);
    if (session) setSession({ ...session, profile: person, statusDetail: "Patient updated. Now call 112." });
    setPicker(false);
    if (!session) setPage("home");
  }

  function cancelSOS() {
    setSession(null);
    setPage("home");
  }

  function onTouchStart(e) {
    if (session || countdownPreset) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onTouchEnd(e) {
    if (!touchStart.current || session || countdownPreset) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const startedLeft = touchStart.current.x < 72;
    if (startedLeft && dx > 60 && Math.abs(dy) < 40) setDrawer(true);
    touchStart.current = null;
  }

  const body = useMemo(() => {
    if (session) return null;
    switch (page) {
      case "medicard": return <MediCard profile={profile} />;
      case "family": return <FamilyPage />;
      case "personPicker": return <HomePage profile={profile} location={location} setPage={setPage} startAlert={startAlert} />;
      case "contacts": return <SimpleListPage title="Emergency contacts" subtitle="Choose who receives ResQ alerts." rows={[["Primary contact", profile.contact, "Edit"], ["Automatic alerts", "Enabled for Hyper SOS", "Change"]]} />;
      case "mediclaim": return <SimpleListPage title="Mediclaim" subtitle="Policy details available during a medical situation." rows={[["Policy", profile.mediclaim, "Edit"], ["TPA", "Not added", "Add"], ["Helpline", "Not added", "Add"]]} />;
      case "hospitals": return <SimpleListPage title="Preferred hospitals" subtitle="A preference only. Emergency professionals decide the destination." rows={[["Preferred hospital", profile.hospital, "Edit"], ["Hospital phone", "Not added", "Add"]]} />;
      case "history": return <SimpleListPage title="Emergency history" subtitle="A factual record of previous ResQ activity." rows={[["No previous events", "Your emergency activity will appear here", ""]]} />;
      case "settings": return <SimpleListPage title="Permissions & privacy" subtitle="Control what ResQ can access and share." rows={[["Location", location === "Location is off" ? "Off" : "While using ResQ", "Fix"], ["Family alerts", "On for Hyper SOS", "Change"], ["Medical sharing", "Emergency summary only", "Change"], ["Language", "English", "Change"]]} />;
      case "location": return <SimpleListPage title="Location" subtitle="ResQ uses the phone's location. Confirm if the patient is elsewhere." rows={[["Current location", location, "Refresh"], ["Home address", "Not added", "Add"], ["Patient location", "With me", "Change"]]} />;
      default: return <HomePage profile={profile} location={location} setPage={setPage} startAlert={startAlert} />;
    }
  }, [page, profile, location, session]);

  if (session) {
    return (
      <>
        <ActiveSOS
          session={session}
          location={location}
          cancel={cancelSOS}
          openPicker={() => setPicker(true)}
          addDetail={() => setSession({ ...session, detail: "Medical emergency details added" })}
        />
        {picker && <PersonPicker selected={profile} choose={choosePerson} close={() => setPicker(false)} />}
      </>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#e8f3ee] text-[#0a3d2e]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto min-h-[100dvh] w-full max-w-[430px] bg-white">
        <AppHeader openMenu={() => setDrawer(true)} location={location} />
        {body}
      </div>

      <Drawer open={drawer} close={() => setDrawer(false)} page={page} setPage={setPage} profile={profile} active={Boolean(session)} />
      {countdownPreset && <Countdown preset={countdownPreset} cancel={() => setCountdownPreset(null)} complete={initializeAlert} />}
      {page === "personPicker" && <PersonPicker selected={profile} choose={choosePerson} close={() => setPage("home")} />}

      {page === "home" && !countdownPreset && (
        <button
          onClick={() => startAlert(sosPresets[1])}
          className="fixed bottom-4 right-4 z-30 min-h-12 rounded-[4px] border border-[#12855f] bg-white px-4 text-[14px] font-bold text-[#12855f] shadow-none"
        >
          Reach Me
        </button>
      )}
    </div>
  );
}
