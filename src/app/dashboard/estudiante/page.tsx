"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import {
  Book, Clock, LogOut, ArrowLeft, LayoutDashboard,
  UploadCloud, X, Calendar, CheckCircle, AlertCircle, ChevronLeft, ChevronRight,
  Layers, Video, Link as LinkIcon, Bell, FileText, ClipboardList, MessageSquare, Paperclip, Menu
} from "lucide-react";

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
// ─── INTERFACES ────────────────────────────────────────────────────────────────
interface Aviso {
  id: string; modulo_id: string; titulo?: string; contenido: string;
  tipo: "info" | "alerta" | "exito"; link_contenido?: string; created_at: string;
}
interface Modulo {
  id: string; clase_id: string; titulo: string; descripcion: string;
  link_contenido: string | null; orden: number; created_at: string;
  avisos_modulo?: Aviso[];
}

// ─── VIDEO HELPERS ─────────────────────────────────────────────────────────────
function detectVideoType(url: string): "youtube" | "vimeo" | "mp4" | "unknown" {
  if (!url) return "unknown";
  if (url.includes("youtube.com/watch") || url.includes("youtu.be/") || url.includes("youtube.com/embed")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return "mp4";
  return "unknown";
}
function getYoutubeEmbedUrl(url: string): string {
  let videoId = "";
  if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  else if (url.includes("youtube.com/watch")) { const p = new URLSearchParams(url.split("?")[1]); videoId = p.get("v") || ""; }
  else if (url.includes("youtube.com/embed")) videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}
function getVimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return `https://player.vimeo.com/video/${match ? match[1] : ""}?title=0&byline=0&portrait=0`;
}
function UniversalPlayer({ url }: { url: string }) {
  const type = detectVideoType(url);
  const containerStyle: React.CSSProperties = { width: "100%", borderRadius: 14, overflow: "hidden", background: "#0d1b2a", position: "relative", paddingTop: "56.25%", marginTop: 16 };
  const iframeStyle: React.CSSProperties = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" };
  if (type === "youtube") return <div style={containerStyle}><iframe style={iframeStyle} src={getYoutubeEmbedUrl(url)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="YouTube video" /></div>;
  if (type === "vimeo") return <div style={containerStyle}><iframe style={iframeStyle} src={getVimeoEmbedUrl(url)} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Vimeo video" /></div>;
  if (type === "mp4") return <div style={{ marginTop: 16, borderRadius: 14, overflow: "hidden" }}><video controls style={{ width: "100%", borderRadius: 14, background: "#0d1b2a" }}><source src={url} type="video/mp4" /></video></div>;
  return <div style={{ marginTop: 12, padding: "10px 16px", background: "#e8f5e9", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}><LinkIcon size={14} color="#00C853" /><a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#00C853", fontSize: 13, fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}>{url}</a></div>;
}

const avisoColors = {
  info:   { bg: "#e0f2f1", border: "#80cbc4", text: "#00695c", icon: "ℹ️" },
  alerta: { bg: "#e8f5e9", border: "#a5d6a7", text: "#1b5e20", icon: "⚠️" },
  exito:  { bg: "#e8f5e9", border: "#b9f6ca", text: "#1b5e20", icon: "✅" },
};

// ══════════════════════════════════════════════════════════════════════════════
export default function StudentDashboard() {
  const router = useRouter();
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
  const [comentarioEntrega, setComentarioEntrega] = useState(""); // ← NUEVO
  const [semanaOffset, setSemanaOffset] = useState(0);

  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [moduloAbierto, setModuloAbierto] = useState<Modulo | null>(null);

  // ─── CALIFICACIONES ──────────────────────────────────────────────────────────
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
  const [detalleResultados, setDetalleResultados] = useState<
    Array<{ enunciado: string; tipo: string; estado: "correcta" | "incorrecta" | "pendiente"; puntaje: number }>
  >([]);

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    setUserId(user.id);
    const { data: prof } = await supabase.from("profiles").select("nombre").eq("id", user.id).single();
    setNombre(prof?.nombre || "Estudiante");
    const { data: inscs } = await supabase.from("inscripciones").select("clases(id, nombre, descripcion)").eq("alumno_id", user.id);
    const clasesData = inscs?.map((i: any) => i.clases).filter((c: any) => c !== null) || [];
    setClases(clasesData);
    const { data: tareasData } = await supabase.from("tareas_estudiante").select("*").eq("alumno_id", user.id).order("fecha_entrega", { ascending: true });
    const { data: entregas } = await supabase.from("entregas_tareas").select("tarea_id, nota, archivo_url, comentario").eq("alumno_id", user.id);
    const tareasConEstado = (tareasData || []).map((t: any) => {
      const entrega = entregas?.find((e: any) => e.tarea_id === t.id);
      return { ...t, entrega, esVencida: new Date(t.fecha_entrega).getTime() < Date.now() && !entrega };
    });
    setTodasTareas(tareasConEstado);
  };

  const fetchClaseData = async (cid: string, uid: string) => {
    setLoading(true);
    const { data: t } = await supabase.from("tareas_clase").select("*").eq("clase_id", cid).order("created_at", { ascending: false });
    const { data: e } = await supabase.from("entregas_tareas").select("tarea_id, nota, archivo_url, comentario").eq("alumno_id", uid);
    setTareas(t?.map((task: any) => {
      const entrega = e?.find((ent: any) => ent.tarea_id === task.id);
      return { ...task, entrega, esVencida: new Date(task.fecha_entrega).getTime() < Date.now() && !entrega };
    }) || []);
    const { data: evs } = await supabase.from("evaluaciones").select("*").eq("clase_id", cid).order("created_at", { ascending: false });
    const { data: resps } = await supabase.from("respuestas_evaluacion").select("*").eq("alumno_id", uid);
    setEvaluaciones(evs?.map((ev: any) => {
      const resp = resps?.find((r: any) => r.evaluacion_id === ev.id);
      return { ...ev, respuesta: resp };
    }) || []);
    const { data: mData } = await supabase.from("modulos_clase").select("*, avisos_modulo(*)").eq("clase_id", cid).order("orden", { ascending: true });
    setModulos(mData || []);
    setLoading(false);
  };

  // ─── ENTREGA CON COMENTARIO ──────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file || !uploadModal) return;
    setLoading(true);
    const path = `entregas/${userId}/${uploadModal.id}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("entregas-alumnos").upload(path, file);
    if (error) { alert("Error al subir el archivo"); setLoading(false); return; }
    const url = supabase.storage.from("entregas-alumnos").getPublicUrl(path).data.publicUrl;
    await supabase.from("entregas_tareas").upsert({
      tarea_id: uploadModal.id,
      alumno_id: userId,
      archivo_url: url,
      comentario: comentarioEntrega.trim() || null, // ← NUEVO
    });
    setUploadModal(null);
    setFile(null);
    setComentarioEntrega(""); // ← NUEVO
    await fetchClaseData(selectedClase?.id, userId);
    await fetchUserData();
    setLoading(false);
  };

  // ─── SEMANA ─────────────────────────────────────────────────────────────────
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
  const tareasPendientes  = todasTareas.filter(t => !t.entrega && !t.esVencida);
  const tareasVencidas    = todasTareas.filter(t => t.esVencida);
  const tareasEntregadas  = todasTareas.filter(t => t.entrega);
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

  // ─── EVALUACIÓN ─────────────────────────────────────────────────────────────
  const comenzarEvaluacion = (ev: any) => {
    setSelectedEval(ev); setRespuestasAlumno({}); setView("realizar-evaluacion");
  };

  const finalizarYCalificarEvaluacion = async () => {
    if (!selectedEval) return;
    const sinResponder = selectedEval.preguntas.some((p: any) => respuestasAlumno[p.id] === undefined || respuestasAlumno[p.id] === "");
    if (sinResponder) { if (!window.confirm("Tienes preguntas sin responder. ¿Quieres finalizar de todos modos?")) return; }
    setLoading(true);
    const totalPreguntas = selectedEval.preguntas.length;
    let correctas = 0; let pendientes = 0;
    const detalle: typeof detalleResultados = [];
    const puntajePorPregunta = parseFloat((50 / totalPreguntas).toFixed(1));
    selectedEval.preguntas.forEach((p: any) => {
      if (p.tipo === "icfes") {
        const esCorrecta = respuestasAlumno[p.id] !== undefined && Number(respuestasAlumno[p.id]) === Number(p.correcta);
        if (esCorrecta) correctas++;
        detalle.push({ enunciado: p.enunciado, tipo: "icfes", estado: esCorrecta ? "correcta" : "incorrecta", puntaje: esCorrecta ? puntajePorPregunta : 0 });
      } else {
        const respuesta = (respuestasAlumno[p.id] || "").trim().toLowerCase();
        const modoCorreccion = p.modoCorreccion || "docente";
        if (modoCorreccion === "auto") {
          const palabras = (p.palabrasClave || "").split(",").map((kw: string) => kw.trim().toLowerCase()).filter(Boolean);
          const hayCoincidencia = palabras.length > 0 ? palabras.some((kw: string) => respuesta.includes(kw)) : respuesta.length >= 5;
          if (hayCoincidencia) correctas++;
          detalle.push({ enunciado: p.enunciado, tipo: "abierta-auto", estado: hayCoincidencia ? "correcta" : "incorrecta", puntaje: hayCoincidencia ? puntajePorPregunta : 0 });
        } else {
          pendientes++;
          detalle.push({ enunciado: p.enunciado, tipo: "abierta-docente", estado: "pendiente", puntaje: 0 });
        }
      }
    });
    const notaAutomatica = parseFloat(((correctas / totalPreguntas) * 50).toFixed(1));
    setFinalNotaCalculada(notaAutomatica); setEsNotaProvisional(pendientes > 0); setPreguntasPendientesCount(pendientes); setDetalleResultados(detalle);
    const { error } = await supabase.from("respuestas_evaluacion").upsert({ evaluacion_id: selectedEval.id, alumno_id: userId, respuestas: respuestasAlumno, nota: notaAutomatica, es_provisional: pendientes > 0, pendientes_count: pendientes });
    if (error) { alert("Error al registrar respuestas: " + error.message); setLoading(false); return; }
    setMostrarResultadoModal(true); setAnimatedNota(0.0);
    const duracion = 1800; const pasos = 36; const incremento = notaAutomatica / pasos; const tiempoPaso = duracion / pasos;
    let paso = 0; let acumulado = 0.0;
    const contador = setInterval(() => {
      paso++; acumulado += incremento;
      if (paso >= pasos || acumulado >= notaAutomatica) { acumulado = notaAutomatica; clearInterval(contador); }
      setAnimatedNota(parseFloat(acumulado.toFixed(1)));
    }, tiempoPaso);
    setLoading(false);
  };

  // ─── HELPERS MÓDULO ─────────────────────────────────────────────────────────
  const tareasDelModulo       = (moduloId: string) => tareas.filter(t => t.modulo_id === moduloId);
  const evaluacionesDelModulo = (moduloId: string) => evaluaciones.filter(e => e.modulo_id === moduloId);

  const abrirModulo = async (m: Modulo) => {
    const { data, error } = await supabase.from("modulos_clase").select("*, avisos_modulo(*)").eq("id", m.id).single();
    setModuloAbierto(!error && data ? data : m);
  };

  // ─── FETCH CALIFICACIONES ────────────────────────────────────────────────────
  const fetchCalificaciones = async (uid: string, clasesData: any[]) => {
    setLoadingCalif(true);
    const resultado: any[] = [];
    for (const clase of clasesData) {
      // Módulos de la clase
      const { data: modulosData } = await supabase
        .from("modulos_clase").select("id, titulo, orden").eq("clase_id", clase.id).order("orden", { ascending: true });
      const modulosMap: Record<string, string> = {};
      (modulosData || []).forEach((m: any) => { modulosMap[m.id] = m.titulo; });

      // Tareas entregadas con nota
      const { data: tareasClase } = await supabase
        .from("tareas_clase").select("id, titulo, modulo_id").eq("clase_id", clase.id);
      const { data: entregasData } = await supabase
        .from("entregas_tareas").select("tarea_id, nota, archivo_url")
        .eq("alumno_id", uid)
        .not("nota", "is", null);

      const tareasCalificadas = (tareasClase || [])
        .map((t: any) => {
          const entrega = (entregasData || []).find((e: any) => e.tarea_id === t.id);
          if (!entrega) return null;
          return {
            id: t.id, titulo: t.titulo, tipo: "tarea",
            modulo_id: t.modulo_id,
            modulo_nombre: modulosMap[t.modulo_id] || "Sin módulo",
            nota: entrega.nota,
            escala: 50,
          };
        }).filter(Boolean);

      // Evaluaciones respondidas
      const { data: evsClase } = await supabase
        .from("evaluaciones").select("id, titulo, modulo_id").eq("clase_id", clase.id);
      const { data: respsData } = await supabase
        .from("respuestas_evaluacion").select("evaluacion_id, nota, es_provisional")
        .eq("alumno_id", uid);

      const evalsCalificadas = (evsClase || [])
        .map((ev: any) => {
          const resp = (respsData || []).find((r: any) => r.evaluacion_id === ev.id);
          if (!resp) return null;
          return {
            id: ev.id, titulo: ev.titulo, tipo: "evaluacion",
            modulo_id: ev.modulo_id,
            modulo_nombre: modulosMap[ev.modulo_id] || "Sin módulo",
            nota: resp.nota,
            es_provisional: resp.es_provisional,
            escala: 50,
          };
        }).filter(Boolean);

      const todas = [...tareasCalificadas, ...evalsCalificadas];
      if (todas.length > 0) {
        resultado.push({ clase, items: todas, modulosMap });
      }
    }
    setCalificacionesPorClase(resultado);
    setLoadingCalif(false);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d1b2a", fontFamily: "Inter, sans-serif", flexDirection: isMobile ? "column" : "row" }}>

      {/* ── SIDEBAR DESKTOP ── */}
      {!isMobile && (
        <aside style={{ width: 260, background: "#060d14", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "28px 20px", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, padding: "0 8px" }}>
            <img src="/logo.png" alt="ITP Logo" style={{ height: 50, width: "auto", objectFit: "contain" }} />
            <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>ITP <span style={{ color: "#00C853" }}>Aula</span></span>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <button onClick={() => setView("dashboard")}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: view === "dashboard" || view === "clase" ? "#00C853" : "transparent", color: view === "dashboard" || view === "clase" ? "white" : "#6b9e7e" }}>
              <Book size={18} /> Mis Cursos
            </button>
            <button onClick={() => setView("calendario")}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: view === "calendario" ? "#00C853" : "transparent", color: view === "calendario" ? "white" : "#6b9e7e" }}>
              <Calendar size={18} /> Calendario
              {tareasPendientes.length > 0 && (
                <span style={{ marginLeft: "auto", background: "#ff5252", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 980 }}>{tareasPendientes.length}</span>
              )}
            </button>
            <button onClick={() => { setView("calificaciones"); fetchCalificaciones(userId, clases); }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: view === "calificaciones" ? "#00C853" : "transparent", color: view === "calificaciones" ? "white" : "#6b9e7e" }}>
              <CheckCircle size={18} /> Calificaciones
            </button>
          </nav>
          <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 20 }}>
            <p style={{ color: "white", fontSize: 13, fontWeight: 600, padding: "8px 16px" }}>{nombre}</p>
            <p style={{ color: "#00C853", fontSize: 11, padding: "0 16px 8px", textTransform: "uppercase", letterSpacing: "1px" }}>Estudiante</p>
            <button onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", color: "#ff5252", background: "transparent", fontSize: 13, fontWeight: 600, width: "100%" }}>
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </aside>
      )}

      {/* ── TOPBAR MÓVIL ── */}
      {isMobile && (
        <header style={{ background: "#060d14", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="ITP Logo" style={{ height: 36, width: "auto", objectFit: "contain" }} />
            <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>ITP <span style={{ color: "#00C853" }}>Aula</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6b9e7e", fontSize: 12, fontWeight: 600 }}>{nombre}</span>
            <button onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ff5252", padding: 6 }}>
              <LogOut size={18} />
            </button>
          </div>
        </header>
      )}

      {/* MAIN */}
      <main style={{
        marginLeft: isMobile ? 0 : 260,
        flex: 1,
        background: "#f0faf5",
        borderRadius: isMobile ? 0 : "40px 0 0 40px",
        padding: isMobile ? "20px 16px 100px" : "40px",
        minHeight: "100vh",
        overflowY: "auto",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <div style={{ marginBottom: isMobile ? 24 : 40 }}>
            <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>Aula Virtual</p>
            <h1 style={{ color: "#0d1b2a", fontSize: isMobile ? 24 : 32, fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>
              {view === "dashboard"           && "Hola, " + nombre}
              {view === "clase"               && (selectedClase?.nombre || "")}
              {view === "calendario"          && "Mi Calendario"}
              {view === "realizar-evaluacion" && "Cuestionario Virtual"}
              {view === "calificaciones"      && "Mis Calificaciones"}
            </h1>
          </div>

          {/* ── DASHBOARD ─────────────────────────────────────────────────── */}
          {view === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 8 : 12, marginBottom: isMobile ? 20 : 28 }}>
                <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p style={{ color: "#6b9e7e", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Pendientes</p>
                  <p style={{ color: "#ff5252", fontSize: 28, fontWeight: 800, margin: "4px 0 0" }}>{tareasPendientes.length}</p>
                </div>
                <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p style={{ color: "#6b9e7e", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Entregadas</p>
                  <p style={{ color: "#00C853", fontSize: 28, fontWeight: 800, margin: "4px 0 0" }}>{tareasEntregadas.length}</p>
                </div>
                <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p style={{ color: "#6b9e7e", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Vencidas</p>
                  <p style={{ color: "#00C853", fontSize: 28, fontWeight: 800, margin: "4px 0 0" }}>{tareasVencidas.length}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {clases.length === 0 && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#6b9e7e", fontSize: 14, background: "white", borderRadius: 22 }}>
                    Aún no estás inscrito en ninguna clase.
                  </div>
                )}
                {clases.map((c: any) => {
                  const pendientes = todasTareas.filter(t => t.clase_id === c.id && !t.entrega && !t.esVencida).length;
                  return (
                    <div key={c.id}
                      onClick={() => { setSelectedClase(c); setView("clase"); fetchClaseData(c.id, userId); }}
                      style={{ background: "white", borderRadius: 22, padding: 28, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", position: "relative" }}>
                      {pendientes > 0 && (
                        <div style={{ position: "absolute", top: 16, right: 16, background: "#ff5252", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 980 }}>
                          {pendientes} pendiente{pendientes > 1 ? "s" : ""}
                        </div>
                      )}
                      <div style={{ background: "#e8f5e9", width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <Book size={22} color="#00C853" />
                      </div>
                      <h3 style={{ color: "#0d1b2a", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{c.nombre}</h3>
                      <p style={{ color: "#6b9e7e", fontSize: 13, lineHeight: 1.5 }}>{c.descripcion || "Sin descripción"}</p>
                      <p style={{ color: "#00C853", fontSize: 12, fontWeight: 600, marginTop: 16 }}>Entrar al aula →</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── VISTA CLASE: GRID DE MÓDULOS ──────────────────────────────── */}
          {view === "clase" && (
            <div>
              <button onClick={() => setView("dashboard")}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "white", color: "#0d1b2a", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 28 }}>
                <ArrowLeft size={15} /> Volver
              </button>
              {loading && <p style={{ color: "#6b9e7e", fontSize: 14 }}>Cargando módulos...</p>}
              {!loading && modulos.length === 0 && (
                <div style={{ textAlign: "center", padding: 80, color: "#6b9e7e", fontSize: 14, background: "white", borderRadius: 22, border: "2px dashed rgba(0,0,0,0.08)" }}>
                  <Layers size={40} color="#e2e8f0" style={{ marginBottom: 16 }} />
                  <p style={{ margin: 0 }}>El docente aún no ha publicado módulos para esta clase.</p>
                </div>
              )}
              {!loading && modulos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                  {modulos.map((m, idx) => {
                    const tCount = tareasDelModulo(m.id).length;
                    const eCount = evaluacionesDelModulo(m.id).length;
                    const aCount = (m.avisos_modulo || []).length;
                    const pendientesMod = tareasDelModulo(m.id).filter(t => !t.entrega && !t.esVencida).length;
                    return (
                      <div key={m.id} onClick={() => abrirModulo(m)}
                        style={{ background: "white", borderRadius: 22, padding: 28, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", position: "relative", transition: "box-shadow 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,200,83,0.12)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                        {pendientesMod > 0 && (
                          <div style={{ position: "absolute", top: 16, right: 16, background: "#ff5252", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 980 }}>
                            {pendientesMod} pend.
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                          <div style={{ background: "#00C853", color: "white", width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>
                            {idx + 1}
                          </div>
                        </div>
                        <h3 style={{ color: "#0d1b2a", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{m.titulo}</h3>
                        {m.descripcion && <p style={{ color: "#6b9e7e", fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>{m.descripcion}</p>}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                          {tCount > 0 && <span style={{ background: "#e0f2f1", color: "#00BFA5", fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 980, display: "flex", alignItems: "center", gap: 3 }}><FileText size={9} /> {tCount} tarea{tCount > 1 ? "s" : ""}</span>}
                          {eCount > 0 && <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 980, display: "flex", alignItems: "center", gap: 3 }}><ClipboardList size={9} /> {eCount} eval.</span>}
                          {aCount > 0 && <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 980, display: "flex", alignItems: "center", gap: 3 }}><Bell size={9} /> {aCount} aviso{aCount > 1 ? "s" : ""}</span>}
                          {m.link_contenido && <span style={{ background: "#e0f2f1", color: "#00897B", fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 980, display: "flex", alignItems: "center", gap: 3 }}><Video size={9} /> Video</span>}
                        </div>
                        <p style={{ color: "#00C853", fontSize: 12, fontWeight: 600, margin: 0 }}>Ver contenido →</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── EVALUACIÓN ────────────────────────────────────────────────── */}
          {view === "realizar-evaluacion" && selectedEval && (
            <div>
              <div style={{ background: "white", borderRadius: 24, padding: 32, border: "1px solid rgba(0,0,0,0.06)", marginBottom: 24 }}>
                <button onClick={() => setView("clase")}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "#4a7c6f", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16, padding: 0 }}>
                  <ArrowLeft size={15} /> Cancelar y salir
                </button>
                <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>Examen en Curso</p>
                <h2 style={{ color: "#0d1b2a", fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>{selectedEval.titulo}</h2>
                <p style={{ color: "#4a7c6f", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{selectedEval.descripcion || "Responde con atención todas las preguntas."}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
                {selectedEval.preguntas?.map((p: any, index: number) => (
                  <div key={p.id} style={{ background: "white", borderRadius: 22, padding: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                      <span style={{ background: "#00C853", color: "white", width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{index + 1}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "#0d1b2a", fontSize: 15, fontWeight: 700, margin: "0 0 4px", paddingTop: 3 }}>{p.enunciado}</p>
                        {p.tipo === "abierta" && p.modoCorreccion === "docente" && <span style={{ background: "#e0f2f1", color: "#00BFA5", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>Revisión docente</span>}
                        {p.tipo === "abierta" && p.modoCorreccion === "auto"    && <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>Auto-calificada</span>}
                      </div>
                    </div>
                    {p.tipo === "icfes" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 40 }}>
                        {["A", "B", "C", "D"].map((letter, optIdx) => {
                          const isSelected = respuestasAlumno[p.id] === optIdx;
                          return (
                            <div key={letter} onClick={() => setRespuestasAlumno({ ...respuestasAlumno, [p.id]: optIdx })}
                              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 12, border: isSelected ? "2px solid #00C853" : "1px solid rgba(0,0,0,0.08)", background: isSelected ? "#e8f5e9" : "white", cursor: "pointer" }}>
                              <div style={{ width: 20, height: 20, borderRadius: "50%", border: isSelected ? "6px solid #00C853" : "2px solid rgba(0,0,0,0.2)", background: "white", flexShrink: 0 }} />
                              <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? "#00C853" : "#0d1b2a" }}>{letter}.</span>
                              <span style={{ fontSize: 14, color: "#1a3a2a" }}>{p.opciones[optIdx]}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ paddingLeft: 40 }}>
                        <textarea placeholder="Escribe tu respuesta aquí..." value={respuestasAlumno[p.id] || ""} onChange={e => setRespuestasAlumno({ ...respuestasAlumno, [p.id]: e.target.value })}
                          style={{ width: "100%", background: "#f0faf5", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "16px", fontSize: 14, outline: "none", color: "#0d1b2a", minHeight: 120, resize: "none", boxSizing: "border-box" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 60 }}>
                <button onClick={() => setView("clase")} style={{ background: "white", color: "#4a7c6f", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "14px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                <button onClick={finalizarYCalificarEvaluacion} disabled={loading} style={{ background: "#00C853", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{loading ? "Enviando..." : "Terminar y Calificar"}</button>
              </div>
            </div>
          )}

          {/* ── CALENDARIO ────────────────────────────────────────────────── */}
          {view === "calendario" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <button onClick={() => setSemanaOffset(semanaOffset - 1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#0d1b2a" }}><ChevronLeft size={16} /> Anterior</button>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#0d1b2a", fontSize: 15, fontWeight: 700, margin: 0 }}>{diasSemana[0].getDate()} {meses[diasSemana[0].getMonth()]} — {diasSemana[6].getDate()} {meses[diasSemana[6].getMonth()]} {diasSemana[6].getFullYear()}</p>
                  {semanaOffset === 0 && <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, margin: "2px 0 0" }}>Esta semana</p>}
                </div>
                <button onClick={() => setSemanaOffset(semanaOffset + 1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#0d1b2a" }}>Siguiente <ChevronRight size={16} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 32 }}>
                {diasSemana.map((dia, i) => {
                  const tareasDelDia = tareasPorDia(dia);
                  const esHoy = dia.getTime() === hoy.getTime();
                  return (
                    <div key={i} style={{ background: esHoy ? "#0d1b2a" : "white", borderRadius: 16, padding: "14px 10px", border: esHoy ? "2px solid #00C853" : "1px solid rgba(0,0,0,0.06)", minHeight: 120 }}>
                      <p style={{ color: esHoy ? "#00C853" : "#6b9e7e", fontSize: 10, fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px", textAlign: "center" }}>{nombresDias[i]}</p>
                      <p style={{ color: esHoy ? "white" : "#0d1b2a", fontSize: 20, fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>{dia.getDate()}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {tareasDelDia.map(t => (
                          <div key={t.id} style={{ background: t.entrega ? "#e8f5e9" : t.esVencida ? "#ffebee" : "#e8f5e9", borderRadius: 6, padding: "4px 6px" }}>
                            <p style={{ color: t.entrega ? "#00C853" : t.esVencida ? "#ff5252" : "#00C853", fontSize: 9, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.titulo}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "white", borderRadius: 22, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "#0d1b2a", fontSize: 15, fontWeight: 700, margin: 0 }}>Tareas de esta semana</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ background: "#ffebee", color: "#ff5252", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 980 }}>{tareasPendientes.length} pendientes</span>
                    <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 980 }}>{tareasEntregadas.length} entregadas</span>
                  </div>
                </div>
                {todasTareas.filter(t => { if (!t.fecha_entrega) return false; const f = new Date(t.fecha_entrega); return f >= diasSemana[0] && f <= diasSemana[6]; }).length === 0 && (
                  <div style={{ padding: 40, textAlign: "center", color: "#6b9e7e", fontSize: 14 }}>No hay tareas para esta semana.</div>
                )}
                {todasTareas.filter(t => { if (!t.fecha_entrega) return false; const f = new Date(t.fecha_entrega); return f >= diasSemana[0] && f <= diasSemana[6]; }).map((t, i, arr) => (
                  <div key={t.id} style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: t.entrega ? "#e8f5e9" : t.esVencida ? "#ffebee" : "#e8f5e9", flexShrink: 0 }}>
                        {t.entrega ? <CheckCircle size={18} color="#00C853" /> : t.esVencida ? <AlertCircle size={18} color="#ff5252" /> : <Clock size={18} color="#00C853" />}
                      </div>
                      <div>
                        <p style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 600, margin: 0 }}>{t.titulo}</p>
                        <p style={{ color: "#6b9e7e", fontSize: 12, margin: "2px 0 0" }}>{t.clase_nombre} — {new Date(t.fecha_entrega).toLocaleDateString()} {new Date(t.fecha_entrega).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {t.entrega ? (
                        <div style={{ textAlign: "center" }}>
                          <p style={{ color: "#6b9e7e", fontSize: 10, fontWeight: 600, textTransform: "uppercase", margin: 0 }}>Nota</p>
                          <p style={{ color: "#0d1b2a", fontSize: 18, fontWeight: 800, margin: 0 }}>{t.entrega.nota ?? "sin nota"}</p>
                        </div>
                      ) : (
                        <span style={{ background: t.esVencida ? "#ffebee" : "#e8f5e9", color: t.esVencida ? "#ff5252" : "#00C853", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980 }}>{t.esVencida ? "Vencida" : "Pendiente"}</span>
                      )}
                      {!t.entrega && !t.esVencida && (
                        <button onClick={() => { setSelectedClase({ id: t.clase_id, nombre: t.clase_nombre }); setComentarioEntrega(""); setUploadModal(t); }}
                          style={{ background: "#0d1b2a", color: "white", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Subir</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "white", borderRadius: 22, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <h3 style={{ color: "#0d1b2a", fontSize: 15, fontWeight: 700, margin: 0 }}>Todas las tareas pendientes</h3>
                </div>
                {tareasPendientes.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#6b9e7e", fontSize: 14 }}>No tienes tareas pendientes.</div>}
                {tareasPendientes.map((t, i) => (
                  <div key={t.id} style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < tareasPendientes.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                    <div>
                      <p style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 600, margin: 0 }}>{t.titulo}</p>
                      <p style={{ color: "#6b9e7e", fontSize: 12, margin: "2px 0 0" }}>{t.clase_nombre} — {new Date(t.fecha_entrega).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => { setSelectedClase({ id: t.clase_id, nombre: t.clase_nombre }); setComentarioEntrega(""); setUploadModal(t); }}
                      style={{ background: "#00C853", color: "white", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Entregar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CALIFICACIONES ───────────────────────────────────────────── */}
          {view === "calificaciones" && (
            <div>
              {loadingCalif && (
                <div style={{ textAlign: "center", padding: 60, color: "#6b9e7e", fontSize: 14 }}>Cargando calificaciones...</div>
              )}
              {!loadingCalif && calificacionesPorClase.length === 0 && (
                <div style={{ textAlign: "center", padding: 80, color: "#6b9e7e", fontSize: 14, background: "white", borderRadius: 22, border: "2px dashed rgba(0,0,0,0.08)" }}>
                  <CheckCircle size={40} color="#b9f6ca" style={{ marginBottom: 16 }} />
                  <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#4a7c6f" }}>Aún no tienes calificaciones registradas</p>
                  <p style={{ margin: 0, fontSize: 13 }}>Aquí aparecerán tus notas cuando el docente las publique.</p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {calificacionesPorClase.map(({ clase, items }) => {
                  const isOpen = !!acordeonesAbiertos[clase.id];
                  // agrupar por módulo
                  const porModulo: Record<string, any[]> = {};
                  items.forEach((item: any) => {
                    const key = item.modulo_nombre;
                    if (!porModulo[key]) porModulo[key] = [];
                    porModulo[key].push(item);
                  });
                  // promedio general — todo sobre 50
                  const notas = items.map((i: any) => parseFloat(i.nota));
                  const promedio = notas.length > 0 ? (notas.reduce((a: number, b: number) => a + b, 0) / notas.length) : null;

                  return (
                    <div key={clase.id} style={{ background: "white", borderRadius: 22, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                      {/* ── Cabecera acordeón ── */}
                      <button
                        onClick={() => setAcordeonesAbiertos(prev => ({ ...prev, [clase.id]: !prev[clase.id] }))}
                        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", background: "white", border: "none", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ background: "#e8f5e9", width: 46, height: 46, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Book size={20} color="#00C853" />
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <p style={{ color: "#00C853", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 2px" }}>Asignatura</p>
                            <h3 style={{ color: "#0d1b2a", fontSize: 16, fontWeight: 700, margin: 0 }}>{clase.nombre}</h3>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {promedio !== null && (
                            <div style={{ textAlign: "right" }}>
                              <p style={{ color: "#6b9e7e", fontSize: 10, fontWeight: 600, textTransform: "uppercase", margin: "0 0 2px" }}>Promedio</p>
                              <span style={{
                                fontSize: 22, fontWeight: 800,
                                color: promedio >= 35 ? "#00C853" : promedio >= 25 ? "#f59e0b" : "#ff5252"
                              }}>
                                {promedio.toFixed(1)}<span style={{ fontSize: 12, color: "#6b9e7e", fontWeight: 500 }}>/50</span>
                              </span>
                            </div>
                          )}
                          <div style={{ background: "#f0faf5", borderRadius: 10, padding: "6px 8px" }}>
                            {isOpen
                              ? <ChevronLeft size={16} color="#6b9e7e" style={{ transform: "rotate(-90deg)" }} />
                              : <ChevronRight size={16} color="#6b9e7e" style={{ transform: "rotate(90deg)" }} />}
                          </div>
                        </div>
                      </button>

                      {/* ── Contenido expandido ── */}
                      {isOpen && (
                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
                          {Object.entries(porModulo).map(([moduloNombre, moduloItems]) => (
                            <div key={moduloNombre}>
                              {/* Título del módulo */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                <Layers size={13} color="#00BFA5" />
                                <p style={{ color: "#0d1b2a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                                  {moduloNombre}
                                </p>
                                <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.06)" }} />
                              </div>
                              {/* Items del módulo */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {(moduloItems as any[]).map((item: any) => {
                                  const esTarea = item.tipo === "tarea";
                                  const nota = parseFloat(item.nota);
                                  // semáforo sobre escala /50: ≥30 verde, ≥20 amarillo, <20 rojo
                                  const colorNota = nota >= 35 ? "#00C853" : nota >= 25 ? "#f59e0b" : "#ff5252";
                                  const bgNota   = nota >= 35 ? "#e8f5e9"  : nota >= 25 ? "#fef3c7"  : "#ffebee";
                                  return (
                                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#f0faf5", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(0,0,0,0.04)" }}>
                                      {/* Ícono tipo */}
                                      <div style={{ width: 36, height: 36, borderRadius: 10, background: esTarea ? "#e0f2f1" : "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {esTarea ? <FileText size={16} color="#00BFA5" /> : <ClipboardList size={16} color="#00C853" />}
                                      </div>
                                      {/* Info */}
                                      <div style={{ flex: 1 }}>
                                        <p style={{ color: "#0d1b2a", fontSize: 13, fontWeight: 600, margin: "0 0 3px" }}>{item.titulo}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                          <span style={{ background: esTarea ? "#e0f2f1" : "#e8f5e9", color: esTarea ? "#00BFA5" : "#00C853", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 980 }}>
                                            {esTarea ? "Tarea" : "Evaluación"}
                                          </span>
                                          {item.es_provisional && (
                                            <span style={{ background: "#e0f2f1", color: "#00897B", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 980 }}>
                                              ⏳ Provisional
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {/* Nota — siempre sobre 50 */}
                                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <div style={{ background: bgNota, borderRadius: 12, padding: "8px 16px", display: "inline-block" }}>
                                          <p style={{ color: "#6b9e7e", fontSize: 9, fontWeight: 600, textTransform: "uppercase", margin: "0 0 1px" }}>Nota</p>
                                          <span style={{ color: colorNota, fontSize: 20, fontWeight: 800 }}>
                                            {nota.toFixed(1)}
                                          </span>
                                          <span style={{ color: "#6b9e7e", fontSize: 11 }}>/50</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: CONTENIDO DEL MÓDULO (estudiante, solo lectura)
      ════════════════════════════════════════════════════════════════════ */}
      {moduloAbierto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: isMobile ? "flex-end" : "flex-start", justifyContent: "center", padding: isMobile ? 0 : "32px 24px", overflowY: "auto" }}>
          <div style={{ background: "#f0faf5", borderRadius: isMobile ? "24px 24px 0 0" : 28, width: "100%", maxWidth: isMobile ? "100%" : 960, margin: isMobile ? 0 : "auto", maxHeight: isMobile ? "92vh" : "none", overflowY: "auto" }}>

            {/* Header */}
            <div style={{ background: "white", borderRadius: "28px 28px 0 0", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div>
                <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 4px" }}>Módulo</p>
                <h2 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>{moduloAbierto.titulo}</h2>
                {moduloAbierto.descripcion && <p style={{ color: "#4a7c6f", fontSize: 13, margin: "6px 0 0" }}>{moduloAbierto.descripcion}</p>}
              </div>
              <button onClick={() => setModuloAbierto(null)} style={{ background: "#f0faf5", border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>
                <X size={18} color="#4a7c6f" />
              </button>
            </div>

            {/* Video del módulo */}
            {moduloAbierto.link_contenido && (
              <div style={{ padding: "0 32px" }}>
                <UniversalPlayer url={moduloAbierto.link_contenido} />
              </div>
            )}

            {/* ── Tareas del módulo ───────────────────────────────────────── */}
            <div style={{ padding: "24px 32px 0" }}>
              <p style={{ color: "#0d1b2a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={13} color="#00BFA5" /> Tareas
                <span style={{ background: "#e0f2f1", color: "#00BFA5", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>{tareasDelModulo(moduloAbierto.id).length}</span>
              </p>
              {tareasDelModulo(moduloAbierto.id).length === 0 ? (
                <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", color: "#6b9e7e", fontSize: 13, textAlign: "center" }}>Sin tareas en este módulo.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {tareasDelModulo(moduloAbierto.id).map(t => (
                    <div key={t.id} style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                            <h4 style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700, margin: 0 }}>{t.titulo}</h4>
                            {t.entrega   && <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 980 }}>Entregado</span>}
                            {t.esVencida && <span style={{ background: "#ffebee", color: "#ff5252",  fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 980 }}>Vencido</span>}
                            {/* ── BADGE: archivo adjunto del docente ── */}
                            {t.archivo_url && (
                              <span style={{ background: "#e0f2f1", color: "#00897B", fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 980, display: "flex", alignItems: "center", gap: 3 }}>
                                <Paperclip size={9} /> Adjunto
                              </span>
                            )}
                          </div>
                          <p style={{ color: "#4a7c6f", fontSize: 12, margin: "0 0 6px" }}>{t.descripcion}</p>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b9e7e", fontSize: 11 }}>
                            <Clock size={11} color="#00C853" /> {t.fecha_entrega ? new Date(t.fecha_entrega).toLocaleString() : "Sin fecha"}
                          </span>

                          {/* ── ARCHIVO ADJUNTO DEL DOCENTE ── */}
                          {t.archivo_url && (
                            <a
                              href={t.archivo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 7, background: "#e0f2f1", border: "1px solid #80cbc4", color: "#00897B", fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 9, textDecoration: "none" }}>
                              <Paperclip size={13} /> Ver material del docente
                            </a>
                          )}

                          {/* ── COMENTARIO QUE EL ESTUDIANTE YA ENTREGÓ ── */}
                          {t.entrega?.comentario && (
                            <div style={{ marginTop: 10, background: "#f8fafc", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "10px 14px" }}>
                              <p style={{ color: "#6b9e7e", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 5 }}>
                                <MessageSquare size={10} /> Tu comentario
                              </p>
                              <p style={{ color: "#1a3a2a", fontSize: 12, margin: 0, lineHeight: 1.5 }}>{t.entrega.comentario}</p>
                            </div>
                          )}
                        </div>

                        <div style={{ minWidth: 120, textAlign: "center", flexShrink: 0 }}>
                          {t.entrega ? (
                            <div style={{ background: "#f0faf5", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(0,0,0,0.06)" }}>
                              <p style={{ color: "#6b9e7e", fontSize: 9, fontWeight: 600, textTransform: "uppercase", margin: 0 }}>Nota</p>
                              <span style={{ color: "#0d1b2a", fontSize: 24, fontWeight: 800 }}>{t.entrega.nota ?? "—"}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => { if (!t.esVencida) { setComentarioEntrega(""); setUploadModal(t); } }}
                              disabled={t.esVencida}
                              style={{ background: t.esVencida ? "#f0faf5" : "#0d1b2a", color: t.esVencida ? "#6b9e7e" : "white", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 12, fontWeight: 600, cursor: t.esVencida ? "not-allowed" : "pointer", width: "100%" }}>
                              {t.esVencida ? "Cerrado" : "Subir Tarea"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Video de la tarea */}
                      {t.link_contenido && <UniversalPlayer url={t.link_contenido} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Evaluaciones del módulo ─────────────────────────────────── */}
            <div style={{ padding: "24px 32px 0" }}>
              <p style={{ color: "#0d1b2a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <ClipboardList size={13} color="#00C853" /> Evaluaciones
                <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>{evaluacionesDelModulo(moduloAbierto.id).length}</span>
              </p>
              {evaluacionesDelModulo(moduloAbierto.id).length === 0 ? (
                <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", color: "#6b9e7e", fontSize: 13, textAlign: "center" }}>Sin evaluaciones en este módulo.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {evaluacionesDelModulo(moduloAbierto.id).map(ev => (
                    <div key={ev.id} style={{ background: "white", borderRadius: 16, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, border: "1px solid rgba(0,0,0,0.05)" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <h4 style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700, margin: 0 }}>{ev.titulo}</h4>
                          {ev.respuesta && (
                            <span style={{ background: ev.respuesta.es_provisional ? "#e0f2f1" : "#e8f5e9", color: ev.respuesta.es_provisional ? "#00BFA5" : "#00C853", fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 980 }}>
                              {ev.respuesta.es_provisional ? "⏳ Provisional" : "✓ Completado"}
                            </span>
                          )}
                        </div>
                        <p style={{ color: "#4a7c6f", fontSize: 12, margin: "0 0 6px" }}>{ev.descripcion || "Sin descripción"}</p>
                        <span style={{ color: "#6b9e7e", fontSize: 11 }}>{ev.preguntas?.length || 0} preguntas</span>
                      </div>
                      <div style={{ minWidth: 150, textAlign: "center" }}>
                        {ev.respuesta ? (
                          <div style={{ background: "#f0faf5", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(0,0,0,0.06)" }}>
                            <p style={{ color: "#6b9e7e", fontSize: 9, fontWeight: 600, textTransform: "uppercase", margin: 0 }}>
                              {ev.respuesta.es_provisional ? "Provisional" : "Calificación"}
                            </p>
                            <span style={{ color: ev.respuesta.es_provisional ? "#00BFA5" : ev.respuesta.nota >= 30.0 ? "#00C853" : "#ff5252", fontSize: 20, fontWeight: 800 }}>
                              {parseFloat(ev.respuesta.nota).toFixed(1)}<span style={{ fontSize: 12, color: "#6b9e7e" }}> / 50</span>
                            </span>
                          </div>
                        ) : (
                          <button onClick={() => { setModuloAbierto(null); comenzarEvaluacion(ev); }}
                            style={{ background: "#00C853", color: "white", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%" }}>
                            Presentar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Avisos del módulo ───────────────────────────────────────── */}
            <div style={{ padding: "24px 32px 32px" }}>
              <p style={{ color: "#0d1b2a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={13} color="#00C853" /> Avisos
                <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>{(moduloAbierto.avisos_modulo || []).length}</span>
              </p>
              {(moduloAbierto.avisos_modulo || []).length === 0 ? (
                <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", color: "#6b9e7e", fontSize: 13, textAlign: "center" }}>Sin avisos en este módulo.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(moduloAbierto.avisos_modulo || []).map((av: Aviso) => {
                    const colors = avisoColors[av.tipo];
                    return (
                      <div key={av.id} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{colors.icon}</span>
                          <div style={{ flex: 1 }}>
                            {av.titulo && (
                              <p style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.3 }}>{av.titulo}</p>
                            )}
                            <p style={{ color: "#0d2618", fontSize: 13, fontWeight: 400, margin: 0, lineHeight: 1.5 }}>{av.contenido}</p>
                          </div>
                        </div>
                        {av.link_contenido && <UniversalPlayer url={av.link_contenido} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MODAL ENTREGA DE TAREA — con comentario y adjunto del docente
      ════════════════════════════════════════════════════════════════════ */}
      {uploadModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 24 }}>
          <div style={{ background: "white", borderRadius: isMobile ? "24px 24px 0 0" : 28, padding: isMobile ? "28px 20px 36px" : 40, width: "100%", maxWidth: isMobile ? "100%" : 480 }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Entregar Tarea</h3>
              <button onClick={() => { setUploadModal(null); setFile(null); setComentarioEntrega(""); }}
                style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>
            <p style={{ color: "#6b9e7e", fontSize: 13, marginBottom: 24 }}>{uploadModal.titulo}</p>

            {/* ── Material del docente ── */}
            {uploadModal.archivo_url && (
              <div style={{ background: "#e0f2f1", border: "1px solid #80cbc4", borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <Paperclip size={16} color="#00897B" />
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#00897B", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 2px" }}>Material del docente</p>
                  <a href={uploadModal.archivo_url} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#00695c", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    Ver archivo adjunto →
                  </a>
                </div>
              </div>
            )}

            {/* ── Zona de archivo ── */}
            <label style={{ display: "block", background: "#f0faf5", border: "2px dashed rgba(0,0,0,0.1)", borderRadius: 16, padding: "28px", textAlign: "center", cursor: "pointer", marginBottom: 16 }}>
              <UploadCloud size={36} color="#6b9e7e" style={{ margin: "0 auto 12px" }} />
              <p style={{ color: "#0d1b2a", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{file ? file.name : "Seleccionar archivo"}</p>
              <p style={{ color: "#6b9e7e", fontSize: 11 }}>PDF, DOCX, ZIP — máx. 20 MB</p>
              <input type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] || null)} />
            </label>
            {file && (
              <button onClick={() => setFile(null)}
                style={{ background: "#ffebee", color: "#ff5252", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>
                Quitar archivo
              </button>
            )}

            {/* ── Comentario ── */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <MessageSquare size={12} /> Comentario para el docente <span style={{ color: "#6b9e7e", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(opcional)</span>
              </label>
              <textarea
                placeholder="Ej: Completé todos los puntos. Tuve dudas en el ejercicio 3..."
                value={comentarioEntrega}
                onChange={e => setComentarioEntrega(e.target.value)}
                style={{ width: "100%", background: "#f0faf5", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", minHeight: 90, resize: "none", boxSizing: "border-box", lineHeight: 1.5 }}
              />
            </div>

            {/* ── Botones ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                onClick={() => { setUploadModal(null); setFile(null); setComentarioEntrega(""); }}
                style={{ background: "#f0faf5", color: "#4a7c6f", border: "none", borderRadius: 12, padding: "13px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                style={{ background: !file || loading ? "rgba(0,200,83,0.4)" : "#00C853", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 13, fontWeight: 600, cursor: !file || loading ? "not-allowed" : "pointer" }}>
                {loading ? "Enviando..." : "Entregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL RESULTADO EVALUACIÓN ════ */}
      {mostrarResultadoModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.92)", zIndex: 400, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 24, overflowY: "auto" }}>
          <div style={{ background: "white", borderRadius: isMobile ? "24px 24px 0 0" : 32, padding: isMobile ? "28px 20px 40px" : 44, width: "100%", maxWidth: isMobile ? "100%" : 520, textAlign: "center", margin: isMobile ? 0 : "auto" }}>
            <h3 style={{ color: "#0d1b2a", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{esNotaProvisional ? "Evaluación Enviada" : "Simulacro Completado"}</h3>
            <p style={{ color: "#6b9e7e", fontSize: 13, marginBottom: 28 }}>{esNotaProvisional ? "Tu docente revisará las preguntas pendientes" : "Resultado calculado automáticamente"}</p>
            <div style={{ width: 170, height: 170, borderRadius: "50%", margin: "0 auto 28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `8px solid ${esNotaProvisional ? "#80cbc4" : animatedNota >= 30 ? "#b9f6ca" : "#ffcdd2"}`, background: esNotaProvisional ? "#e0f2f1" : animatedNota >= 30 ? "#e8f5e9" : "#ffebee", position: "relative" }}>
              {esNotaProvisional && <span style={{ position: "absolute", top: -12, right: -12, background: "#00BFA5", color: "white", fontSize: 9, fontWeight: 700, padding: "4px 8px", borderRadius: 980 }}>PROVISIONAL</span>}
              <span style={{ color: esNotaProvisional ? "#2563eb" : animatedNota >= 30 ? "#00C853" : "#ff5252", fontSize: 46, fontWeight: 900, letterSpacing: "-1.5px" }}>{animatedNota.toFixed(1)}</span>
              <span style={{ color: "#6b9e7e", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>/ 50 pts</span>
            </div>
            {detalleResultados.length > 0 && (
              <div style={{ textAlign: "left", marginBottom: 28 }}>
                <p style={{ color: "#0d1b2a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Resumen</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {detalleResultados.map((item, i) => (
                    <div key={i} style={{ background: "#f0faf5", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, border: "1px solid rgba(0,0,0,0.06)" }}>
                      <p style={{ color: "#1a3a2a", fontSize: 12, fontWeight: 500, margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#00C853", fontWeight: 700 }}>#{i + 1}</span> {item.enunciado}
                      </p>
                      <span style={{ flexShrink: 0, background: item.estado === "correcta" ? "#e8f5e9" : item.estado === "incorrecta" ? "#ffebee" : "#e0f2f1", color: item.estado === "correcta" ? "#00C853" : item.estado === "incorrecta" ? "#ff5252" : "#00BFA5", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 980, textTransform: "uppercase" }}>
                        {item.estado === "correcta" ? `✓ +${item.puntaje}` : item.estado === "incorrecta" ? "✗ Incorrecta" : "⏳ Pendiente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={async () => { setMostrarResultadoModal(false); setView("clase"); setDetalleResultados([]); setEsNotaProvisional(false); setPreguntasPendientesCount(0); if (selectedClase) await fetchClaseData(selectedClase.id, userId); await fetchUserData(); }}
              style={{ background: "#0d1b2a", color: "white", border: "none", borderRadius: 12, width: "100%", padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Volver al Aula Virtual
            </button>
          </div>
        </div>
      )}

      {/* ── BARRA INFERIOR MÓVIL ── */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#060d14", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0 14px", zIndex: 50 }}>
          <button onClick={() => setView("dashboard")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "4px 16px" }}>
            <Book size={22} color={view === "dashboard" || view === "clase" ? "#00C853" : "#6b9e7e"} />
            <span style={{ fontSize: 10, fontWeight: 600, color: view === "dashboard" || view === "clase" ? "#00C853" : "#6b9e7e" }}>Cursos</span>
          </button>
          <button onClick={() => setView("calendario")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "4px 16px", position: "relative" }}>
            <Calendar size={22} color={view === "calendario" ? "#00C853" : "#6b9e7e"} />
            {tareasPendientes.length > 0 && (
              <span style={{ position: "absolute", top: 0, right: 10, background: "#ff5252", color: "white", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 980 }}>{tareasPendientes.length}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 600, color: view === "calendario" ? "#00C853" : "#6b9e7e" }}>Calendario</span>
          </button>
          <button onClick={() => { setView("calificaciones"); fetchCalificaciones(userId, clases); }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "4px 16px" }}>
            <CheckCircle size={22} color={view === "calificaciones" ? "#00C853" : "#6b9e7e"} />
            <span style={{ fontSize: 10, fontWeight: 600, color: view === "calificaciones" ? "#00C853" : "#6b9e7e" }}>Notas</span>
          </button>
        </nav>
      )}

    </div>
  );
}