"use client";
import Link from "next/link";
import { ChevronDown, ChevronUp, MessageCircle, Mail, Phone, Menu, X, CheckCircle, CreditCard, Clock, BookOpen, Wrench, Award, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const WHATSAPP = "https://wa.me/573218837010";
const EMAIL    = "mailto:institutodepetroleo01@gmail.com";

const C = {
  green:     "#00C853",
  greenMid:  "#00BFA5",
  greenDark: "#00897B",
  greenBg:   "#e8f5e9",
  tealBg:    "#e0f2f1",
  navy:      "#0d1b2a",
  pageBg:    "#f0faf5",
  muted:     "#6b9e7e",
  mutedDark: "#4a7c6f",
  danger:    "#ff5252",
};

function useWindowSize() {
  const [width, setWidth]   = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true); setWidth(window.innerWidth);
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { width, mounted };
}

// ════════════════════════════════════════════════════════
// DATOS
// ════════════════════════════════════════════════════════

const tecnicosLaborales = [
  {
    sector: "Sector Hidrocarburos", color: C.green, bg: C.greenBg,
    cursos: [
      { nombre: "Perforación y Producción de Pozos de Gas y Petróleo", desc: "Formación técnica en operaciones de perforación, completamiento y producción de pozos petroleros con estándares internacionales." },
      { nombre: "Operador de Equipo Pesado", desc: "Capacitación en manejo y mantenimiento de maquinaria pesada utilizada en operaciones del sector hidrocarburos." },
      { nombre: "Mecánica Diésel", desc: "Técnicas de diagnóstico, mantenimiento y reparación de motores diesel aplicados al sector energético." },
      { nombre: "Técnico Laboral en Tubero Para la Industria Petrolera", desc: "Formación en instalación, inspección y mantenimiento de sistemas de tuberías en operaciones del sector petrolero." },
      { nombre: "Técnico Laboral en Soldadura Para la Industria Petrolera", desc: "Capacitación en técnicas de soldadura industrial aplicadas a estructuras metálicas y tuberías del sector de hidrocarburos." },
    ],
  },
  {
    sector: "Sector Técnico / Industrial", color: C.greenMid, bg: C.tealBg,
    cursos: [
      { nombre: "Electromecánica", desc: "Integración de sistemas eléctricos y mecánicos para el mantenimiento industrial en plantas y equipos del sector." },
      { nombre: "Electricidad Industrial", desc: "Instalación, operación y mantenimiento de sistemas eléctricos en entornos industriales y petroleros." },
      { nombre: "Instrumentación Industrial", desc: "Calibración, instalación y mantenimiento de instrumentos de medición y control en procesos industriales." },
      { nombre: "Auxiliar de Electricidad", desc: "Apoyo técnico en la instalación, reparación y mantenimiento de sistemas eléctricos en ambientes residenciales e industriales." },
      { nombre: "Electricista Industrial de Montaje y Mantenimiento", desc: "Montaje y mantenimiento de instalaciones eléctricas industriales de alta y baja tensión con normas de seguridad." },
      { nombre: "Instalador de Redes y Equipos a Gas", desc: "Instalación, revisión y certificación de redes de gas domiciliario e industrial bajo normativas técnicas vigentes." },
      { nombre: "Auxiliar de Construcción de Edificaciones", desc: "Apoyo en procesos constructivos de edificaciones, manejo de materiales, herramientas y normas de seguridad en obra." },
    ],
  },
  {
    sector: "Sector Logística, Puertos y Servicios", color: C.greenDark, bg: C.tealBg,
    cursos: [
      { nombre: "Agente de Tránsito y Seguridad Vial", desc: "Formación en normativa de tránsito, control vial, primeros auxilios y gestión de la seguridad en movilidad urbana." },
      { nombre: "Auxiliar Administrativo", desc: "Gestión documental, atención al cliente, manejo de herramientas ofimáticas y soporte en procesos administrativos empresariales." },
      { nombre: "Auxiliar Contable y Financiero", desc: "Registro de operaciones contables, manejo de libros, conciliaciones bancarias y apoyo en informes financieros básicos." },
      { nombre: "Auxiliar de Operaciones y Servicios Portuarios", desc: "Apoyo logístico en operaciones de carga, descarga y almacenamiento en terminales portuarias." },
      { nombre: "Auxiliar de Procesos y Servicios Logísticos", desc: "Gestión de cadena de suministro, control de inventarios y coordinación de procesos logísticos en empresas." },
      { nombre: "Asistente de Servicio al Cliente", desc: "Técnicas de comunicación efectiva, manejo de quejas, fidelización de clientes y estándares de calidad en servicio." },
      { nombre: "Auxiliar de Hotelería y Operaciones Turísticas", desc: "Operaciones de hospedaje, atención al huésped, gestión de reservas y servicios de alimentación en establecimientos turísticos." },
    ],
  },
  {
    sector: "Sector Salud, SST y Comunidad", color: C.green, bg: C.greenBg,
    cursos: [
      { nombre: "Auxiliar en Seguridad y Salud en el Trabajo (SST)", desc: "Formación en normatividad HSE, identificación de riesgos y gestión de seguridad en entornos de alta exigencia." },
      { nombre: "Gestión Ambiental", desc: "Herramientas para la identificación, evaluación y control de impactos ambientales en operaciones industriales." },
      { nombre: "Atención Integral a la Primera Infancia", desc: "Cuidado, estimulación y desarrollo integral de niños en primera infancia bajo enfoques pedagógicos y de bienestar." },
      { nombre: "Auxiliar Administrativo en Salud", desc: "Apoyo en procesos de admisión, facturación, historia clínica y gestión documental en entidades del sector salud." },
      { nombre: "Auxiliar de Juzgados y Tribunales", desc: "Gestión de expedientes judiciales, notificaciones, diligencias y apoyo en procesos jurídicos administrativos." },
      { nombre: "Auxiliar de Seguridad Integral y Prevención del Riesgo", desc: "Vigilancia, control de acceso, planes de emergencia y manejo de sistemas de seguridad física." },
      { nombre: "Auxiliar Social y Comunitario", desc: "Apoyo a comunidades vulnerables, gestión de proyectos sociales y trabajo con organizaciones de base." },
    ],
  },
];

