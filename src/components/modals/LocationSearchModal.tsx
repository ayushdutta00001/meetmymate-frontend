import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Clock, MapPin, ArrowRight, ChevronRight } from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const RECENT = [
  { id: 1, name: "South City Mall", sub: "Prince Anwar Shah Rd, Kolkata · West Bengal" },
  { id: 2, name: "Eco Park", sub: "New Town, Kolkata · West Bengal" },
  { id: 3, name: "Victoria Memorial", sub: "Queens Way, Kolkata · West Bengal" },
  { id: 4, name: "Coffee House", sub: "College Street, Kolkata · West Bengal" },
  { id: 5, name: "Park Street", sub: "Park Street, Kolkata · West Bengal" },
];

const POPULAR = ["South City Mall", "Eco Park", "Quest Mall", "Victoria Memorial", "City Centre", "Park Street", "Inox Multiplex"];

const ALL_RESULTS = [
  { id: 1, name: "South City Mall", location: "Prince Anwar Shah Rd", city: "Kolkata, West Bengal" },
  { id: 2, name: "Quest Mall", location: "Syed Amir Ali Ave", city: "Kolkata, West Bengal" },
  { id: 3, name: "Eco Park", location: "New Town", city: "Kolkata, West Bengal" },
  { id: 4, name: "Victoria Memorial", location: "Queens Way", city: "Kolkata, West Bengal" },
  { id: 5, name: "City Centre 1", location: "Salt Lake City", city: "Kolkata, West Bengal" },
  { id: 6, name: "Nicco Park", location: "Salt Lake", city: "Kolkata, West Bengal" },
  { id: 7, name: "Forum Mall", location: "Elgin Road", city: "Kolkata, West Bengal" },
  { id: 8, name: "Acropolis Mall", location: "Rajdanga Main Rd", city: "Kolkata, West Bengal" },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface LocationResult {
  id: number;
  name: string;
  location: string;
  city: string;
}

interface LocationSearchModalProps {
    open: boolean;
  onClose: () => void;
  onSelect?: (result: LocationResult) => void;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RecentRow({ item, delay, onSelect }: { item: typeof RECENT[0]; delay: number; onSelect: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.28, ease: "easeOut" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onSelect}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        width: "100%", padding: "11px 12px", borderRadius: 14, textAlign: "left", cursor: "pointer",
        border: `1px solid ${hov ? "rgba(59,130,246,0.38)" : "rgba(255,255,255,0.06)"}`,
        background: hov ? "rgba(59,130,246,0.07)" : "rgba(255,255,255,0.025)",
        boxShadow: hov ? "0 4px 20px rgba(0,0,0,0.35)" : "none",
        transform: hov ? "translateY(-1.5px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: hov ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.07)",
        border: `1px solid ${hov ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.08)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s ease",
        transform: hov ? "scale(1.06)" : "scale(1)",
      }}>
        <Clock size={15} color={hov ? "#60A5FA" : "rgba(255,255,255,0.45)"} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "Inter, sans-serif" }}>
          {item.name}
        </div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "Inter, sans-serif" }}>
          {item.sub}
        </div>
      </div>
      <ChevronRight size={15} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: hov ? "translateX(3px)" : "translateX(0)" }} />
    </motion.button>
  );
}

function PopularPill({ label, onSelect }: { label: string; onSelect: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onSelect}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 100, cursor: "pointer",
        border: `1px solid ${hov ? "rgba(59,130,246,0.55)" : "rgba(255,255,255,0.11)"}`,
        background: hov ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.06)",
        boxShadow: hov ? "0 0 16px rgba(59,130,246,0.22)" : "none",
        transform: hov ? "scale(1.04)" : "scale(1)",
        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <MapPin size={12} color={hov ? "#60A5FA" : "rgba(255,255,255,0.45)"} />
      <span style={{ fontSize: 12.5, fontWeight: 500, color: hov ? "#fff" : "rgba(255,255,255,0.65)", fontFamily: "Inter, sans-serif" }}>
        {label}
      </span>
    </button>
  );
}

function ResultCard({ result, delay, onSelect }: { result: LocationResult; delay: number; onSelect: (r: LocationResult) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(result)}
       style={{
        display: "flex", alignItems: "center", gap: 14, width: "100%",
        padding: "13px 14px", borderRadius: 18, textAlign: "left", cursor: "pointer",
        border: `1px solid ${hov ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.07)"}`,
        background: hov ? "rgba(255,255,255,0.058)" : "rgba(255,255,255,0.025)",
        boxShadow: hov ? "0 10px 36px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.18)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
        marginBottom: 10,
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 15, flexShrink: 0,
        background: hov ? "rgba(59,130,246,0.28)" : "rgba(59,130,246,0.14)",
        border: "1px solid rgba(59,130,246,0.28)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.25s ease",
        transform: hov ? "scale(1.06)" : "scale(1)",
      }}>
        <MapPin size={21} color={hov ? "#93C5FD" : "#60A5FA"} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "Outfit, sans-serif" }}>
          {result.name}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2, fontFamily: "Inter, sans-serif" }}>
          {result.location} · {result.city}
        </div>
        <div style={{ fontSize: 11, color: "rgba(96,165,250,0.75)", marginTop: 3, fontWeight: 500, letterSpacing: "0.02em", fontFamily: "Inter, sans-serif" }}>
          Public Meeting Location
        </div>
      </div>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: hov ? "rgba(59,130,246,0.22)" : "rgba(255,255,255,0.07)",
        border: `1px solid ${hov ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.1)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.25s ease",
      }}>
        <ArrowRight
          size={15}
          color={hov ? "#60A5FA" : "rgba(255,255,255,0.45)"}
          style={{ transition: "transform 0.25s ease", transform: hov ? "translateX(2px)" : "translateX(0)" }}
        />
      </div>
    </motion.button>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", textAlign: "center" }}
    >
      <div style={{ position: "relative", marginBottom: 22 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(59,130,246,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={20} color="rgba(96,165,250,0.9)" />
            </div>
          </div>
        </div>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 10, fontFamily: "Outfit, sans-serif" }}>
        No locations found
      </h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, fontFamily: "Inter, sans-serif" }}>
        Try searching by:<br />
        <span style={{ color: "rgba(96,165,250,0.65)" }}>Mall · Park · Café · Metro Station</span>
      </p>
    </motion.div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────

export default function LocationSearchModal({ open, onClose, onSelect }: LocationSearchModalProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const max = scrollHeight - clientHeight;
    setScrollPct(max > 0 ? (scrollTop / max) * 100 : 0);
    setIsScrolled(scrollTop > 6);
  };

  useEffect(() => {
    if (!open) {
      setQuery("");
      setScrollPct(0);
      setIsScrolled(false);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (query) setQuery("");
        else onClose();
      }
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, query, onClose]);

  const filtered = query.trim()
    ? ALL_RESULTS.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.location.toLowerCase().includes(query.toLowerCase()) ||
        r.city.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_RESULTS;

  const showEmpty = query.trim().length > 0 && filtered.length === 0;

  const handleSelect = (result: LocationResult) => {
    onSelect?.(result);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <style>{`
            .lsm-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.12) transparent; scroll-behavior: smooth; }
            .lsm-scroll::-webkit-scrollbar { width: 4px; }
            .lsm-scroll::-webkit-scrollbar-track { background: transparent; }
            .lsm-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 100px; }
            .lsm-scroll:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); }
            .lsm-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Modal centering wrapper */}
          <div style={{ position: "fixed", inset: 0, zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, pointerEvents: "none" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.9 }}
              style={{
                position: "relative",
               width: 520,
maxWidth: "95%",
height: 560,
maxHeight: "80vh",
                background: "rgba(10, 17, 30, 0.95)",
                backdropFilter: "blur(36px)",
                WebkitBackdropFilter: "blur(36px)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 32,
                boxShadow: "0 48px 120px rgba(0,0,0,0.85), 0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                pointerEvents: "all",
              }}
            >
              {/* ── Progress bar ── */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 20, borderRadius: "32px 32px 0 0", overflow: "hidden" }}>
                <motion.div
                  animate={{ width: `${scrollPct < 1 ? 0 : scrollPct}%` }}
                  transition={{ duration: 0.12, ease: "linear" }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #2563EB, #7C3AED, #06B6D4)",
                    borderRadius: "0 2px 2px 0",
                    minWidth: scrollPct > 0 ? 20 : 0,
                  }}
                />
              </div>

              {/* ── Header ── */}
              <div style={{
                padding: "26px 26px 18px",
                transition: "background 0.3s ease, box-shadow 0.3s ease",
                background: isScrolled ? "rgba(10,17,30,0.75)" : "transparent",
                backdropFilter: isScrolled ? "blur(20px)" : "none",
                boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
                flexShrink: 0,
                zIndex: 10,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <h1 style={{ fontSize: 21, fontWeight: 700, color: "#fff", letterSpacing: "-0.4px", lineHeight: 1.2, fontFamily: "Outfit, sans-serif", margin: 0 }}>
                      Search Meeting Location
                    </h1>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", fontFamily: "Inter, sans-serif", margin: "5px 0 0" }}>
                      Choose a safe public place to meet.
                    </p>
                  </div>
                  <button
                    onMouseEnter={() => setCloseHov(true)}
                    onMouseLeave={() => setCloseHov(false)}
                    onClick={onClose}
                    style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: closeHov ? "rgba(239,68,68,0.14)" : "rgba(255,255,255,0.07)",
                      border: `1px solid ${closeHov ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.1)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s ease", marginTop: 2,
                    }}
                  >
                    <X size={16} color={closeHov ? "#EF4444" : "rgba(255,255,255,0.55)"} />
                  </button>
                </div>
              </div>

              {/* ── Search ── */}
              <div style={{ padding: "0 22px 16px", flexShrink: 0, zIndex: 9 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  height: 52, paddingLeft: 16, paddingRight: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${isFocused ? "rgba(59,130,246,0.52)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 20,
                  boxShadow: isFocused ? "0 0 0 3px rgba(59,130,246,0.13), 0 4px 16px rgba(0,0,0,0.25)" : "0 2px 12px rgba(0,0,0,0.2)",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                }}>
                  <Search size={17} color={isFocused ? "#60A5FA" : "rgba(255,255,255,0.38)"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                  <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search malls, cafés, parks..."
                    style={{
                      flex: 1, background: "transparent", border: "none", outline: "none",
                      color: "#fff", fontSize: 14.5, fontFamily: "Inter, sans-serif",
                    }}
                  />
                  <kbd style={{
                    fontSize: 10.5, color: "rgba(255,255,255,0.28)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6, padding: "2px 7px",
                    fontFamily: "Inter, sans-serif", letterSpacing: "0.04em", flexShrink: 0,
                  }}>ESC</kbd>
                </div>
              </div>

              {/* ── Scrollable body ── */}
              <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                {/* Top fade */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 36, zIndex: 5, pointerEvents: "none",
                  background: "linear-gradient(to bottom, rgba(10,17,30,0.85), transparent)",
                  opacity: isScrolled ? 1 : 0, transition: "opacity 0.3s ease",
                }} />
                {/* Bottom fade */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 44, zIndex: 5, pointerEvents: "none",
                  background: "linear-gradient(to top, rgba(10,17,30,0.9), transparent)",
                }} />

                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="lsm-scroll"
                  style={{ height: "100%", overflowY: "auto", padding: "6px 22px 20px" }}
                >
                  <AnimatePresence mode="wait">
                    {query.trim() === "" ? (
                      <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                        {/* Recent searches */}
                        <section style={{ marginBottom: 22 }}>
                          <h2 style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 10, fontFamily: "Inter, sans-serif" }}>
                            Recent Searches
                          </h2>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {RECENT.map((item, i) => (
                              <RecentRow key={item.id} item={item} delay={i * 0.045} onSelect={onClose} />
                            ))}
                          </div>
                        </section>

                        {/* Popular pills */}
                        <section style={{ marginBottom: 22 }}>
                          <h2 style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 10, fontFamily: "Inter, sans-serif" }}>
                            Popular Locations
                          </h2>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {POPULAR.map((p, i) => (
                              <motion.div key={p} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.04, duration: 0.25 }}>
                                <PopularPill label={p} onSelect={onClose} />
                              </motion.div>
                            ))}
                          </div>
                        </section>

                        {/* Divider */}
                        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0 20px" }} />

                        {/* Nearby results */}
                        <h2 style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 12, fontFamily: "Inter, sans-serif" }}>
                          Nearby Locations
                        </h2>
                        {ALL_RESULTS.map((r, i) => (
                          <ResultCard key={r.id} result={r} delay={0.2 + i * 0.04} onSelect={handleSelect} />
                        ))}
                      </motion.div>
                    ) : showEmpty ? (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <EmptyState />
                      </motion.div>
                    ) : (
                      <motion.div key={`results-${query}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                        <h2 style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 14, fontFamily: "Inter, sans-serif" }}>
                          {filtered.length} Result{filtered.length !== 1 ? "s" : ""}
                        </h2>
                        {filtered.map((r, i) => (
                          <ResultCard key={r.id} result={r} delay={i * 0.05} onSelect={handleSelect} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Footer ── */}
              <div style={{
                padding: "14px 22px 18px",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(10,17,30,0.6)",
                backdropFilter: "blur(12px)",
                flexShrink: 0,
              }}>
                <button
                  onMouseEnter={() => setCancelHov(true)}
                  onMouseLeave={() => setCancelHov(false)}
                  onClick={onClose}
                  style={{
                    width: "100%", height: 48, borderRadius: 14,
                    background: cancelHov ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${cancelHov ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.09)"}`,
                    color: cancelHov ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
                    fontSize: 15, fontWeight: 500, fontFamily: "Inter, sans-serif",
                    cursor: "pointer", transition: "all 0.2s ease",
                    transform: cancelHov ? "translateY(-1px)" : "translateY(0)",
                    boxShadow: cancelHov ? "0 6px 20px rgba(0,0,0,0.3)" : "none",
                    letterSpacing: "0.01em",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}