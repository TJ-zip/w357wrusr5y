import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Baby,
  Check,
  ChevronRight,
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
  Phone,
  Plus,
  Shield,
  ShieldCheck,
  Siren,
  Smartphone,
  TriangleAlert,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

// Color System (Strictly preserved)
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

// Seed Data
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

const sosPresets = [
  {
    id: "hyper",
    title: "Get ResQ",
    subtitle: "Medical emergency",
    description: "Start location, MediCard and family alerts.",
    actionLabel: "Get ResQ",
    swipeCue: "Swipe to choose another SOS",
    mode: "hyper",
    number: "112",
    theme: "red",
  },
  {
    id: "reach",
    title: "Reach Me",
    subtitle: "Alert my circle and share my location",
    description: "Share live position with your trusted contacts.",
    actionLabel: "Start Reach Me",
    swipeCue: "Swipe to choose another SOS",
    mode: "reach",
    number: null,
    theme: "green",
  },
  {
    id: "ambulance",
    title: "Ambulance Helpline",
    subtitle: "Call the configured ambulance number",
    description: "Prepares phone dialer for ambulance service.",
    actionLabel: "Call Ambulance Helpline",
    swipeCue: "Swipe to choose another SOS",
    mode: "call",
    number: "102",
    theme: "whiteRedBorder",
  },
  {
    id: "family",
    title: "Family Emergency",
    subtitle: "Alert family and call the saved contact",
    description: "Notify family profiles and open primary contact.",
    actionLabel: "Start Family Emergency",
    swipeCue: "Swipe to choose another SOS",
    mode: "call",
    number: "+919000000002",
    theme: "softGreen",
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

// Button Component
function TapButton({ children, tone = "green", onClick, disabled = false, className = "", ...props }) {
  const toneClass =
    tone === "red"
      ? "border-[#c8322a] bg-[#c8322a] text-white active:bg-[#a82a23]"
      : tone === "redOutline"
      ? "border-2 border-[#c8322a] bg-white text-[#c8322a] active:bg-[#fff3f1]"
      : tone === "plain"
      ? "border border-[#c9dad2] bg-white text-[#0a3d2e] active:bg-[#e8f3ee]"
      : "border border-[#12855f] bg-[#12855f] text-white active:bg-[#0a3d2e]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "flex min-h-14 w-full items-center justify-center gap-2 rounded-[4px] px-5 text-[16px] font-bold transition disabled:opacity-40 select-none",
        toneClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Ruled Row Component
function Row({ label, value, action, onClick, urgent = false, icon: Icon, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex min-h-[76px] w-full items-center gap-3 border-b border-[#c9dad2] px-4 py-3 text-left transition active:bg-[#e8f3ee]/40",
        urgent && "border-l-4 border-l-[#c8322a]",
        className
      )}
    >
      {Icon && <Icon className={cx("h-5 w-5 shrink-0", urgent ? "text-[#c8322a]" : "text-[#12855f]")} />}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#5a7368]">{label}</p>
        <p className="mt-1 truncate text-[16px] font-bold text-[#0a3d2e]">{value}</p>
      </div>
      {action && (
        <span className={cx("min-h-12 px-2 text-[14px] font-bold leading-[48px]", urgent ? "text-[#c8322a]" : "text-[#12855f]")}>
          {action}
        </span>
      )}
    </button>
  );
}

// Application Header
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

// Swipeable SOS Preset Selector Component
function SosPresetSelector({ presets, selectedIndex, setSelectedIndex, onActivate }) {
  const containerRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, isLocked: false, isVertical: false });

  const activePreset = presets[selectedIndex] || presets[0];

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

    // Resistance at bounds
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

    const threshold = 70;
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
      {/* Outer Card Carousel Viewport */}
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

            return (
              <div key={preset.id} className="min-w-full flex-shrink-0 p-0.5">
                <div
                  className={cx(
                    "flex min-h-[220px] flex-col justify-between rounded-[6px] p-5 text-left transition-colors",
                    isHyper && "bg-[#c8322a] text-white",
                    isReach && "bg-[#12855f] text-white",
                    isAmbulance && "border-2 border-[#c8322a] bg-white text-[#0a3d2e]",
                    isFamily && "border border-[#c9dad2] bg-[#e8f3ee] text-[#0a3d2e]"
                  )}
                >
                  {/* Top: Icon & Title */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {isHyper && <Siren className="h-8 w-8 text-white" strokeWidth={2.2} />}
                        {isReach && <HeartPulse className="h-8 w-8 text-white" strokeWidth={2.2} />}
                        {isAmbulance && <Cross className="h-8 w-8 text-[#c8322a]" strokeWidth={2.2} />}
                        {isFamily && <UsersRound className="h-8 w-8 text-[#12855f]" strokeWidth={2.2} />}

                        <span
                          className={cx(
                            "text-[24px] font-extrabold tracking-[-0.03em]",
                            (isHyper || isReach) && "text-white",
                            isAmbulance && "text-[#c8322a]",
                            isFamily && "text-[#0a3d2e]"
                          )}
                          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                        >
                          {preset.title.toUpperCase()}
                        </span>
                      </div>
                      <span className={cx("text-[12px] font-bold uppercase tracking-wider", (isHyper || isReach) ? "text-white/80" : "text-[#5a7368]")}>
                        {preset.subtitle}
                      </span>
                    </div>

                    <p className={cx("mt-2 text-[14px] leading-5 font-medium", (isHyper || isReach) ? "text-white/95" : "text-[#5a7368]")}>
                      {preset.description}
                    </p>
                  </div>

                  {/* Middle / Bottom: Primary Preset Action Button */}
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivate(preset);
                      }}
                      className={cx(
                        "flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] px-4 text-[16px] font-extrabold uppercase tracking-wide transition active:scale-[0.99]",
                        isHyper && "bg-white text-[#c8322a] active:bg-[#fff3f1]",
                        isReach && "bg-white text-[#12855f] active:bg-[#e8f3ee]",
                        isAmbulance && "bg-[#c8322a] text-white active:bg-[#a82a23]",
                        isFamily && "bg-[#12855f] text-white active:bg-[#0a3d2e]"
                      )}
                    >
                      {preset.actionLabel}
                    </button>

                    {/* Swipe Cue */}
                    <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-center opacity-85">
                      <ArrowLeft className="h-3 w-3" />
                      <span>{preset.swipeCue}</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Position Indicators: 4 Short Rectangular Marks (No rounded pills) */}
      <div className="mt-2.5 flex items-center justify-center gap-2" aria-label="Preset indicators">
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
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#5a7368]">
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
              className={cx(
                "flex min-h-[74px] flex-col items-center justify-center rounded-[4px] border border-[#c9dad2] bg-white p-2 text-center transition active:bg-[#e8f3ee]"
              )}
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

