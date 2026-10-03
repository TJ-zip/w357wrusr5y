import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Baby,
  Camera,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Cross,
  FileHeart,
  Flame,
  HeartPulse,
  History,
  Home,
  Hospital,
  MapPin,
  Menu,
  MessageSquareWarning,
  Navigation,
  Phone,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldCheck,
  Siren,
  Smartphone,
  Square,
  TriangleAlert,
  UserRound,
  UsersRound,
  Video,
  X,
} from "lucide-react";

// Brand Color System (Strictly preserved)
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

// Seed Profiles
const defaultProfiles = [
  {
    id: "self",
    name: "Suvan Pantina",
    relation: "My profile",
    age: 20,
    initials: "SP",
    usual: true,
    bloodGroup: "B+",
    phone: "+91 90000 00001",
    address: "Indiranagar, Bangalore, KA",
    preferredLanguage: "English",
    conditions: ["No condition added"],
    allergies: ["No allergy added"],
    medicines: ["No medicine added"],
    procedures: ["None"],
    implants: ["None"],
    mobilityRequirements: "Normal mobility",
    contact: "Aarav · +91 90000 00001",
    additionalContacts: ["Priya · +91 90000 00003"],
    hospital: "City Care Hospital",
    hospitalPhone: "+91 80 4455 6677",
    mediclaim: "Care Health · Policy #482109",
    mediclaimTpa: "Medi Assist TPA",
    mediclaimHelpline: "1800-200-4477",
    updated: "Today",
    isManaged: false,
    receiveAlerts: true,
  },
  {
    id: "parent",
    name: "Raman Pantina",
    relation: "Father",
    age: 58,
    initials: "RP",
    usual: false,
    bloodGroup: "O+",
    phone: "+91 90000 00002",
    address: "Indiranagar, Bangalore, KA",
    preferredLanguage: "English",
    conditions: ["Type 2 diabetes"],
    allergies: ["Penicillin"],
    medicines: ["Metformin 500mg"],
    procedures: ["Appendectomy (2018)"],
    implants: ["None"],
    mobilityRequirements: "Normal mobility",
    contact: "Suvan · +91 90000 00001",
    additionalContacts: ["Radha · +91 90000 00004"],
    hospital: "City Care Hospital",
    hospitalPhone: "+91 80 4455 6677",
    mediclaim: "Star Health · Policy #783912",
    mediclaimTpa: "Heritage TPA",
    mediclaimHelpline: "1800-425-2255",
    updated: "18 Sep 2026",
    isManaged: true,
    receiveAlerts: true,
  },
];

// Rebuilt SOS Presets with strict vertical metadata
const sosPresets = [
  {
    id: "hyper",
    kicker: "MEDICAL EMERGENCY",
    title: "Get ResQ",
    subtitle: "Medical emergency",
    description: "Start location, MediCard and connected-family alerts.",
    actionLabel: "GET RESQ",
    mode: "hyper",
    number: "112",
    theme: "red",
    icon: Siren,
  },
  {
    id: "reach",
    kicker: "EMERGENCY ASSISTANCE",
    title: "Reach Me",
    subtitle: "Emergency assistance to reach your location",
    description: "Request emergency services to reach your location and alert your circle.",
    actionLabel: "START REACH ME",
    mode: "reach",
    number: null,
    theme: "green",
    icon: HeartPulse,
  },
  {
    id: "ambulance",
    kicker: "AMBULANCE SERVICE",
    title: "Ambulance Helpline",
    subtitle: "Configured helpline",
    description: "Prepare a call to the configured ambulance helpline.",
    actionLabel: "CALL AMBULANCE HELPLINE",
    mode: "call",
    number: "102",
    theme: "whiteRedBorder",
    icon: Cross,
  },
  {
    id: "family",
    kicker: "FAMILY SUPPORT",
    title: "Family Emergency",
    subtitle: "Primary family contact",
    description: "Alert family profiles and call your primary emergency contact.",
    actionLabel: "START FAMILY EMERGENCY",
    mode: "call",
    number: "+919000000002",
    theme: "softGreen",
    icon: UsersRound,
  },
];

// Centralized Emergency Services Configuration
const initialEmergencyServices = [
  { id: "police", label: "Police", number: "112", icon: Shield, urgent: true, desc: "Police assistance & dispatch" },
  { id: "fire", label: "Fire", number: "112", icon: Flame, urgent: true, desc: "Fire & rescue response" },
  { id: "medical", label: "Medical", number: "112", icon: Cross, urgent: true, desc: "Ambulance emergency" },
  { id: "disaster", label: "Disaster", number: "112", icon: TriangleAlert, urgent: true, desc: "Disaster response authority" },
  { id: "women", label: "Women", number: "1091", icon: ShieldCheck, urgent: false, desc: "Women helpline (configured)" },
  { id: "child", label: "Child", number: "1098", icon: Baby, urgent: false, desc: "Childline support (configured)" },
  { id: "elderly", label: "Elderly", number: "14567", icon: Accessibility, urgent: false, desc: "Elderline assistance (configured)" },
  { id: "bystander", label: "Report Bystander", number: null, icon: MessageSquareWarning, urgent: false, action: "report", desc: "Report aid for another person" },
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

function dateNow() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function uid() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Logo Component: "Res" in deep green, only "Q" in red
function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none" aria-label="ResQ">
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

// Ruled Row Component
function Row({ label, value, action, onClick, urgent = false, icon: Icon, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex min-h-[72px] w-full items-center gap-3 border-b border-[#c9dad2] px-4 py-3 text-left transition active:bg-[#e8f3ee]/40",
        urgent && "border-l-4 border-l-[#c8322a]",
        className
      )}
    >
      {Icon && <Icon className={cx("h-5 w-5 shrink-0", urgent ? "text-[#c8322a]" : "text-[#12855f]")} />}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-[#5a7368]">{label}</p>
        <p className="mt-0.5 truncate text-[16px] font-bold text-[#0a3d2e]">{value}</p>
      </div>
      {action && (
        <span className={cx("min-h-12 px-2 text-[14px] font-bold leading-[48px]", urgent ? "text-[#c8322a]" : "text-[#12855f]")}>
          {action}
        </span>
      )}
    </button>
  );
}

// Header
function AppHeader({ openMenu, location = "Finding location…", onLocationClick }) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-[#c9dad2] bg-white px-3 select-none">
      <button
        onClick={openMenu}
        className="grid h-12 w-12 place-items-center text-[#12855f] active:bg-[#e8f3ee] rounded-[4px]"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      <Logo />
      <button
        onClick={onLocationClick}
        className="ml-auto flex max-w-[150px] items-center gap-1.5 text-right text-[12px] font-semibold text-[#5a7368] p-1.5 rounded active:bg-[#e8f3ee]"
        aria-label="Current location"
      >
        <MapPin className="h-4 w-4 shrink-0 text-[#12855f]" />
        <span className="truncate">{location}</span>
      </button>
    </header>
  );
}