const programasAcademicos = [
  { nombre: "Auxiliar en Derechos Humanos", desc: "Capacita en marco jurídico nacional e internacional de DDHH, mediación de conflictos comunitarios, promoción de dignidad humana y apoyo a veedurías sociales." },
  { nombre: "Auxiliar en Entrenamiento Deportivo", desc: "Formación metodológica en actividad física y deporte: anatomía aplicada, primeros auxilios deportivos, pedagogía del entrenamiento y eventos recreativos." },
  { nombre: "Auxiliar en Investigación Judicial y Criminalística", desc: "Cadena de custodia, recolección de elementos probatorios, dactiloscopia, fotografía forense y preservación del lugar de los hechos." },
  { nombre: "Auxiliar en Saneamiento y Salud Ambiental", desc: "Inspección y control de factores ambientales: calidad del agua, muestreo de alimentos, control de plagas y manejo de residuos sólidos." },
  { nombre: "Gestión Documental y Administración de Archivos", desc: "Archivística moderna, Ley General de Archivos, planeación, producción, organización y digitalización de documentos físicos y electrónicos." },
  { nombre: "Maquinaria Pesada", desc: "Operación y seguridad de excavadoras, retroexcavadoras y motoniveladoras. Inspecciones pre-operacionales, fallas en sistemas hidráulicos y normativas de seguridad industrial." },
  { nombre: "Marketing Digital y Redes Sociales", desc: "Estrategias de contenido, SEO/SEM, email marketing, pauta digital, community management y análisis de métricas para posicionamiento de marcas." },
  { nombre: "Mecánica de Motos", desc: "Diagnóstico y reparación de motores 2 y 4 tiempos, sistemas de transmisión, suspensión, frenos e inyección electrónica de combustible." },
  { nombre: "Mercadeo y Ventas", desc: "Prospección de clientes, psicología del consumidor, negociación efectiva, servicio postventa y gestión CRM para líderes comerciales." },
  { nombre: "Montacargas", desc: "Operación logística segura de montacargas: capacidades de carga, estabilidad, normas OSHA, técnicas de estiba y mantenimiento preventivo." },
  { nombre: "Pedagogía", desc: "Diseño curricular, teorías del aprendizaje, estrategias didácticas, evaluación del conocimiento y manejo de aula para instructores y docentes." },
  { nombre: "Redes y Sistemas de Computación", desc: "Ensamble de computadores, sistemas operativos, redes LAN, direccionamiento IP, seguridad informática básica y configuración de enrutadores." },
  { nombre: "Secretariado Ejecutivo", desc: "Redacción mercantil, protocolo empresarial, gestión de agendas directivas, atención al cliente y herramientas ofimáticas avanzadas." },
  { nombre: "Teología Ministerial Bíblica", desc: "Hermenéutica y exégesis bíblica, historia de la iglesia, consejería pastoral, ética cristiana y liderazgo eclesiástico." },
];