// Home Page Component
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
        className="flex min-h-[58px] w-full items-center gap-3 border-b border-[#c9dad2] text-left active:bg-[#e8f3ee]/50"
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

      {/* 3. Call 112 Primary Action */}
      <div className="mt-4">
        <a
          href="tel:112"
          className="flex min-h-[66px] w-full items-center justify-center gap-3 rounded-[6px] border-2 border-[#c8322a] bg-white text-[21px] font-extrabold text-[#c8322a] transition active:bg-[#fff3f1]"
        >
          <Phone className="h-6 w-6" /> Call 112
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
          className="flex min-h-[76px] w-full items-center gap-3 text-left active:bg-[#e8f3ee]/40"
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
      return "Location, MediCard and connected family alerts will initialize.";
    }
    if (preset.mode === "reach") {
      return "Your trusted contacts will be alerted and ResQ will call you.";
    }
    if (preset.mode === "bystander") {
      return "Location and bystander observations will be prepared. Account MediCard is NOT attached.";
    }
    if (preset.number) {
      return `ResQ will open the phone calling interface for ${preset.number}.`;
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
            {preset.title}
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

        <TapButton tone="redOutline" onClick={cancel}>
          <X className="h-5 w-5" /> Cancel
        </TapButton>
      </div>
    </div>
  );
}

