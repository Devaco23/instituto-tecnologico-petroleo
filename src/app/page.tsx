"use client";
import Link from "next/link";
import { ChevronDown, ChevronUp, MessageCircle, Mail, Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const WHATSAPP = "https://wa.me/573218837010";
const EMAIL = "mailto:institutodepetroleo01@gmail.com";

// Emil: custom easing curves — built-ins are too weak
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

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
    sector: "Sector Hidrocarburos", color: "#00C853", bg: "#e8f5e9",
    cursos: [
      { nombre: "Perforacion y Produccion de Pozos", desc: "Formacion tecnica en operaciones de perforacion, completamiento y produccion de pozos petroleros con estandares internacionales." },
      { nombre: "Operador de Equipo Pesado", desc: "Capacitacion en manejo y mantenimiento de maquinaria pesada utilizada en operaciones del sector hidrocarburos." },
      { nombre: "Mecanica Diesel", desc: "Tecnicas de diagnostico, mantenimiento y reparacion de motores diesel aplicados al sector energetico." },
    ]
  },
  {
    sector: "Sector Tecnico / Industrial", color: "#00BFA5", bg: "#e0f2f1",
    cursos: [
      { nombre: "Electromecanica", desc: "Integracion de sistemas electricos y mecanicos para el mantenimiento industrial en plantas y equipos del sector." },
      { nombre: "Electricidad Industrial", desc: "Instalacion, operacion y mantenimiento de sistemas electricos en entornos industriales y petroleros." },
      { nombre: "Instrumentacion Industrial", desc: "Calibracion, instalacion y mantenimiento de instrumentos de medicion y control en procesos industriales." },
    ]
  },
  {
    sector: "HSEQ y Ambiente", color: "#00C853", bg: "#e8f5e9",
    cursos: [
      { nombre: "Auxiliar en Seguridad y Salud en el Trabajo (SST)", desc: "Formacion en normatividad HSE, identificacion de riesgos y gestion de seguridad en entornos de alta exigencia." },
      { nombre: "Gestion Ambiental", desc: "Herramientas para la identificacion, evaluacion y control de impactos ambientales en operaciones industriales." },
    ]
  },
  {
    sector: "Certificaciones de Campo (100h)", color: "#00897B", bg: "#e0f2f1",
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
    <div
      // Emil: stagger handled by parent via CSS; accordion card entrance
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.07)",
        overflow: "hidden",
        marginBottom: 10,
        boxShadow: open
          ? "0 8px 32px rgba(0,0,0,0.10)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        // Emil: specify exact properties, use custom curve
        transition: `box-shadow 200ms ${EASE_OUT}`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "16px 18px" : "20px 26px",
          background: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: bg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            // Emil: scale transform on the icon dot for subtle feedback
            transition: `transform 200ms ${EASE_OUT}`,
          }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: color, fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", margin: 0 }}>Programa</p>
            <h3 style={{ color: "#0d1b2a", fontSize: isMobile ? 14 : 16, fontWeight: 700, margin: 0 }}>{sector}</h3>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 980 }}>
            {cursos.length} cursos
          </span>
          {/* Emil: chevron rotates instead of swapping icons — smoother, one element */}
          <div style={{
            transition: `transform 200ms ${EASE_OUT}`,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "flex",
          }}>
            <ChevronDown size={16} color="#94a3b8" />
          </div>
        </div>
      </button>

      {/* Emil: use CSS max-height transition instead of conditional render — allows smooth collapse */}
      <div style={{
        maxHeight: open ? "2000px" : "0px",
        overflow: "hidden",
        // Emil: ease-in-out for on-screen movement (expand/collapse)
        transition: `max-height ${open ? "400ms" : "250ms"} ${EASE_IN_OUT}`,
      }}>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: isMobile ? "14px 16px" : "18px 26px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            {["100% Virtual", "Pago a cuotas", "Matriculas 2026"].map(t => (
              <span key={t} style={{ background: "#f0faf5", color: "#00897B", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 980 }}>{t}</span>
            ))}
          </div>
          {cursos.map((c, i) => (
            <div
              key={c.nombre}
              // Emil: stagger entrance — each curso appears with a small delay
              style={{
                background: "#f8fffe",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(6px)",
                transition: `opacity 250ms ${EASE_OUT} ${i * 40}ms, transform 250ms ${EASE_OUT} ${i * 40}ms`,
              }}
            >
              <button
                onClick={() => setOpenCurso(openCurso === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "13px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  gap: 10,
                }}
              >
                <span style={{ color: "#0d1b2a", fontSize: 13, fontWeight: 600, textAlign: "left" }}>{c.nombre}</span>
                <div style={{
                  flexShrink: 0,
                  transition: `transform 180ms ${EASE_OUT}`,
                  transform: openCurso === i ? "rotate(180deg)" : "rotate(0deg)",
                  display: "flex",
                }}>
                  <ChevronDown size={14} color="#94a3b8" />
                </div>
              </button>

              <div style={{
                maxHeight: openCurso === i ? "400px" : "0px",
                overflow: "hidden",
                transition: `max-height ${openCurso === i ? "300ms" : "200ms"} ${EASE_IN_OUT}`,
              }}>
                <div style={{ padding: "0 16px 16px" }}>
                  <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{c.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      className="btn-primary"
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        gap: 7, background: color, color: "white", padding: "10px 20px",
                        borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none",
                      }}
                    >
                      <MessageCircle size={14} /> Inscribirme ahora
                    </a>
                    <a
                      href={EMAIL}
                      className="btn-secondary"
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        gap: 7, background: bg, color: color, padding: "10px 20px",
                        borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none",
                      }}
                    >
                      <Mail size={14} /> Mas informacion
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f0faf5", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(13,27,42,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,200,83,0.15)" : "none",
        padding: isMobile ? "14px 20px" : "16px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        // Emil: specify exact properties, custom ease-out
        transition: `background 200ms ${EASE_OUT}, border-bottom 200ms ${EASE_OUT}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="ITP" style={{ height: isMobile ? 38 : 48, width: "auto", objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }} />
          <div>
            <span style={{ color: "white", fontWeight: 800, fontSize: isMobile ? 16 : 20, letterSpacing: "-0.5px" }}>ITP</span>
            {!isMobile && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>Instituto Tecnico de Petroleo</p>}
          </div>
        </div>

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {[["Inicio", "#inicio"], ["Programas", "#programas"], ["Contacto", "#contacto"]].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="nav-link"
                style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/login"
            className="btn-cta"
            style={{
              background: "#00C853", color: "white",
              padding: isMobile ? "8px 16px" : "10px 22px",
              borderRadius: 980, fontSize: isMobile ? 13 : 14,
              fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 14px rgba(0,200,83,0.35)",
            }}
          >
            Aula Virtual
          </Link>
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "rgba(255,255,255,0.1)", border: "none",
                borderRadius: 10, padding: "8px", cursor: "pointer", color: "white",
              }}
            >
              {/* Emil: rotate icon instead of swap — single element, smoother */}
              <div style={{
                transition: `transform 200ms ${EASE_OUT}`,
                transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                display: "flex",
              }}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            </button>
          )}
        </div>
      </nav>

      {/* MENÚ MÓVIL — Emil: slide + fade in from top, ease-out */}
      <div style={{
        position: "fixed", top: 70, left: 0, right: 0, zIndex: 99,
        background: "rgba(13,27,42,0.97)", backdropFilter: "blur(12px)",
        padding: menuOpen ? "20px 24px 28px" : "0 24px",
        display: "flex", flexDirection: "column", gap: 4,
        borderBottom: menuOpen ? "1px solid rgba(0,200,83,0.15)" : "none",
        maxHeight: menuOpen ? "400px" : "0px",
        overflow: "hidden",
        // Emil: ease-in-out for on-screen movement; asymmetric timing
        transition: `max-height ${menuOpen ? "300ms" : "220ms"} ${EASE_IN_OUT}, padding ${menuOpen ? "300ms" : "220ms"} ${EASE_IN_OUT}`,
        pointerEvents: menuOpen ? "auto" : "none",
      }}>
        {[["Inicio", "#inicio"], ["Programas", "#programas"], ["Contacto", "#contacto"]].map(([label, href], i) => (
          <a
            key={label}
            href={href}
            onClick={() => setMenuOpen(false)}
            style={{
              color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 600,
              textDecoration: "none", padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              // Emil: stagger entrance per item
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(-6px)",
              transition: `opacity 200ms ${EASE_OUT} ${i * 50}ms, transform 200ms ${EASE_OUT} ${i * 50}ms`,
            }}
          >
            {label}
          </a>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <a href={WHATSAPP} target="_blank" className="btn-primary"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#00C853", color: "white", padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            <MessageCircle size={15} /> WhatsApp
          </a>
          <a href={EMAIL} className="btn-glass"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "rgba(255,255,255,0.08)", color: "white", padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Mail size={15} /> Email
          </a>
        </div>
      </div>

      {/* HERO — imagen renombrada a "fondo" */}
      <section id="inicio" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", padding: isMobile ? "100px 24px 60px" : "0 48px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/fondo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,27,42,0.6) 0%, rgba(13,27,42,0.5) 50%, rgba(13,27,42,0.82) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 860 }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: isMobile ? 13 : 15, fontWeight: 500, letterSpacing: "0.5px", marginBottom: 16 }}>
            Instituto Tecnico de Petroleo · En convenio con SSAAES
          </p>
          <h1 style={{ color: "white", fontSize: isMobile ? "36px" : "clamp(56px,7vw,88px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: isMobile ? "-1px" : "-3px", marginBottom: isMobile ? 18 : 24, textShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
            Formacion Tecnica{" "}
            <span style={{ color: "#00C853" }}>para el Sector Energetico</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: isMobile ? 15 : 18, maxWidth: 520, margin: isMobile ? "0 auto 32px" : "0 auto 40px", lineHeight: 1.65 }}>
            Estudia a tu ritmo con modalidad 100% virtual. Certificacion con los mejores estandares del sector petrolero e industrial.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexDirection: isMobile ? "column" : "row", padding: isMobile ? "0 12px" : 0 }}>
            <a
              href={WHATSAPP}
              target="_blank"
              className="btn-primary"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 9, background: "#00C853", color: "white",
                padding: isMobile ? "14px 24px" : "15px 34px",
                borderRadius: 980, fontSize: isMobile ? 14 : 16, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 6px 24px rgba(0,200,83,0.45)",
                width: isMobile ? "100%" : "auto", boxSizing: "border-box" as const,
              }}
            >
              <MessageCircle size={18} /> Inscribirme ahora
            </a>
            <a
              href="#programas"
              className="btn-ghost"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 9, background: "rgba(255,255,255,0.12)", color: "white",
                padding: isMobile ? "14px 24px" : "15px 34px",
                borderRadius: 980, fontSize: isMobile ? 14 : 16, fontWeight: 700,
                textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
                width: isMobile ? "100%" : "auto", boxSizing: "border-box" as const,
              }}
            >
              Ver Programas
            </a>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", gap: 56, justifyContent: "center", marginTop: 64 }}>
              {[{ valor: "100%", label: "Virtual" }, { valor: "15+", label: "Programas" }, { valor: "2026", label: "Matriculas abiertas" }].map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    textAlign: "center",
                    // Emil: stagger stat entrance
                    animation: `statFadeIn 400ms ${EASE_OUT} ${300 + i * 80}ms both`,
                  }}
                >
                  <p style={{ color: "#00C853", fontSize: 36, fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>{s.valor}</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Emil: bounce arrow — real bounce cubic-bezier, not generic */}
        <a
          href="#programas"
          style={{
            position: "absolute", bottom: isMobile ? 28 : 36,
            left: "50%", transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.4)",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 4, textDecoration: "none", fontSize: 10, fontWeight: 600,
            letterSpacing: "1px", textTransform: "uppercase",
            animation: "scrollBounce 2s cubic-bezier(0.45, 0, 0.55, 1) infinite",
          }}
        >
          <ChevronDown size={26} />
        </a>
      </section>

      {/* CONVENIO STRIP */}
      <div style={{ background: "#0d1b2a", padding: isMobile ? "16px 20px" : "18px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 8 : 20, flexWrap: "wrap", textAlign: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px" }}>En convenio con</span>
          <span style={{ color: "#00C853", fontSize: 13, fontWeight: 800 }}>SSAAES</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>NIT 900650018-5</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <a href="tel:3115267054" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}><Phone size={11} /> 311 5267054</a>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <a href={EMAIL} style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none" }}>institutodepetroleo01@gmail.com</a>
        </div>
      </div>

      {/* PROGRAMAS */}
      <section id="programas" style={{ padding: isMobile ? "48px 16px 64px" : "80px 48px 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 56 }}>
          <span style={{ display: "inline-block", background: "#e8f5e9", color: "#00C853", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "6px 16px", borderRadius: 980, marginBottom: 14 }}>Oferta Academica 2026</span>
          <h2 style={{ color: "#0d1b2a", fontSize: isMobile ? 26 : 38, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px" }}>Todos nuestros programas</h2>
          <p style={{ color: "#64748b", fontSize: 15, margin: 0 }}>Modalidad 100% virtual · Pagos a cuotas · Certificacion avalada</p>
        </div>
        {/* Emil: stagger sector cards appearance */}
        {programas.map((p, i) => (
          <div
            key={p.sector}
            style={{
              animation: `sectorFadeIn 350ms ${EASE_OUT} ${i * 60}ms both`,
            }}
          >
            <AcordeonSector {...p} isMobile={isMobile} />
          </div>
        ))}
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: isMobile ? "0 16px 64px" : "0 48px 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0d1b2a 0%, #0a2a1a 100%)", borderRadius: isMobile ? 20 : 28, padding: isMobile ? "36px 24px" : "56px 60px", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(0,200,83,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,191,165,0.06)", pointerEvents: "none" }} />
          <span style={{ display: "inline-block", background: "rgba(0,200,83,0.12)", color: "#00C853", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "6px 16px", borderRadius: 980, marginBottom: 16, border: "1px solid rgba(0,200,83,0.2)" }}>Contactanos</span>
          <h3 style={{ color: "white", fontSize: isMobile ? 22 : 32, fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 12px" }}>Resuelve tus dudas ahora</h3>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>Un asesor te contactara y te guiara en el proceso de inscripcion.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexDirection: isMobile ? "column" : "row" }}>
            <a
              href={WHATSAPP}
              target="_blank"
              className="btn-primary"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 8, background: "#00C853", color: "white",
                padding: isMobile ? "14px 24px" : "13px 28px",
                borderRadius: 980, fontSize: 14, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 6px 20px rgba(0,200,83,0.35)",
              }}
            >
              <MessageCircle size={16} /> 321 8837010 / 311 5267054
            </a>
            <a
              href={EMAIL}
              className="btn-glass"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 8, background: "rgba(255,255,255,0.08)", color: "white",
                padding: isMobile ? "14px 24px" : "13px 28px",
                borderRadius: 980, fontSize: 14, fontWeight: 700, textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Mail size={16} /> institutodepetroleo01@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d1b2a", padding: isMobile ? "24px 20px" : "28px 48px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="ITP" style={{ height: 32, width: "auto", objectFit: "contain" }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Instituto Tecnico de Petroleo · SSAAES NIT 900650018-5</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>© 2026</p>
      </footer>

      <style>{`
        /* Emil: all transitions specify exact properties + custom curves */

        /* Scroll bounce — real ease-in-out, not generic */
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(10px); }
        }

        /* Hero stats stagger entrance */
        @keyframes statFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Sector cards stagger entrance */
        @keyframes sectorFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Emil: nav links — specify color only, fast */
        .nav-link {
          transition: color 150ms ease-out;
        }
        .nav-link:hover {
          color: #00C853 !important;
        }

        /* Emil: buttons — scale on :active for instant feedback; hover gated behind media query */
        .btn-primary, .btn-secondary, .btn-ghost, .btn-glass, .btn-cta {
          transition: opacity 150ms ease-out, transform 120ms ease-out, box-shadow 150ms ease-out;
        }

        /* Emil: hover only on true pointer devices — touch triggers false positives */
        @media (hover: hover) and (pointer: fine) {
          .btn-primary:hover  { opacity: 0.9; transform: translateY(-1px); }
          .btn-secondary:hover { opacity: 0.88; }
          .btn-ghost:hover    { background: rgba(255,255,255,0.18) !important; }
          .btn-glass:hover    { background: rgba(255,255,255,0.14) !important; }
          .btn-cta:hover      { opacity: 0.9; transform: translateY(-1px); }
        }

        /* Emil: :active scale for press feedback on every button */
        .btn-primary:active, .btn-cta:active { transform: scale(0.97); }
        .btn-secondary:active, .btn-ghost:active, .btn-glass:active { transform: scale(0.97); }

        /* Emil: respect reduced-motion — keep opacity, remove movement */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}