"use client";
import { Building2, Target, Eye, MapPin, Users, Wifi, ChevronDown, ChevronUp, MessageCircle, Mail } from "lucide-react";
import { useState } from "react";
import { C, WHATSAPP, EMAIL } from "@/lib/constants";
import { useWindowSize } from "@/lib/useWindowSize";

/* ── DATOS — Bloque 1: Identidad e Historia ───────────────────────────── */
const identidad = {
  nombre: "Instituto Técnico del Petróleo de Puerto Boyacá (ITP Puerto Boyacá)",
  naturaleza: "Privada",
  propietario: "Semillero de Saberes y Asesorías Académicas Especializadas (SSAAES) · NIT 900650018-5",
  director: "Ing. Lenin Ferney Patiño Gutiérrez",
  cargo: "Director General y Representante Legal — Ingeniero de Petróleos",
  historia: [
    "Puerto Boyacá tiene más de 50 años de tradición petrolera, una actividad que ha impulsado el desarrollo económico y social de la región.",
    "Por ser un municipio distante de los grandes centros urbanos, el acceso a educación superior técnica certificada ha sido históricamente limitado.",
    "El ITP nace para cerrar esa brecha: formar y certificar mano de obra técnica local calificada, evitando que las oportunidades laborales del sector terminen en manos de personal de otras regiones.",
    "El programa responde a las tendencias ocupacionales del Observatorio Laboral colombiano y a la demanda real de perfiles técnicos en perforación y producción de pozos.",
  ],
};

/* ── DATOS — Bloque 2: Misión, Visión y Calidad ───────────────────────── */
const misionVisionCalidad = {
  mision:
    "Ofrecer una educación y formación de calidad que prepare al talento humano mediante el desarrollo de competencias laborales, técnicas y humanas en perforación y producción de pozos de gas y petróleo, mejorando su desempeño y los procesos de la industria.",
  vision:
    "Ser la institución líder y referente regional en formación por competencias laborales del sector hidrocarburos, reconocida por su excelencia académica, modernidad y pertinencia — con la industria misma como evaluadora del mejoramiento institucional continuo.",
  calidad: [
    "Mejora continua basada en el ciclo PHVA (Planear, Hacer, Verificar, Ajustar) aplicado a cada uno de los procesos institucionales.",
    "Principio de equidad: acceso justo a la educación técnica para la población de la región.",
    "Principio de sostenibilidad: procesos pensados con responsabilidad hacia las generaciones futuras.",
    "Política institucional centrada en la satisfacción del cliente y la formación integral por competencias.",
  ],
};



/* ── DATOS — Bloque 4: Recursos y Contacto ────────────────────────────── */
const recursosContacto = {
  planta: [
    "3 salones de clase",
    "Biblioteca",
    "Área de bienestar institucional",
    "Wi-Fi",
    "Computadores para la enseñanza",
    "2 video proyectores y ayudas audiovisuales",
  ],
  direccion: "Calle 21 No. 3-39, Barrio Plan de Vivienda, Puerto Boyacá, Boyacá",
  telefono: "321 8837010",
};

