"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import {
  MapPin, Clock, Car, Shield, CheckCircle, X, MessageCircle,
  Star, ArrowRight, RefreshCw, CreditCard, Award, TrendingUp,
  ChevronDown, Menu, FileText, Zap,
} from "lucide-react"

const DISPLAY = "var(--font-display)"
const BODY    = "var(--font-body)"
const BLUE    = "#1a44d4"
const RED     = "#CC1122"
const DARK    = "#0d1425"
const DARKER  = "#091020"

// URL-encodes filenames from /public/imagenes autos/
const p = (f: string) => `/imagenes%20autos/${f.replace(/ /g, "%20")}`

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

  return <span ref={ref}>{display}{suffix}</span>
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
    { label: "INICIO",      href: "#inicio"      },
    { label: "VEHÍCULOS",   href: "#vehiculos"   },
    { label: "FINANCIACIÓN",href: "#financiacion"},
    { label: "GESTORÍA",    href: "#gestoria"    },
    { label: "CONTACTO",    href: "#contacto"    },
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
              background: "rgba(2,8,19,0.97)",
              backdropFilter: "blur(16px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 28,
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)" }}
            >
              <X size={24} />
            </button>
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 32, color: "#fff", textDecoration: "none", letterSpacing: "0.06em" }}
              >
                {label}
              </a>
            ))}
            <a
              href="https://wa.me/5493442647442"
              target="_blank" rel="noopener noreferrer"
              style={{ marginTop: 12, background: RED, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, letterSpacing: "0.08em", padding: "14px 32px", borderRadius: 4, textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
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
              style={{ overflow: "hidden", background: "rgba(4,7,28,0.97)", borderBottom: `1px solid ${BLUE}30` }}
            >
              <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 36, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.52)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, display: "inline-block", flexShrink: 0 }} />
                  Lun–Vie 9:00–17:00 &nbsp;·&nbsp; Sáb 8:30–12:00 &nbsp;·&nbsp; Gral. Galarza 1712, Concepción del Uruguay
                </div>
                <button onClick={() => setShowBar(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 4, display: "flex" }}>
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navbar */}
        <nav style={{
          background: scrolled ? "rgba(4,7,28,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(28px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(28px)" : "none",
          borderBottom: scrolled ? `1px solid ${BLUE}20` : "none",
          transition: "background 0.4s, border-color 0.4s",
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
                  style={{ padding: "6px 14px", borderRadius: 999, color: "rgba(255,255,255,0.62)", textDecoration: "none", transition: "color 0.2s, background 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)" }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.62)"; e.currentTarget.style.background = "transparent" }}
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
              style={{ alignItems: "center", gap: 8, background: RED, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: "0.07em", padding: "8px 20px", borderRadius: 4, textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <MessageCircle size={14} /> WHATSAPP
            </a>

            {/* Hamburger */}
            <button className="flex md:hidden" onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
              <Menu size={24} />
            </button>
          </div>

          {scrolled && <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${BLUE}55, transparent)` }} />}
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
        background: `linear-gradient(150deg, #020d1f 0%, ${DARK} 45%, #071030 100%)`,
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Diagonal background wash */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `linear-gradient(125deg, transparent 38%, ${BLUE}0c 62%, ${BLUE}1a 100%)`,
        clipPath: "polygon(42% 0%, 100% 0%, 100% 100%, 28% 100%)",
      }} />

      {/* Diagonal slash motif — from flyer */}
      <div style={{ position: "absolute", top: "16%", left: "41%", width: 2, height: "75%", background: `linear-gradient(to bottom, transparent, ${BLUE}38, transparent)`, transform: "rotate(-12deg)" }} />
      <div style={{ position: "absolute", top: "22%", left: "43.5%", width: 1, height: "62%", background: `linear-gradient(to bottom, transparent, ${RED}28, transparent)`, transform: "rotate(-12deg)" }} />

      {/* Car — absolute behind content, hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}
        className="hidden lg:block"
        style={{ position: "absolute", right: "-4%", bottom: 0, width: "65%", zIndex: 0, pointerEvents: "none" }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", height: "80%", background: `radial-gradient(ellipse, ${BLUE}22 0%, transparent 68%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "8%", left: "6%", right: "6%", height: 2, background: `linear-gradient(90deg, transparent, ${RED}99, transparent)` }} />
        <Image
          src="/baic%20bj30%20fondo%20transparente%202.0.webp"
          alt="BAIC BJ30"
          width={900}
          height={600}
          priority
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </motion.div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(100px, 18vw, 160px) 24px clamp(48px, 8vw, 80px)", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 600 }}>
          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 9vw, 92px)", lineHeight: 0.92, letterSpacing: "-0.01em", marginBottom: 24, textTransform: "uppercase" }}
          >
            TU PRÓXIMO
            <br />
            AUTO,{" "}
            <em style={{ color: RED, fontStyle: "italic" }}>ESTÁ ACÁ.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}
            style={{ fontFamily: BODY, fontSize: 16, color: "rgba(255,255,255,0.52)", lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}
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
              style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1.5px solid ${RED}`, color: RED, fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "13px 28px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)", textDecoration: "none", transition: "background 0.2s, color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = RED; e.currentTarget.style.color = "#fff" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = RED }}
            >
              <MessageCircle size={15} /> WHATSAPP
            </a>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }}
            style={{ display: "flex", gap: 32, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {[
              { value: 40,   suffix: "",    label: "Años de trayectoria" },
              { value: 500,  suffix: "+",   label: "Vehículos vendidos" },
              { value: 100,  suffix: "%",   label: "Financiación propia" },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, color: BLUE, lineHeight: 1 }}>
                  <AnimatedNumber value={value} suffix={suffix} />
                </div>
                <div style={{ fontFamily: BODY, fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.04em" }}>
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
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.25)" }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}

// ── Brand strip ───────────────────────────────────────────────────────────────
const BRANDS = ["RENAULT", "JEEP", "TOYOTA", "FIAT", "PEUGEOT", "FORD", "VOLKSWAGEN", "CHEVROLET", "HONDA", "NISSAN"]

function BrandStrip() {
  return (
    <section style={{ background: DARKER, borderTop: `1px solid ${BLUE}18`, borderBottom: `1px solid ${BLUE}18`, padding: "18px 0", overflow: "hidden" }}>
      <div className="marquee-track">
        {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, paddingRight: 40 }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, letterSpacing: "0.22em", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>
              {b}
            </span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: `${BLUE}55`, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const stats = [
    { Icon: Award,       value: 40,  suffix: "",   top: "AÑOS DE",       bottom: "TRAYECTORIA"    },
    { Icon: Car,         value: 1000,suffix: "+",  top: "VEHÍCULOS",     bottom: "VENDIDOS"       },
    { Icon: TrendingUp,  value: 100, suffix: "%",  top: "FINANCIACIÓN",  bottom: "PROPIA"         },
    { Icon: Star,        value: 4.9, suffix: "★",  top: "CALIFICACIÓN",  bottom: "PROMEDIO"       },
  ]

  return (
    <section ref={ref} style={{ background: DARK, padding: "72px 0", borderBottom: `1px solid ${BLUE}18` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 2 }}>
          {stats.map(({ Icon, value, suffix, top, bottom }, i) => (
            <motion.div
              key={bottom}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "36px 28px", textAlign: "center" }}
            >
              <div style={{ width: 48, height: 48, background: `${BLUE}18`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Icon size={22} style={{ color: BLUE }} />
              </div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 32, lineHeight: 1, color: "#fff", marginBottom: 10, letterSpacing: "-0.01em" }}>
                {inView ? <AnimatedNumber value={value} suffix={suffix} /> : `0${suffix}`}
              </div>
              <div style={{ fontFamily: BODY, fontWeight: 400, fontSize: 12, color: "rgba(255,255,255,0.42)", letterSpacing: "0.08em" }}>{top} {bottom}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Autos ─────────────────────────────────────────────────────────────────────
const AUTOS = [
  // ── 0 KM ──
  { marca: "CHEVROLET",  modelo: "Captiva",      version: "PHEV Plug-in Hybrid",  anio: "2025", km: "0",       tipo: "0KM"   as const, imagen: p("chevrolet captiva phev 0 km.webp")                              },
  { marca: "JAC",        modelo: "JS2",          version: "Luxury",               anio: "2025", km: "0",       tipo: "0KM"   as const, imagen: p("jac js2 luxury o km.webp")                                     },
  { marca: "TOYOTA",     modelo: "Yaris Cross",  version: "XLS",                  anio: "2025", km: "0",       tipo: "0KM"   as const, imagen: p("toyota yaris cross 0 km.webp")                                  },
  // ── USADOS ──
  { marca: "JEEP",       modelo: "Renegade",     version: "Sport AT",             anio: "2025", km: "21.000",  tipo: "USADO" as const, imagen: p("jeep renegade 2025 21 mil km.webp")                             },
  { marca: "TOYOTA",     modelo: "Corolla",      version: "XEi CVT",              anio: "2023", km: "21.000",  tipo: "USADO" as const, imagen: p("toyota corolla xei cvt 2023 21mil km.webp")                     },
  { marca: "RENAULT",    modelo: "Kangoo",       version: "Furgón",               anio: "2023", km: "57.000",  tipo: "USADO" as const, imagen: p("renault kangoo 2023 57 mil km.webp")                            },
  { marca: "RENAULT",    modelo: "Captur",       version: "Intens CVT",           anio: "2020", km: "72.000",  tipo: "USADO" as const, imagen: p("renault captur intens 2020 72 mil km.webp")                     },
  { marca: "VOLKSWAGEN", modelo: "Nivus",        version: "Comfortline",          anio: "2020", km: "103.000", tipo: "USADO" as const, imagen: p("volkswagen navius 2020 103 mil km.webp")                        },
  { marca: "FIAT",       modelo: "Palio",        version: "Attractive",           anio: "2018", km: "87.000",  tipo: "USADO" as const, imagen: p("fiat palio attractive 2018 87 mil km.webp")                     },
  { marca: "PEUGEOT",    modelo: "408",          version: "Allure 2.0",           anio: "2016", km: "87.000",  tipo: "USADO" as const, imagen: p("peugeot 408 aliure 2016 87mil km.webp")                         },
  { marca: "CHEVROLET",  modelo: "Onix",         version: "LTZ",                  anio: "2016", km: "103.000", tipo: "USADO" as const, imagen: p("cherolet onix ltz 2016 103 mil km.webp")                        },
  { marca: "NISSAN",     modelo: "Frontier",     version: "Platinum 4x4",         anio: "2022", km: "174.000", tipo: "USADO" as const, imagen: p("nissan frontier platinum 4x4 2022 174 mil km.webp")             },
  { marca: "VOLKSWAGEN", modelo: "Vento",        version: "Tech Comfortline",     anio: "2017", km: "174.000", tipo: "USADO" as const, imagen: p("volkswagen vento tech comfotline 2017 174 mil km.webp")         },
]

function FleetCard({ auto }: { auto: (typeof AUTOS)[0] }) {
  const [imgError, setImgError] = useState(false)
  const accent = auto.tipo === "0KM" ? BLUE : RED

  return (
    <div
      className="fleet-card"
      style={{
        flex: "0 0 380px",
        height: 240,
        borderRadius: 12,
        background: `linear-gradient(135deg, #080f1e 0%, #0b1626 100%)`,
        border: `1px solid ${BLUE}18`,
        position: "relative",
        overflow: "hidden",
        scrollSnapAlign: "start",
      }}
    >
      {/* Accent line top */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />

      {/* Car image — right side, uses contain to respect transparency */}
      {!imgError ? (
        <div style={{ position: "absolute", right: "-4%", top: 0, bottom: 0, width: "64%", pointerEvents: "none" }}>
          <Image
            src={auto.imagen}
            alt={`${auto.marca} ${auto.modelo}`}
            fill
            loading="lazy"
            style={{ objectFit: "contain", objectPosition: "center right" }}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "60%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Car size={72} style={{ color: `${BLUE}20` }} />
        </div>
      )}

      {/* Gradient: opaque left → transparent right */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to right, #080f1e 32%, rgba(8,15,30,0.82) 52%, rgba(8,15,30,0.1) 78%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      {/* Info — left column */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "52%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px 24px" }}>
        {/* Tipo badge */}
        <span style={{
          alignSelf: "flex-start",
          background: accent, color: "#fff",
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 9, letterSpacing: "0.14em",
          padding: "3px 10px",
          clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
          marginBottom: 12,
        }}>
          {auto.tipo}
        </span>

        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 10, color: accent, letterSpacing: "0.14em", marginBottom: 3 }}>
          {auto.marca}
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 26, lineHeight: 1, marginBottom: 4 }}>
          {auto.modelo}
        </div>
        <div style={{ fontFamily: BODY, fontSize: 11, color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>
          {auto.version}
        </div>

        <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{auto.anio}</span>
          <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{auto.km === "0" ? "0 KM" : `${auto.km} km`}</span>
        </div>

        <a
          href={`https://wa.me/5493442647442?text=Hola! Me interesa el ${auto.marca} ${auto.modelo} ${auto.anio}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            alignSelf: "flex-start",
            display: "inline-flex", alignItems: "center", gap: 6,
            background: accent, color: "#fff",
            fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, letterSpacing: "0.08em",
            padding: "8px 16px", borderRadius: 4, textDecoration: "none",
          }}
        >
          <MessageCircle size={11} /> CONSULTAR
        </a>
      </div>
    </div>
  )
}

function FleetSection() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector(".fleet-card") as HTMLElement
    const amount = card ? card.offsetWidth + 16 : 396
    track.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" })
  }

  const fleet = AUTOS.slice(0, 10)

  return (
    <section id="vehiculos" style={{ background: DARK, padding: "96px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>STOCK DISPONIBLE</div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase" }}>
              VEHÍCULOS <span style={{ color: BLUE }}>DISPONIBLES</span>
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex" style={{ gap: 8 }}>
            {(["left", "right"] as const).map(dir => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  border: `1.5px solid ${BLUE}35`,
                  background: "transparent", color: "rgba(255,255,255,0.5)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s, color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = `${BLUE}18` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${BLUE}35`; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "transparent" }}
              >
                <ArrowRight size={16} style={{ transform: dir === "left" ? "rotate(180deg)" : "none" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="fleet-track"
          style={{
            display: "flex",
            overflowX: "auto",
            gap: 16,
            scrollSnapType: "x mandatory",
            paddingBottom: 4,
          }}
        >
          {fleet.map(auto => (
            <FleetCard key={`${auto.marca}-${auto.modelo}-${auto.anio}`} auto={auto} />
          ))}
        </div>

        {/* Scroll hint — mobile only */}
        <div className="flex md:hidden" style={{ alignItems: "center", gap: 6, marginTop: 14 }}>
          <ArrowRight size={11} style={{ color: "rgba(255,255,255,0.22)" }} />
          <span style={{ fontFamily: BODY, fontSize: 11, color: "rgba(255,255,255,0.22)" }}>Deslizá para ver más</span>
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
    <section ref={ref} id="financiacion" style={{ background: DARKER, padding: "96px 0", borderTop: `1px solid ${BLUE}15` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>HACEMOS TODO MÁS FÁCIL</div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase" }}>
            TU AUTO, <span style={{ color: BLUE }}>SIN VUELTAS</span>
          </h2>
        </div>

        {/* Bento grid: big left + 2 right stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gridTemplateRows: "auto auto", gap: 16 }}>

          {/* BIG: Tomamos tu usado */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              gridRow: undefined,
              background: `linear-gradient(135deg, ${BLUE}22 0%, ${BLUE}08 100%)`,
              border: `1px solid ${BLUE}28`, borderRadius: 12,
              padding: "clamp(24px, 5vw, 48px) clamp(20px, 4vw, 40px)",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: 340, position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", bottom: -20, right: -20, opacity: 0.04 }}>
              <RefreshCw size={220} />
            </div>
            <div>
              <div style={{ width: 52, height: 52, background: `${BLUE}28`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                <RefreshCw size={26} style={{ color: BLUE }} />
              </div>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 16 }}>
                TOMAMOS<br />TU <span style={{ color: BLUE }}>USADO</span>
              </h3>
              <p style={{ fontFamily: BODY, fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.7, maxWidth: 340 }}>
                Tasamos tu vehículo de forma justa y transparente. Lo tomamos como parte de pago para que el salto al próximo sea más fácil y más barato.
              </p>
            </div>
            <a
              href="https://wa.me/5493442647442?text=Hola! Quiero saber cuánto vale mi usado"
              target="_blank" rel="noopener noreferrer"
              className="shimmer-btn"
              style={{ marginTop: 32, display: "inline-flex", alignItems: "center", gap: 10, background: BLUE, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "13px 26px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)", textDecoration: "none", alignSelf: "flex-start" }}
            >
              TASAR MI USADO <ArrowRight size={15} />
            </a>
          </motion.div>

          {/* RIGHT TOP: Financiamos */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: `linear-gradient(135deg, ${RED}18 0%, ${RED}08 100%)`,
              border: `1px solid ${RED}25`, borderRadius: 12,
              padding: "36px 32px", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", bottom: -10, right: -10, opacity: 0.04 }}>
              <CreditCard size={140} />
            </div>
            <div style={{ width: 48, height: 48, background: `${RED}20`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <CreditCard size={24} style={{ color: RED }} />
            </div>
            <h3 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 28, lineHeight: 1.1, textTransform: "uppercase", marginBottom: 12 }}>
              FINANCIAMOS
            </h3>
            <p style={{ fontFamily: BODY, fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
              Planes en pesos adaptados a tu situación. Sin trámites complicados, cuotas que se ajustan a vos.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { Icon: Award,       title: "40 años de trayectoria", desc: "Cuatro décadas en Concepción del Uruguay nos respaldan. Conocemos el mercado local como nadie." },
  { Icon: RefreshCw,   title: "Tomamos tu usado",        desc: "Tasamos y tomamos tu vehículo como parte de pago al mejor precio, sin complicaciones." },
  { Icon: CreditCard,  title: "Financiamos",             desc: "Planes accesibles en pesos adaptados a tu situación. Cuotas cómodas, sin vueltas." },
  { Icon: Shield,      title: "Calidad garantizada",     desc: "Todos los vehículos pasan revisión técnica completa antes de estar disponibles en stock." },
]

function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} style={{ background: DARK, padding: "96px 0", borderTop: `1px solid ${BLUE}15` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>POR QUÉ ELEGIRNOS</div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase" }}>
            LO QUE NOS <span style={{ color: BLUE }}>DISTINGUE</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16 }}>
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: "32px 26px", transition: "border-color 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${BLUE}35`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
            >
              <div style={{ width: 48, height: 48, background: `${BLUE}18`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon size={22} style={{ color: BLUE }} />
              </div>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 19, lineHeight: 1.2, marginBottom: 12 }}>{title}</h3>
              <p style={{ fontFamily: BODY, fontSize: 14, color: "rgba(255,255,255,0.46)", lineHeight: 1.7 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Gabriel S.",      car: "Google Maps",  text: "Buena gente, les hemos comprado autos y si los autos que venden son buenos, mejor aún la calidad de personas.", stars: 5 },
  { name: "Fede",            car: "Google Maps",  text: "La atención es excelente y muy buena predisposición, gente que sabe lo que hace!", stars: 5 },
  { name: "Luis Alberto D.", car: "Google Maps",  text: "Excelente atención, siempre dispuestos a brindar lo mejor con los clientes, que es lo más importante.", stars: 5 },
]

function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} style={{ background: DARKER, padding: "clamp(48px, 10vw, 96px) 0", borderTop: `1px solid ${BLUE}15` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>CLIENTES</div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase" }}>
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
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "32px 28px" }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
                {Array.from({ length: stars }).map((_, j) => (
                  <Star key={j} size={14} style={{ color: BLUE, fill: BLUE }} />
                ))}
              </div>
              <p style={{ fontFamily: BODY, fontSize: 15, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
                &ldquo;{text}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 18 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15 }}>{name}</div>
                <div style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.32)", marginTop: 2 }}>{car}</div>
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
    <section ref={ref} id="contacto" style={{ background: DARK, padding: "clamp(48px, 10vw, 96px) 0", borderTop: `1px solid ${BLUE}15` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="grid lg:grid-cols-2" style={{ gap: "clamp(32px, 6vw, 80px)", alignItems: "center" }}>

          {/* LEFT */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>CONTACTO</div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 40 }}>
              VISITANOS O{" "}
              <span style={{ color: RED }}>ESCRIBINOS</span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 40 }}>
              {[
                { Icon: MapPin,  label: "Dirección", value: "Gral. Galarza 1712, Concepción del Uruguay, Entre Ríos" },
                { Icon: Clock,   label: "Lun–Vie",   value: "9:00 a 17:00" },
                { Icon: Clock,   label: "Sábados",   value: "8:30 a 12:00" },
                { Icon: MessageCircle, label: "WhatsApp", value: "+54 9 3442 64-7442" },
              ].map(({ Icon, label, value }) => (
                <div key={label + value} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 40, height: 40, background: `${BLUE}18`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} style={{ color: BLUE }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: BODY, fontSize: 10, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/5493442647442"
              target="_blank" rel="noopener noreferrer"
              className="shimmer-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: RED, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "14px 30px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)", textDecoration: "none" }}
            >
              <MessageCircle size={16} /> CONSULTANOS POR WHATSAPP
            </a>
          </div>

          {/* RIGHT: Hours card — flyer-inspired */}
          <motion.div
            initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ background: `linear-gradient(135deg, ${BLUE}1c 0%, ${BLUE}0a 100%)`, border: `1px solid ${BLUE}28`, borderRadius: 12, padding: "clamp(24px, 5vw, 44px) clamp(20px, 4vw, 40px)" }}
          >
            <h3 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(22px, 5vw, 32px)", lineHeight: 1.1, letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 36 }}>
              HORARIOS DE<br />ATENCIÓN
            </h3>
            {[
              { day: "LUN – VIE", open: "09:00", close: "17:00" },
              { day: "SÁBADOS",   open: "08:30", close: "12:00" },
            ].map(({ day, open, close }) => (
              <div key={day} style={{ marginBottom: 30 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: "rgba(255,255,255,0.42)", letterSpacing: "0.14em", marginBottom: 12 }}>{day}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ background: "rgba(255,255,255,0.08)", fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, padding: "8px 20px", clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)", color: "rgba(255,255,255,0.65)", lineHeight: 1, display: "inline-block" }}>
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
function TelepaseBanner() {
  return (
    <div style={{ background: `linear-gradient(90deg, ${BLUE}22 0%, ${BLUE}0a 100%)`, borderTop: `1px solid ${BLUE}25`, borderBottom: `1px solid ${BLUE}25` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, background: `${BLUE}28`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Zap size={18} style={{ color: BLUE }} />
          </div>
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 15, letterSpacing: "0.02em" }}>Gestionamos tu Telepase</div>
            <div style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.48)", marginTop: 2 }}>Nos encargamos del trámite para que viajes sin parar en los peajes.</div>
          </div>
        </div>
        <a
          href="https://wa.me/5493442647442?text=Hola! Quiero información sobre el trámite del Telepase"
          target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${BLUE}`, color: BLUE, fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", padding: "9px 20px", textDecoration: "none", borderRadius: 4, whiteSpace: "nowrap", transition: "background 0.2s, color 0.2s", flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.color = "#fff" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BLUE }}
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
    <section id="gestoria" ref={ref} style={{ background: DARKER, padding: "clamp(48px, 10vw, 96px) 0", borderTop: `1px solid ${BLUE}15` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="grid lg:grid-cols-2" style={{ gap: "clamp(32px, 6vw, 80px)", alignItems: "center" }}>

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          >
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 8 }}>SERVICIOS ADICIONALES</div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(32px, 4.5vw, 58px)", lineHeight: 1, letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 20 }}>
              GESTORÍA<br /><span style={{ color: BLUE }}>AUTOMOTOR</span>
            </h2>
            <p style={{ fontFamily: BODY, fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
              Además de la compra y venta de vehículos, te ayudamos con todos los trámites del automotor. Sin colas, sin vueltas — nosotros nos encargamos del papeleo.
            </p>
            <a
              href="https://wa.me/5493442647442?text=Hola! Necesito información sobre gestoría automotor"
              target="_blank" rel="noopener noreferrer"
              className="shimmer-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: BLUE, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "14px 30px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)", textDecoration: "none" }}
            >
              <MessageCircle size={15} /> CONSULTAR POR WHATSAPP
            </a>
          </motion.div>

          {/* RIGHT — servicios list */}
          <motion.div
            initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ background: `linear-gradient(135deg, ${BLUE}14 0%, ${BLUE}06 100%)`, border: `1px solid ${BLUE}22`, borderRadius: 12, padding: "clamp(24px, 5vw, 40px)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, background: `${BLUE}22`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={22} style={{ color: BLUE }} />
              </div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 18 }}>Trámites que realizamos</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {servicios.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <CheckCircle size={15} style={{ color: BLUE, flexShrink: 0 }} />
                  <span style={{ fontFamily: BODY, fontSize: 15, color: "rgba(255,255,255,0.75)" }}>{s}</span>
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
    <footer style={{ background: DARKER, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 0" }}>
        <div className="grid md:grid-cols-4" style={{ gap: 48, paddingBottom: 52, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <Image src="/logo.webp" alt="Chita Automotores" width={120} height={48} style={{ objectFit: "contain" }} />
            </div>
            <p style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>
              Concesionaria de autos 0km y usados en Concepción del Uruguay, Entre Ríos. Desde 1984.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, color: BLUE, letterSpacing: "0.14em", marginBottom: 20 }}>NAVEGACIÓN</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Inicio", "Vehículos", "Financiación", "Contacto"].map(l => (
                <a key={l} href={`#${l.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`} style={{ fontFamily: BODY, fontSize: 14, color: "rgba(255,255,255,0.42)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}>
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
                <a key={l} href="#vehiculos" style={{ fontFamily: BODY, fontSize: 14, color: "rgba(255,255,255,0.42)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}>
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
                <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>Gral. Galarza 1712<br />Concepción del Uruguay</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Clock size={14} style={{ color: BLUE, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>Lun–Vie 9–17 · Sáb 8:30–12</span>
              </div>
              <a href="https://wa.me/5493442647442" target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: 10, textDecoration: "none" }}>
                <MessageCircle size={14} style={{ color: RED, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: BODY, fontSize: 13, color: RED }}>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.22)" }}>
            © {new Date().getFullYear()} Chita Automotores · Todos los derechos reservados
          </span>
          <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.18)" }}>
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
      style={{ position: "fixed", bottom: "clamp(16px, 4vw, 28px)", right: "clamp(16px, 4vw, 28px)", width: "clamp(46px, 12vw, 56px)", height: "clamp(46px, 12vw, 56px)", background: RED, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99, boxShadow: `0 6px 28px ${RED}55`, color: "#fff", textDecoration: "none" }}
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
      <BentoSection />
      <TestimonialsSection />
      <TelepaseBanner />
      <GestoriaSection />
      <ContactSection />
      <Footer />
      <FloatingWA />
    </main>
  )
}