// Rebuilt SOS Preset Carousel: Strict Vertical Hierarchy & Zero Collisions
function SosPresetSelector({ presets, selectedIndex, setSelectedIndex, onActivate }) {
  const containerRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, isLocked: false, isVertical: false });

  function handlePointerDown(e) {
    setIsDragging(true);
    setDragX(0);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      isLocked: false,
      isVertical: false,
    };
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch (_) {}
  }

  function handlePointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    if (!dragStart.current.isLocked) {
      if (Math.abs(dy) > Math.abs(dx) + 5) {
        dragStart.current.isVertical = true;
        dragStart.current.isLocked = true;
        setIsDragging(false);
        setDragX(0);
        return;
      }
      if (Math.abs(dx) > 8) {
        dragStart.current.isLocked = true;
      }
    }

    if (dragStart.current.isVertical) return;

    let adjustedDx = dx;
    if (selectedIndex === 0 && dx > 0) adjustedDx = dx * 0.3;
    if (selectedIndex === presets.length - 1 && dx < 0) adjustedDx = dx * 0.3;
    setDragX(adjustedDx);
  }

  function handlePointerUp(e) {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch (_) {}

    const threshold = 65;
    if (dragX < -threshold && selectedIndex < presets.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      try { navigator.vibrate?.(15); } catch (_) {}
    } else if (dragX > threshold && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      try { navigator.vibrate?.(15); } catch (_) {}
    }
    setDragX(0);
  }

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative overflow-hidden rounded-[6px] touch-pan-y cursor-grab active:cursor-grabbing"
      >
        <div
          className="flex transition-transform ease-out"
          style={{
            transform: `translateX(calc(-${selectedIndex * 100}% + ${dragX}px))`,
            transitionDuration: isDragging ? "0ms" : "260ms",
          }}
        >
          {presets.map((preset) => {
            const isHyper = preset.id === "hyper";
            const isReach = preset.id === "reach";
            const isAmbulance = preset.id === "ambulance";
            const isFamily = preset.id === "family";
            const Icon = preset.icon;

            return (
              <div key={preset.id} className="min-w-full flex-shrink-0 p-0.5">
                {/* Strict Vertical Structure */}
                <div
                  className={cx(
                    "sos-preset flex min-h-[250px] w-full flex-col justify-between rounded-[6px] p-5 text-left transition-colors",
                    isHyper && "bg-[#c8322a] text-white",
                    isReach && "bg-[#12855f] text-white",
                    isAmbulance && "border-2 border-[#c8322a] bg-white text-[#0a3d2e]",
                    isFamily && "border border-[#c9dad2] bg-[#e8f3ee] text-[#0a3d2e]"
                  )}
                >
                  {/* Top Block: Icon, Kicker, Title, Description */}
                  <div className="w-full min-w-0">
                    {/* 1. Icon */}
                    <div className="preset-icon mb-2.5">
                      <Icon
                        className={cx(
                          "h-8 w-8",
                          (isHyper || isReach) && "text-white",
                          isAmbulance && "text-[#c8322a]",
                          isFamily && "text-[#12855f]"
                        )}
                        strokeWidth={2.3}
                      />
                    </div>

                    {/* 2. Preset Kicker (11px, Uppercase, Semibold, Letter spacing) */}
                    <p
                      className={cx(
                        "preset-kicker text-[11px] font-semibold uppercase tracking-[0.14em]",
                        (isHyper || isReach) ? "text-white/80" : isAmbulance ? "text-[#c8322a]" : "text-[#12855f]"
                      )}
                    >
                      {preset.kicker}
                    </p>

                    {/* 3. Preset Title (Montserrat ExtraBold, 26px mobile / 30px wider, line-height ~1.1, natural wrap) */}
                    <h2
                      className={cx(
                        "preset-title mt-1.5 break-words text-[26px] sm:text-[30px] font-extrabold tracking-[-0.035em] leading-[1.1]",
                        (isHyper || isReach) && "text-white",
                        isAmbulance && "text-[#c8322a]",
                        isFamily && "text-[#0a3d2e]"
                      )}
                      style={{
                        fontFamily: "Montserrat, Arial, sans-serif",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {preset.title}
                    </h2>

                    {/* 4. One-line descriptor / Short explanation (15px, max 2 lines) */}
                    <p
                      className={cx(
                        "preset-description mt-2.5 text-[15px] leading-5 font-medium line-clamp-2",
                        (isHyper || isReach) ? "text-white/95" : "text-[#5a7368]"
                      )}
                    >
                      {preset.description}
                    </p>
                  </div>

                  {/* Bottom Block: Primary CTA & Swipe Instruction (At least 12px vertical spacing) */}
                  <div className="mt-4 w-full min-w-0 pt-2">
                    {/* 5. Primary Action Button (min 56px high, full width, max 1 line, 15px-16px) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivate(preset);
                      }}
                      className={cx(
                        "preset-cta flex min-h-[56px] w-full items-center justify-center rounded-[4px] px-4 text-[15px] sm:text-[16px] font-extrabold uppercase tracking-wide transition active:scale-[0.99]",
                        isHyper && "bg-white text-[#c8322a] active:bg-[#fff3f1]",
                        isReach && "bg-white text-[#12855f] active:bg-[#e8f3ee]",
                        isAmbulance && "bg-[#c8322a] text-white active:bg-[#a82a23]",
                        isFamily && "bg-[#12855f] text-white active:bg-[#0a3d2e]"
                      )}
                    >
                      {preset.actionLabel}
                    </button>

                    {/* 6. Swipe Instruction */}
                    <div
                      className={cx(
                        "preset-swipe-cue mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-center",
                        (isHyper || isReach) ? "text-white/80" : "text-[#5a7368]"
                      )}
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Swipe to choose another SOS</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Preset Position Indicators (4 short rectangular marks, no rounded pills) */}
      <div className="mt-3 flex items-center justify-center gap-2" aria-label="Preset indicators">
        {presets.map((preset, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedIndex(idx);
                try { navigator.vibrate?.(15); } catch (_) {}
              }}
              className={cx(
                "h-1.5 transition-all duration-200",
                isSelected
                  ? idx === 0
                    ? "w-8 bg-[#c8322a]"
                    : idx === 1
                    ? "w-8 bg-[#12855f]"
                    : "w-8 bg-[#0a3d2e]"
                  : "w-5 bg-[#c9dad2]"
              )}
              aria-label={`Select ${preset.title}`}
            />
          );
        })}
      </div>
    </div>
  );
}

