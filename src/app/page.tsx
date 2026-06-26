"use client";
import { MessageCircle, ChevronDown, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { C, WHATSAPP, EMAIL } from "@/lib/constants";
import { useWindowSize } from "@/lib/useWindowSize";

export default function InicioPage() {
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;

  return (
    <>
      {/* ══ HERO ════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", padding: isMobile ? "100px 24px 60px" : "0 48px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/fondo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,27,42,0.6) 0%, rgba(13,27,42,0.5) 50%, rgba(13,27,42,0.82) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 860 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,200,83,0.1)", border: "1px solid rgba(0,200,83,0.2)", color: C.green, fontSize: 11, fontWeight: 600, padding: "6px 16px", borderRadius: 980, marginBottom: isMobile ? 18 : 28, letterSpacing: "0.5px" }}>
            Matrículas Abiertas 2026
          </div>
          <h1 style={{ color: "white", fontSize: isMobile ? "36px" : "clamp(56px,7vw,88px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: isMobile ? "-1px" : "-3px", marginBottom: isMobile ? 18 : 24, textShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
            Formación Técnica{" "}
            <span style={{ color: C.green }}>para el Sector Energético</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: isMobile ? 15 : 18, maxWidth: 520, margin: isMobile ? "0 auto 32px" : "0 auto 40px", lineHeight: 1.65 }}>
            Modalidad 100% virtual · Clases de lunes a jueves 7–9 pm · Certificación avalada por SSAAES
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexDirection: isMobile ? "column" : "row", padding: isMobile ? "0 12px" : 0 }}>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: isMobile ? "14px 24px" : "15px 34px", borderRadius: 980, fontSize: isMobile ? 14 : 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 24px rgba(0,200,83,0.45)", width: isMobile ? "100%" : "auto", boxSizing: "border-box" as const }}>
              <MessageCircle size={18} /> Inscribirme ahora
            </a>
            <Link href="/programas" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "rgba(255,255,255,0.12)", color: "white", padding: isMobile ? "14px 24px" : "15px 34px", borderRadius: 980, fontSize: isMobile ? 14 : 16, fontWeight: 700, textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", width: isMobile ? "100%" : "auto", boxSizing: "border-box" as const }}>
              Ver Programas
            </Link>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", gap: 56, justifyContent: "center", marginTop: 64 }}>
              {[{ v: "30+", l: "Programas" }, { v: "100%", l: "Virtual" }, { v: "2026", l: "Matrículas abiertas" }].map(s => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <p style={{ color: C.green, fontSize: 36, fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>{s.v}</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link href="/programas" style={{ position: "absolute", bottom: isMobile ? 28 : 36, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none", animation: "bounce 2s infinite" }}>
          <ChevronDown size={26} />
        </Link>
      </section>

      {/* ══ CONVENIO STRIP ══════════════════════════════════════════════ */}
      <div style={{ background: C.navy, padding: isMobile ? "16px 20px" : "18px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 8 : 20, flexWrap: "wrap", textAlign: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px" }}>En convenio con</span>
          <span style={{ color: C.green, fontSize: 13, fontWeight: 800 }}>SSAAES</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>NIT 900650018-5</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <a href="tel:3115267054" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}><Phone size={11} /> 311 5267054</a>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <a href={EMAIL} style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none" }}>institutodepetroleo01@gmail.com</a>
        </div>
      </div>
    </>
  );
}