// Active SOS Command Screen (Preset-specific truthfully rendered)
function ActiveSOS({ session, location, cancel, openPicker, addDetail, escalateToHyper }) {
  const [elapsed, setElapsed] = useState(0);
  const [scriptOpen, setScriptOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const isHyper = session.preset.mode === "hyper";
  const isReach = session.preset.mode === "reach";
  const isBystander = session.preset.mode === "bystander";
  const isCall = session.preset.mode === "call";

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#c9dad2] px-4">
        <Logo />
        <button
          onClick={cancel}
          className="min-h-12 px-2 text-[14px] font-bold text-[#c8322a] active:opacity-75"
        >
          Cancel SOS
        </button>
      </header>

      {/* Incident Status Banner */}
      <section
        className={cx(
          "shrink-0 border-l-4 px-4 py-3.5",
          isReach ? "border-l-[#12855f] bg-[#e8f3ee]" : "border-l-[#c8322a] bg-[#e8f3ee]"
        )}
        aria-live="assertive"
      >
        <p className="text-[12px] font-bold text-[#5a7368]">
          SOS active · {mm}:{ss}
        </p>
        <h1
          className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#0a3d2e]"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
        >
          {session.statusTitle}
        </h1>
        <p className="mt-1 text-[15px] leading-5 text-[#5a7368]">
          {session.statusDetail}
        </p>
      </section>

      {/* Progress Steps */}
      <div className="shrink-0 border-b border-[#c9dad2] px-4 py-2.5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.11em] text-[#12855f]">
          What ResQ has done
        </p>
        <div className="mt-2.5 grid grid-cols-4 gap-1">
          {session.steps.map((step) => (
            <div key={step.label} className="text-center">
              <div
                className={cx(
                  "mx-auto grid h-7 w-7 place-items-center rounded-[3px] border",
                  step.done
                    ? "border-[#12855f] bg-[#12855f] text-white"
                    : "border-[#c9dad2] text-[#5a7368]"
                )}
              >
                {step.done ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
              </div>
              <p className="mt-1 text-[10px] font-semibold text-[#5a7368]">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Information Rows */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Row label="Location" value={location} action="Fix" icon={MapPin} />

        {isBystander ? (
          <>
            <Row
              label="Patient"
              value="Unknown bystander (Aid reported)"
              action="Details"
              icon={UserRound}
            />
            {session.bystanderData && (
              <div className="border-b border-[#c9dad2] bg-[#e8f3ee]/50 px-4 py-3 text-[14px] leading-6 text-[#0a3d2e]">
                <p>
                  <span className="font-bold">Observations:</span>{" "}
                  {session.bystanderData.observations || "None reported"}
                </p>
                <p>
                  <span className="font-bold">Category:</span> {session.bystanderData.ageGroup} ·{" "}
                  <span className="font-bold">Conscious:</span> {session.bystanderData.consciousness} ·{" "}
                  <span className="font-bold">Breathing:</span> {session.bystanderData.breathing}
                </p>
                {session.bystanderData.landmark && (
                  <p>
                    <span className="font-bold">Landmark:</span> {session.bystanderData.landmark}
                  </p>
                )}
              </div>
            )}
            <Row
              label="MediCard"
              value="No MediCard attached · Bystander mode"
              icon={FileHeart}
            />
            <Row
              label="Tell the operator"
              value="Read bystander summary to 112"
              action={scriptOpen ? "Close" : "Open"}
              onClick={() => setScriptOpen(!scriptOpen)}
              icon={Phone}
            />
            {scriptOpen && (
              <div className="border-b border-[#c9dad2] bg-[#e8f3ee] p-4 text-[14px] leading-6 text-[#0a3d2e]">
                <p className="font-bold">I am reporting an emergency for an unknown person at {location}.</p>
                <p>Observed condition: {session.bystanderData?.observations || "Emergency assistance required"}.</p>
                <p>Person appears to be {session.bystanderData?.consciousness || "unknown state"}.</p>
                <p>Nearest landmark: {session.bystanderData?.landmark || "Near GPS coordinates"}.</p>
                <p className="mt-2 font-semibold">Confirm directly with operator for ambulance triage.</p>
              </div>
            )}
          </>
        ) : isReach ? (
          <>
            <Row
              label="Patient"
              value={`${session.profile.name} · Reach Me`}
              action="Change"
              onClick={openPicker}
              icon={UserRound}
            />
            <Row
              label="Trusted Circle"
              value="Alerts sent to primary & family contacts"
              action="View"
              icon={UsersRound}
            />
            <div className="border-b border-[#c9dad2] p-4 bg-white">
              <button
                onClick={escalateToHyper}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-[#c8322a] text-[15px] font-bold text-white active:bg-[#a82a23]"
              >
                <Siren className="h-5 w-5" /> Escalate to Get ResQ
              </button>
            </div>
          </>
        ) : isCall ? (
          <>
            <Row
              label="Emergency Destination"
              value={`${session.preset.title} · ${session.preset.number}`}
              icon={Phone}
            />
            <Row
              label="Calling Interface"
              value="Phone dialer launched"
              action="Redial"
              onClick={() => {
                if (session.preset.number) window.location.href = `tel:${session.preset.number}`;
              }}
              icon={Phone}
            />
          </>
        ) : (
          /* Get ResQ Standard Rows */
          <>
            <Row
              label="Patient"
              value={`${session.profile.name} · Allergy: ${session.profile.allergies[0] || "None"}`}
              action="Change"
              onClick={openPicker}
              icon={UserRound}
            />
            <Row
              label="Family"
              value={session.familyStatus}
              action="View"
              icon={UsersRound}
            />
            <Row
              label="Tell the operator"
              value="Read this summary to 112"
              action={scriptOpen ? "Close" : "Open"}
              onClick={() => setScriptOpen(!scriptOpen)}
              icon={FileHeart}
            />
            {scriptOpen && (
              <div className="border-b border-[#c9dad2] bg-[#e8f3ee] p-4 text-[14px] leading-6 text-[#0a3d2e]">
                <p className="font-bold">
                  My name is {session.profile.name}. I am at {location}.
                </p>
                <p>Known condition: {session.profile.conditions[0]}.</p>
                <p>Allergy: {session.profile.allergies[0]}.</p>
                <p>Current medicine: {session.profile.medicines[0]}.</p>
                <p className="mt-2 font-semibold">
                  Confirm the location and emergency details directly with the operator.
                </p>
              </div>
            )}
          </>
        )}

        <Row
          label="What is happening?"
          value={session.detail || "Not added"}
          action="Add"
          onClick={addDetail}
          icon={AlertCircle}
        />
      </div>

      {/* Pinned Bottom Call 112 Bar */}
      <div className="shrink-0 border-t border-[#c9dad2] bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-2.5">
        <p className="mb-2 border-l-4 border-[#c8322a] pl-2.5 text-[13px] font-bold text-[#c8322a]">
          Call 112 for an ambulance.
        </p>
        <a
          href="tel:112"
          className="flex min-h-[66px] w-full items-center justify-center gap-3 rounded-[6px] bg-[#c8322a] text-[22px] font-extrabold text-white active:bg-[#a82a23]"
        >
          <Phone className="h-6 w-6" /> Call 112
        </a>
      </div>
    </div>
  );
}

// Report Bystander Bottom Sheet Component
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
    <div
      className="fixed inset-0 z-[90] flex items-end bg-[#0a3d2e]/25"
      onClick={onClose}
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[8px] bg-white pb-[max(20px,env(safe-area-inset-bottom))]"
      >
        {/* Header */}
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
          <button
            onClick={onClose}
            className="grid h-12 w-12 place-items-center text-[#12855f] active:bg-[#e8f3ee] rounded"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick 112 Call & Location */}
          <div className="flex items-center justify-between rounded-[4px] border border-[#c9dad2] bg-[#e8f3ee] p-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#12855f]">Location</p>
              <p className="truncate text-[14px] font-bold text-[#0a3d2e]">{location}</p>
            </div>
            <a
              href="tel:112"
              className="ml-3 flex min-h-10 items-center gap-1.5 rounded-[4px] bg-[#c8322a] px-3.5 text-[14px] font-extrabold text-white"
            >
              <Phone className="h-4 w-4" /> Call 112
            </a>
          </div>

          {/* Observations Form */}
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
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[4px] bg-[#c8322a] text-[16px] font-bold text-white transition active:bg-[#a82a23]"
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

// Navigation Drawer Component
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
      {/* Translucent Deep-Green Overlay (#0A3D2E / 25%) */}
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
          <button
            onClick={close}
            className="grid h-12 w-12 place-items-center text-[#12855f] active:bg-[#e8f3ee] rounded"
            aria-label="Close menu"
          >
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
        </div>
      </aside>
    </>
  );
}

// Plain Page Scaffold
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

// MediCard Page
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
              <TapButton
                tone="plain"
                onClick={() => setEditingKey(null)}
                className="flex-1"
              >
                Cancel
              </TapButton>
              <TapButton
                tone="green"
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
                className="flex-1"
              >
                Save
              </TapButton>
            </div>
          </div>
        </div>
      )}
    </PlainPage>
  );
}

