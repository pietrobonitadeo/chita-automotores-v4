"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import {
  MapPin, Clock, CheckCircle, X, MessageCircle,
  Star, ArrowRight, RefreshCw, CreditCard,
  ChevronDown, Menu, FileText, Zap,
} from "lucide-react"

const DISPLAY = "var(--font-display)"
const BODY    = "var(--font-body)"
const BLUE    = "#1a44d4"
const RED     = "#CC1122"
const DARK    = "#0d1425"
const BG      = "#ffffff"
const BG2     = "#f5f6fa"
const TEXT2   = "rgba(13,20,37,0.52)"
const BORDER  = "rgba(13,20,37,0.08)"
const WA      = "#128C7E"

// URL-encodes filenames from /public/imagenes autos/
const p = (f: string) => `/imagenes%20autos/${f.replace(/ /g, "%20")}`
const p2 = (f: string) => `/imagenes%20autos%202.0/${f.replace(/ /g, "%20")}`

// ── Animated number counter ──────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const dur = 2200
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(ease * value))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value])

  return <span ref={ref}>{display.toLocaleString("es-AR")}{suffix}</span>
}

// ── Scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, height: 3, zIndex: 200,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${BLUE}, ${RED})`,
        transition: "width 0.08s linear",
        pointerEvents: "none",
      }}
    />
  )
}

