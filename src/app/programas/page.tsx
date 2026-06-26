"use client";
import { ChevronDown, ChevronUp, MessageCircle, Mail, CheckCircle, CreditCard, BookOpen, Wrench, Award, Globe } from "lucide-react";
import { useState } from "react";
import { C, WHATSAPP, EMAIL } from "@/lib/constants";
import { useWindowSize } from "@/lib/useWindowSize";

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
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: color, color: "white", padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
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

export default function ProgramasPage() {
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;
  const [seccion, setSeccion] = useState<"tecnicos" | "academicos" | "validacion" | "iadc">("tecnicos");
  const [openAcad, setOpenAcad] = useState<number | null>(null);
  const [openValid, setOpenValid] = useState(false);
  const [openValidBanco, setOpenValidBanco] = useState(false);
  const [openCostos, setOpenCostos] = useState(false);
  const [openIADC, setOpenIADC] = useState<number | null>(null);
  const [openTecReq, setOpenTecReq] = useState(false);
  const [openTecBanco, setOpenTecBanco] = useState(false);

  return (
    <section style={{ padding: isMobile ? "100px 16px 64px" : "140px 48px 80px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 44 }}>
        <span style={{ display: "inline-block", background: C.greenBg, color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "6px 16px", borderRadius: 980, marginBottom: 12 }}>Oferta Académica 2026</span>
        <h2 style={{ color: C.navy, fontSize: isMobile ? 24 : 34, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 10px" }}>Todos nuestros programas</h2>
        <p style={{ color: C.mutedDark, fontSize: 14, margin: 0 }}>Selecciona la modalidad que se adapta a tu perfil</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "white", padding: 6, borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", flexWrap: isMobile ? "wrap" : "nowrap" }}>
        {[
          { key: "tecnicos",   label: isMobile ? "Técnicos" : "Técnicos Laborales",    icon: <Wrench size={13} /> },
          { key: "academicos", label: isMobile ? "Académicos" : "Programas Académicos", icon: <BookOpen size={13} /> },
          { key: "validacion", label: isMobile ? "Validación" : "Validación de Comp.",  icon: <Award size={13} /> },
          { key: "iadc",       label: isMobile ? "IADC" : "Certificaciones IADC",       icon: <Globe size={13} /> },
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

          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
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
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.green, color: "white", padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><MessageCircle size={14} /> Consultar</a>
                    <a href={EMAIL} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.greenBg, color: C.green, padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><Mail size={14} /> Más info</a>
                  </div>
                </div>
              )}
            </div>
          ))}
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
            <MessageCircle size={18} /> Consulta por nuestros programas
          </a>
        </div>
      )}

      {/* TAB: Validación de Competencias */}
      {seccion === "validacion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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

          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
            <MessageCircle size={18} /> Iniciar proceso de validación
          </a>
        </div>
      )}

      {/* TAB: Certificaciones IADC */}
      {seccion === "iadc" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.greenMid, color: "white", padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><MessageCircle size={14} /> Inscribirme</a>
                      <a href={EMAIL} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.tealBg, color: C.greenMid, padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><Mail size={14} /> Más info</a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.greenMid, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,191,165,0.35)" }}>
            <MessageCircle size={18} /> Consultar certificaciones IADC
          </a>
        </div>
      )}
    </section>
  );
}