// Family Page
function FamilyPage({ profiles, onAddFamily, onBack }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState("");
  const [blood, setBlood] = useState("O+");
  const [allergy, setAllergy] = useState("");

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
        <TapButton onClick={() => setShowAdd(true)}>
          <Plus className="h-5 w-5" /> Add or link family member
        </TapButton>
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
            <input
              type="text"
              placeholder="Blood Group (e.g. B+, O+)"
              value={blood}
              onChange={(e) => setBlood(e.target.value)}
              className="min-h-11 w-full rounded border border-[#c9dad2] px-3 text-[14px]"
            />
            <input
              type="text"
              placeholder="Known Allergies (if any)"
              value={allergy}
              onChange={(e) => setAllergy(e.target.value)}
              className="min-h-11 w-full rounded border border-[#c9dad2] px-3 text-[14px]"
            />
            <div className="flex gap-2 pt-2">
              <TapButton tone="plain" onClick={() => setShowAdd(false)} className="flex-1">
                Cancel
              </TapButton>
              <TapButton
                tone="green"
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
                      bloodGroup: blood || "Unknown",
                      allergies: allergy ? [allergy] : ["No allergy added"],
                      conditions: ["No condition added"],
                      medicines: ["No medicine added"],
                      updated: "Today",
                    });
                    setShowAdd(false);
                  }
                }}
                className="flex-1"
              >
                Add Member
              </TapButton>
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

