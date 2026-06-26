"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import {
  Book, Clock, LogOut, ArrowLeft, UploadCloud,
  X, Calendar, CheckCircle, AlertCircle, ChevronLeft, ChevronRight,
  Layers, Video, Link as LinkIcon, Bell, FileText, ClipboardList,
  MessageSquare, Paperclip,
} from "lucide-react";

const C = {
  green:     "#00C853",
  greenMid:  "#00BFA5",
  greenDark: "#00897B",
  greenBg:   "#e8f5e9",
  tealBg:    "#e0f2f1",
  navy:      "#0d1b2a",
  navyDeep:  "#060d14",
  pageBg:    "#f0faf5",
  border:    "rgba(0,0,0,0.07)",
  muted:     "#6b9e7e",
  mutedDark: "#4a7c6f",
  danger:    "#ff5252",
  dangerBg:  "#ffebee",
} as const;

const EASE_OUT    = "cubic-bezier(0.23, 1, 0.32, 1)";
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

interface Aviso {
  id: string; modulo_id: string; titulo?: string; contenido: string;
  tipo: "info" | "alerta" | "exito"; link_contenido?: string; created_at: string;
}
interface Modulo {
  id: string; clase_id: string; titulo: string; descripcion: string;
  link_contenido: string | null; orden: number; created_at: string;
  avisos_modulo?: Aviso[];
}

function detectVideoType(url: string): "youtube" | "vimeo" | "mp4" | "unknown" {
  if (!url) return "unknown";
  if (url.includes("youtube.com/watch") || url.includes("youtu.be/") || url.includes("youtube.com/embed")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return "mp4";
  return "unknown";
}
function getYoutubeEmbedUrl(url: string): string {
  let id = "";
  if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1]?.split("?")[0] || "";
  else if (url.includes("youtube.com/watch")) id = new URLSearchParams(url.split("?")[1]).get("v") || "";
  else if (url.includes("youtube.com/embed")) id = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}
