"use client";
import Link from "next/link";
import { Drill, ShieldAlert, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: "#0F172A", borderBottom: "1px solid rgba(249,115,22,0.2)", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#F97316", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 11 }}>ITP</div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>INSTITUTO TECNICO DE PETROLEO</span>
        </div>
        <Link href="/login" style={{ background: "#F97316", color: "white", padding: "8px 20px", borderRadius: 980, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
          Aula Virtual
        </Link>
      </nav>

      {/* HERO */}
      <section style={{ background: "#0F172A", padding: "96px 28px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h1 style={{ color: "white", fontSize: "clamp(42px, 8vw, 72px)", fontWeight: 800, lineHeight: 1, letterSpacing: "-2px", marginBottom: 20 }}>
            Impulsando el <br />
            <span style={{ color: "#F97316" }}>futuro energetico</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
            Formacion tecnica superior con estandares internacionales en la capital petrolera de Colombia.
          </p>
        </div>
      </section>

      {/* CARRERAS */}
      <section style={{ padding: "80px 28px", maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: "#F97316", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Programas</p>
          <h2 style={{ color: "#0F172A", fontSize: 32, fontWeight: 700, letterSpacing: "-1px", margin: 0 }}>Nuestras carreras</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>Elige la carrera que va a transformar tu futuro profesional.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: <Drill size={22} />, title: "Petroleos", desc: "Exploracion, extraccion y gestion tecnica de hidrocarburos con enfoque global.", tag: "Tec. en Petroleos", ic: "#F97316", bg: "#fff7ed" },
            { icon: <ShieldAlert size={22} />, title: "Seguridad Industrial", desc: "Prevencion de riesgos y normatividad HSE en entornos de alta exigencia petrolera.", tag: "Tec. en SST", ic: "#3b82f6", bg: "#eff6ff" },
            { icon: <BarChart3 size={22} />, title: "Marketing", desc: "Estrategias de posicionamiento y ventas para el sector de servicios energeticos.", tag: "Tec. en Marketing", ic: "#10b981", bg: "#ecfdf5" },
          ].map((c) => (
            <div key={c.title} style={{ background: "white", borderRadius: 22, padding: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: c.bg, color: c.ic, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{c.icon}</div>
              <h3 style={{ color: "#0F172A", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{c.title}</h3>
              <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              <span style={{ display: "inline-block", marginTop: 16, fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 980, background: c.bg, color: c.ic }}>{c.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "28px", borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase" }}>Instituto Tecnico de Petroleo - 2026</p>
      </footer>

    </div>
  );
}