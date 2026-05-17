"use client";
import Link from "next/link";
import { ChevronDown, ChevronUp, MessageCircle, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const WHATSAPP = "https://wa.me/573218837010";
const EMAIL = "mailto:institutodepetroleo01@gmail.com";

// ─── HOOK RESPONSIVE ──────────────────────────────────────────────────────────
function useWindowSize() {
  const [width, setWidth] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setWidth(window.innerWidth);
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return { width, mounted };
}

const programas = [
  {
    sector: "Sector Hidrocarburos",
    color: "#00C853",
    bg: "#e8f5e9",
    cursos: [
      { nombre: "Perforacion y Produccion de Pozos", desc: "Formacion tecnica en operaciones de perforacion, completamiento y produccion de pozos petroleros con estandares internacionales." },
      { nombre: "Operador de Equipo Pesado", desc: "Capacitacion en manejo y mantenimiento de maquinaria pesada utilizada en operaciones del sector hidrocarburos." },
      { nombre: "Mecanica Diesel", desc: "Tecnicas de diagnostico, mantenimiento y reparacion de motores diesel aplicados al sector energetico." },
    ]
  },
  {
    sector: "Sector Tecnico / Industrial",
    color: "#00BFA5",
    bg: "#e0f2f1",
    cursos: [
      { nombre: "Electromecanica", desc: "Integracion de sistemas electricos y mecanicos para el mantenimiento industrial en plantas y equipos del sector." },
      { nombre: "Electricidad Industrial", desc: "Instalacion, operacion y mantenimiento de sistemas electricos en entornos industriales y petroleros." },
      { nombre: "Instrumentacion Industrial", desc: "Calibracion, instalacion y mantenimiento de instrumentos de medicion y control en procesos industriales." },
    ]
  },
  {
    sector: "HSEQ y Ambiente",
    color: "#00C853",
    bg: "#e8f5e9",
    cursos: [
      { nombre: "Auxiliar en Seguridad y Salud en el Trabajo (SST)", desc: "Formacion en normatividad HSE, identificacion de riesgos y gestion de seguridad en entornos de alta exigencia." },
      { nombre: "Gestion Ambiental", desc: "Herramientas para la identificacion, evaluacion y control de impactos ambientales en operaciones industriales." },
    ]
  },
  {
    sector: "Certificaciones de Campo (100h)",
    color: "#00897B",
    bg: "#e0f2f1",
    cursos: [
      { nombre: "Cunero", desc: "Certificacion en operaciones basicas de cuadra en taladros de perforacion." },
      { nombre: "Encuellador", desc: "Certificacion para trabajos en altura en la torre del taladro y manejo de tuberia." },
      { nombre: "Aceitero", desc: "Certificacion en lubricacion y mantenimiento preventivo de equipos de perforacion." },
      { nombre: "Patiero", desc: "Certificacion en operaciones de patio en instalaciones de perforacion y produccion." },
      { nombre: "Recorredor", desc: "Certificacion para supervision y recorrido de lineas de produccion en campo petrolero." },
      { nombre: "Recoge muestras", desc: "Certificacion en tecnicas de toma y manejo de muestras geologicas y de fluidos." },
      { nombre: "Operador de Planta de Tratamiento de Aguas", desc: "Certificacion en operacion y control de plantas de tratamiento de aguas industriales." },
      { nombre: "Matematicas Petroleras", desc: "Certificacion en calculo aplicado a operaciones y mediciones del sector petroleo y gas." },
    ]
  },
];

function AcordeonSector({ sector, color, bg, cursos, isMobile }: typeof programas[0] & { isMobile: boolean }) {
  const [open, setOpen] = useState(false);
  const [openCurso, setOpenCurso] = useState<number | null>(null);

  return (
    <div style={{ background: "white", borderRadius: isMobile ? 16 : 20, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 18px" : "20px 24px", background: "white", border: "none", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 14 }}>
          <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: color, fontSize: 10, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>Programa</p>
            <h3 style={{ color: "#0d1b2a", fontSize: isMobile ? 14 : 16, fontWeight: 700, margin: 0 }}>{sector}</h3>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ background: bg, color: color, fontSize: isMobile ? 10 : 11, fontWeight: 700, padding: isMobile ? "3px 8px" : "4px 12px", borderRadius: 980 }}>
            {isMobile ? cursos.length : `${cursos.length} cursos`}
          </span>
          {open ? <ChevronUp size={16} color="#6b9e7e" /> : <ChevronDown size={16} color="#6b9e7e" />}
        </div>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: isMobile ? "12px 16px" : "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
            {["100% Virtual", "Pago a cuotas", "Matriculas 2026"].map(tag => (
              <span key={tag} style={{ background: "#f0faf5", color: "#4a7c6f", fontSize: 10, fontWeight: 500, padding: "3px 10px", borderRadius: 980 }}>{tag}</span>
            ))}
          </div>

          {cursos.map((c, i) => (
            <div key={c.nombre} style={{ background: "#f0faf5", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.04)" }}>
              <button
                onClick={() => setOpenCurso(openCurso === i ? null : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "12px 14px" : "14px 18px", background: "transparent", border: "none", cursor: "pointer", gap: 10 }}
              >
                <span style={{ color: "#0d1b2a", fontSize: isMobile ? 13 : 14, fontWeight: 600, textAlign: "left" }}>{c.nombre}</span>
                <span style={{ flexShrink: 0 }}>
                  {openCurso === i ? <ChevronUp size={14} color="#6b9e7e" /> : <ChevronDown size={14} color="#6b9e7e" />}
                </span>
              </button>
              {openCurso === i && (
                <div style={{ padding: isMobile ? "0 14px 14px" : "0 18px 16px" }}>
                  <p style={{ color: "#4a7c6f", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>{c.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
                    <a href={WHATSAPP} target="_blank"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, background: color, color: "white", padding: "10px 18px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                    >
                      <MessageCircle size={14} /> Inscribirme ahora
                    </a>
                    <a href={EMAIL}
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, background: bg, color: color, padding: "10px 18px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                    >
                      <Mail size={14} /> Mas info
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;

  return (
    <div style={{ minHeight: "100vh", background: "#f0faf5", fontFamily: "Inter, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        background: "#0d1b2a",
        borderBottom: "1px solid rgba(0,200,83,0.2)",
        padding: isMobile ? "12px 16px" : "14px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="ITP Logo" style={{ height: isMobile ? 40 : 54, width: "auto", objectFit: "contain" }} />
          <span style={{ color: "white", fontWeight: 700, fontSize: isMobile ? 15 : 18 }}>ITP</span>
        </div>
        <Link href="/login" style={{
          background: "#00C853", color: "white",
          padding: isMobile ? "8px 16px" : "8px 20px",
          borderRadius: 980, fontSize: isMobile ? 13 : 14,
          fontWeight: 600, textDecoration: "none",
        }}>
          Aula Virtual
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: "#0d1b2a", padding: isMobile ? "52px 20px 44px" : "96px 28px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,200,83,0.1)", border: "1px solid rgba(0,200,83,0.2)",
            color: "#00C853", fontSize: 11, fontWeight: 600,
            padding: "6px 16px", borderRadius: 980, marginBottom: isMobile ? 18 : 28, letterSpacing: "0.5px",
          }}>
            Matriculas Abiertas 2026
          </div>
          <h1 style={{
            color: "white",
            fontSize: isMobile ? "34px" : "clamp(42px, 8vw, 72px)",
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: isMobile ? "-1px" : "-2px",
            marginBottom: isMobile ? 14 : 20,
          }}>
            Impulsando el{" "}
            <span style={{ color: "#00C853" }}>futuro energetico</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: isMobile ? 15 : 17,
            maxWidth: 420, margin: isMobile ? "0 auto 28px" : "0 auto 36px",
            lineHeight: 1.6,
          }}>
            Expertos en petróleo y técnica industrial. Estudia a tu ritmo, llega más lejos.
          </p>
          <div style={{
            display: "flex", gap: 10, justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            padding: isMobile ? "0 8px" : 0,
          }}>
            <a href={WHATSAPP} target="_blank" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#00C853", color: "white",
              padding: "13px 24px", borderRadius: 980,
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              width: isMobile ? "100%" : "auto", boxSizing: "border-box" as const,
            }}>
              <MessageCircle size={16} /> WhatsApp 321 8837010
            </a>
            <a href={EMAIL} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "rgba(255,255,255,0.08)", color: "white",
              padding: "13px 24px", borderRadius: 980,
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              width: isMobile ? "100%" : "auto", boxSizing: "border-box" as const,
            }}>
              <Mail size={16} /> Escribenos
            </a>
          </div>
        </div>
      </section>

      {/* ── CONVENIO BADGE ── */}
      <div style={{ background: "#0d1b2a", padding: isMobile ? "0 16px 28px" : "0 28px 40px" }}>
        <div style={{
          maxWidth: 780, margin: "0 auto",
          background: "rgba(0,200,83,0.08)", border: "1px solid rgba(0,200,83,0.2)",
          borderRadius: 14, padding: isMobile ? "14px 16px" : "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: isMobile ? 4 : 12, flexWrap: "wrap", textAlign: "center",
        }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>ITP en convenio con</span>
          <span style={{ color: "#00C853", fontSize: 12, fontWeight: 700 }}>SSAAES</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>NIT 900650018-5</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>· 311 5267054</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>institutodepetroleo01@gmail.com</span>
        </div>
      </div>

      {/* ── OFERTA ACADEMICA ── */}
      <section style={{ padding: isMobile ? "28px 16px 56px" : "40px 28px 80px", maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 48 }}>
          <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>
            Oferta Academica Completa
          </p>
          <h2 style={{ color: "#0d1b2a", fontSize: isMobile ? 22 : 32, fontWeight: 700, letterSpacing: "-1px", margin: 0 }}>
            Todos nuestros programas
          </h2>
          <p style={{ color: "#4a7c6f", fontSize: 13, marginTop: 8 }}>
            Modalidad 100% virtual — Pagos a cuotas — Certificacion avalada
          </p>
        </div>

        {programas.map((p) => (
          <AcordeonSector key={p.sector} {...p} isMobile={isMobile} />
        ))}

        {/* CTA CONTACTO */}
        <div style={{
          background: "#0d1b2a", borderRadius: isMobile ? 20 : 24,
          padding: isMobile ? "32px 20px" : "40px 32px",
          textAlign: "center", marginTop: 20,
        }}>
          <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>
            Contactanos
          </p>
          <h3 style={{ color: "white", fontSize: isMobile ? 20 : 24, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 10 }}>
            Resuelve tus dudas ahora
          </h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
            Escribenos por WhatsApp o correo electronico y un asesor te contactara.
          </p>
          <div style={{
            display: "flex", gap: 10, justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
          }}>
            <a href={WHATSAPP} target="_blank" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#00C853", color: "white",
              padding: "12px 24px", borderRadius: 980,
              fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>
              <MessageCircle size={15} /> 321 8837010 / 311 5267054
            </a>
            <a href={EMAIL} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "rgba(255,255,255,0.08)", color: "white",
              padding: "12px 24px", borderRadius: 980,
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <Mail size={15} /> institutodepetroleo01@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: isMobile ? "20px 16px" : "28px", borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
        <p style={{ color: "#6b9e7e", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", lineHeight: 1.7 }}>
          Instituto Tecnico de Petroleo en convenio con SSAAES NIT 900650018-5 — 2026
        </p>
      </footer>

    </div>
  );
}