// Main Application Component
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
  const [services, setServices] = useState(initialEmergencyServices);
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
        statusDetail: "Location & bystander report logged. Personal MediCard is NOT attached. Now call 112.",
        familyStatus: "Bystander report active",
        detail: preset.bystanderData?.observations || "",
        steps: [
          { label: "Started", done: true },
          { label: "Location", done: true },
          { label: "Observations", done: true },
          { label: "Dialer ready", done: true },
        ],
      });
      return;
    }

    if (preset.mode === "reach") {
      setSession({
        id: sessionId,
        profile,
        preset,
        statusTitle: "Reach Me is active",
        statusDetail: "Sharing your live location with selected trusted circle.",
        familyStatus: "Connected circle alerted",
        detail: "",
        steps: [
          { label: "Started", done: true },
          { label: "Location", done: true },
          { label: "Contacts", done: true },
          { label: "Callback", done: true },
        ],
      });
      return;
    }

    if (preset.mode === "call") {
      setSession({
        id: sessionId,
        profile,
        preset,
        statusTitle: `Calling ${preset.title}`,
        statusDetail: `Opening the phone dialer for ${preset.number}.`,
        familyStatus: preset.alerts ? "Alerts initializing" : "Not configured",
        detail: "",
        steps: [
          { label: "Started", done: true },
          { label: "Location", done: true },
          { label: "Dialer", done: true },
          { label: "Emergency", done: true },
        ],
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
      statusDetail: "Your location and MediCard are being prepared. Now call 112.",
      familyStatus: "Connected family Get ResQ alerts initialized",
      detail: "",
      steps: [
        { label: "Started", done: true },
        { label: "Location", done: true },
        { label: "MediCard", done: true },
        { label: "Family", done: true },
      ],
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
      number: "112",
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
        statusDetail: `Patient updated to ${person.name}. Now call 112.`,
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
    setPage("home");
  }

  // Left-edge right-swipe to open navigation drawer
  function onTouchStart(e) {
    if (session || countdownPreset || bystanderSheet || picker) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onTouchEnd(e) {
    if (!touchStart.current || session || countdownPreset || bystanderSheet || picker) return;
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

  if (session) {
    return (
      <div className="app-shell min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#0a3d2e]">
        <ActiveSOS
          session={session}
          location={location}
          cancel={cancelSOS}
          openPicker={() => setPicker(true)}
          addDetail={() =>
            setSession({ ...session, detail: prompt("Describe emergency symptoms:") || session.detail })
          }
          escalateToHyper={() => {
            setSession({
              ...session,
              preset: sosPresets[0],
              statusTitle: "Escalated to Get ResQ",
              statusDetail: "Family alerts and emergency MediCard initialized. Call 112.",
            });
          }}
        />
        {picker && (
          <PersonPicker
            profiles={profiles}
            selected={profile}
            choose={choosePerson}
            close={() => setPicker(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="app-shell min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#0a3d2e]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 1. Header (Sticky Top) */}
      <AppHeader
        openMenu={() => setDrawer(true)}
        location={location}
        onLocationClick={() => setPage("location")}
      />

      {/* 2. Main Page Content (Normal vertical scroll) */}
      <main className="w-full">{body}</main>

      {/* 3. Navigation Drawer */}
      <Drawer
        open={drawer}
        close={() => setDrawer(false)}
        page={page}
        setPage={setPage}
        profile={profile}
        active={Boolean(session)}
      />

      {/* 4. Five-Second Countdown Overlay */}
      {countdownPreset && (
        <Countdown
          preset={countdownPreset}
          cancel={() => setCountdownPreset(null)}
          complete={initializeAlert}
        />
      )}

      {/* 5. Patient Selection Bottom Sheet */}
      {page === "personPicker" && (
        <PersonPicker
          profiles={profiles}
          selected={profile}
          choose={choosePerson}
          close={() => setPage("home")}
        />
      )}

      {/* 6. Report Bystander Bottom Sheet */}
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