const validacionEspecialidades = [
  "Perforación y/o Producción de Pozos de Gas y Petróleo",
  "Instrumentación Industrial",
  "Electromecánica",
  "Electricidad Industrial",
  "Mecánica Diésel",
  "Auxiliar en Seguridad y Salud en el Trabajo (SST)",
];

const iadcCursos = [
  { nombre: "Well Control Workover", desc: "Certificación internacional en control de pozos para operaciones de workover. Cubre procedimientos de barrera, manejo de kicks y uso de equipo de control en superficie." },
  { nombre: "Well Control Drilling", desc: "Estándar IADC para personal de perforación. Abarca principios de presión de formación, detección temprana de influjos y procedimientos de cierre de pozo." },
  { nombre: "Workover – Drilling", desc: "Programa combinado que integra competencias de control de pozo en operaciones de perforación y workover bajo los estándares Well Sharp del IADC." },
  { nombre: "IWCF Surface / Subsea", desc: "Certificación IWCF reconocida globalmente para control de pozos en superficie y subsea. Valida competencias técnicas esenciales para operaciones offshore y onshore." },
  { nombre: "Stuck Pipe Prevention", desc: "Curso especializado en identificación de causas, prevención y liberación de tubería atrapada. Incluye técnicas de jarring, back-off y análisis de parámetros de perforación." },
  { nombre: "Rig Pass", desc: "Inducción de seguridad para acceso a instalaciones petroleras. Cubre identificación de riesgos en taladro, uso de EPP, permisos de trabajo y procedimientos de emergencia." },
  { nombre: "Rig Management", desc: "Formación en gestión integral de taladros: planificación operativa, administración de recursos humanos, contratos de perforación y cumplimiento normativo HSE." },
  { nombre: "Rig Inspection", desc: "Metodología de inspección técnica de equipos de perforación. Evaluación de integridad estructural, sistemas de izaje, BOP, sistemas de circulación y documentación reglamentaria." },
];