// Contact Emergency Services Grid (Compact 4-column by 2-row)
function EmergencyServicesGrid({ services, onSelectService }) {
  return (
    <div className="w-full pt-1">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#5a7368]">
          Contact Emergency Services
        </h2>
        <span className="text-[11px] font-semibold text-[#5a7368]">112 India Protocol</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {services.map((svc) => {
          const Icon = svc.icon;
          const isBystander = svc.id === "bystander";
          return (
            <button
              key={svc.id}
              onClick={() => onSelectService(svc)}
              className="flex min-h-[74px] flex-col items-center justify-center rounded-[4px] border border-[#c9dad2] bg-white p-2 text-center transition active:bg-[#e8f3ee]"
              aria-label={svc.label}
            >
              <Icon
                className={cx("h-5 w-5", svc.urgent ? "text-[#c8322a]" : "text-[#12855f]")}
                strokeWidth={2.1}
              />
              <span className="mt-1.5 text-[12px] font-bold leading-tight text-[#0a3d2e]">
                {svc.label}
              </span>
              <span className="text-[10px] font-medium text-[#5a7368]">
                {isBystander ? "Report" : svc.number}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Home Page: Sole permanent Call 112 CTA
function HomePage({
  profile,
  location,
  setPage,
  startAlert,
  services,
  onServiceSelect,
  presetIndex,
  setPresetIndex,
}) {
  return (
    <div className="w-full px-4 pb-8 pt-3">
      {/* 1. Location Strip */}
      <button
        onClick={() => setPage("location")}
        className="flex min-h-[56px] w-full items-center gap-3 border-b border-[#c9dad2] text-left active:bg-[#e8f3ee]/50"
      >
        <MapPin className="h-5 w-5 shrink-0 text-[#12855f]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-bold text-[#0a3d2e]">{location}</p>
          <p className="text-[12px] text-[#5a7368]">Your phone's current location</p>
        </div>
        <span className="min-h-12 px-2 text-[14px] font-bold leading-[48px] text-[#12855f]">
          Edit
        </span>
      </button>

      {/* 2. Swipeable SOS Preset Area */}
      <div className="mt-3">
        <SosPresetSelector
          presets={sosPresets}
          selectedIndex={presetIndex}
          setSelectedIndex={setPresetIndex}
          onActivate={(preset) => startAlert(preset)}
        />
      </div>

      {/* 3. The ONLY dedicated permanent Call 112 CTA in the application */}
      <div className="mt-4">
        <a
          href="tel:112"
          className="flex min-h-[68px] w-full items-center justify-center gap-3 rounded-[6px] border-2 border-[#c8322a] bg-white text-[22px] font-extrabold text-[#c8322a] transition active:bg-[#fff3f1]"
        >
          <Phone className="h-6 w-6 text-[#c8322a]" /> Call 112
        </a>
      </div>

      {/* 4. Contact Emergency Services Grid */}
      <div className="mt-4">
        <EmergencyServicesGrid
          services={services}
          onSelectService={onServiceSelect}
        />
      </div>

      {/* 5. Selected Patient Row */}
      <div className="mt-5 border-t border-[#c9dad2]">
        <button
          onClick={() => setPage("personPicker")}
          className="flex min-h-[74px] w-full items-center gap-3 text-left active:bg-[#e8f3ee]/40"
        >
          <div className="grid h-11 w-11 place-items-center bg-[#e8f3ee] font-extrabold text-[#12855f] rounded-[4px]">
            {profile.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-[#5a7368]">Patient</p>
            <p className="mt-0.5 truncate text-[17px] font-bold text-[#0a3d2e]">
              {profile.name} · {profile.age}
            </p>
          </div>
          <span className="min-h-12 px-2 text-[14px] font-bold leading-[48px] text-[#12855f]">
            Change
          </span>
        </button>
      </div>
    </div>
  );
}

// Universal 5-Second Countdown Screen
function Countdown({ preset, cancel, complete }) {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds <= 0) {
      complete();
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, complete]);

  const desc = useMemo(() => {
    if (preset.mode === "hyper") {
      return "Location, MediCard and connected-family alerts will initialize.";
    }
    if (preset.mode === "reach") {
      return "Location sharing and trusted-contact alerts will initialize.";
    }
    if (preset.mode === "bystander") {
      return "Location and bystander observations will be prepared. Account MediCard is NOT attached.";
    }
    if (preset.number) {
      return `ResQ will prepare the phone dialer for ${preset.number}.`;
    }
    return "Emergency action initializing.";
  }, [preset]);

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      <div className="mx-auto flex h-[100dvh] w-full max-w-[440px] flex-col px-5 pb-[max(22px,env(safe-area-inset-bottom))] pt-8">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#c8322a]">
            Starting
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#c8322a]">
            {preset.title.toUpperCase()}
          </p>
          <div
            className="mt-6 text-[110px] font-extrabold leading-none text-[#c8322a] select-none"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            {seconds}
          </div>
          <h1
            className="mt-5 text-[26px] font-extrabold tracking-[-0.035em] text-[#0a3d2e]"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            Starting in {seconds} seconds
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-6 text-[#5a7368]">
            {desc}
          </p>
        </div>

        <button
          onClick={cancel}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[4px] border-2 border-[#c8322a] bg-white text-[16px] font-bold text-[#c8322a] active:bg-[#fff3f1]"
        >
          <X className="h-5 w-5" /> Cancel
        </button>
      </div>
    </div>
  );
}

// 3. GET RESQ RESULT SCREEN (No Call 112, Truthful status, Callback requested)
function GetResqResultScreen({
  session,
  location,
  cancel,
  openPicker,
  onOpenAddDetail,
  onOpenLocation,
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const progressItems = [
    { label: "SOS session created", done: true, detail: `Session ID: ${session.id}` },
    { label: "Location found", done: true, detail: location },
    { label: "MediCard prepared", done: true, detail: `Blood: ${session.profile.bloodGroup} · Allergy: ${session.profile.allergies[0] || "None"}` },
    { label: `Alert sent to ${session.profile.contact.split("·")[0].trim()}`, done: true, detail: "SMS & push dispatch logged" },
    { label: "ResQ callback requested", done: false, detail: "In queue for automatic coordinator callback" },
  ];

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#c9dad2] px-4">
        <Logo />
        <button
          onClick={cancel}
          className="min-h-12 px-2 text-[14px] font-bold text-[#c8322a] active:opacity-75"
        >
          Cancel Get ResQ
        </button>
      </header>

      {/* Main Status Headline Block */}
      <section className="shrink-0 border-l-4 border-l-[#c8322a] bg-[#e8f3ee] px-4 py-4" aria-live="assertive">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#5a7368]">
            Get ResQ Active · {mm}:{ss}
          </p>
        </div>
        <h1
          className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-[#0a3d2e]"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
        >
          GET RESQ STARTED
        </h1>
        <p className="mt-1 text-[18px] font-bold text-[#c8322a]">
          You’ll receive a call soon.
        </p>
        <p className="mt-1 text-[14px] leading-5 text-[#5a7368]">
          Your location, MediCard and connected-family alerts are being prepared.
        </p>
      </section>

      {/* Truthful Progress List */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#12855f] mb-2.5">
          Emergency Status
        </p>

        <div className="space-y-3">
          {progressItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-[4px] border border-[#c9dad2] bg-white p-3">
              <div
                className={cx(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full mt-0.5",
                  item.done ? "bg-[#12855f] text-white" : "border border-[#c9dad2] bg-[#e8f3ee] text-[#5a7368]"
                )}
              >
                {item.done ? <Check className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-[#0a3d2e]">{item.label}</p>
                <p className="text-[12px] text-[#5a7368]">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Detail Row */}
        <div className="mt-4 border-t border-[#c9dad2] pt-3">
          <Row
            label="Incident Details"
            value={session.detail || "No additional details added"}
            action="Add / Edit"
            onClick={onOpenAddDetail}
            icon={AlertCircle}
          />
        </div>
      </div>

      {/* Primary Actions: NO Call 112 CTA */}
      <div className="shrink-0 border-t border-[#c9dad2] bg-white p-4 space-y-2.5 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenLocation}
            className="flex min-h-12 items-center justify-center gap-1.5 rounded-[4px] border border-[#c9dad2] bg-white text-[14px] font-bold text-[#0a3d2e] active:bg-[#e8f3ee]"
          >
            <MapPin className="h-4 w-4 text-[#12855f]" /> Update location
          </button>
          <button
            onClick={openPicker}
            className="flex min-h-12 items-center justify-center gap-1.5 rounded-[4px] border border-[#c9dad2] bg-white text-[14px] font-bold text-[#0a3d2e] active:bg-[#e8f3ee]"
          >
            <UserRound className="h-4 w-4 text-[#12855f]" /> Change patient
          </button>
        </div>

        <button
          onClick={onOpenAddDetail}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-[#12855f] text-[15px] font-bold text-white active:bg-[#0a3d2e]"
        >
          <Plus className="h-4 w-4" /> Add emergency details
        </button>

        <button
          onClick={cancel}
          className="flex min-h-11 w-full items-center justify-center rounded-[4px] text-[13px] font-bold text-[#c8322a] active:opacity-75"
        >
          Cancel Get ResQ
        </button>
      </div>
    </div>
  );
}

// 6 & 9. REACH ME TRACKING INTERFACE (Uber-like operational layout, Video Stamp, Truthful status)
function ReachMeTrackingScreen({
  session,
  location,
  cancel,
  onOpenTextComposer,
  onOpenVideoStamp,
  onOpenLocation,
  isSimulatedAccepted,
  onToggleSimulation,
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white">
      {/* A. Status Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#c9dad2] px-4">
        <Logo />
        <button
          onClick={cancel}
          className="min-h-12 px-2 text-[14px] font-bold text-[#c8322a] active:opacity-75"
        >
          Cancel
        </button>
      </header>

      {/* Incident Status Banner */}
      <section className="shrink-0 border-l-4 border-l-[#12855f] bg-[#e8f3ee] px-4 py-3.5" aria-live="assertive">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#12855f]">
            REACH ME ACTIVE · {mm}:{ss}
          </p>
          <button
            onClick={onToggleSimulation}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#5a7368] border border-[#c9dad2]"
            title="Toggle developer provider accepted preview"
          >
            {isSimulatedAccepted ? "Dev: Revert to Waiting" : "Dev: Simulate Acceptance"}
          </button>
        </div>

        {isSimulatedAccepted ? (
          <>
            <h1
              className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#0a3d2e]"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              Emergency services are reaching you
            </h1>
            <p className="mt-0.5 text-[14px] font-medium text-[#12855f]">
              Stay at the shared location if it is safe to do so.
            </p>
          </>
        ) : (
          <>
            <h1
              className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#0a3d2e]"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              Connecting you with emergency services
            </h1>
            <p className="mt-0.5 text-[14px] text-[#5a7368]">
              Your location and emergency details are being prepared.
            </p>
          </>
        )}
      </section>

      {/* B. Operational Location Surface */}
      <div className="shrink-0 border-b border-[#c9dad2] bg-[#f8fbf9] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12855f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#12855f]"></span>
            </div>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#0a3d2e]">
              Shared Emergency Location
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#5a7368]">GPS Accuracy ±6m</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between rounded-[4px] border border-[#c9dad2] bg-white p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-[#0a3d2e]">{location}</p>
            <p className="text-[11px] text-[#5a7368]">Live coordinates broadcast to responders</p>
          </div>
          <button
            onClick={onOpenLocation}
            className="ml-3 grid h-9 w-9 shrink-0 place-items-center rounded bg-[#e8f3ee] text-[#12855f] active:bg-[#c9dad2]"
            aria-label="Recenter location"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content: Status Sheet, Updates, Connected Profiles */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-4">
        {/* C. Service Status Sheet */}
        {isSimulatedAccepted ? (
          <div className="rounded-[4px] border-2 border-[#12855f] bg-[#e8f3ee] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#12855f]">
                Dispatched Responder
              </span>
              <span className="text-[11px] font-bold text-[#0a3d2e]">Vehicle: KA-01-EQ-4122</span>
            </div>
            <p className="text-[17px] font-extrabold text-[#0a3d2e]">City Care Quick Response</p>
            <p className="text-[13px] text-[#5a7368]">Basic Life Support Ambulance</p>
            <div className="border-t border-[#c9dad2] pt-2">
              <p className="text-[15px] font-bold text-[#12855f]">Provider’s estimate: 12 minutes</p>
              <p className="text-[11px] text-[#5a7368]">Updated at 7:12 AM. This estimate may change.</p>
            </div>
            <a
              href="tel:+918044551199"
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded bg-[#12855f] text-[14px] font-bold text-white"
            >
              <Phone className="h-4 w-4" /> Call provider (+91 80 4455 1199)
            </a>
          </div>
        ) : (
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#12855f] mb-2">
              STATUS
            </p>
            <div className="space-y-2">
              {[
                { label: "Request created", status: "Reach Me session active", done: true },
                { label: "Location found", status: location, done: true },
                { label: "MediCard ready", status: `${session.profile.name} (B+)`, done: true },
                { label: "Waiting for service confirmation", status: "Submitting to local emergency dispatch", done: false },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#e8f3ee] py-1.5 text-[14px]">
                  <span className="font-bold text-[#0a3d2e]">{item.label}</span>
                  <span className={cx("text-[12px]", item.done ? "text-[#12855f] font-semibold" : "text-[#5a7368]")}>
                    {item.done ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* D. Updates Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#12855f]">
              UPDATES
            </p>
            <span className="text-[11px] text-[#5a7368]">
              {session.updates?.length || 0} attached
            </span>
          </div>

          {!session.updates || session.updates.length === 0 ? (
            <p className="text-[13px] text-[#5a7368] italic py-2">
              No additional details yet. Add text observations or attach a Video Stamp.
            </p>
          ) : (
            <div className="space-y-2">
              {session.updates.map((upd) => (
                <div key={upd.id} className="rounded border border-[#c9dad2] bg-[#f8fbf9] p-3 text-[13px]">
                  <div className="flex items-center justify-between text-[#5a7368]">
                    <span className="font-bold text-[#12855f]">{upd.source || "You reported"}</span>
                    <span>{upd.timestamp}</span>
                  </div>
                  {upd.type === "video" ? (
                    <div className="mt-1 flex items-center gap-2 font-bold text-[#0a3d2e]">
                      <Video className="h-4 w-4 text-[#12855f]" />
                      <span>Video Stamp attached ({upd.duration})</span>
                      <span className="ml-auto text-[11px] font-normal text-[#5a7368]">{upd.storageStatus}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-[#0a3d2e] font-medium leading-relaxed">{upd.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Add Update Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={onOpenTextComposer}
              className="flex min-h-12 items-center justify-center gap-1.5 rounded-[4px] border border-[#12855f] bg-white text-[14px] font-bold text-[#12855f] active:bg-[#e8f3ee]"
            >
              <Plus className="h-4 w-4" /> Add text update
            </button>
            <button
              onClick={onOpenVideoStamp}
              className="flex min-h-12 items-center justify-center gap-1.5 rounded-[4px] bg-[#12855f] text-[14px] font-bold text-white active:bg-[#0a3d2e]"
            >
              <Camera className="h-4 w-4" /> Start Video Stamp
            </button>
          </div>
        </div>

        {/* E. Connected Profiles */}
        <div className="border-t border-[#c9dad2] pt-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#12855f] mb-1">
            CONNECTED PROFILES
          </p>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-[#12855f]" />
              <span className="text-[14px] font-bold text-[#0a3d2e]">2 contacts alerted</span>
            </div>
            <span className="text-[12px] font-semibold text-[#12855f]">Location sharing active</span>
          </div>
          <p className="text-[12px] text-[#5a7368]">{session.profile.contact}</p>
        </div>
      </div>

      {/* Bottom Action Footer (NO Call 112 CTA) */}
      <div className="shrink-0 border-t border-[#c9dad2] bg-white p-3.5 space-y-2 pb-[max(14px,env(safe-area-inset-bottom))]">
        <button
          onClick={onOpenLocation}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded border border-[#c9dad2] text-[14px] font-bold text-[#0a3d2e] active:bg-[#e8f3ee]"
        >
          <MapPin className="h-4 w-4 text-[#12855f]" /> Update location
        </button>
        <button
          onClick={cancel}
          className="flex min-h-10 w-full items-center justify-center text-[13px] font-bold text-[#c8322a] active:opacity-75"
        >
          Cancel Reach Me
        </button>
      </div>
    </div>
  );
}

// 7. TEXT UPDATE COMPOSER
function TextUpdateComposer({ onClose, onSave }) {
  const [text, setText] = useState("");

  const quickChips = [
    "Patient is conscious",
    "Patient is not responding",
    "Breathing difficulty",
    "Heavy bleeding",
    "Accident or fall",
    "Location is difficult to access",
    "Unknown",
  ];

  function appendChip(chip) {
    setText((prev) => (prev ? `${prev}. ${chip}` : chip));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end bg-[#0a3d2e]/35" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85dvh] w-full overflow-y-auto rounded-t-[8px] bg-white p-4 pb-[max(20px,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-between border-b border-[#c9dad2] pb-3">
          <h3
            className="text-[18px] font-extrabold text-[#0a3d2e]"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            Describe what is happening
          </h3>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center text-[#12855f]">
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="mt-2 text-[12px] text-[#5a7368]">Quick entries (tap to add):</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => appendChip(chip)}
              className="rounded-[4px] border border-[#c9dad2] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#0a3d2e] active:bg-[#e8f3ee]"
            >
              + {chip}
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add details emergency services should know."
          className="mt-3 w-full rounded border border-[#c9dad2] p-3 text-[14px] text-[#0a3d2e] placeholder:text-[#5a7368]/60 focus:border-[#12855f] focus:outline-none"
        />

        <div className="mt-3 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 min-h-12 rounded border border-[#c9dad2] text-[14px] font-bold text-[#0a3d2e]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (text.trim()) {
                onSave(text.trim());
                onClose();
              }
            }}
            disabled={!text.trim()}
            className="flex-1 min-h-12 rounded bg-[#12855f] text-[14px] font-bold text-white disabled:opacity-40"
          >
            Save update
          </button>
        </div>
      </div>
    </div>
  );
}

// 8. VIDEO STAMP MODAL (MediaDevices.getUserMedia, camera tracks strictly stopped on close)
function VideoStampModal({ sessionId, location, onClose, onAttach }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [step, setStep] = useState("init"); // init, recording, review, denied, unsupported
  const [recordSec, setRecordSec] = useState(0);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);

  // Stop camera tracks cleanly
  function stopCameraTracks() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraTracks();
      if (videoBlobUrl) {
        URL.revokeObjectURL(videoBlobUrl);
      }
    };
  }, [videoBlobUrl]);

  // Request camera and microphone
  async function initCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStep("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep("ready");
    } catch (err) {
      setStep("denied");
    }
  }

  useEffect(() => {
    initCamera();
  }, []);

  // Timer while recording
  useEffect(() => {
    let timer;
    if (step === "recording") {
      timer = setInterval(() => {
        setRecordSec((s) => {
          if (s >= 30) {
            stopRecording();
            return 30;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    setRecordSec(0);

    try {
      const recorder = new MediaRecorder(streamRef.current);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoBlobUrl(url);
        setStep("review");
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setStep("recording");
    } catch (_) {
      setStep("denied");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  function handleRetake() {
    if (videoBlobUrl) {
      URL.revokeObjectURL(videoBlobUrl);
      setVideoBlobUrl(null);
    }
    setRecordSec(0);
    initCamera();
  }

  function handleAttach() {
    stopCameraTracks();
    onAttach({
      duration: `${recordSec}s`,
      timestamp: timeNow(),
      locationStatus: "Location attached",
      storageStatus: "Stored on this device",
    });
    onClose();
  }

  function handleClose() {
    stopCameraTracks();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 bg-black/80">
        <div>
          <span className="text-[14px] font-bold">Video Stamp</span>
          <span className="ml-2 text-[11px] text-white/70">ID: {sessionId}</span>
        </div>
        <button onClick={handleClose} className="p-2 text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Viewport Area */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {step === "denied" ? (
          <div className="p-6 text-center">
            <Camera className="mx-auto h-12 w-12 text-[#c8322a]" />
            <h3 className="mt-3 text-[18px] font-bold">Camera Access Denied</h3>
            <p className="mt-2 text-[14px] text-white/70 max-w-xs">
              Camera and microphone permissions are required to capture a Video Stamp.
            </p>
            <button
              onClick={handleClose}
              className="mt-5 rounded bg-white px-5 py-2.5 text-[14px] font-bold text-[#0a3d2e]"
            >
              Close
            </button>
          </div>
        ) : step === "unsupported" ? (
          <div className="p-6 text-center">
            <Video className="mx-auto h-12 w-12 text-[#c8322a]" />
            <h3 className="mt-3 text-[18px] font-bold">Video Not Supported</h3>
            <p className="mt-2 text-[14px] text-white/70">
              Your browser does not support in-app video capture.
            </p>
            <button
              onClick={handleClose}
              className="mt-5 rounded bg-white px-5 py-2.5 text-[14px] font-bold text-[#0a3d2e]"
            >
              Close
            </button>
          </div>
        ) : step === "review" && videoBlobUrl ? (
          <video
            src={videoBlobUrl}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        )}

        {/* Live Stamped HUD */}
        {(step === "ready" || step === "recording") && (
          <div className="absolute top-3 left-3 right-3 rounded bg-black/60 p-2 text-[12px] space-y-0.5 pointer-events-none">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#12855f]">STAMP: {timeNow()}</span>
              {step === "recording" && (
                <div className="flex items-center gap-1.5 text-[#c8322a] font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c8322a] animate-pulse"></span>
                  <span>REC 00:{String(recordSec).padStart(2, "0")} / 00:30</span>
                </div>
              )}
            </div>
            <p className="truncate text-white/80">Loc: {location}</p>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="h-28 bg-black/90 px-5 flex items-center justify-around pb-[max(12px,env(safe-area-inset-bottom))]">
        {step === "ready" && (
          <button
            onClick={startRecording}
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#c8322a] text-white active:scale-95"
            aria-label="Start recording"
          >
            <Circle className="h-7 w-7 fill-white" />
          </button>
        )}

        {step === "recording" && (
          <button
            onClick={stopRecording}
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#c8322a] text-white active:scale-95"
            aria-label="Stop recording"
          >
            <Square className="h-6 w-6 fill-white" />
          </button>
        )}

        {step === "review" && (
          <div className="flex w-full items-center justify-between gap-3">
            <button
              onClick={handleRetake}
              className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded border border-white text-[14px] font-bold text-white active:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" /> Retake
            </button>
            <button
              onClick={handleAttach}
              className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded bg-[#12855f] text-[14px] font-bold text-white active:bg-[#0a3d2e]"
            >
              <Check className="h-4 w-4" /> Attach to Incident
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Service Calling Session Screen (Police, Fire, Helpline - NO duplicated Call 112)
function ServiceCallSessionScreen({ session, location, cancel }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#c9dad2] px-4">
        <Logo />
        <button onClick={cancel} className="min-h-12 px-2 text-[14px] font-bold text-[#c8322a]">
          Cancel
        </button>
      </header>

      <section className="shrink-0 border-l-4 border-l-[#c8322a] bg-[#e8f3ee] px-4 py-4" aria-live="assertive">
        <p className="text-[12px] font-bold text-[#5a7368]">Calling interface active · {mm}:{ss}</p>
        <h1
          className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#0a3d2e]"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
        >
          {session.statusTitle}
        </h1>
        <p className="mt-1 text-[15px] leading-5 text-[#5a7368]">{session.statusDetail}</p>
      </section>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3">
        <Row label="Destination" value={`${session.preset.title}`} icon={Phone} />
        <Row label="Calling Number" value={session.preset.number || "Configured line"} icon={Phone} />
        <Row label="Location" value={location} icon={MapPin} />

        <div className="pt-2">
          <button
            onClick={() => {
              if (session.preset.number) window.location.href = `tel:${session.preset.number}`;
            }}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#12855f] text-[15px] font-bold text-white"
          >
            <Phone className="h-4 w-4" /> Redial {session.preset.number}
          </button>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#c9dad2] p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={cancel}
          className="flex min-h-12 w-full items-center justify-center rounded border border-[#c9dad2] text-[14px] font-bold text-[#c8322a]"
        >
          End Session
        </button>
      </div>
    </div>
  );
}

// Bystander Active Session Screen (NO duplicated Call 112)
function BystanderSessionScreen({ session, location, cancel, onOpenAddDetail }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#c9dad2] px-4">
        <Logo />
        <button onClick={cancel} className="min-h-12 px-2 text-[14px] font-bold text-[#c8322a]">
          Cancel
        </button>
      </header>

      <section className="shrink-0 border-l-4 border-l-[#12855f] bg-[#e8f3ee] px-4 py-4" aria-live="assertive">
        <p className="text-[12px] font-bold text-[#5a7368]">Bystander report logged · {mm}:{ss}</p>
        <h1
          className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#0a3d2e]"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
        >
          Bystander SOS Active
        </h1>
        <p className="mt-1 text-[15px] leading-5 text-[#5a7368]">
          Incident reported for an unknown person. Your personal MediCard is NOT attached.
        </p>
      </section>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3">
        <Row label="Patient" value="Unknown bystander" icon={UserRound} />
        <Row label="Location" value={location} icon={MapPin} />
        {session.bystanderData && (
          <div className="rounded border border-[#c9dad2] bg-[#f8fbf9] p-3 text-[13px] space-y-1">
            <p><span className="font-bold">Observations:</span> {session.bystanderData.observations || "None reported"}</p>
            <p><span className="font-bold">Category:</span> {session.bystanderData.ageGroup} · <span className="font-bold">Conscious:</span> {session.bystanderData.consciousness}</p>
            <p><span className="font-bold">Landmark:</span> {session.bystanderData.landmark || "GPS location"}</p>
          </div>
        )}
        <Row label="MediCard" value="No MediCard attached · Bystander mode" icon={FileHeart} />
      </div>

      <div className="shrink-0 border-t border-[#c9dad2] p-4 pb-[max(16px,env(safe-area-inset-bottom))] space-y-2">
        <button
          onClick={onOpenAddDetail}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#12855f] text-[15px] font-bold text-white"
        >
          <Plus className="h-4 w-4" /> Add observation update
        </button>
        <button
          onClick={cancel}
          className="flex min-h-11 w-full items-center justify-center rounded text-[13px] font-bold text-[#c8322a]"
        >
          Cancel report
        </button>
      </div>
    </div>
  );
}

// Person Picker Bottom Sheet
function PersonPicker({ profiles, selected, choose, close }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-[#0a3d2e]/25" onClick={close}>
      <section
        onClick={(e) => e.stopPropagation()}
        className="max-h-[82dvh] w-full overflow-y-auto rounded-t-[8px] bg-white pb-[max(18px,env(safe-area-inset-bottom))]"
      >
        <div className="flex h-16 items-center justify-between border-b border-[#c9dad2] px-4">
          <h2
            className="text-[22px] font-extrabold text-[#0a3d2e]"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            Who needs help?
          </h2>
          <button onClick={close} className="grid h-12 w-12 place-items-center text-[#12855f]">
            <X className="h-6 w-6" />
          </button>
        </div>

        {profiles.map((person) => (
          <button
            key={person.id}
            onClick={() => choose(person)}
            className="flex min-h-[76px] w-full items-center gap-3 border-b border-[#c9dad2] px-4 text-left active:bg-[#e8f3ee]"
          >
            <div className="grid h-11 w-11 place-items-center bg-[#e8f3ee] font-extrabold text-[#12855f] rounded-[4px]">
              {person.initials}
            </div>
            <div className="flex-1">
              <p className="text-[17px] font-bold text-[#0a3d2e]">{person.name}</p>
              <p className="mt-0.5 text-[13px] text-[#5a7368]">
                {person.relation} · {person.age} years
              </p>
            </div>
            {selected.id === person.id && <Check className="h-5 w-5 text-[#12855f]" />}
          </button>
        ))}

        <button
          onClick={() =>
            choose({
              ...profiles[0],
              id: "someone",
              name: "Someone else",
              relation: "Unknown person",
              age: "Adult",
              initials: "?",
              conditions: ["Unknown"],
              allergies: ["Unknown"],
              medicines: ["Unknown"],
            })
          }
          className="flex min-h-[64px] w-full items-center gap-3 border-b border-[#c9dad2] px-4 text-left text-[16px] font-bold text-[#12855f] active:bg-[#e8f3ee]"
        >
          Someone else
        </button>

        <button
          onClick={() =>
            choose({
              ...profiles[0],
              id: "unknown",
              name: "Unknown person",
              relation: "No profile",
              age: "Unknown",
              initials: "?",
              conditions: ["Unknown"],
              allergies: ["Unknown"],
              medicines: ["Unknown"],
            })
          }
          className="flex min-h-[64px] w-full items-center gap-3 px-4 text-left text-[16px] font-bold text-[#12855f] active:bg-[#e8f3ee]"
        >
          I don't know this person
        </button>
      </section>
    </div>
  );
}

// Bystander Report Initial Sheet
function BystanderBottomSheet({ location, onClose, onStartBystanderSos }) {
  const [ageGroup, setAgeGroup] = useState("Unknown");
  const [consciousness, setConsciousness] = useState("Unknown");
  const [breathing, setBreathing] = useState("Unknown");
  const [observations, setObservations] = useState("");
  const [landmark, setLandmark] = useState("");

  const ageOptions = ["Child", "Adult", "Senior", "Unknown"];
  const consciousOptions = ["Conscious", "Unconscious", "Unknown"];
  const breathingOptions = ["Visible", "Not visible", "Unknown"];

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-[#0a3d2e]/25" onClick={onClose}>
      <section
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[8px] bg-white pb-[max(20px,env(safe-area-inset-bottom))]"
      >
        <div className="flex h-16 items-center justify-between border-b border-[#c9dad2] px-4">
          <div>
            <h2
              className="text-[20px] font-extrabold text-[#0a3d2e]"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              Report a bystander emergency
            </h2>
            <p className="text-[12px] text-[#5a7368]">Assisting someone else in distress</p>
          </div>
          <button onClick={onClose} className="grid h-12 w-12 place-items-center text-[#12855f] rounded">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="rounded-[4px] border border-[#c9dad2] bg-[#e8f3ee] p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#12855f]">Location</p>
            <p className="truncate text-[14px] font-bold text-[#0a3d2e]">{location}</p>
          </div>

          <div>
            <label className="text-[12px] font-extrabold uppercase tracking-wider text-[#5a7368]">
              Estimated Age Category (Optional)
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {ageOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAgeGroup(opt)}
                  className={cx(
                    "min-h-10 rounded-[4px] border px-3.5 text-[13px] font-bold transition",
                    ageGroup === opt
                      ? "border-[#12855f] bg-[#12855f] text-white"
                      : "border-[#c9dad2] bg-white text-[#0a3d2e]"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-extrabold uppercase tracking-wider text-[#5a7368]">
              Consciousness (Optional)
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {consciousOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setConsciousness(opt)}
                  className={cx(
                    "min-h-10 rounded-[4px] border px-3.5 text-[13px] font-bold transition",
                    consciousness === opt
                      ? "border-[#12855f] bg-[#12855f] text-white"
                      : "border-[#c9dad2] bg-white text-[#0a3d2e]"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-extrabold uppercase tracking-wider text-[#5a7368]">
              Breathing Visible (Optional)
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {breathingOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBreathing(opt)}
                  className={cx(
                    "min-h-10 rounded-[4px] border px-3.5 text-[13px] font-bold transition",
                    breathing === opt
                      ? "border-[#12855f] bg-[#12855f] text-white"
                      : "border-[#c9dad2] bg-white text-[#0a3d2e]"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-extrabold uppercase tracking-wider text-[#5a7368]">
              Nearby Landmark
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Metro Pillar 182, near tea stall"
              className="mt-1.5 min-h-11 w-full rounded-[4px] border border-[#c9dad2] px-3 text-[14px] text-[#0a3d2e] placeholder:text-[#5a7368]/60 focus:border-[#12855f] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[12px] font-extrabold uppercase tracking-wider text-[#5a7368]">
              What Can Be Observed?
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={2}
              placeholder="e.g. Road accident, fallen on side, responsive to voice"
              className="mt-1.5 w-full rounded-[4px] border border-[#c9dad2] p-3 text-[14px] text-[#0a3d2e] placeholder:text-[#5a7368]/60 focus:border-[#12855f] focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onStartBystanderSos({
                  ageGroup,
                  consciousness,
                  breathing,
                  observations,
                  landmark,
                });
              }}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[4px] bg-[#12855f] text-[16px] font-bold text-white transition active:bg-[#0a3d2e]"
            >
              <Siren className="h-5 w-5" /> Start Bystander SOS
            </button>
            <p className="mt-2 text-center text-[12px] text-[#5a7368]">
              Your account MediCard will NOT be attached to this report.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Navigation Drawer
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
          <button onClick={close} className="grid h-12 w-12 place-items-center text-[#12855f] rounded" aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>

        <button
          onClick={() => {
            setPage("medicard");
            close();
          }}
          className="flex w-full items-center gap-3 border-b border-[#c9dad2] bg-[#e8f3ee] p-4 text-left active:bg-[#e8f3ee]/80"
        >
          <div className="grid h-12 w-12 place-items-center bg-white font-extrabold text-[#12855f] rounded-[4px]">
            {profile.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-bold text-[#0a3d2e]">{profile.name}</p>
            <p className="mt-0.5 text-[13px] text-[#5a7368]">Usual SOS profile</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#12855f]" />
        </button>

        <div className="pb-8">
          {sections.map((section) => (
            <div key={section.title} className="pt-4">
              <p className="px-4 pb-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#5a7368]">
                {section.title}
              </p>
              {section.items.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => {
                    setPage(id);
                    close();
                  }}
                  className={cx(
                    "flex min-h-14 w-full items-center gap-3 border-b border-[#e8f3ee] px-4 text-left text-[15px] font-bold transition active:bg-[#e8f3ee]",
                    page === id ? "bg-[#e8f3ee] text-[#12855f]" : "text-[#0a3d2e]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          ))}

          {/* Direct APK Download Button */}
          <div className="p-4 border-t border-[#c9dad2] mt-4">
            <a
              href="/resq-debug.apk"
              download="resq-debug.apk"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#12855f] text-[14px] font-bold text-white shadow-sm active:bg-[#0a3d2e]"
            >
              <Smartphone className="h-4 w-4" /> Download Android APK (22 MB)
            </a>
            <p className="mt-1.5 text-center text-[11px] text-[#5a7368]">
              Install directly on your Android phone
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

// Plain Page Layout
function PlainPage({ title, subtitle, children, back }) {
  return (
    <div className="w-full px-4 pb-12 pt-4">
      {back && (
        <button
          onClick={back}
          className="mb-3 flex min-h-12 items-center gap-2 text-[15px] font-bold text-[#12855f] active:opacity-75"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      )}
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#12855f]">ResQ</p>
      <h1
        className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-[#0a3d2e]"
        style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
      >
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-[14px] leading-5 text-[#5a7368]">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

// MediCard Screen
function MediCard({ profile, onUpdateProfile, onBack }) {
  const [editingKey, setEditingKey] = useState(null);
  const [fieldVal, setFieldVal] = useState("");

  const groups = [
    [
      "Identity",
      [
        ["Name", profile.name, "name"],
        ["Age", String(profile.age), "age"],
        ["Blood group", profile.bloodGroup, "bloodGroup"],
        ["Phone number", profile.phone || "+91 90000 00001", "phone"],
        ["Address", profile.address || "Indiranagar, Bangalore", "address"],
      ],
    ],
    [
      "Medical",
      [
        ["Conditions", profile.conditions.join(", "), "conditions"],
        ["Allergies", profile.allergies.join(", "), "allergies"],
        ["Medicines", profile.medicines.join(", "), "medicines"],
      ],
    ],
    [
      "Emergency support",
      [
        ["Primary contact", profile.contact, "contact"],
        ["Preferred hospital", profile.hospital, "hospital"],
        ["Mediclaim", profile.mediclaim, "mediclaim"],
        ["TPA Reference", profile.mediclaimTpa || "Medi Assist TPA", "mediclaimTpa"],
      ],
    ],
  ];

  return (
    <PlainPage title="My MediCard" subtitle="The essential information needed during a medical situation." back={onBack}>
      <div className="border-y border-[#c9dad2] bg-[#e8f3ee] p-4">
        <p className="text-[19px] font-bold text-[#0a3d2e]">{profile.name}</p>
        <p className="mt-1 text-[13px] text-[#5a7368]">Last updated {profile.updated}</p>
      </div>

      {groups.map(([group, rows]) => (
        <section key={group} className="mt-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#12855f]">{group}</p>
          <div className="mt-1 border-t border-[#c9dad2]">
            {rows.map(([label, value, key]) => (
              <Row
                key={label}
                label={label}
                value={value}
                action="Edit"
                onClick={() => {
                  setEditingKey({ key, label, val: value });
                  setFieldVal(value);
                }}
              />
            ))}
          </div>
        </section>
      ))}

      {editingKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a3d2e]/35 p-4">
          <div className="w-full max-w-sm rounded-[6px] bg-white p-5">
            <h3 className="text-[18px] font-bold text-[#0a3d2e]">Edit {editingKey.label}</h3>
            <input
              type="text"
              value={fieldVal}
              onChange={(e) => setFieldVal(e.target.value)}
              className="mt-3 min-h-12 w-full rounded border border-[#c9dad2] px-3 text-[15px] text-[#0a3d2e] focus:border-[#12855f] focus:outline-none"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditingKey(null)}
                className="flex-1 min-h-11 rounded border border-[#c9dad2] text-[14px] font-bold text-[#0a3d2e]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  let updated = { ...profile, updated: "Today" };
                  if (["conditions", "allergies", "medicines"].includes(editingKey.key)) {
                    updated[editingKey.key] = fieldVal.split(",").map((s) => s.trim());
                  } else {
                    updated[editingKey.key] = fieldVal;
                  }
                  onUpdateProfile(updated);
                  setEditingKey(null);
                }}
                className="flex-1 min-h-11 rounded bg-[#12855f] text-[14px] font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </PlainPage>
  );
}

// Family Profiles Screen
function FamilyPage({ profiles, onAddFamily, onBack }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState("");

  return (
    <PlainPage title="Family profiles" subtitle="Create a managed profile or link an independent ResQ account." back={onBack}>
      <div className="border-t border-[#c9dad2]">
        {profiles.map((p) => (
          <Row
            key={p.id}
            label={`${p.relation} · ${p.age} years`}
            value={p.name}
            action="Open"
            icon={UserRound}
          />
        ))}
      </div>

      <div className="mt-5">
        <button
          onClick={() => setShowAdd(true)}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded bg-[#12855f] text-[15px] font-bold text-white"
        >
          <Plus className="h-5 w-5" /> Add or link family member
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a3d2e]/35 p-4">
          <div className="w-full max-w-sm rounded-[6px] bg-white p-5 space-y-3">
            <h3 className="text-[18px] font-bold text-[#0a3d2e]">Add Family Member</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11 w-full rounded border border-[#c9dad2] px-3 text-[14px]"
            />
            <input
              type="text"
              placeholder="Relationship (e.g. Mother, Son)"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="min-h-11 w-full rounded border border-[#c9dad2] px-3 text-[14px]"
            />
            <input
              type="text"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="min-h-11 w-full rounded border border-[#c9dad2] px-3 text-[14px]"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 min-h-11 rounded border border-[#c9dad2] text-[14px] font-bold text-[#0a3d2e]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (name.trim()) {
                    const initials = name
                      .trim()
                      .split(" ")
                      .map((w) => w[0]?.toUpperCase())
                      .slice(0, 2)
                      .join("");
                    onAddFamily({
                      id: `fam_${Date.now()}`,
                      name,
                      relation: relation || "Family",
                      age: age || "Adult",
                      initials: initials || "FM",
                      bloodGroup: "Unknown",
                      allergies: ["No allergy added"],
                      conditions: ["No condition added"],
                      medicines: ["No medicine added"],
                      updated: "Today",
                    });
                    setShowAdd(false);
                  }
                }}
                className="flex-1 min-h-11 rounded bg-[#12855f] text-[14px] font-bold text-white"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </PlainPage>
  );
}

// Simple List Page
function SimpleListPage({ title, subtitle, rows, onBack }) {
  return (
    <PlainPage title={title} subtitle={subtitle} back={onBack}>
      <div className="border-t border-[#c9dad2]">
        {rows.map((row, idx) => (
          <Row key={idx} label={row[0]} value={row[1]} action={row[2] || ""} onClick={row[3]} />
        ))}
      </div>
    </PlainPage>
  );
}

// Main App Container
export default function App() {
  const [page, setPage] = useState("home");
  const [drawer, setDrawer] = useState(false);
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem("resq_profiles");
      return saved ? JSON.parse(saved) : defaultProfiles;
    } catch (_) {
      return defaultProfiles;
    }
  });
  const [profile, setProfile] = useState(() => profiles[0]);
  const [location, setLocation] = useState("12.9716, 77.5946 · Bangalore");
  const [presetIndex, setPresetIndex] = useState(0);
  const [countdownPreset, setCountdownPreset] = useState(null);
  const [session, setSession] = useState(null);
  const [picker, setPicker] = useState(false);
  const [bystanderSheet, setBystanderSheet] = useState(false);
  const [services] = useState(initialEmergencyServices);
  const [textComposerOpen, setTextComposerOpen] = useState(false);
  const [videoStampOpen, setVideoStampOpen] = useState(false);
  const [isSimulatedAccepted, setIsSimulatedAccepted] = useState(false);

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("resq_history");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "H-1",
              title: "Reach Me check-in",
              date: "15 Sep 2026",
              time: "08:42 PM",
              patientName: "Suvan Pantina",
              status: "Completed without escalation",
            },
          ];
    } catch (_) {
      return [];
    }
  });

  const touchStart = useRef(null);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem("resq_profiles", JSON.stringify(profiles));
    } catch (_) {}
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem("resq_history", JSON.stringify(history));
    } catch (_) {}
  }, [history]);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)} · GPS`);
      },
      () => {},
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

    const sessionId = `RQ-${Math.floor(1000 + Math.random() * 9000)}`;

    if (preset.mode === "bystander") {
      setSession({
        id: sessionId,
        profile: { ...profile, name: "Unknown bystander", allergies: ["None attached"] },
        preset,
        bystanderData: preset.bystanderData,
        statusTitle: "Bystander SOS active",
        statusDetail: "Location & bystander report logged. Personal MediCard is NOT attached.",
        familyStatus: "Bystander report active",
        detail: preset.bystanderData?.observations || "",
        updates: [],
      });
      return;
    }

    if (preset.mode === "reach") {
      setSession({
        id: `RM-${Math.floor(1000 + Math.random() * 9000)}`,
        profile,
        preset,
        statusTitle: "Connecting you with emergency services",
        statusDetail: "Your location and emergency details are being prepared.",
        updates: [],
      });
      setIsSimulatedAccepted(false);
      return;
    }

    if (preset.mode === "call") {
      setSession({
        id: sessionId,
        profile,
        preset,
        statusTitle: `Calling ${preset.title}`,
        statusDetail: `Opening phone calling flow for ${preset.number}.`,
        detail: "",
      });
      if (preset.number) {
        window.location.href = `tel:${preset.number}`;
      }
      return;
    }

    // Default: Get ResQ
    setSession({
      id: sessionId,
      profile,
      preset,
      statusTitle: "Get ResQ started",
      statusDetail: "Your location, MediCard and connected-family alerts are being prepared.",
      detail: "",
      updates: [],
    });
  }

  function handleServiceSelect(svc) {
    if (svc.id === "bystander") {
      setBystanderSheet(true);
      return;
    }

    if (!svc.number) {
      alert(`Service ${svc.label} does not have a configured helpline. Call 112 for all emergencies.`);
      return;
    }

    startAlert({
      id: svc.id,
      title: `${svc.label.toUpperCase()} · ${svc.number}`,
      subtitle: svc.desc,
      number: svc.number,
      mode: "call",
      alerts: false,
    });
  }

  function handleStartBystanderSos(bystanderData) {
    setBystanderSheet(false);
    startAlert({
      id: "bystander",
      title: "Bystander SOS",
      subtitle: "Emergency aid for another person",
      number: null,
      mode: "bystander",
      bystanderData,
      alerts: false,
    });
  }

  function choosePerson(person) {
    setProfile(person);
    if (session) {
      setSession({
        ...session,
        profile: person,
      });
    }
    setPicker(false);
    if (!session) setPage("home");
  }

  function cancelSOS() {
    if (session) {
      setHistory((prev) => [
        {
          id: session.id,
          title: session.preset.title,
          date: dateNow(),
          time: timeNow(),
          patientName: session.profile.name,
          status: "Resolved by user",
        },
        ...prev,
      ]);
    }
    setSession(null);
    setIsSimulatedAccepted(false);
    setPage("home");
  }

  function addSessionUpdate(updateObj) {
    if (!session) return;
    setSession((prev) => ({
      ...prev,
      updates: [updateObj, ...(prev.updates || [])],
    }));
  }

  // Left-edge right-swipe to open navigation drawer
  function onTouchStart(e) {
    if (session || countdownPreset || bystanderSheet || picker || textComposerOpen || videoStampOpen) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onTouchEnd(e) {
    if (!touchStart.current || session || countdownPreset || bystanderSheet || picker || textComposerOpen || videoStampOpen) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const startedLeft = touchStart.current.x < 72;
    if (startedLeft && dx > 60 && Math.abs(dy) < 40) {
      setDrawer(true);
    }
    touchStart.current = null;
  }

  const body = useMemo(() => {
    if (session) return null;
    switch (page) {
      case "medicard":
        return (
          <MediCard
            profile={profile}
            onUpdateProfile={(updated) => {
              setProfile(updated);
              setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            }}
            onBack={() => setPage("home")}
          />
        );
      case "family":
        return (
          <FamilyPage
            profiles={profiles}
            onAddFamily={(newP) => setProfiles((prev) => [...prev, newP])}
            onBack={() => setPage("home")}
          />
        );
      case "contacts":
        return (
          <SimpleListPage
            title="Emergency contacts"
            subtitle="Choose who receives ResQ alerts."
            rows={[
              ["Primary contact", profile.contact, "Edit"],
              ["Automatic alerts", "Enabled for Get ResQ", "Change"],
              ["Secondary contact", profile.additionalContacts[0] || "None", "Edit"],
            ]}
            onBack={() => setPage("home")}
          />
        );
      case "mediclaim":
        return (
          <SimpleListPage
            title="Mediclaim"
            subtitle="Policy details available during a medical situation."
            rows={[
              ["Policy reference", profile.mediclaim, "Edit"],
              ["TPA Provider", profile.mediclaimTpa || "Not added", "Edit"],
              ["24x7 Helpline", profile.mediclaimHelpline || "Not added", "Edit"],
            ]}
            onBack={() => setPage("home")}
          />
        );
      case "hospitals":
        return (
          <SimpleListPage
            title="Preferred hospitals"
            subtitle="A preference only. Emergency professionals decide the destination."
            rows={[
              ["Preferred hospital", profile.hospital, "Edit"],
              ["Emergency desk phone", profile.hospitalPhone || "Not added", "Edit"],
            ]}
            onBack={() => setPage("home")}
          />
        );
      case "history":
        return (
          <SimpleListPage
            title="Emergency history"
            subtitle="A factual record of previous ResQ activity."
            rows={
              history.length === 0
                ? [["No previous events", "Your emergency activity will appear here", ""]]
                : history.map((h) => [
                    `${h.title} · ${h.date} ${h.time}`,
                    `${h.patientName} (${h.status})`,
                    "Factual record",
                  ])
            }
            onBack={() => setPage("home")}
          />
        );
      case "settings":
        return (
          <SimpleListPage
            title="Permissions & privacy"
            subtitle="Control what ResQ can access and share."
            rows={[
              ["Download Android APK", "resq-debug.apk (22 MB)", "Download", () => window.open("/resq-debug.apk", "_blank")],
              ["Location tracking", "While using ResQ", "Active"],
              ["Family emergency alerts", "On for Get ResQ", "Change"],
              ["Medical sharing", "Concise emergency summary only", "Change"],
              ["Language", "English", "Change"],
              ["Factual status model", "No artificial ambulance fleets", "Verified"],
            ]}
            onBack={() => setPage("home")}
          />
        );
      case "location":
        return (
          <SimpleListPage
            title="Location"
            subtitle="ResQ uses phone coordinates. Confirm if patient is elsewhere."
            rows={[
              ["Current location", location, "Refresh", () => setLocation("12.9716, 77.5946 · Refreshed")],
              ["Home address", profile.address || "Not added", "Edit"],
              ["Patient location", "With me", "Change"],
            ]}
            onBack={() => setPage("home")}
          />
        );
      default:
        return (
          <HomePage
            profile={profile}
            location={location}
            setPage={setPage}
            startAlert={startAlert}
            services={services}
            onServiceSelect={handleServiceSelect}
            presetIndex={presetIndex}
            setPresetIndex={setPresetIndex}
          />
        );
    }
  }, [page, profile, profiles, location, session, services, presetIndex, history]);

  // Active Session Routing (No duplicated Call 112 across screens!)
  if (session) {
    if (session.preset.mode === "reach") {
      return (
        <div className="app-shell min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#0a3d2e]">
          <ReachMeTrackingScreen
            session={session}
            location={location}
            cancel={cancelSOS}
            onOpenTextComposer={() => setTextComposerOpen(true)}
            onOpenVideoStamp={() => setVideoStampOpen(true)}
            onOpenLocation={() => setPage("location")}
            isSimulatedAccepted={isSimulatedAccepted}
            onToggleSimulation={() => setIsSimulatedAccepted(!isSimulatedAccepted)}
          />

          {textComposerOpen && (
            <TextUpdateComposer
              onClose={() => setTextComposerOpen(false)}
              onSave={(text) => {
                addSessionUpdate({
                  id: uid(),
                  type: "text",
                  text,
                  source: "You reported",
                  timestamp: timeNow(),
                });
              }}
            />
          )}

          {videoStampOpen && (
            <VideoStampModal
              sessionId={session.id}
              location={location}
              onClose={() => setVideoStampOpen(false)}
              onAttach={(meta) => {
                addSessionUpdate({
                  id: uid(),
                  type: "video",
                  source: "You reported",
                  duration: meta.duration,
                  timestamp: meta.timestamp,
                  locationStatus: meta.locationStatus,
                  storageStatus: meta.storageStatus,
                });
              }}
            />
          )}
        </div>
      );
    }

    if (session.preset.mode === "hyper") {
      return (
        <div className="app-shell min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#0a3d2e]">
          <GetResqResultScreen
            session={session}
            location={location}
            cancel={cancelSOS}
            openPicker={() => setPicker(true)}
            onOpenAddDetail={() => setTextComposerOpen(true)}
            onOpenLocation={() => setPage("location")}
          />

          {picker && (
            <PersonPicker
              profiles={profiles}
              selected={profile}
              choose={choosePerson}
              close={() => setPicker(false)}
            />
          )}

          {textComposerOpen && (
            <TextUpdateComposer
              onClose={() => setTextComposerOpen(false)}
              onSave={(text) => {
                setSession((prev) => ({ ...prev, detail: text }));
              }}
            />
          )}
        </div>
      );
    }

    if (session.preset.mode === "bystander") {
      return (
        <div className="app-shell min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#0a3d2e]">
          <BystanderSessionScreen
            session={session}
            location={location}
            cancel={cancelSOS}
            onOpenAddDetail={() => setTextComposerOpen(true)}
          />

          {textComposerOpen && (
            <TextUpdateComposer
              onClose={() => setTextComposerOpen(false)}
              onSave={(text) => {
                setSession((prev) => ({
                  ...prev,
                  bystanderData: {
                    ...(prev.bystanderData || {}),
                    observations: text,
                  },
                }));
              }}
            />
          )}
        </div>
      );
    }

    // Call Mode (Police, Fire, Ambulance Helpline, Family Emergency)
    return (
      <div className="app-shell min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#0a3d2e]">
        <ServiceCallSessionScreen
          session={session}
          location={location}
          cancel={cancelSOS}
        />
      </div>
    );
  }

  return (
    <div
      className="app-shell min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#0a3d2e]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AppHeader
        openMenu={() => setDrawer(true)}
        location={location}
        onLocationClick={() => setPage("location")}
      />

      <main className="w-full">{body}</main>

      <Drawer
        open={drawer}
        close={() => setDrawer(false)}
        page={page}
        setPage={setPage}
        profile={profile}
        active={Boolean(session)}
      />

      {countdownPreset && (
        <Countdown
          preset={countdownPreset}
          cancel={() => setCountdownPreset(null)}
          complete={initializeAlert}
        />
      )}

      {page === "personPicker" && (
        <PersonPicker
          profiles={profiles}
          selected={profile}
          choose={choosePerson}
          close={() => setPage("home")}
        />
      )}

      {bystanderSheet && (
        <BystanderBottomSheet
          location={location}
          onClose={() => setBystanderSheet(false)}
          onStartBystanderSos={handleStartBystanderSos}
        />
      )}
    </div>
  );
}