function getVimeoEmbedUrl(url: string): string {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return `https://player.vimeo.com/video/${m ? m[1] : ""}?title=0&byline=0&portrait=0`;
}
function UniversalPlayer({ url }: { url: string }) {
  const type = detectVideoType(url);
  const wrap: React.CSSProperties = { width: "100%", borderRadius: 14, overflow: "hidden", background: C.navy, position: "relative", paddingTop: "56.25%", marginTop: 16 };
  const fr: React.CSSProperties = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" };
  if (type === "youtube") return <div style={wrap}><iframe style={fr} src={getYoutubeEmbedUrl(url)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="YouTube" /></div>;
  if (type === "vimeo")   return <div style={wrap}><iframe style={fr} src={getVimeoEmbedUrl(url)} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Vimeo" /></div>;
  if (type === "mp4")     return <div style={{ marginTop: 16, borderRadius: 14, overflow: "hidden" }}><video controls style={{ width: "100%", borderRadius: 14 }}><source src={url} type="video/mp4" /></video></div>;
  return (
    <div style={{ marginTop: 12, padding: "10px 16px", background: C.greenBg, borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
      <LinkIcon size={14} color={C.green} />
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: C.green, fontSize: 13, fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}>{url}</a>
    </div>
  );
}

const avisoColors = {
  info:   { bg: C.tealBg,  border: "#80cbc4", icon: "ℹ️" },
  alerta: { bg: C.greenBg, border: "#a5d6a7", icon: "⚠️" },
  exito:  { bg: C.greenBg, border: "#b9f6ca", icon: "✅" },
};

export default function StudentDashboard() {
  const router = useRouter();
  useInactivityLogout();
  const { width: screenWidth, mounted } = useWindowSize();
  const isMobile = mounted && screenWidth < 768;

  const [view, setView] = useState<"dashboard" | "clase" | "calendario" | "realizar-evaluacion" | "calificaciones">("dashboard");
  const [nombre, setNombre] = useState("");
  const [userId, setUserId] = useState("");
  const [clases, setClases] = useState<any[]>([]);
  const [selectedClase, setSelectedClase] = useState<any>(null);
  const [tareas, setTareas] = useState<any[]>([]);
  const [todasTareas, setTodasTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [comentarioEntrega, setComentarioEntrega] = useState("");
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [moduloAbierto, setModuloAbierto] = useState<Modulo | null>(null);

  const [calificacionesPorClase, setCalificacionesPorClase] = useState<any[]>([]);
  const [loadingCalif, setLoadingCalif] = useState(false);
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState<Record<string, boolean>>({});

  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);
  const [selectedEval, setSelectedEval] = useState<any>(null);
  const [respuestasAlumno, setRespuestasAlumno] = useState<Record<string, any>>({});
  const [mostrarResultadoModal, setMostrarResultadoModal] = useState(false);
  const [animatedNota, setAnimatedNota] = useState(0.0);
  const [finalNotaCalculada, setFinalNotaCalculada] = useState(0.0);
  const [esNotaProvisional, setEsNotaProvisional] = useState(false);
  const [preguntasPendientesCount, setPreguntasPendientesCount] = useState(0);
  const [detalleResultados, setDetalleResultados] = useState<Array<{ enunciado: string; tipo: string; estado: "correcta" | "incorrecta" | "pendiente"; puntaje: number }>>([]);

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    setUserId(user.id);
    const { data: prof } = await supabase.from("profiles").select("nombre").eq("id", user.id).single();
    setNombre(prof?.nombre || "Estudiante");
    const { data: inscs } = await supabase.from("inscripciones").select("clases(id, nombre, descripcion)").eq("alumno_id", user.id);
    const clasesData = inscs?.map((i: any) => i.clases).filter(Boolean) || [];
    setClases(clasesData);
    const { data: tareasData } = await supabase.from("tareas_estudiante").select("*").eq("alumno_id", user.id).order("fecha_entrega", { ascending: true });
    const { data: entregas } = await supabase.from("entregas_tareas").select("tarea_id, nota, archivo_url, comentario, comentario_docente").eq("alumno_id", user.id);
    setTodasTareas((tareasData || []).map((t: any) => {
      const entrega = entregas?.find((e: any) => e.tarea_id === t.id);
      return { ...t, entrega, esVencida: new Date(t.fecha_entrega).getTime() < Date.now() && !entrega };
    }));
  };

  const fetchClaseData = async (cid: string, uid: string) => {
    setLoading(true);
    const { data: t } = await supabase.from("tareas_clase").select("*").eq("clase_id", cid).order("created_at", { ascending: false });
    const { data: e } = await supabase.from("entregas_tareas").select("tarea_id, nota, archivo_url, comentario, comentario_docente").eq("alumno_id", uid);
    setTareas(t?.map((task: any) => {
      const entrega = e?.find((ent: any) => ent.tarea_id === task.id);
      return { ...task, entrega, esVencida: new Date(task.fecha_entrega).getTime() < Date.now() && !entrega };
    }) || []);
    const { data: evs } = await supabase.from("evaluaciones").select("*").eq("clase_id", cid).order("created_at", { ascending: false });
    const { data: resps } = await supabase.from("respuestas_evaluacion").select("*").eq("alumno_id", uid);
    setEvaluaciones(evs?.map((ev: any) => ({ ...ev, respuesta: resps?.find((r: any) => r.evaluacion_id === ev.id) })) || []);
    const { data: mData } = await supabase.from("modulos_clase").select("*, avisos_modulo(*)").eq("clase_id", cid).order("orden", { ascending: true });
    setModulos(mData || []);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!file || !uploadModal) return;
    setLoading(true);
    const path = `entregas/${userId}/${uploadModal.id}_${Date.now()}_${file.name}`;
    const { error: upError } = await supabase.storage.from("entregas-alumnos").upload(path, file);
    if (upError) { alert("Error al subir el archivo: " + upError.message); setLoading(false); return; }
    const url = supabase.storage.from("entregas-alumnos").getPublicUrl(path).data.publicUrl;
    const { data: existing } = await supabase.from("entregas_tareas").select("id").eq("tarea_id", uploadModal.id).eq("alumno_id", userId).single();
    if (existing) {
      const { error: updErr } = await supabase.from("entregas_tareas").update({ archivo_url: url, comentario: comentarioEntrega.trim() || null }).eq("id", existing.id);
      if (updErr) { alert("Error al guardar entrega: " + updErr.message); setLoading(false); return; }
    } else {
      const { error: insErr } = await supabase.from("entregas_tareas").insert({ tarea_id: uploadModal.id, alumno_id: userId, archivo_url: url, comentario: comentarioEntrega.trim() || null });
      if (insErr) { alert("Error al registrar entrega: " + insErr.message); setLoading(false); return; }
    }
    setUploadModal(null); setFile(null); setComentarioEntrega("");
    await fetchClaseData(selectedClase?.id, userId);
    await fetchUserData();
    setLoading(false);
  };

  const getSemana = () => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + 1 + semanaOffset * 7);
    lunes.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(lunes); d.setDate(lunes.getDate() + i); return d; });
  };
  const diasSemana = getSemana();
  const nombresDias = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const tareasPorDia = (dia: Date) => todasTareas.filter(t => {
    if (!t.fecha_entrega) return false;
    const f = new Date(t.fecha_entrega);
    return f.getDate() === dia.getDate() && f.getMonth() === dia.getMonth() && f.getFullYear() === dia.getFullYear();
  });
  const tareasPendientes = todasTareas.filter(t => !t.entrega && !t.esVencida);
  const tareasVencidas   = todasTareas.filter(t => t.esVencida);
  const tareasEntregadas = todasTareas.filter(t => t.entrega);
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

  const comenzarEvaluacion = (ev: any) => { setSelectedEval(ev); setRespuestasAlumno({}); setView("realizar-evaluacion"); };

  const finalizarYCalificarEvaluacion = async () => {
    if (!selectedEval) return;
    const sinResponder = selectedEval.preguntas.some((p: any) => respuestasAlumno[p.id] === undefined || respuestasAlumno[p.id] === "");
    if (sinResponder && !window.confirm("Tienes preguntas sin responder. ¿Finalizar de todos modos?")) return;
    setLoading(true);
    const total = selectedEval.preguntas.length;
    let correctas = 0, pendientes = 0;
    const detalle: typeof detalleResultados = [];
    const ppp = parseFloat((50 / total).toFixed(1));
    selectedEval.preguntas.forEach((p: any) => {
      if (p.tipo === "icfes") {
        const ok = respuestasAlumno[p.id] !== undefined && Number(respuestasAlumno[p.id]) === Number(p.correcta);
        if (ok) correctas++;
        detalle.push({ enunciado: p.enunciado, tipo: "icfes", estado: ok ? "correcta" : "incorrecta", puntaje: ok ? ppp : 0 });
      } else {
        const resp = (respuestasAlumno[p.id] || "").trim().toLowerCase();
        if ((p.modoCorreccion || "docente") === "auto") {
          const kws = (p.palabrasClave || "").split(",").map((k: string) => k.trim().toLowerCase()).filter(Boolean);
          const ok = kws.length > 0 ? kws.some((k: string) => resp.includes(k)) : resp.length >= 5;
          if (ok) correctas++;
          detalle.push({ enunciado: p.enunciado, tipo: "abierta-auto", estado: ok ? "correcta" : "incorrecta", puntaje: ok ? ppp : 0 });
        } else { pendientes++; detalle.push({ enunciado: p.enunciado, tipo: "abierta-docente", estado: "pendiente", puntaje: 0 }); }
      }
    });
    const nota = parseFloat(((correctas / total) * 50).toFixed(1));
    setFinalNotaCalculada(nota); setEsNotaProvisional(pendientes > 0); setPreguntasPendientesCount(pendientes); setDetalleResultados(detalle);
    const { error } = await supabase.from("respuestas_evaluacion").upsert({ evaluacion_id: selectedEval.id, alumno_id: userId, respuestas: respuestasAlumno, nota, es_provisional: pendientes > 0, pendientes_count: pendientes });
    if (error) { alert("Error al registrar: " + error.message); setLoading(false); return; }
    setMostrarResultadoModal(true); setAnimatedNota(0);
    const pasos = 36, dur = 1800, inc = nota / pasos, step = dur / pasos;
    let p = 0, acc = 0;
    const timer = setInterval(() => { p++; acc += inc; if (p >= pasos || acc >= nota) { acc = nota; clearInterval(timer); } setAnimatedNota(parseFloat(acc.toFixed(1))); }, step);
    setLoading(false);
  };

  const tareasDelModulo       = (id: string) => tareas.filter(t => t.modulo_id === id);
  const evaluacionesDelModulo = (id: string) => evaluaciones.filter(e => e.modulo_id === id);

  const abrirModulo = async (m: Modulo) => {
    const { data, error } = await supabase.from("modulos_clase").select("*, avisos_modulo(*)").eq("id", m.id).single();
    setModuloAbierto(!error && data ? data : m);
  };

  const fetchCalificaciones = async (uid: string, clasesData: any[]) => {
    setLoadingCalif(true);
    const resultado: any[] = [];
    for (const clase of clasesData) {
      const { data: mods } = await supabase.from("modulos_clase").select("id, titulo, orden").eq("clase_id", clase.id).order("orden", { ascending: true });
      const modMap: Record<string, string> = {};
      (mods || []).forEach((m: any) => { modMap[m.id] = m.titulo; });
      const { data: tc } = await supabase.from("tareas_clase").select("id, titulo, modulo_id").eq("clase_id", clase.id);
      const { data: ec } = await supabase.from("entregas_tareas").select("tarea_id, nota, archivo_url, comentario_docente").eq("alumno_id", uid).not("nota", "is", null);
      const tareasCalif = (tc || []).map((t: any) => {
        const e = (ec || []).find((x: any) => x.tarea_id === t.id);
        if (!e) return null;
        return { id: t.id, titulo: t.titulo, tipo: "tarea", modulo_id: t.modulo_id, modulo_nombre: modMap[t.modulo_id] || "Sin módulo", nota: e.nota, comentario_docente: e.comentario_docente, escala: 50 };
      }).filter(Boolean);
      const { data: evsC } = await supabase.from("evaluaciones").select("id, titulo, modulo_id").eq("clase_id", clase.id);
      const { data: rc } = await supabase.from("respuestas_evaluacion").select("evaluacion_id, nota, es_provisional").eq("alumno_id", uid);
      const evalsCalif = (evsC || []).map((ev: any) => {
        const r = (rc || []).find((x: any) => x.evaluacion_id === ev.id);
        if (!r) return null;
        return { id: ev.id, titulo: ev.titulo, tipo: "evaluacion", modulo_id: ev.modulo_id, modulo_nombre: modMap[ev.modulo_id] || "Sin módulo", nota: r.nota, es_provisional: r.es_provisional, escala: 50 };
      }).filter(Boolean);
      const todas = [...tareasCalif, ...evalsCalif];
      if (todas.length > 0) resultado.push({ clase, items: todas });
    }
    setCalificacionesPorClase(resultado);
    setLoadingCalif(false);
  };

  const navItems = [
    { label: "Mis Cursos",     icon: <Book size={18} />,        v: "dashboard",      active: view === "dashboard" || view === "clase" },
    { label: "Calendario",     icon: <Calendar size={18} />,    v: "calendario",     active: view === "calendario", badge: tareasPendientes.length },
    { label: "Calificaciones", icon: <CheckCircle size={18} />, v: "calificaciones", active: view === "calificaciones" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.navy, fontFamily: "'Segoe UI', Inter, system-ui, sans-serif", flexDirection: isMobile ? "column" : "row" }}>

      {/* SIDEBAR DESKTOP */}
      {!isMobile && (
        <aside style={{ width: 260, background: C.navyDeep, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "28px 20px", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, padding: "0 8px" }}>
            <img src="/logo.png" alt="ITP" style={{ height: 46, width: "auto", objectFit: "contain" }} />
            <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>ITP <span style={{ color: C.green }}>Aula</span></span>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
            {navItems.map(item => (
              <button key={item.v}
                onClick={() => { setView(item.v as any); if (item.v === "calificaciones") fetchCalificaciones(userId, clases); }}
                className="nav-btn"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, width: "100%", textAlign: "left", background: item.active ? C.green : "transparent", color: item.active ? "white" : C.muted, transition: `background 180ms ${EASE_OUT}, color 180ms ${EASE_OUT}` }}>
                {item.icon} {item.label}
                {item.badge && item.badge > 0 && <span style={{ marginLeft: "auto", background: C.danger, color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 980 }}>{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 20 }}>
            <p style={{ color: "white", fontSize: 13, fontWeight: 600, padding: "8px 16px", margin: 0 }}>{nombre}</p>
            <p style={{ color: C.green, fontSize: 11, padding: "0 16px 8px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Estudiante</p>
            <button onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
              className="signout-btn"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", color: C.danger, background: "transparent", fontSize: 13, fontWeight: 600, width: "100%", transition: `opacity 150ms ${EASE_OUT}` }}>
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </aside>
      )}

      {/* TOPBAR MÓVIL */}
      {isMobile && (
        <header style={{ background: C.navyDeep, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="ITP" style={{ height: 36, width: "auto", objectFit: "contain" }} />
            <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>ITP <span style={{ color: C.green }}>Aula</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.muted, fontSize: 12, fontWeight: 600 }}>{nombre}</span>
            <button onClick={() => supabase.auth.signOut().then(() => router.push("/login"))} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.danger, padding: 6 }}><LogOut size={18} /></button>
          </div>
        </header>
      )}

      {/* MAIN */}
      <main style={{ marginLeft: isMobile ? 0 : 260, flex: 1, background: C.pageBg, borderRadius: isMobile ? 0 : "40px 0 0 40px", padding: isMobile ? "20px 16px 100px" : "40px", minHeight: "100vh", overflowY: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <div style={{ marginBottom: isMobile ? 24 : 36 }}>
            <p style={{ color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 4px" }}>Aula Virtual</p>
            <h1 style={{ color: C.navy, fontSize: isMobile ? 24 : 32, fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>
              {view === "dashboard"           && `Hola, ${nombre}`}
              {view === "clase"               && (selectedClase?.nombre || "")}
              {view === "calendario"          && "Mi Calendario"}
              {view === "realizar-evaluacion" && "Cuestionario Virtual"}
              {view === "calificaciones"      && "Mis Calificaciones"}
            </h1>
          </div>

          {/* DASHBOARD */}
          {view === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? 8 : 12, marginBottom: isMobile ? 20 : 28 }}>
                {[
                  { label: "Pendientes", value: tareasPendientes.length, color: C.danger },
                  { label: "Entregadas", value: tareasEntregadas.length, color: C.green },
                  { label: "Vencidas",   value: tareasVencidas.length,   color: C.green },
                ].map((s, i) => (
                  <div key={s.label} style={{ background: "white", borderRadius: 16, padding: isMobile ? "14px 16px" : "20px 22px", border: `1px solid ${C.border}`, animation: `statIn 300ms ${EASE_OUT} ${i * 60}ms both` }}>
                    <p style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>{s.label}</p>
                    <p style={{ color: s.color, fontSize: isMobile ? 24 : 30, fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {clases.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: C.muted, fontSize: 14, background: "white", borderRadius: 22 }}>Aún no estás inscrito en ninguna clase.</div>}
                {clases.map((c: any, i: number) => {
                  const pendientes = todasTareas.filter(t => t.clase_id === c.id && !t.entrega && !t.esVencida).length;
                  return (
                    <div key={c.id} onClick={() => { setSelectedClase(c); setView("clase"); fetchClaseData(c.id, userId); }}
                      className="card-hover"
                      style={{ background: "white", borderRadius: 22, padding: 28, border: `1px solid ${C.border}`, cursor: "pointer", position: "relative", animation: `cardIn 320ms ${EASE_OUT} ${i * 50}ms both` }}>
                      {pendientes > 0 && <div style={{ position: "absolute", top: 16, right: 16, background: C.danger, color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 980 }}>{pendientes} pendiente{pendientes > 1 ? "s" : ""}</div>}
                      <div style={{ background: C.greenBg, width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <Book size={22} color={C.green} />
                      </div>
                      <h3 style={{ color: C.navy, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{c.nombre}</h3>
                      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>{c.descripcion || "Sin descripción"}</p>
                      <p style={{ color: C.green, fontSize: 12, fontWeight: 700, marginTop: 16, margin: "16px 0 0" }}>Entrar al aula →</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CLASE: MÓDULOS */}
          {view === "clase" && (
            <div>
              <button onClick={() => setView("dashboard")} className="back-btn"
                style={{ display: "flex", alignItems: "center", gap: 8, background: "white", color: C.navy, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 28 }}>
                <ArrowLeft size={15} /> Volver
              </button>
              {loading && <p style={{ color: C.muted, fontSize: 14 }}>Cargando módulos...</p>}
              {!loading && modulos.length === 0 && (
                <div style={{ textAlign: "center", padding: 80, color: C.muted, fontSize: 14, background: "white", borderRadius: 22, border: "2px dashed rgba(0,0,0,0.08)" }}>
                  <Layers size={40} color="#e2e8f0" style={{ marginBottom: 16 }} />
                  <p style={{ margin: 0 }}>El docente aún no ha publicado módulos.</p>
                </div>
              )}
              {!loading && modulos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                  {modulos.map((m, idx) => {
                    const tCount = tareasDelModulo(m.id).length;
                    const eCount = evaluacionesDelModulo(m.id).length;
                    const aCount = (m.avisos_modulo || []).length;
                    const pend = tareasDelModulo(m.id).filter(t => !t.entrega && !t.esVencida).length;
                    return (
                      <div key={m.id} onClick={() => abrirModulo(m)} className="card-hover"
                        style={{ background: "white", borderRadius: 22, padding: 28, border: `1px solid ${C.border}`, cursor: "pointer", position: "relative", animation: `cardIn 300ms ${EASE_OUT} ${idx * 50}ms both` }}>
                        {pend > 0 && <div style={{ position: "absolute", top: 16, right: 16, background: C.danger, color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 980 }}>{pend} pend.</div>}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                          <div style={{ background: C.green, color: "white", width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>{idx + 1}</div>
                        </div>
                        <h3 style={{ color: C.navy, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{m.titulo}</h3>
                        {m.descripcion && <p style={{ color: C.muted, fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>{m.descripcion}</p>}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                          {tCount > 0 && <span style={{ background: C.tealBg, color: C.greenMid, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 980 }}>{tCount} tarea{tCount > 1 ? "s" : ""}</span>}
                          {eCount > 0 && <span style={{ background: C.greenBg, color: C.green, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 980 }}>{eCount} eval.</span>}
                          {aCount > 0 && <span style={{ background: C.greenBg, color: C.green, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 980 }}>{aCount} aviso{aCount > 1 ? "s" : ""}</span>}
                          {m.link_contenido && <span style={{ background: C.tealBg, color: C.greenDark, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 980 }}>Video</span>}
                        </div>
                        <p style={{ color: C.green, fontSize: 12, fontWeight: 700, margin: 0 }}>Ver contenido →</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* EVALUACIÓN */}
          {view === "realizar-evaluacion" && selectedEval && (
            <div>
              <div style={{ background: "white", borderRadius: 24, padding: 32, border: `1px solid ${C.border}`, marginBottom: 24 }}>
                <button onClick={() => setView("clase")} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: C.mutedDark, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16, padding: 0 }}>
                  <ArrowLeft size={15} /> Cancelar y salir
                </button>
                <p style={{ color: C.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>Examen en Curso</p>
                <h2 style={{ color: C.navy, fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>{selectedEval.titulo}</h2>
                <p style={{ color: C.mutedDark, fontSize: 14, margin: 0, lineHeight: 1.5 }}>{selectedEval.descripcion || "Responde con atención todas las preguntas."}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
                {selectedEval.preguntas?.map((p: any, index: number) => (
                  <div key={p.id} style={{ background: "white", borderRadius: 22, padding: 28, border: `1px solid ${C.border}`, animation: `cardIn 280ms ${EASE_OUT} ${index * 40}ms both` }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                      <span style={{ background: C.green, color: "white", width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{index + 1}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: C.navy, fontSize: 15, fontWeight: 700, margin: "0 0 4px", paddingTop: 3 }}>{p.enunciado}</p>
                        {p.tipo === "abierta" && p.modoCorreccion === "docente" && <span style={{ background: C.tealBg, color: C.greenMid, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>Revisión docente</span>}
                        {p.tipo === "abierta" && p.modoCorreccion === "auto"    && <span style={{ background: C.greenBg, color: C.green, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>Auto-calificada</span>}
                      </div>
                    </div>
                    {p.tipo === "icfes" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 40 }}>
                        {["A", "B", "C", "D"].map((letter, optIdx) => {
                          const selected = respuestasAlumno[p.id] === optIdx;
                          return (
                            <div key={letter} onClick={() => setRespuestasAlumno({ ...respuestasAlumno, [p.id]: optIdx })}
                              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 12, cursor: "pointer", border: selected ? `2px solid ${C.green}` : "1px solid rgba(0,0,0,0.08)", background: selected ? C.greenBg : "white", transition: `background 150ms ${EASE_OUT}, border-color 150ms ${EASE_OUT}` }}>
                              <div style={{ width: 20, height: 20, borderRadius: "50%", border: selected ? `6px solid ${C.green}` : "2px solid rgba(0,0,0,0.2)", background: "white", flexShrink: 0 }} />
                              <span style={{ fontSize: 14, fontWeight: 700, color: selected ? C.green : C.navy }}>{letter}.</span>
                              <span style={{ fontSize: 14, color: C.navy }}>{p.opciones[optIdx]}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ paddingLeft: 40 }}>
                        <textarea placeholder="Escribe tu respuesta..." value={respuestasAlumno[p.id] || ""} onChange={e => setRespuestasAlumno({ ...respuestasAlumno, [p.id]: e.target.value })}
                          style={{ width: "100%", background: C.pageBg, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: 16, fontSize: 14, outline: "none", color: C.navy, minHeight: 120, resize: "none", boxSizing: "border-box" as const }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 60 }}>
                <button onClick={() => setView("clase")} style={{ background: "white", color: C.mutedDark, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "14px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                <button onClick={finalizarYCalificarEvaluacion} disabled={loading} className="btn-primary"
                  style={{ background: C.green, color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 16px rgba(0,200,83,0.3)` }}>
                  {loading ? "Enviando..." : "Terminar y Calificar"}
                </button>
              </div>
            </div>
          )}

          {/* CALENDARIO */}
          {view === "calendario" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <button onClick={() => setSemanaOffset(semanaOffset - 1)} className="back-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: C.navy }}><ChevronLeft size={16} /> Anterior</button>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: C.navy, fontSize: 15, fontWeight: 700, margin: 0 }}>{diasSemana[0].getDate()} {meses[diasSemana[0].getMonth()]} — {diasSemana[6].getDate()} {meses[diasSemana[6].getMonth()]} {diasSemana[6].getFullYear()}</p>
                  {semanaOffset === 0 && <p style={{ color: C.green, fontSize: 11, fontWeight: 600, margin: "2px 0 0" }}>Esta semana</p>}
                </div>
                <button onClick={() => setSemanaOffset(semanaOffset + 1)} className="back-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: C.navy }}>Siguiente <ChevronRight size={16} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isMobile ? 4 : 8, marginBottom: 28 }}>
                {diasSemana.map((dia, i) => {
                  const tdias = tareasPorDia(dia);
                  const esHoy = dia.getTime() === hoy.getTime();
                  return (
                    <div key={i} style={{ background: esHoy ? C.navy : "white", borderRadius: 14, padding: isMobile ? "10px 6px" : "14px 10px", border: esHoy ? `2px solid ${C.green}` : `1px solid ${C.border}`, minHeight: isMobile ? 80 : 110 }}>
                      <p style={{ color: esHoy ? C.green : C.muted, fontSize: 9, fontWeight: 700, textTransform: "uppercase", margin: "0 0 3px", textAlign: "center" }}>{nombresDias[i]}</p>
                      <p style={{ color: esHoy ? "white" : C.navy, fontSize: isMobile ? 16 : 20, fontWeight: 800, textAlign: "center", margin: "0 0 8px" }}>{dia.getDate()}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {tdias.slice(0, isMobile ? 1 : 3).map(t => (
                          <div key={t.id} style={{ background: t.entrega ? C.greenBg : t.esVencida ? C.dangerBg : C.greenBg, borderRadius: 5, padding: "3px 5px" }}>
                            <p style={{ color: t.entrega ? C.green : t.esVencida ? C.danger : C.green, fontSize: 8, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.titulo}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {[
                { title: "Tareas de esta semana", items: todasTareas.filter(t => { if (!t.fecha_entrega) return false; const f = new Date(t.fecha_entrega); return f >= diasSemana[0] && f <= diasSemana[6]; }), badges: [`${tareasPendientes.length} pendientes`, `${tareasEntregadas.length} entregadas`] },
                { title: "Todas las tareas pendientes", items: tareasPendientes, badges: [] },
              ].map(section => (
                <div key={section.title} style={{ background: "white", borderRadius: 22, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <h3 style={{ color: C.navy, fontSize: 15, fontWeight: 700, margin: 0 }}>{section.title}</h3>
                    <div style={{ display: "flex", gap: 6 }}>{section.badges.map(b => <span key={b} style={{ background: C.greenBg, color: C.greenDark, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 980 }}>{b}</span>)}</div>
                  </div>
                  {section.items.length === 0 ? <div style={{ padding: 36, textAlign: "center", color: C.muted, fontSize: 14 }}>Sin tareas aquí.</div>
                    : section.items.map((t, idx, arr) => (
                      <div key={t.id} style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: idx < arr.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: t.entrega ? C.greenBg : t.esVencida ? C.dangerBg : C.greenBg, flexShrink: 0 }}>
                            {t.entrega ? <CheckCircle size={16} color={C.green} /> : t.esVencida ? <AlertCircle size={16} color={C.danger} /> : <Clock size={16} color={C.green} />}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ color: C.navy, fontSize: 14, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.titulo}</p>
                            <p style={{ color: C.muted, fontSize: 12, margin: "2px 0 0" }}>{t.clase_nombre} — {new Date(t.fecha_entrega).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          {t.entrega ? (
                            <div style={{ textAlign: "center" }}>
                              <p style={{ color: C.muted, fontSize: 9, fontWeight: 600, textTransform: "uppercase", margin: 0 }}>Nota</p>
                              <p style={{ color: C.navy, fontSize: 18, fontWeight: 800, margin: 0 }}>{t.entrega.nota ?? "—"}</p>
                            </div>
                          ) : <span style={{ background: t.esVencida ? C.dangerBg : C.greenBg, color: t.esVencida ? C.danger : C.green, fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980 }}>{t.esVencida ? "Vencida" : "Pendiente"}</span>}
                          {!t.entrega && !t.esVencida && (
                            <button onClick={() => { setSelectedClase({ id: t.clase_id, nombre: t.clase_nombre }); setComentarioEntrega(""); setUploadModal(t); }}
                              className="btn-primary" style={{ background: C.navy, color: "white", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Subir</button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}

          {/* CALIFICACIONES */}
          {view === "calificaciones" && (
            <div>
              {loadingCalif && <div style={{ textAlign: "center", padding: 60, color: C.muted }}>Cargando calificaciones...</div>}
              {!loadingCalif && calificacionesPorClase.length === 0 && (
                <div style={{ textAlign: "center", padding: 80, color: C.muted, fontSize: 14, background: "white", borderRadius: 22, border: "2px dashed rgba(0,0,0,0.08)" }}>
                  <CheckCircle size={40} color="#b9f6ca" style={{ marginBottom: 16 }} />
                  <p style={{ margin: "0 0 6px", fontWeight: 600, color: C.mutedDark }}>Aún no tienes calificaciones</p>
                  <p style={{ margin: 0, fontSize: 13 }}>Aquí aparecerán tus notas cuando el docente las publique.</p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {calificacionesPorClase.map(({ clase, items }) => {
                  const isOpen = !!acordeonesAbiertos[clase.id];
                  const porModulo: Record<string, any[]> = {};
                  items.forEach((item: any) => { if (!porModulo[item.modulo_nombre]) porModulo[item.modulo_nombre] = []; porModulo[item.modulo_nombre].push(item); });
                  const notas = items.map((i: any) => parseFloat(i.nota));
                  const promedio = notas.length ? notas.reduce((a: number, b: number) => a + b, 0) / notas.length : null;
                  return (
                    <div key={clase.id} style={{ background: "white", borderRadius: 22, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: isOpen ? "0 6px 24px rgba(0,0,0,0.07)" : "none", transition: `box-shadow 200ms ${EASE_OUT}` }}>
                      <button onClick={() => setAcordeonesAbiertos(p => ({ ...p, [clase.id]: !p[clase.id] }))}
                        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "white", border: "none", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ background: C.greenBg, width: 44, height: 44, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center" }}><Book size={20} color={C.green} /></div>
                          <div style={{ textAlign: "left" }}>
                            <p style={{ color: C.green, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 2px" }}>Asignatura</p>
                            <h3 style={{ color: C.navy, fontSize: 15, fontWeight: 700, margin: 0 }}>{clase.nombre}</h3>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {promedio !== null && (
                            <div style={{ textAlign: "right" }}>
                              <p style={{ color: C.muted, fontSize: 10, fontWeight: 600, textTransform: "uppercase", margin: "0 0 1px" }}>Promedio</p>
                              <span style={{ fontSize: 20, fontWeight: 900, color: promedio >= 35 ? C.green : promedio >= 25 ? "#f59e0b" : C.danger }}>{promedio.toFixed(1)}<span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>/50</span></span>
                            </div>
                          )}
                          <div style={{ transition: `transform 200ms ${EASE_OUT}`, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", background: C.pageBg, borderRadius: 10, padding: "6px 8px", display: "flex" }}>
                            <ChevronRight size={16} color={C.muted} style={{ transform: "rotate(90deg)" }} />
                          </div>
                        </div>
                      </button>
                      <div style={{ maxHeight: isOpen ? "2000px" : "0px", overflow: "hidden", transition: `max-height ${isOpen ? "400ms" : "250ms"} ${EASE_IN_OUT}` }}>
                        <div style={{ borderTop: `1px solid ${C.border}`, padding: "18px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                          {Object.entries(porModulo).map(([modNombre, modItems]) => (
                            <div key={modNombre}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                <Layers size={12} color={C.greenMid} />
                                <p style={{ color: C.navy, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>{modNombre}</p>
                                <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.06)" }} />
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {(modItems as any[]).map((item: any, ii: number) => {
                                  const nota = parseFloat(item.nota);
                                  const colorNota = nota >= 35 ? C.green : nota >= 25 ? "#f59e0b" : C.danger;
                                  const bgNota   = nota >= 35 ? C.greenBg : nota >= 25 ? "#fef3c7" : C.dangerBg;
                                  return (
                                    <div key={item.id} style={{ background: C.pageBg, borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(0,0,0,0.04)", animation: isOpen ? `cardIn 250ms ${EASE_OUT} ${ii * 30}ms both` : "none" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: item.tipo === "tarea" ? C.tealBg : C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                          {item.tipo === "tarea" ? <FileText size={16} color={C.greenMid} /> : <ClipboardList size={16} color={C.green} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                          <p style={{ color: C.navy, fontSize: 13, fontWeight: 600, margin: "0 0 3px" }}>{item.titulo}</p>
                                          <div style={{ display: "flex", gap: 5 }}>
                                            <span style={{ background: item.tipo === "tarea" ? C.tealBg : C.greenBg, color: item.tipo === "tarea" ? C.greenMid : C.green, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 980 }}>{item.tipo === "tarea" ? "Tarea" : "Evaluación"}</span>
                                            {item.es_provisional && <span style={{ background: C.tealBg, color: C.greenDark, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 980 }}>⏳ Provisional</span>}
                                          </div>
                                        </div>
                                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                          <div style={{ background: bgNota, borderRadius: 12, padding: "8px 14px" }}>
                                            <p style={{ color: C.muted, fontSize: 9, fontWeight: 600, textTransform: "uppercase", margin: "0 0 1px" }}>Nota</p>
                                            <span style={{ color: colorNota, fontSize: 20, fontWeight: 900 }}>{nota.toFixed(1)}</span>
                                            <span style={{ color: C.muted, fontSize: 11 }}>/50</span>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Retroalimentación del docente */}
                                      {item.comentario_docente && (
                                        <div style={{ marginTop: 12, background: C.greenBg, border: "1px solid #b9f6ca", borderRadius: 10, padding: "10px 14px" }}>
                                          <p style={{ color: C.greenDark, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 5 }}>
                                            <MessageSquare size={10} /> Retroalimentación del docente
                                          </p>
                                          <p style={{ color: C.navy, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{item.comentario_docente}</p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL: MÓDULO */}
      {moduloAbierto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: isMobile ? "flex-end" : "flex-start", justifyContent: "center", padding: isMobile ? 0 : "32px 24px", overflowY: "auto" }}>
          <div style={{ background: C.pageBg, borderRadius: isMobile ? "24px 24px 0 0" : 28, width: "100%", maxWidth: isMobile ? "100%" : 960, margin: isMobile ? 0 : "auto", maxHeight: isMobile ? "92vh" : "none", overflowY: "auto" }}>
            <div style={{ background: "white", borderRadius: "28px 28px 0 0", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p style={{ color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 4px" }}>Módulo</p>
                <h2 style={{ color: C.navy, fontSize: 22, fontWeight: 800, margin: 0 }}>{moduloAbierto.titulo}</h2>
                {moduloAbierto.descripcion && <p style={{ color: C.mutedDark, fontSize: 13, margin: "6px 0 0" }}>{moduloAbierto.descripcion}</p>}
              </div>
              <button onClick={() => setModuloAbierto(null)} className="icon-btn" style={{ background: C.pageBg, border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>
                <X size={18} color={C.mutedDark} />
              </button>
            </div>
            {moduloAbierto.link_contenido && <div style={{ padding: "0 28px" }}><UniversalPlayer url={moduloAbierto.link_contenido} /></div>}

            {/* Tareas del módulo */}
            <div style={{ padding: "22px 28px 0" }}>
              <p style={{ color: C.navy, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={13} color={C.greenMid} /> Tareas
                <span style={{ background: C.tealBg, color: C.greenMid, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>{tareasDelModulo(moduloAbierto.id).length}</span>
              </p>
              {tareasDelModulo(moduloAbierto.id).length === 0
                ? <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", color: C.muted, fontSize: 13, textAlign: "center" }}>Sin tareas en este módulo.</div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {tareasDelModulo(moduloAbierto.id).map((t: any) => (
                    <div key={t.id} style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                            <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: 0 }}>{t.titulo}</h4>
                            {t.entrega   && <span style={{ background: C.greenBg, color: C.green, fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 980 }}>Entregado</span>}
                            {t.esVencida && <span style={{ background: C.dangerBg, color: C.danger, fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 980 }}>Vencido</span>}
                            {t.archivo_url && <span style={{ background: C.tealBg, color: C.greenDark, fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 980 }}>Adjunto</span>}
                          </div>
                          <p style={{ color: C.mutedDark, fontSize: 12, margin: "0 0 6px" }}>{t.descripcion}</p>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, color: C.muted, fontSize: 11 }}>
                            <Clock size={11} color={C.green} /> {t.fecha_entrega ? new Date(t.fecha_entrega).toLocaleString() : "Sin fecha"}
                          </span>
                          {t.archivo_url && (
                            <a href={t.archivo_url} target="_blank" rel="noopener noreferrer"
                              style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 7, background: C.tealBg, border: "1px solid #80cbc4", color: C.greenDark, fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 9, textDecoration: "none" }}>
                              <Paperclip size={13} /> Ver material del docente
                            </a>
                          )}
                          {/* Comentario del estudiante */}
                          {t.entrega?.comentario && (
                            <div style={{ marginTop: 10, background: C.pageBg, border: `1px solid rgba(0,0,0,0.07)`, borderRadius: 10, padding: "10px 14px" }}>
                              <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 5 }}><MessageSquare size={10} /> Tu comentario</p>
                              <p style={{ color: C.navy, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{t.entrega.comentario}</p>
                            </div>
                          )}
                          {/* Retroalimentación del docente */}
                          {t.entrega?.comentario_docente && (
                            <div style={{ marginTop: 10, background: C.greenBg, border: "1px solid #b9f6ca", borderRadius: 10, padding: "10px 14px" }}>
                              <p style={{ color: C.greenDark, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 5 }}><MessageSquare size={10} /> Retroalimentación del docente</p>
                              <p style={{ color: C.navy, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{t.entrega.comentario_docente}</p>
                            </div>
                          )}
                        </div>
                        <div style={{ minWidth: 120, textAlign: "center", flexShrink: 0 }}>
                          {t.entrega ? (
                            <div style={{ background: C.pageBg, borderRadius: 12, padding: "10px 14px", border: `1px solid ${C.border}` }}>
                              <p style={{ color: C.muted, fontSize: 9, fontWeight: 600, textTransform: "uppercase", margin: 0 }}>Nota</p>
                              <span style={{ color: C.navy, fontSize: 24, fontWeight: 900 }}>{t.entrega.nota ?? "—"}</span>
                            </div>
                          ) : (
                            <button onClick={() => { if (!t.esVencida) { setComentarioEntrega(""); setUploadModal(t); } }} disabled={t.esVencida}
                              className={t.esVencida ? "" : "btn-primary"}
                              style={{ background: t.esVencida ? C.pageBg : C.navy, color: t.esVencida ? C.muted : "white", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 12, fontWeight: 600, cursor: t.esVencida ? "not-allowed" : "pointer", width: "100%" }}>
                              {t.esVencida ? "Cerrado" : "Subir Tarea"}
                            </button>
                          )}
                        </div>
                      </div>
                      {t.link_contenido && <UniversalPlayer url={t.link_contenido} />}
                    </div>
                  ))}
                </div>
              }
            </div>

            {/* Evaluaciones del módulo */}
            <div style={{ padding: "22px 28px 0" }}>
              <p style={{ color: C.navy, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <ClipboardList size={13} color={C.green} /> Evaluaciones
                <span style={{ background: C.greenBg, color: C.green, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>{evaluacionesDelModulo(moduloAbierto.id).length}</span>
              </p>
              {evaluacionesDelModulo(moduloAbierto.id).length === 0
                ? <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", color: C.muted, fontSize: 13, textAlign: "center" }}>Sin evaluaciones en este módulo.</div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {evaluacionesDelModulo(moduloAbierto.id).map(ev => (
                    <div key={ev.id} style={{ background: "white", borderRadius: 16, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, border: "1px solid rgba(0,0,0,0.05)" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: 0 }}>{ev.titulo}</h4>
                          {ev.respuesta && <span style={{ background: ev.respuesta.es_provisional ? C.tealBg : C.greenBg, color: ev.respuesta.es_provisional ? C.greenMid : C.green, fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 980 }}>{ev.respuesta.es_provisional ? "⏳ Provisional" : "✓ Completado"}</span>}
                        </div>
                        <p style={{ color: C.mutedDark, fontSize: 12, margin: "0 0 4px" }}>{ev.descripcion || "Sin descripción"}</p>
                        <span style={{ color: C.muted, fontSize: 11 }}>{ev.preguntas?.length || 0} preguntas</span>
                      </div>
                      <div style={{ minWidth: 140, textAlign: "center" }}>
                        {ev.respuesta ? (
                          <div style={{ background: C.pageBg, borderRadius: 12, padding: "10px 14px", border: `1px solid ${C.border}` }}>
                            <p style={{ color: C.muted, fontSize: 9, fontWeight: 600, textTransform: "uppercase", margin: 0 }}>{ev.respuesta.es_provisional ? "Provisional" : "Calificación"}</p>
                            <span style={{ color: ev.respuesta.nota >= 30 ? C.green : C.danger, fontSize: 20, fontWeight: 900 }}>{parseFloat(ev.respuesta.nota).toFixed(1)}<span style={{ fontSize: 12, color: C.muted }}> / 50</span></span>
                          </div>
                        ) : (
                          <button onClick={() => { setModuloAbierto(null); comenzarEvaluacion(ev); }} className="btn-primary"
                            style={{ background: C.green, color: "white", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%", boxShadow: `0 4px 12px rgba(0,200,83,0.3)` }}>
                            Presentar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>

            {/* Avisos del módulo */}
            <div style={{ padding: "22px 28px 28px" }}>
              <p style={{ color: C.navy, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={13} color={C.green} /> Avisos
                <span style={{ background: C.greenBg, color: C.green, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>{(moduloAbierto.avisos_modulo || []).length}</span>
              </p>
              {(moduloAbierto.avisos_modulo || []).length === 0
                ? <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", color: C.muted, fontSize: 13, textAlign: "center" }}>Sin avisos.</div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(moduloAbierto.avisos_modulo || []).map((av: Aviso) => {
                    const col = avisoColors[av.tipo];
                    return (
                      <div key={av.id} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{col.icon}</span>
                          <div>
                            {av.titulo && <p style={{ color: C.navy, fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{av.titulo}</p>}
                            <p style={{ color: C.navy, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{av.contenido}</p>
                          </div>
                        </div>
                        {av.link_contenido && <UniversalPlayer url={av.link_contenido} />}
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ENTREGA */}
      {uploadModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 24 }}>
          <div style={{ background: "white", borderRadius: isMobile ? "24px 24px 0 0" : 28, padding: isMobile ? "28px 20px 36px" : 40, width: "100%", maxWidth: isMobile ? "100%" : 480, animation: `modalIn 280ms ${EASE_OUT}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h3 style={{ color: C.navy, fontSize: 22, fontWeight: 800, margin: 0 }}>Entregar Tarea</h3>
              <button onClick={() => { setUploadModal(null); setFile(null); setComentarioEntrega(""); }} className="icon-btn" style={{ background: C.pageBg, border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>{uploadModal.titulo}</p>
            {uploadModal.archivo_url && (
              <div style={{ background: C.tealBg, border: "1px solid #80cbc4", borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <Paperclip size={16} color={C.greenDark} />
                <div>
                  <p style={{ color: C.greenDark, fontSize: 11, fontWeight: 700, textTransform: "uppercase", margin: "0 0 2px" }}>Material del docente</p>
                  <a href={uploadModal.archivo_url} target="_blank" rel="noopener noreferrer" style={{ color: C.greenDark, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Ver archivo adjunto →</a>
                </div>
              </div>
            )}
            <label style={{ display: "block", background: C.pageBg, border: "2px dashed rgba(0,0,0,0.1)", borderRadius: 16, padding: 28, textAlign: "center", cursor: "pointer", marginBottom: 16 }}>
              <UploadCloud size={36} color={C.muted} style={{ margin: "0 auto 12px" }} />
              <p style={{ color: C.navy, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{file ? file.name : "Seleccionar archivo"}</p>
              <p style={{ color: C.muted, fontSize: 11 }}>PDF, DOCX, ZIP — máx. 20 MB</p>
              <input type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] || null)} />
            </label>
            {file && <button onClick={() => setFile(null)} style={{ background: C.dangerBg, color: C.danger, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>Quitar archivo</button>}
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: C.mutedDark, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <MessageSquare size={12} /> Comentario <span style={{ color: C.muted, fontWeight: 400, textTransform: "none" }}>(opcional)</span>
              </label>
              <textarea placeholder="Ej: Completé todos los puntos..." value={comentarioEntrega} onChange={e => setComentarioEntrega(e.target.value)}
                style={{ width: "100%", background: C.pageBg, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: C.navy, minHeight: 90, resize: "none", boxSizing: "border-box" as const, lineHeight: 1.5 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={() => { setUploadModal(null); setFile(null); setComentarioEntrega(""); }} style={{ background: C.pageBg, color: C.mutedDark, border: "none", borderRadius: 12, padding: 13, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleUpload} disabled={!file || loading} className={!file || loading ? "" : "btn-primary"}
                style={{ background: !file || loading ? "rgba(0,200,83,0.4)" : C.green, color: "white", border: "none", borderRadius: 12, padding: 13, fontSize: 13, fontWeight: 600, cursor: !file || loading ? "not-allowed" : "pointer" }}>
                {loading ? "Enviando..." : "Entregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESULTADO EVALUACIÓN */}
      {mostrarResultadoModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.92)", zIndex: 400, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 24, overflowY: "auto" }}>
          <div style={{ background: "white", borderRadius: isMobile ? "24px 24px 0 0" : 32, padding: isMobile ? "28px 20px 40px" : 44, width: "100%", maxWidth: isMobile ? "100%" : 520, textAlign: "center", margin: isMobile ? 0 : "auto", animation: `modalIn 320ms ${EASE_OUT}` }}>
            <h3 style={{ color: C.navy, fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{esNotaProvisional ? "Evaluación Enviada" : "Simulacro Completado"}</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>{esNotaProvisional ? "Tu docente revisará las preguntas pendientes" : "Resultado calculado automáticamente"}</p>
            <div style={{ width: 170, height: 170, borderRadius: "50%", margin: "0 auto 28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `8px solid ${esNotaProvisional ? "#80cbc4" : animatedNota >= 30 ? "#b9f6ca" : "#ffcdd2"}`, background: esNotaProvisional ? C.tealBg : animatedNota >= 30 ? C.greenBg : C.dangerBg, position: "relative" }}>
              {esNotaProvisional && <span style={{ position: "absolute", top: -12, right: -12, background: C.greenMid, color: "white", fontSize: 9, fontWeight: 700, padding: "4px 8px", borderRadius: 980 }}>PROVISIONAL</span>}
              <span style={{ color: esNotaProvisional ? "#2563eb" : animatedNota >= 30 ? C.green : C.danger, fontSize: 46, fontWeight: 900, letterSpacing: "-1.5px" }}>{animatedNota.toFixed(1)}</span>
              <span style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>/ 50 pts</span>
            </div>
            {detalleResultados.length > 0 && (
              <div style={{ textAlign: "left", marginBottom: 28 }}>
                <p style={{ color: C.navy, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Resumen</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {detalleResultados.map((item, i) => (
                    <div key={i} style={{ background: C.pageBg, borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, border: `1px solid ${C.border}` }}>
                      <p style={{ color: C.navy, fontSize: 12, fontWeight: 500, margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <span style={{ color: C.green, fontWeight: 700 }}>#{i + 1}</span> {item.enunciado}
                      </p>
                      <span style={{ flexShrink: 0, background: item.estado === "correcta" ? C.greenBg : item.estado === "incorrecta" ? C.dangerBg : C.tealBg, color: item.estado === "correcta" ? C.green : item.estado === "incorrecta" ? C.danger : C.greenMid, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 980, textTransform: "uppercase" }}>
                        {item.estado === "correcta" ? `✓ +${item.puntaje}` : item.estado === "incorrecta" ? "✗ Incorrecta" : "⏳ Pendiente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={async () => { setMostrarResultadoModal(false); setView("clase"); setDetalleResultados([]); setEsNotaProvisional(false); setPreguntasPendientesCount(0); if (selectedClase) await fetchClaseData(selectedClase.id, userId); await fetchUserData(); }}
              className="btn-primary" style={{ background: C.navy, color: "white", border: "none", borderRadius: 12, width: "100%", padding: 14, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Volver al Aula Virtual
            </button>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR MÓVIL */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.navyDeep, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0 14px", zIndex: 50 }}>
          {navItems.map(item => (
            <button key={item.v}
              onClick={() => { setView(item.v as any); if (item.v === "calificaciones") fetchCalificaciones(userId, clases); }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "4px 16px", position: "relative" }}>
              <span style={{ color: item.active ? C.green : C.muted, transition: `color 180ms ${EASE_OUT}` }}>{item.icon}</span>
              {item.badge && item.badge > 0 && <span style={{ position: "absolute", top: 0, right: 10, background: C.danger, color: "white", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 980 }}>{item.badge}</span>}
              <span style={{ fontSize: 10, fontWeight: 600, color: item.active ? C.green : C.muted, transition: `color 180ms ${EASE_OUT}` }}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      <style>{`
        @keyframes statIn  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn  { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96);      } to { opacity:1; transform:scale(1);    } }
        @media (hover:hover) and (pointer:fine) {
          .card-hover:hover  { box-shadow:0 8px 32px rgba(0,200,83,0.12); transform:translateY(-1px); }
          .nav-btn:hover     { opacity:0.9; }
          .back-btn:hover    { opacity:0.88; }
          .signout-btn:hover { opacity:0.75; }
        }
        .card-hover  { transition:box-shadow 200ms cubic-bezier(0.23,1,0.32,1),transform 160ms cubic-bezier(0.23,1,0.32,1); }
        .btn-primary:active { transform:scale(0.97); }
        .icon-btn:active    { transform:scale(0.93); }
        .back-btn:active    { transform:scale(0.98); }
        .btn-primary { transition:opacity 150ms cubic-bezier(0.23,1,0.32,1),transform 120ms cubic-bezier(0.23,1,0.32,1),box-shadow 150ms cubic-bezier(0.23,1,0.32,1); }
        .icon-btn    { transition:transform 120ms cubic-bezier(0.23,1,0.32,1),opacity 150ms cubic-bezier(0.23,1,0.32,1); }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; } }
      `}</style>
    </div>
  );
}