// ════════════════════════════════════════════════════════
// COMPONENTE: Acordeón sector (Técnicos Laborales)
// ════════════════════════════════════════════════════════
function AcordeonSector({ sector, color, bg, cursos, isMobile }: typeof tecnicosLaborales[0] & { isMobile: boolean }) {
  const [open, setOpen] = useState(false);
  const [openCurso, setOpenCurso] = useState<number | null>(null);
  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 18px" : "20px 26px", background: "white", border: "none", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: color, fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", margin: 0 }}>Programa</p>
            <h3 style={{ color: C.navy, fontSize: isMobile ? 14 : 16, fontWeight: 700, margin: 0 }}>{sector}</h3>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 980 }}>{cursos.length} cursos</span>
          {open ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
        </div>
      </button>
      {open && (
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: isMobile ? "14px 16px" : "18px 26px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            {["100% Virtual", "Lun–Jue 7–9 pm", "Pago a cuotas", "Matrículas 2026"].map(t => (
              <span key={t} style={{ background: C.pageBg, color: C.greenDark, fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 980 }}>{t}</span>
            ))}
          </div>
          {cursos.map((c, i) => (
            <div key={c.nombre} style={{ background: "#f8fffe", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)" }}>
              <button onClick={() => setOpenCurso(openCurso === i ? null : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "transparent", border: "none", cursor: "pointer", gap: 10 }}>
                <span style={{ color: C.navy, fontSize: 13, fontWeight: 600, textAlign: "left" }}>{c.nombre}</span>
                <span style={{ flexShrink: 0 }}>{openCurso === i ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}</span>
              </button>
              {openCurso === i && (
                <div style={{ padding: "0 16px 16px" }}>
                  <p style={{ color: C.mutedDark, fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{c.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
                    <a href={WHATSAPP} target="_blank" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: color, color: "white", padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      <MessageCircle size={14} /> Inscribirme
                    </a>
                    <a href={EMAIL} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: bg, color: color, padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      <Mail size={14} /> Más info
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



// ════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════
export default function HomePage() {
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [seccion, setSeccion]     = useState<"tecnicos" | "academicos" | "validacion" | "iadc">("tecnicos");
  const [openAcad, setOpenAcad]   = useState<number | null>(null);
  const [openValid, setOpenValid] = useState(false);
  const [openValidBanco, setOpenValidBanco] = useState(false);
  const [openCostos, setOpenCostos] = useState(false);
  const [openIADC, setOpenIADC]   = useState<number | null>(null);
  const [openTecReq, setOpenTecReq] = useState(false);
  const [openTecBanco, setOpenTecBanco] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(13,27,42,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,200,83,0.15)" : "none", padding: isMobile ? "14px 20px" : "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="ITP" style={{ height: isMobile ? 38 : 48, width: "auto", objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }} />
          <div>
            <span style={{ color: "white", fontWeight: 800, fontSize: isMobile ? 16 : 20, letterSpacing: "-0.5px" }}>ITP</span>
            {!isMobile && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>Instituto Tecnico de Petroleo</p>}
          </div>
        </div>
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {[["Inicio","#inicio"],["Programas","#programas"],["Contacto","#contacto"]].map(([l,h]) => (
              <a key={l} href={h} style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.green)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}>{l}</a>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" style={{ background: C.green, color: "white", padding: isMobile ? "8px 16px" : "10px 22px", borderRadius: 980, fontSize: isMobile ? 13 : 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(0,200,83,0.35)" }}>Aula Virtual</Link>
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", color: "white" }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Menú móvil */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 70, left: 0, right: 0, zIndex: 99, background: "rgba(13,27,42,0.97)", backdropFilter: "blur(12px)", padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: 4, borderBottom: "1px solid rgba(0,200,83,0.15)" }}>
          {[["Inicio","#inicio"],["Programas","#programas"],["Contacto","#contacto"]].map(([l,h]) => (
            <a key={l} href={h} onClick={() => setMenuOpen(false)} style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 600, textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{l}</a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <a href={WHATSAPP} target="_blank" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.green, color: "white", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><MessageCircle size={15} /> WhatsApp</a>
            <a href={EMAIL} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "rgba(255,255,255,0.08)", color: "white", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}><Mail size={15} /> Email</a>
          </div>
        </div>
      )}

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section id="inicio" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", padding: isMobile ? "100px 24px 60px" : "0 48px" }}>
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
            <a href={WHATSAPP} target="_blank" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: isMobile ? "14px 24px" : "15px 34px", borderRadius: 980, fontSize: isMobile ? 14 : 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 24px rgba(0,200,83,0.45)", width: isMobile ? "100%" : "auto", boxSizing: "border-box" as const }}>
              <MessageCircle size={18} /> Inscribirme ahora
            </a>
            <a href="#programas" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "rgba(255,255,255,0.12)", color: "white", padding: isMobile ? "14px 24px" : "15px 34px", borderRadius: 980, fontSize: isMobile ? 14 : 16, fontWeight: 700, textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", width: isMobile ? "100%" : "auto", boxSizing: "border-box" as const }}>
              Ver Programas
            </a>
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
        <a href="#programas" style={{ position: "absolute", bottom: isMobile ? 28 : 36, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none", animation: "bounce 2s infinite" }}>
          <ChevronDown size={26} />
        </a>
      </section>

      {/* ══ CONVENIO STRIP ══════════════════════════════════════════════════ */}
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

      {/* ══ PROGRAMAS ═══════════════════════════════════════════════════════ */}
      <section id="programas" style={{ padding: isMobile ? "40px 16px 64px" : "60px 48px 80px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 44 }}>
          <span style={{ display: "inline-block", background: C.greenBg, color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "6px 16px", borderRadius: 980, marginBottom: 12 }}>Oferta Académica 2026</span>
          <h2 style={{ color: C.navy, fontSize: isMobile ? 24 : 34, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 10px" }}>Todos nuestros programas</h2>
          <p style={{ color: C.mutedDark, fontSize: 14, margin: 0 }}>Selecciona la modalidad que se adapta a tu perfil</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "white", padding: 6, borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", flexWrap: isMobile ? "wrap" : "nowrap" }}>
          {[
            { key: "tecnicos",   label: isMobile ? "Técnicos" : "Técnicos Laborales",   icon: <Wrench size={13} /> },
            { key: "academicos", label: isMobile ? "Académicos" : "Programas Académicos", icon: <BookOpen size={13} /> },
            { key: "validacion", label: isMobile ? "Validación" : "Validación de Comp.", icon: <Award size={13} /> },
            { key: "iadc",       label: isMobile ? "IADC" : "Certificaciones IADC",      icon: <Globe size={13} /> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setSeccion(tab.key as any)}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: isMobile ? "9px 8px" : "12px 14px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: isMobile ? 11 : 13, fontWeight: 700, background: seccion === tab.key ? (tab.key === "iadc" ? C.greenMid : C.green) : "transparent", color: seccion === tab.key ? "white" : C.muted, transition: "all 0.18s ease", whiteSpace: "nowrap" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Técnicos Laborales */}
        {seccion === "tecnicos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* 1. Inversión */}
            <div style={{ background: "white", borderRadius: 18, padding: "24px 22px", border: "1px solid rgba(0,0,0,0.07)" }}>
              <p style={{ color: C.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Inversión</p>
              <p style={{ color: C.navy, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Modalidad de pago flexible · Clases Lun–Jue 7–9 pm vía Google Meet</p>
              <p style={{ color: C.mutedDark, fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}>
                Programas técnicos laborales con certificación avalada por SSAAES. Disponibles en modalidad 100% virtual con clases en tiempo real.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 10 }}>
                {[
                  { titulo: "Matrícula", valor: "$150.000", sub: "Pago único de ingreso", color: C.green, bg: C.greenBg },
                  { titulo: "Cuotas mensuales", valor: "$400.000", sub: "Durante 12 meses", color: C.greenMid, bg: C.tealBg },
                  { titulo: "Pago de contado", valor: "$4.800.000", sub: "Inversión total del programa", color: C.greenDark, bg: C.tealBg },
                ].map(c => (
                  <div key={c.titulo} style={{ background: c.bg, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                    <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", margin: "0 0 4px" }}>{c.titulo}</p>
                    <p style={{ color: c.color, fontSize: 20, fontWeight: 900, margin: "0 0 2px" }}>{c.valor}</p>
                    <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>{c.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Programas Disponibles (acordeón con sub-acordeones de sector) */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <button onClick={() => setOpenTecReq(!openTecReq)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "white", border: "none", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Wrench size={20} color={C.green} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: C.green, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Oferta</p>
                    <p style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: 0 }}>Programas Disponibles ({tecnicosLaborales.reduce((a, s) => a + s.cursos.length, 0)} cursos)</p>
                  </div>
                </div>
                {openTecReq ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </button>
              {openTecReq && (
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                    {["100% Virtual", "Lun–Jue 7–9 pm", "Pago a cuotas", "Matrículas 2026"].map(t => (
                      <span key={t} style={{ background: C.pageBg, color: C.greenDark, fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 980 }}>{t}</span>
                    ))}
                  </div>
                  {tecnicosLaborales.map(sector => (
                    <AcordeonSector key={sector.sector} {...sector} isMobile={isMobile} />
                  ))}
                </div>
              )}
            </div>

            {/* 3. Requisitos de Inscripción */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <button onClick={() => setOpenCostos(!openCostos)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "white", border: "none", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle size={20} color={C.greenMid} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: C.greenMid, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Documentos</p>
                    <p style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: 0 }}>Requisitos de Inscripción</p>
                  </div>
                </div>
                {openCostos ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </button>
              {openCostos && (
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "16px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Haber cursado y aprobado noveno (9°) grado de educación básica.",
                    "Fotocopia legible del documento de identidad.",
                    "Tener 16 años de edad cumplidos.",
                    "Acta de Bachiller o certificado de noveno grado original.",
                    "Fotocopia del soporte de afiliación a EPS activa.",
                    "Diligenciar completamente el Formulario de Inscripción institucional.",
                  ].map((req, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ color: C.green, fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                      </div>
                      <p style={{ color: C.navy, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{req}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Cuentas Bancarias */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <button onClick={() => setOpenTecBanco(!openTecBanco)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "white", border: "none", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CreditCard size={20} color={C.greenDark} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: C.greenDark, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Pagos</p>
                    <p style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: 0 }}>Cuentas Bancarias y Medios de Pago</p>
                  </div>
                </div>
                {openTecBanco ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </button>
              {openTecBanco && (
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "16px 22px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 10 }}>
                    {[
                      { banco: "Bancolombia", tipo: "Ahorros", cuenta: "496-529273-85" },
                      { banco: "Davivienda",  tipo: "Ahorros", cuenta: "146200092048" },
                      { banco: "Nequi",       tipo: "Institucional", cuenta: "3218837010" },
                    ].map(b => (
                      <div key={b.banco} style={{ background: C.pageBg, borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(0,0,0,0.05)" }}>
                        <p style={{ color: C.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", margin: "0 0 4px" }}>{b.banco}</p>
                        <p style={{ color: C.muted, fontSize: 11, margin: "0 0 2px" }}>{b.tipo}</p>
                        <p style={{ color: C.navy, fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: "0.5px" }}>{b.cuenta}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ color: C.muted, fontSize: 12, marginTop: 12, lineHeight: 1.5 }}>
                    Enviar comprobante al WhatsApp <strong style={{ color: C.navy }}>321 8837010</strong> o al correo <strong style={{ color: C.navy }}>institutodepetroleo01@gmail.com</strong>
                  </p>
                </div>
              )}
            </div>

            <a href={WHATSAPP} target="_blank" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
              <MessageCircle size={18} /> Inscribirme ahora
            </a>
          </div>
        )}

        {/* TAB: Programas Académicos */}
        {seccion === "academicos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: C.tealBg, borderRadius: 14, padding: "14px 18px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <BookOpen size={16} color={C.greenDark} />
              <p style={{ color: C.greenDark, fontSize: 13, fontWeight: 600, margin: 0 }}>Estos programas se presentan de forma exclusiva por su perfil de estudio. Consulta requisitos y disponibilidad directamente con nuestro equipo.</p>
            </div>
            {programasAcademicos.map((p, i) => (
              <div key={p.nombre} style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
                <button onClick={() => setOpenAcad(openAcad === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "transparent", border: "none", cursor: "pointer", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: C.green, fontSize: 12, fontWeight: 800 }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <span style={{ color: C.navy, fontSize: 13, fontWeight: 600, textAlign: "left" }}>{p.nombre}</span>
                  </div>
                  <span style={{ flexShrink: 0 }}>{openAcad === i ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}</span>
                </button>
                {openAcad === i && (
                  <div style={{ padding: "0 18px 16px" }}>
                    <p style={{ color: C.mutedDark, fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
                      <a href={WHATSAPP} target="_blank" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.green, color: "white", padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><MessageCircle size={14} /> Consultar</a>
                      <a href={EMAIL} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.greenBg, color: C.green, padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><Mail size={14} /> Más info</a>
                    </div>
                    
                  </div>
                )}
              </div>
              
            ))}
             <a href={WHATSAPP} target="_blank" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
              <MessageCircle size={18} /> Consulta por nuestros programas
            </a>
          </div>
        )}

        {/* TAB: Validación de Competencias */}
        {seccion === "validacion" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Info general */}
            <div style={{ background: "white", borderRadius: 18, padding: "24px 22px", border: "1px solid rgba(0,0,0,0.07)" }}>
              <p style={{ color: C.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>¿Qué es?</p>
              <p style={{ color: C.navy, fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>Modalidad especial para personas con experiencia laboral comprobable</p>
              <p style={{ color: C.mutedDark, fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}>
                Dirigida a profesionales con experiencia práctica en el sector que requieren acreditar su idoneidad mediante una titulación formal, sin necesidad de cursar el programa completo.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 10 }}>
                {[
                  { titulo: "Inversión total", valor: "$3.200.000", sub: "Incluye diploma y acta de grado", color: C.green, bg: C.greenBg },
                  { titulo: "Primer pago (50%)", valor: "$1.600.000", sub: "Al radicar documentos", color: C.greenMid, bg: C.tealBg },
                  { titulo: "Tiempo de entrega", valor: "1 mes", sub: "Cumplidos los requisitos", color: C.greenDark, bg: C.tealBg },
                ].map(c => (
                  <div key={c.titulo} style={{ background: c.bg, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                    <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", margin: "0 0 4px" }}>{c.titulo}</p>
                    <p style={{ color: c.color, fontSize: 20, fontWeight: 900, margin: "0 0 2px" }}>{c.valor}</p>
                    <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>{c.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Especialidades */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <button onClick={() => setOpenValid(!openValid)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "white", border: "none", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Award size={20} color={C.green} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: C.green, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Habilitadas</p>
                    <p style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: 0 }}>Especialidades para Validación ({validacionEspecialidades.length})</p>
                  </div>
                </div>
                {openValid ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </button>
              {openValid && (
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "16px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {validacionEspecialidades.map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: C.pageBg, borderRadius: 10, padding: "12px 16px" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, flexShrink: 0 }} />
                      <span style={{ color: C.navy, fontSize: 13, fontWeight: 600 }}>{e}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Requisitos validación */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <button onClick={() => setOpenCostos(!openCostos)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "white", border: "none", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle size={20} color={C.greenMid} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: C.greenMid, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Documentos</p>
                    <p style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: 0 }}>Requisitos de Radicación</p>
                  </div>
                </div>
                {openCostos ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </button>
              {openCostos && (
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "16px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Hoja de vida detallada con soportes de experiencia laboral expedidos por empresas u organizaciones.",
                    "Fotocopia legible del Diploma de Bachiller académico.",
                    "Fotocopia ampliada del documento de identidad.",
                    "Recibo original de consignación o transferencia de pago del proceso.",
                    "Formulario oficial de Solicitud de Validación diligenciado.",
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.tealBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ color: C.greenMid, fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                      </div>
                      <p style={{ color: C.navy, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{r}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bancos validación */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <button onClick={() => setOpenValidBanco(!openValidBanco)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "white", border: "none", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CreditCard size={20} color={C.greenDark} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: C.greenDark, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Pagos</p>
                    <p style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: 0 }}>Cuentas Bancarias y Medios de Pago</p>
                  </div>
                </div>
                {openValidBanco ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </button>
              {openValidBanco && (
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "16px 22px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 10 }}>
                    {[
                      { banco: "Bancolombia", tipo: "Ahorros", cuenta: "496-529273-85" },
                      { banco: "Davivienda",  tipo: "Ahorros", cuenta: "146200092048" },
                      { banco: "Nequi",       tipo: "Institucional", cuenta: "3218837010" },
                    ].map(b => (
                      <div key={b.banco} style={{ background: C.pageBg, borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(0,0,0,0.05)" }}>
                        <p style={{ color: C.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", margin: "0 0 4px" }}>{b.banco}</p>
                        <p style={{ color: C.muted, fontSize: 11, margin: "0 0 2px" }}>{b.tipo}</p>
                        <p style={{ color: C.navy, fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: "0.5px" }}>{b.cuenta}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ color: C.muted, fontSize: 12, marginTop: 12, lineHeight: 1.5 }}>
                    Enviar comprobante al WhatsApp <strong style={{ color: C.navy }}>321 8837010</strong> o al correo <strong style={{ color: C.navy }}>institutodepetroleo01@gmail.com</strong>
                  </p>
                </div>
              )}
            </div>

            <a href={WHATSAPP} target="_blank" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
              <MessageCircle size={18} /> Iniciar proceso de validación
            </a>
          </div>
        )}

        {/* TAB: Certificaciones IADC */}
        {seccion === "iadc" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Header informativo */}
            <div style={{ background: "white", borderRadius: 18, padding: "24px 22px", border: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.tealBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Globe size={22} color={C.greenMid} />
                </div>
                <div>
                  <p style={{ color: C.greenMid, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Internacional</p>
                  <h3 style={{ color: C.navy, fontSize: isMobile ? 16 : 18, fontWeight: 800, margin: 0 }}>Certificaciones IADC – Well Sharp</h3>
                </div>
              </div>
              <p style={{ color: C.mutedDark, fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}>
                Certificaciones internacionales emitidas por el IADC (International Association of Drilling Contractors). Disponibles en modalidad <strong>virtual y presencial</strong>. Reconocidas globalmente en el sector de perforación y producción de hidrocarburos.
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Virtual y Presencial", "Reconocimiento Internacional", "IADC Well Sharp", "Sector Petrolero"].map(t => (
                  <span key={t} style={{ background: C.tealBg, color: C.greenDark, fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 980 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Lista cursos IADC */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {iadcCursos.map((c, i) => (
                <div key={c.nombre} style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <button onClick={() => setOpenIADC(openIADC === i ? null : i)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "transparent", border: "none", cursor: "pointer", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ background: C.tealBg, color: C.greenMid, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8, flexShrink: 0 }}>IADC</span>
                      <span style={{ color: C.navy, fontSize: 13, fontWeight: 600, textAlign: "left" }}>{c.nombre}</span>
                    </div>
                    <span style={{ flexShrink: 0 }}>{openIADC === i ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}</span>
                  </button>
                  {openIADC === i && (
                    <div style={{ padding: "0 18px 16px" }}>
                      <p style={{ color: C.mutedDark, fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{c.desc}</p>
                      <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
                        <a href={WHATSAPP} target="_blank" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.greenMid, color: "white", padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><MessageCircle size={14} /> Inscribirme</a>
                        <a href={EMAIL} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.tealBg, color: C.greenMid, padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><Mail size={14} /> Más info</a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <a href={WHATSAPP} target="_blank" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.greenMid, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,191,165,0.35)" }}>
              <MessageCircle size={18} /> Consultar certificaciones IADC
            </a>
          </div>
        )}
      </section>

      {/* ══ CTA CONTACTO ════════════════════════════════════════════════════ */}
      <section id="contacto" style={{ padding: isMobile ? "0 16px 80px" : "0 48px 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0d1b2a 0%, #0a2a1a 100%)", borderRadius: isMobile ? 20 : 28, padding: isMobile ? "36px 24px" : "56px 60px", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(0,200,83,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,191,165,0.06)", pointerEvents: "none" }} />
          <span style={{ display: "inline-block", background: "rgba(0,200,83,0.12)", color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "6px 16px", borderRadius: 980, marginBottom: 16, border: "1px solid rgba(0,200,83,0.2)" }}>Contáctanos</span>
          <h3 style={{ color: "white", fontSize: isMobile ? 22 : 32, fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 12px" }}>Resuelve tus dudas ahora</h3>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
            Un asesor te contactará y te guiará en el proceso de inscripción.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexDirection: isMobile ? "column" : "row" }}>
            <a href={WHATSAPP} target="_blank" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.green, color: "white", padding: isMobile ? "14px 24px" : "13px 28px", borderRadius: 980, fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
              <MessageCircle size={16} /> 321 8837010 / 311 5267054
            </a>
            <a href={EMAIL} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "white", padding: isMobile ? "14px 24px" : "13px 28px", borderRadius: 980, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Mail size={16} /> institutodepetroleo01@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer style={{ background: C.navy, padding: isMobile ? "24px 20px" : "28px 48px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="ITP" style={{ height: 32, width: "auto", objectFit: "contain" }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Instituto Técnico de Petróleo · SSAAES NIT 900650018-5</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>© 2026</p>
      </footer>

      {/* ══ BOTÓN FLOTANTE WHATSAPP ══════════════════════════════════════════ */}
      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
        title="Chatea con nosotros en WhatsApp"
        style={{ position: "fixed", bottom: isMobile ? 80 : 32, right: 24, zIndex: 999, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(37,211,102,0.5)", textDecoration: "none", transition: "transform 0.18s ease, box-shadow 0.18s ease" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(37,211,102,0.65)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(37,211,102,0.5)"; }}
      >
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.003 3C8.833 3 3 8.832 3 16.003c0 2.298.614 4.453 1.686 6.31L3 29l6.875-1.663A13.02 13.02 0 0016.003 29C23.17 29 29 23.168 29 16.003 29 8.832 23.17 3 16.003 3z" fill="white"/>
          <path d="M21.892 19.338c-.296-.149-1.751-.865-2.022-.963-.271-.1-.468-.149-.665.149-.198.296-.765.963-.938 1.16-.172.198-.345.223-.641.074-.296-.149-1.25-.461-2.38-1.469-.88-.785-1.473-1.754-1.646-2.05-.173-.297-.018-.457.13-.605.133-.133.297-.347.445-.52.149-.172.198-.297.297-.494.1-.198.05-.371-.025-.52-.074-.149-.665-1.604-.911-2.196-.24-.577-.484-.499-.665-.508l-.568-.01c-.198 0-.519.074-.79.371-.271.297-1.04 1.016-1.04 2.477 0 1.462 1.065 2.875 1.213 3.073.149.198 2.097 3.203 5.082 4.492.71.307 1.264.49 1.696.627.713.227 1.362.195 1.875.118.572-.085 1.751-.716 1.998-1.408.247-.692.247-1.285.173-1.408-.074-.124-.271-.198-.568-.347z" fill="#25D366"/>
        </svg>
      </a>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(10px);} }
        a { transition: opacity 0.2s; }
      `}</style>
    </div>
  );
}