// ── TopBar (announcement + nav) ──────────────────────────────────────────────
function TopBar() {
  const [showBar, setShowBar] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links = [
    { label: "INICIO",       href: "#inicio"       },
    { label: "VEHÍCULOS",    href: "#vehiculos"    },
    { label: "FINANCIACIÓN", href: "#financiacion" },
    { label: "GESTORÍA",     href: "#gestoria"     },
    { label: "CONTACTO",     href: "#contacto"     },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed", inset: 0, zIndex: 48,
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(16px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 28,
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer", color: TEXT2, padding: 4, display: "flex" }}
            >
              <X size={24} />
            </button>
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 32, color: DARK, textDecoration: "none", letterSpacing: "0.06em" }}
              >
                {label}
              </a>
            ))}
            <a
              href="https://wa.me/5493442647442"
              target="_blank" rel="noopener noreferrer"
              style={{ marginTop: 12, background: WA, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, letterSpacing: "0.08em", padding: "14px 32px", borderRadius: 4, textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
            >
              <MessageCircle size={18} /> WHATSAPP
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        {/* Announcement bar */}
        <AnimatePresence>
          {showBar && (
            <motion.div
              initial={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block"
              style={{ overflow: "hidden", background: BG2, borderBottom: `1px solid ${BORDER}` }}
            >
              <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 36, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: BODY, fontSize: 12, color: TEXT2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, display: "inline-block", flexShrink: 0 }} />
                  Lun–Vie 9:00–17:00 &nbsp;·&nbsp; Sáb 8:30–12:00 &nbsp;·&nbsp; Gral. Galarza 1712, Concepción del Uruguay
                </div>
                <button onClick={() => setShowBar(false)} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT2, padding: 4, display: "flex" }}>
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navbar */}
        <nav style={{
          background: scrolled ? "rgba(255,255,255,0.95)" : BG,
          backdropFilter: scrolled ? "blur(28px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(28px)" : "none",
          borderBottom: `1px solid ${BORDER}`,
          transition: "background 0.4s",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo */}
            <a href="#inicio" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <Image src="/logo.webp" alt="Chita Automotores" width={120} height={48} style={{ objectFit: "contain", width: "clamp(100px, 24vw, 120px)", height: "auto" }} />
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: 2, fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: "0.07em" }}>
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{ padding: "6px 14px", borderRadius: 999, color: TEXT2, textDecoration: "none", transition: "color 0.2s, background 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = DARK; e.currentTarget.style.background = BG2 }}
                  onMouseLeave={e => { e.currentTarget.style.color = TEXT2; e.currentTarget.style.background = "transparent" }}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <a
              href="https://wa.me/5493442647442"
              target="_blank" rel="noopener noreferrer"
              className="shimmer-btn hidden md:flex"
              style={{ alignItems: "center", gap: 8, background: WA, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: "0.07em", padding: "8px 20px", borderRadius: 4, textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <MessageCircle size={14} /> WHATSAPP
            </a>

            {/* Hamburger */}
            <button className="flex md:hidden" onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: DARK, padding: 4 }}>
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="inicio"
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Dot grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, ${DARK}12 1.5px, transparent 1.5px)`,
        backgroundSize: "30px 30px",
      }} />

      {/* Blue wash — right panel */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `linear-gradient(125deg, transparent 36%, ${BLUE}0d 58%, ${BLUE}1a 100%)`,
        clipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 26% 100%)",
      }} />

      {/* Diagonal slash motifs — visible */}
      <div style={{ position: "absolute", top: "12%", left: "40%", width: 3, height: "80%", background: `linear-gradient(to bottom, transparent, ${BLUE}45, transparent)`, transform: "rotate(-12deg)" }} />
      <div style={{ position: "absolute", top: "18%", left: "43%", width: 1.5, height: "66%", background: `linear-gradient(to bottom, transparent, ${RED}40, transparent)`, transform: "rotate(-12deg)" }} />
      <div style={{ position: "absolute", top: "8%", left: "37%", width: 1, height: "50%", background: `linear-gradient(to bottom, transparent, ${BLUE}22, transparent)`, transform: "rotate(-12deg)" }} />

      {/* Car — absolute behind content, hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}
        className="hidden lg:block"
        style={{ position: "absolute", right: "-4%", bottom: 0, width: "65%", zIndex: 0, pointerEvents: "none" }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", height: "80%", background: `radial-gradient(ellipse, ${BLUE}18 0%, transparent 68%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "8%", left: "6%", right: "6%", height: 2, background: `linear-gradient(90deg, transparent, ${RED}99, transparent)` }} />
        <Image
          src="/baic%20bj30%20fondo%20transparente%202.0.webp"
          alt="BAIC BJ30"
          width={900}
          height={600}
          priority
          style={{ width: "100%", height: "auto", display: "block", filter: "drop-shadow(0px 28px 32px rgba(13,20,37,0.22)) drop-shadow(0px 8px 12px rgba(13,20,37,0.12))" }}
        />
      </motion.div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(100px, 18vw, 160px) 24px clamp(48px, 8vw, 80px)", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 600 }}>

          {/* Title block with left accent */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            style={{ borderLeft: `5px solid ${RED}`, paddingLeft: 20, marginBottom: 24 }}
          >
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 9vw, 92px)", lineHeight: 0.92, letterSpacing: "-0.01em", textTransform: "uppercase", color: DARK, margin: 0 }}>
              TU PRÓXIMO
              <br />
              AUTO,{" "}
              <em style={{ color: RED, fontStyle: "italic" }}>ESTÁ ACÁ.</em>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}
            style={{ fontFamily: BODY, fontSize: 16, color: TEXT2, lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}
          >
            40 años en Concepción del Uruguay. Tomamos tu usado como parte de pago y financiamos para que llegues a tu próximo auto sin vueltas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.32 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 }}
          >
            <a
              href="#vehiculos"
              className="shimmer-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: BLUE, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "14px 30px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)", textDecoration: "none" }}
            >
              VER VEHÍCULOS <ArrowRight size={15} />
            </a>
            <a
              href="https://wa.me/5493442647442"
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1.5px solid ${WA}`, color: WA, fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "13px 28px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)", textDecoration: "none", transition: "background 0.2s, color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = WA; e.currentTarget.style.color = "#fff" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = RED }}
            >
              <MessageCircle size={15} /> WHATSAPP
            </a>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }}
            style={{ display: "flex", gap: 32, paddingTop: 22, borderTop: `1px solid ${BORDER}` }}
          >
            {[
              { value: 40,   suffix: "",  label: "Años de trayectoria" },
              { value: 5000, suffix: "+", label: "Vehículos vendidos"  },
              { value: 20,   suffix: "+", label: "Marcas disponibles"   },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, color: BLUE, lineHeight: 1 }}>
                  <AnimatedNumber value={value} suffix={suffix} />
                </div>
                <div style={{ fontFamily: BODY, fontSize: 10, color: TEXT2, marginTop: 4, letterSpacing: "0.04em" }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "rgba(13,20,37,0.2)" }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}

// ── Brand strip ───────────────────────────────────────────────────────────────
const BRANDS = ["RENAULT", "TOYOTA", "FIAT", "PEUGEOT", "FORD", "VOLKSWAGEN", "CHEVROLET", "HONDA", "BAIC", "JAC", "CHERY"]

function BrandStrip() {
  return (
    <section style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "20px 0", overflow: "hidden", position: "relative" }}>
      {/* Fade edges */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to right, ${BG2}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${BG2}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
      <div className="marquee-track">
        {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 48, paddingRight: 48 }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 12, letterSpacing: "0.26em", color: "rgba(13,20,37,0.28)", whiteSpace: "nowrap" }}>
              {b}
            </span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: `${BLUE}60`, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Autos ─────────────────────────────────────────────────────────────────────
const AUTOS = [
  { marca: "BAIC",      modelo: "X55 Plus",    version: "SUV Automático",       anio: "2025", tipo: "0KM" as const, imagen: p2("BAIC x55 plus okm.png"),        descripcion: "SUV tecnológico con pantalla táctil 10\", cámara 360° y financiación propia." },
  { marca: "BAIC",      modelo: "BJ30",        version: "SUV 4×2",              anio: "2025", tipo: "0KM" as const, imagen: p2("BAIC bj30 0km.png"),           descripcion: "SUV robusto 4×2 con motor turbo. Todo el equipamiento para el campo y la ciudad." },
  { marca: "CHEVROLET", modelo: "Montana",     version: "Premium MT",           anio: "2025", tipo: "0KM" as const, imagen: p2("chevrolet montana 0km.png"),    descripcion: "La pick-up compacta más versátil de Argentina. Lista para la ciudad, el campo o la aventura." },
  { marca: "CHEVROLET", modelo: "Tracker",     version: "LTZ Turbo AT",         anio: "2025", tipo: "0KM" as const, imagen: p2("chevrolet tracker 0km.png"),    descripcion: "SUV urbano con motor turbo 1.2, pantalla 8\" y conectividad WiFi a bordo." },
  { marca: "TOYOTA",    modelo: "Yaris Cross", version: "XLS CVT",              anio: "2025", tipo: "0KM" as const, imagen: p2("toyota yaris cross 0km.png"),   descripcion: "Crossover japonés: eficiente, confiable y seguro para la ciudad y la ruta." },
]

function FleetSection() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)

  const go = (idx: number) => {
    setDir(idx > current ? 1 : -1)
    setCurrent(idx)
  }
  const prev = () => go((current - 1 + AUTOS.length) % AUTOS.length)
  const next = () => go((current + 1) % AUTOS.length)

  const auto = AUTOS[current]

  return (
    <section id="vehiculos" style={{ background: BG, position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Dot grid texture */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle, ${DARK}10 1.5px, transparent 1.5px)`, backgroundSize: "30px 30px" }} />

      {/* Top label bar */}
      <div style={{ position: "relative", zIndex: 2, padding: "28px 40px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 5, height: 22, background: BLUE, borderRadius: 2 }} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.16em" }}>
            STOCK DISPONIBLE · 0 KM
          </span>
        </div>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: TEXT2 }}>
          {String(current + 1).padStart(2, "0")} / {String(AUTOS.length).padStart(2, "0")}
        </span>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, position: "relative", zIndex: 2, minHeight: 500 }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: `${d * 8}%`, opacity: 0 }),
              center: { x: "0%", opacity: 1 },
              exit: (d: number) => ({ x: `${-d * 8}%`, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <div className="fleet-slide" style={{ height: "100%" }}>
              {/* Text — left on desktop, bottom on mobile */}
              <div className="fleet-slide-text">
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: RED, letterSpacing: "0.2em", marginBottom: 8 }}>
                  {auto.marca}
                </div>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(52px, 8vw, 110px)", lineHeight: 0.88, letterSpacing: "-0.03em", textTransform: "uppercase", color: DARK, marginBottom: 24 }}>
                  {auto.modelo}
                </h2>
                <div style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.4vw, 16px)", color: TEXT2, maxWidth: 380, lineHeight: 1.7, marginBottom: 36 }}>
                  {auto.descripcion}
                </div>
                <a
                  href={`https://wa.me/5493442647442?text=Hola! Me interesa el ${auto.marca} ${auto.modelo} ${auto.anio}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: WA, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", padding: "14px 28px", borderRadius: 4, textDecoration: "none", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0a7a6c")}
                  onMouseLeave={e => (e.currentTarget.style.background = WA)}
                >
                  <MessageCircle size={15} /> CONSULTAR
                </a>
              </div>

              {/* Car image — right on desktop, top on mobile */}
              <div className="fleet-car-img">
                <Image
                  src={auto.imagen}
                  alt={`${auto.marca} ${auto.modelo}`}
                  fill
                  style={{ objectFit: "contain", filter: "drop-shadow(0px 24px 48px rgba(13,20,37,0.20)) drop-shadow(0px 6px 14px rgba(13,20,37,0.10))" }}
                  priority={current === 0}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <button
          onClick={prev}
          style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${BORDER}`, background: BG, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: TEXT2, transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = DARK; e.currentTarget.style.color = DARK }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = TEXT2 }}
        >
          <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {AUTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{ width: i === current ? 28 : 8, height: 8, borderRadius: 4, border: "none", background: i === current ? BLUE : `${DARK}20`, cursor: "pointer", transition: "all 0.3s", padding: 0 }}
            />
          ))}
        </div>

        <button
          onClick={next}
          style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${BORDER}`, background: BG, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: TEXT2, transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = DARK; e.currentTarget.style.color = DARK }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = TEXT2 }}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}

// ── Usados ────────────────────────────────────────────────────────────────────
function UsadosSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const marcas = ["Renault", "Toyota", "Fiat", "Peugeot", "Ford", "Volkswagen", "Chevrolet", "Honda"]

  return (
    <section ref={ref} style={{ background: BG2, padding: "96px 0", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="grid lg:grid-cols-2" style={{ gap: "clamp(40px, 6vw, 96px)", alignItems: "center" }}>

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            <div style={{ borderLeft: `5px solid ${BLUE}`, paddingLeft: 20, marginBottom: 24 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>VEHÍCULOS SEMINUEVOS</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(32px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase", color: DARK }}>
                TAMBIÉN<br /><span style={{ color: BLUE }}>VENDEMOS USADOS</span>
              </h2>
            </div>
            <p style={{ fontFamily: BODY, fontSize: 16, color: TEXT2, lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
              Contamos con un stock de vehículos usados en constante rotación. Escribinos por WhatsApp y te contamos qué tenemos disponible hoy.
            </p>
            <a
              href={`https://wa.me/5493442647442?text=Hola! Me gustaría ver los autos usados disponibles`}
              target="_blank" rel="noopener noreferrer"
              className="shimmer-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: WA, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "14px 30px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)", textDecoration: "none" }}
            >
              <MessageCircle size={15} /> CONSULTAR STOCK DE USADOS
            </a>
          </motion.div>

          {/* RIGHT — marcas */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 24 }}>MARCAS FRECUENTES EN STOCK</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {marcas.map((m, i) => (
                <motion.div
                  key={m}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: DARK, letterSpacing: "0.06em", padding: "10px 18px", border: `1.5px solid ${BORDER}`, borderRadius: 6 }}
                >
                  {m.toUpperCase()}
                </motion.div>
              ))}
            </div>
            <p style={{ fontFamily: BODY, fontSize: 13, color: TEXT2, marginTop: 20, lineHeight: 1.6 }}>
              El stock varía semana a semana. Consultanos para ver la disponibilidad actual.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ── Bento — Finance ───────────────────────────────────────────────────────────
function BentoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} id="financiacion" style={{ background: BG, padding: "96px 0", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderLeft: `5px solid ${BLUE}`, paddingLeft: 20, marginBottom: 48 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>HACEMOS TODO MÁS FÁCIL</div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase", color: DARK }}>
            TU AUTO, <span style={{ color: BLUE }}>SIN VUELTAS</span>
          </h2>
        </div>

        <div>

          {/* Fila 1 — Tomamos tu usado */}
          <motion.div
            className="bento-row"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div style={{ width: 64, height: 64, background: `${BLUE}0e`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <RefreshCw size={30} style={{ color: BLUE }} />
            </div>
            <div className="bento-row-title">
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(26px, 3vw, 42px)", lineHeight: 1, textTransform: "uppercase", color: DARK, letterSpacing: "-0.02em" }}>
                TOMAMOS TU <span style={{ color: BLUE }}>USADO</span>
              </h3>
            </div>
            <p className="bento-row-desc" style={{ fontFamily: BODY, fontSize: 15, color: TEXT2, lineHeight: 1.75 }}>
              Tasamos tu vehículo de forma justa y transparente. Lo tomamos como parte de pago para que el salto al próximo sea más fácil y más barato.
            </p>
          </motion.div>

          <div style={{ height: 1, background: BORDER }} />

          {/* Fila 2 — Financiamos */}
          <motion.div
            className="bento-row"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <div style={{ width: 64, height: 64, background: `${RED}0c`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CreditCard size={30} style={{ color: RED }} />
            </div>
            <div className="bento-row-title">
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(26px, 3vw, 42px)", lineHeight: 1, textTransform: "uppercase", color: DARK, letterSpacing: "-0.02em" }}>
                FINANCIAMOS
              </h3>
            </div>
            <p className="bento-row-desc" style={{ fontFamily: BODY, fontSize: 15, color: TEXT2, lineHeight: 1.75 }}>
              Planes en pesos adaptados a tu situación. Sin trámites complicados, cuotas que se ajustan a vos.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Gabriel S.",      car: "Google Maps", text: "Buena gente, les hemos comprado autos y si los autos que venden son buenos, mejor aún la calidad de personas.", stars: 5 },
  { name: "Fede",            car: "Google Maps", text: "La atención es excelente y muy buena predisposición, gente que sabe lo que hace!", stars: 5 },
  { name: "Luis Alberto D.", car: "Google Maps", text: "Excelente atención, siempre dispuestos a brindar lo mejor con los clientes, que es lo más importante.", stars: 5 },
]

function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} style={{ background: BG2, padding: "clamp(48px, 10vw, 96px) 0", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header with decorative quote */}
        <div style={{ textAlign: "center", marginBottom: 52, position: "relative" }}>
          <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(80px, 14vw, 160px)", color: `${BLUE}08`, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>&ldquo;</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8, position: "relative" }}>CLIENTES</div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase", color: DARK, position: "relative" }}>
            LO QUE DICEN <span style={{ color: BLUE }}>NUESTROS CLIENTES</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3" style={{ gap: 16 }}>
          {TESTIMONIALS.map(({ name, car, text, stars }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "32px 28px", borderTop: `3px solid ${BLUE}`, position: "relative", overflow: "hidden" }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
                {Array.from({ length: stars }).map((_, j) => (
                  <Star key={j} size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                ))}
              </div>
              <p style={{ fontFamily: BODY, fontSize: 15, color: "rgba(13,20,37,0.65)", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
                &ldquo;{text}&rdquo;
              </p>
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: DARK }}>{name}</div>
                <div style={{ fontFamily: BODY, fontSize: 12, color: TEXT2, marginTop: 2 }}>{car}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} id="contacto" style={{ background: BG, padding: "clamp(48px, 10vw, 96px) 0", borderTop: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
      {/* Dot grid texture */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle, ${DARK}0a 1.5px, transparent 1.5px)`, backgroundSize: "30px 30px" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <div className="grid lg:grid-cols-2" style={{ gap: "clamp(32px, 6vw, 80px)", alignItems: "center" }}>

          {/* LEFT */}
          <div>
            <div style={{ borderLeft: `5px solid ${RED}`, paddingLeft: 20, marginBottom: 40 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>CONTACTO</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase", color: DARK }}>
                VISITANOS O{" "}
                <span style={{ color: RED }}>ESCRIBINOS</span>
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 40 }}>
              {[
                { Icon: MapPin,        label: "Dirección", value: "Gral. Galarza 1712, Concepción del Uruguay, Entre Ríos" },
                { Icon: Clock,         label: "Lun–Vie",   value: "9:00 a 17:00" },
                { Icon: Clock,         label: "Sábados",   value: "8:30 a 12:00" },
                { Icon: MessageCircle, label: "WhatsApp",  value: "+54 9 3442 64-7442" },
              ].map(({ Icon, label, value }) => (
                <div key={label + value} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 40, height: 40, background: `${BLUE}10`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} style={{ color: BLUE }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: BODY, fontSize: 10, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: DARK }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: Hours card */}
          <motion.div
            initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ background: `linear-gradient(135deg, ${BLUE}0e 0%, ${BLUE}06 100%)`, border: `1px solid ${BLUE}22`, borderRadius: 12, padding: "clamp(24px, 5vw, 44px) clamp(20px, 4vw, 40px)" }}
          >
            <h3 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(22px, 5vw, 32px)", lineHeight: 1.1, letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 36, color: DARK }}>
              HORARIOS DE<br />ATENCIÓN
            </h3>
            {[
              { day: "LUN – VIE", open: "09:00", close: "17:00" },
              { day: "SÁBADOS",   open: "08:30", close: "12:00" },
            ].map(({ day, open, close }) => (
              <div key={day} style={{ marginBottom: 30 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: TEXT2, letterSpacing: "0.14em", marginBottom: 12 }}>{day}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ background: BG2, fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, padding: "8px 20px", clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)", color: DARK, lineHeight: 1, display: "inline-block" }}>
                    {open}
                  </span>
                  <div style={{ width: 22, height: 2.5, background: RED, transform: "rotate(-20deg)", flexShrink: 0 }} />
                  <span style={{ background: RED, fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, padding: "8px 20px", clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)", color: "#fff", lineHeight: 1, display: "inline-block" }}>
                    {close}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Telepase Banner ───────────────────────────────────────────────────────────
const TELE = "#0a5c36"
function TelepaseBanner() {
  return (
    <div style={{ background: `${TELE}0c`, borderTop: `1px solid ${TELE}22`, borderBottom: `1px solid ${TELE}22` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
            <Image src="/telepase%20logo.png" alt="TelePASE" fill style={{ objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 15, letterSpacing: "0.02em", color: DARK }}>Gestionamos tu Telepase</div>
            <div style={{ fontFamily: BODY, fontSize: 13, color: TEXT2, marginTop: 2 }}>Nos encargamos del trámite para que viajes sin parar en los peajes.</div>
          </div>
        </div>
        <a
          href="https://wa.me/5493442647442?text=Hola! Quiero información sobre el trámite del Telepase"
          target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${TELE}`, color: TELE, fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", padding: "9px 20px", textDecoration: "none", borderRadius: 4, whiteSpace: "nowrap", transition: "background 0.2s, color 0.2s", flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = TELE; e.currentTarget.style.color = "#fff" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TELE }}
        >
          <MessageCircle size={13} /> CONSULTAR
        </a>
      </div>
    </div>
  )
}

// ── Gestoría ──────────────────────────────────────────────────────────────────
function GestoriaSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const servicios = [
    "Transferencias de vehículos",
    "Patentamiento de autos 0 km",
    "Radicación de vehículos",
    "Trámites ante el Registro del Automotor",
    "Gestión de deudas y multas",
    "Duplicados de cédula y título",
  ]

  return (
    <section id="gestoria" ref={ref} style={{ background: BG2, padding: "clamp(48px, 10vw, 96px) 0", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="grid lg:grid-cols-2" style={{ gap: "clamp(40px, 6vw, 96px)", alignItems: "start" }}>

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            <div style={{ borderLeft: `5px solid ${BLUE}`, paddingLeft: 20, marginBottom: 24 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>SERVICIOS ADICIONALES</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(32px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase", color: DARK }}>
                GESTORÍA<br /><span style={{ color: BLUE }}>AUTOMOTOR</span>
              </h2>
            </div>
            <p style={{ fontFamily: BODY, fontSize: 16, color: TEXT2, lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
              Además de la compra y venta de vehículos, te ayudamos con todos los trámites del automotor. Sin colas, sin vueltas — nosotros nos encargamos del papeleo.
            </p>
            <a
              href="https://wa.me/5493442577671?text=Hola! Necesito información sobre gestoría automotor"
              target="_blank" rel="noopener noreferrer"
              className="shimmer-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: WA, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "14px 30px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)", textDecoration: "none" }}
            >
              <MessageCircle size={15} /> CONSULTAR POR WHATSAPP
            </a>
          </motion.div>

          {/* RIGHT — trámites sin contenedor */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 28 }}>TRÁMITES QUE REALIZAMOS</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {servicios.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: 8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0" }}
                >
                  <CheckCircle size={15} style={{ color: BLUE, flexShrink: 0 }} />
                  <span style={{ fontFamily: BODY, fontSize: 15, color: DARK, lineHeight: 1.5 }}>{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: BG2, borderTop: "none" }}>
      {/* Color stripe top */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${BLUE}, ${RED})` }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 0" }}>
        <div className="grid md:grid-cols-4" style={{ gap: 48, paddingBottom: 52, borderBottom: `1px solid ${BORDER}` }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <Image src="/logo.webp" alt="Chita Automotores" width={180} height={72} style={{ objectFit: "contain", width: "clamp(120px, 16vw, 180px)", height: "auto" }} />
            </div>
            <p style={{ fontFamily: BODY, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>
              Concesionaria de autos 0km y usados en Concepción del Uruguay, Entre Ríos. Desde 1984.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 20 }}>NAVEGACIÓN</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Inicio", "Vehículos", "Financiación", "Contacto"].map(l => (
                <a key={l} href={`#${l.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`} style={{ fontFamily: BODY, fontSize: 14, color: TEXT2, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = DARK)} onMouseLeave={e => (e.currentTarget.style.color = TEXT2)}>
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Vehículos */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 20 }}>VEHÍCULOS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Autos 0km", "Autos Usados", "Tomá mi usado", "Financiación"].map(l => (
                <a key={l} href="#vehiculos" style={{ fontFamily: BODY, fontSize: 14, color: TEXT2, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = DARK)} onMouseLeave={e => (e.currentTarget.style.color = TEXT2)}>
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 20 }}>CONTACTO</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <MapPin size={14} style={{ color: BLUE, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: BODY, fontSize: 13, color: TEXT2, lineHeight: 1.5 }}>Gral. Galarza 1712<br />Concepción del Uruguay</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Clock size={14} style={{ color: BLUE, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: BODY, fontSize: 13, color: TEXT2, lineHeight: 1.5 }}>Lun–Vie 9–17 · Sáb 8:30–12</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <MessageCircle size={14} style={{ color: WA, marginTop: 2, flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontFamily: BODY, fontSize: 13, color: TEXT2, lineHeight: 1.4 }}>Ventas: +54 9 3442 64-7442</span>
                  <span style={{ fontFamily: BODY, fontSize: 13, color: TEXT2, lineHeight: 1.4 }}>Gestoría: +54 9 3442 57-7671</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: BODY, fontSize: 12, color: TEXT2 }}>
            © {new Date().getFullYear()} Chita Automotores · Todos los derechos reservados
          </span>
          <span style={{ fontFamily: BODY, fontSize: 12, color: TEXT2 }}>
            Concepción del Uruguay, Entre Ríos, Argentina
          </span>
        </div>
      </div>
    </footer>
  )
}

// ── Floating WA ───────────────────────────────────────────────────────────────
function FloatingWA() {
  return (
    <motion.a
      href="https://wa.me/5493442647442"
      target="_blank" rel="noopener noreferrer"
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.12 }}
      style={{ position: "fixed", bottom: "clamp(16px, 4vw, 28px)", right: "clamp(16px, 4vw, 28px)", width: "clamp(46px, 12vw, 56px)", height: "clamp(46px, 12vw, 56px)", background: WA, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99, boxShadow: `0 6px 28px ${WA}66`, color: "#fff", textDecoration: "none" }}
    >
      <MessageCircle size={24} />
    </motion.a>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <main>
      <ScrollProgress />
      <TopBar />
      <HeroSection />
      <BrandStrip />
      <FleetSection />
      <UsadosSection />
      <BentoSection />
      <TelepaseBanner />
      <GestoriaSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <FloatingWA />
    </main>
  )
}
