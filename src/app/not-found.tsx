"use client"

import { motion } from "framer-motion"
import { ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"

const DISPLAY = "var(--font-display)"
const BODY    = "var(--font-body)"
const BLUE    = "#1a44d4"
const RED     = "#CC1122"

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020813",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background diagonal accents */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${BLUE}10 0%, transparent 65%)`, pointerEvents: "none" }} />

      {/* 404 — glitch title */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        {/* Base */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(120px, 22vw, 200px)", lineHeight: 0.85, letterSpacing: "-0.05em", color: "#fff", position: "relative", userSelect: "none" }}
        >
          404
        </motion.div>

        {/* Glitch layer 1 */}
        <div
          style={{
            position: "absolute", inset: 0,
            fontFamily: DISPLAY, fontWeight: 900,
            fontSize: "clamp(120px, 22vw, 200px)", lineHeight: 0.85, letterSpacing: "-0.05em",
            color: BLUE, pointerEvents: "none",
            animation: "glitch-1 3.5s steps(1) infinite",
          }}
        >
          404
        </div>

        {/* Glitch layer 2 */}
        <div
          style={{
            position: "absolute", inset: 0,
            fontFamily: DISPLAY, fontWeight: 900,
            fontSize: "clamp(120px, 22vw, 200px)", lineHeight: 0.85, letterSpacing: "-0.05em",
            color: RED, pointerEvents: "none",
            animation: "glitch-2 3.5s steps(1) infinite 0.15s",
          }}
        >
          404
        </div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(22px, 3vw, 34px)", letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 14 }}
      >
        PÁGINA NO ENCONTRADA
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        style={{ fontFamily: BODY, fontSize: 16, color: "rgba(255,255,255,0.45)", marginBottom: 44, maxWidth: 380, lineHeight: 1.65 }}
      >
        La página que buscás no existe, pero sí tenemos el auto que buscás.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}
      >
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1.5px solid rgba(255,255,255,0.2)`, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "13px 28px", borderRadius: 4, textDecoration: "none", transition: "border-color 0.2s, background 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "transparent" }}
        >
          <ArrowLeft size={15} /> VOLVER AL INICIO
        </Link>
        <a
          href="https://wa.me/5493442000000"
          target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, background: RED, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", padding: "13px 28px", borderRadius: 4, textDecoration: "none", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <MessageCircle size={15} /> CONTACTAR
        </a>
      </motion.div>
    </div>
  )
}