function AcordeonInstitucion({
  icon, label, title, color, bg, defaultOpen, children, isMobile,
}: {
  icon: React.ReactNode; label: string; title: string; color: string; bg: string;
  defaultOpen?: boolean; children: React.ReactNode; isMobile: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ background: "white", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 18px" : "18px 22px", background: "white", border: "none", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {icon}
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>{label}</p>
            <p style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700, margin: 0 }}>{title}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
      </button>
      {open && (
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: isMobile ? "16px 18px" : "20px 22px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function InstitucionPage() {
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;
  const [tab, setTab] = useState<"identidad" | "mvc" | "recursos">("identidad");

  const tabs = [
    { key: "identidad", label: isMobile ? "Identidad" : "Identidad e Historia", icon: <Building2 size={13} /> },
    { key: "mvc",        label: isMobile ? "Misión/Visión" : "Misión, Visión y Calidad", icon: <Target size={13} /> },
    { key: "recursos",   label: isMobile ? "Contacto" : "Recursos y Contacto", icon: <MapPin size={13} /> },
  ];

  return (
    <section style={{ padding: isMobile ? "100px 16px 64px" : "140px 48px 80px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 44 }}>
        <span style={{ display: "inline-block", background: C.greenBg, color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "6px 16px", borderRadius: 980, marginBottom: 12 }}>
          Sobre nosotros
        </span>
        <h2 style={{ color: C.navy, fontSize: isMobile ? 24 : 34, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 10px" }}>
          Conoce el ITP Puerto Boyacá
        </h2>
        <p style={{ color: C.mutedDark, fontSize: 14, margin: 0 }}>
          Identidad, misión, programa técnico y todo lo que necesitas saber de nuestra institución
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "white", padding: 6, borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", flexWrap: isMobile ? "wrap" : "nowrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: isMobile ? "9px 8px" : "12px 14px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: isMobile ? 11 : 13, fontWeight: 700, background: tab === t.key ? C.green : "transparent", color: tab === t.key ? "white" : C.muted, transition: "all 0.18s ease", whiteSpace: "nowrap" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* BLOQUE 1: Identidad e Historia */}
      {tab === "identidad" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 18, padding: isMobile ? "20px 18px" : "24px 26px", border: "1px solid rgba(0,0,0,0.07)" }}>
            <p style={{ color: C.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>Quiénes somos</p>
            <h3 style={{ color: C.navy, fontSize: isMobile ? 16 : 18, fontWeight: 800, margin: "0 0 14px" }}>{identidad.nombre}</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
              <div style={{ background: C.greenBg, borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", margin: "0 0 3px" }}>Naturaleza</p>
                <p style={{ color: C.navy, fontSize: 13, fontWeight: 700, margin: 0 }}>{identidad.naturaleza}</p>
              </div>
              <div style={{ background: C.tealBg, borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", margin: "0 0 3px" }}>Entidad propietaria</p>
                <p style={{ color: C.navy, fontSize: 13, fontWeight: 700, margin: 0 }}>{identidad.propietario}</p>
              </div>
            </div>
            <div style={{ background: C.pageBg, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <Users size={18} color={C.greenDark} />
              <div>
                <p style={{ color: C.navy, fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>{identidad.director}</p>
                <p style={{ color: C.mutedDark, fontSize: 12, margin: 0 }}>{identidad.cargo}</p>
              </div>
            </div>
          </div>

          <AcordeonInstitucion
            icon={<Building2 size={20} color={C.greenMid} />}
            label="Contexto" title="Nuestra Historia"
            color={C.greenMid} bg={C.tealBg} isMobile={isMobile} defaultOpen
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {identidad.historia.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.greenMid, flexShrink: 0, marginTop: 6 }} />
                  <p style={{ color: C.mutedDark, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{h}</p>
                </div>
              ))}
            </div>
          </AcordeonInstitucion>
        </div>
      )}

      {/* BLOQUE 2: Misión, Visión y Calidad */}
      {tab === "mvc" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 14 }}>
            <div style={{ background: "white", borderRadius: 18, padding: "22px 20px", border: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target size={18} color={C.green} />
                </div>
                <h3 style={{ color: C.navy, fontSize: 16, fontWeight: 800, margin: 0 }}>Misión</h3>
              </div>
              <p style={{ color: C.mutedDark, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{misionVisionCalidad.mision}</p>
            </div>
            <div style={{ background: "white", borderRadius: 18, padding: "22px 20px", border: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: C.tealBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Eye size={18} color={C.greenMid} />
                </div>
                <h3 style={{ color: C.navy, fontSize: 16, fontWeight: 800, margin: 0 }}>Visión</h3>
              </div>
              <p style={{ color: C.mutedDark, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{misionVisionCalidad.vision}</p>
            </div>
          </div>

          <AcordeonInstitucion
            icon={<CheckIcon color={C.greenDark} />}
            label="Mejora continua" title="Política de Calidad"
            color={C.greenDark} bg={C.tealBg} isMobile={isMobile} defaultOpen
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {misionVisionCalidad.calidad.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: C.pageBg, borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.greenDark, flexShrink: 0 }} />
                  <span style={{ color: C.navy, fontSize: 13 }}>{c}</span>
                </div>
              ))}
            </div>
          </AcordeonInstitucion>
        </div>
      )}

      {/* BLOQUE 3: Recursos y Contacto */}
      {tab === "recursos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <AcordeonInstitucion
            icon={<Wifi size={20} color={C.green} />}
            label="Infraestructura" title="Planta Física y Recursos Educativos"
            color={C.green} bg={C.greenBg} isMobile={isMobile} defaultOpen
          >
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 8 }}>
              {recursosContacto.planta.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: C.pageBg, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, flexShrink: 0 }} />
                  <span style={{ color: C.navy, fontSize: 12, fontWeight: 600 }}>{r}</span>
                </div>
              ))}
            </div>
          </AcordeonInstitucion>

          <div style={{ background: "white", borderRadius: 18, padding: isMobile ? "20px 18px" : "24px 26px", border: "1px solid rgba(0,0,0,0.07)" }}>
            <p style={{ color: C.greenDark, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px" }}>Ubicación y contacto</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <MapPin size={18} color={C.greenDark} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: C.navy, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{recursosContacto.direccion}</p>
              </div>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                <MessageCircle size={18} color={C.greenDark} style={{ flexShrink: 0 }} />
                <p style={{ color: C.navy, fontSize: 13, fontWeight: 600, margin: 0 }}>{recursosContacto.telefono}</p>
              </a>
              <a href={EMAIL} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                <Mail size={18} color={C.greenDark} style={{ flexShrink: 0 }} />
                <p style={{ color: C.navy, fontSize: 13, fontWeight: 600, margin: 0 }}>institutodepetroleo01@gmail.com</p>
              </a>
            </div>
          </div>

          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.green, color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
            <MessageCircle size={18} /> Hablar con un asesor
          </a>
        </div>
      )}
    </section>
  );
}