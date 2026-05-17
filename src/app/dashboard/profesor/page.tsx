"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import {
  BookOpen, Users, Plus, Trash2, CheckCircle, LogOut, Clock,
  ArrowLeft, LayoutDashboard, UserPlus, X, Globe, Star, Edit3, Calendar, ChevronLeft, ChevronRight,
  Layers, Bell, Video, Link as LinkIcon, Save,
  FileText, ClipboardList,
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
interface Clase { id: string; nombre: string; descripcion: string; docente_id: string; }
interface Tarea {
  id: string; clase_id: string; modulo_id?: string; titulo: string; descripcion: string;
  fecha_entrega: string; archivo_url?: string; link_contenido?: string; clase_nombre?: string;
}
interface Estudiante { id: string; nombre: string; }
interface Entrega {
  id: string; tarea_id: string; alumno_id: string; archivo_url: string;
  comentario: string; nota: number | null; alumno_nombre?: string;
}
interface Pregunta {
  id: string; tipo: "icfes" | "abierta"; enunciado: string; opciones: string[];
  correcta: number; modoCorreccion: "auto" | "docente"; palabrasClave: string; respuestaSugerida: string;
}
interface Evaluacion {
  id: string; clase_id: string; modulo_id?: string; docente_id: string;
  titulo: string; descripcion: string; preguntas: Pregunta[]; fecha_apertura: string;
}
interface Aviso {
  id: string; modulo_id: string; titulo: string; contenido: string; tipo: "info" | "alerta" | "exito";
  link_contenido?: string; created_at: string;
}
interface Modulo {
  id: string; clase_id: string; titulo: string; descripcion: string;
  orden: number; created_at: string;
  avisos?: Aviso[];
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
  const containerStyle: React.CSSProperties = {
    width: "100%", borderRadius: 14, overflow: "hidden", background: "#0d1b2a",
    position: "relative", paddingTop: "56.25%", marginTop: 12,
  };
  const iframeStyle: React.CSSProperties = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" };
  if (type === "youtube") return <div style={containerStyle}><iframe style={iframeStyle} src={getYoutubeEmbedUrl(url)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="YouTube video" /></div>;
  if (type === "vimeo") return <div style={containerStyle}><iframe style={iframeStyle} src={getVimeoEmbedUrl(url)} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Vimeo video" /></div>;
  if (type === "mp4") return <div style={{ marginTop: 12, borderRadius: 14, overflow: "hidden" }}><video controls style={{ width: "100%", borderRadius: 14, background: "#0d1b2a" }}><source src={url} type="video/mp4" />Tu navegador no soporta este video.</video></div>;
  return (
    <div style={{ marginTop: 10, padding: "10px 16px", background: "#e8f5e9", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
      <LinkIcon size={14} color="#00C853" />
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#00C853", fontSize: 13, fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}>{url}</a>
    </div>
  );
}

function VideoLinkField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const detected = value ? detectVideoType(value) : null;
  return (
    <div>
      <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>
        Link de Video (YouTube, Vimeo o MP4) — opcional
      </label>
      <input
        placeholder="https://youtube.com/watch?v=..."
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", boxSizing: "border-box" }}
      />
      {detected && detected !== "unknown" && (
        <div style={{ marginTop: 6, padding: "6px 12px", background: "#e8f5e9", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <CheckCircle size={12} color="#00C853" />
          <span style={{ color: "#00C853", fontSize: 12, fontWeight: 600 }}>Detectado: {detected.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

const avisoColors = {
  info:   { bg: "#e0f2f1", border: "#80cbc4", text: "#00695c", icon: "ℹ️" },
  alerta: { bg: "#e8f5e9", border: "#a5d6a7", text: "#1b5e20", icon: "⚠️" },
  exito:  { bg: "#e8f5e9", border: "#b9f6ca", text: "#1b5e20", icon: "✅" },
};

function getAvisos(modulo: Modulo): Aviso[] {
  return modulo.avisos_modulo || modulo.avisos || [];
}

// ══════════════════════════════════════════════════════════════════════════════
export default function TeacherDashboard() {
  const router = useRouter();
  const { width: screenWidth, mounted } = useWindowSize();
  const isMobile = mounted && screenWidth < 768;
  const [view, setView] = useState<"dashboard" | "estudiantes" | "calificar" | "detalle-clase" | "calendario">("dashboard");
  const [selectedClase, setSelectedClase] = useState<Clase | null>(null);
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null);
  const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);
  const [clases, setClases] = useState<Clase[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [todasTareas, setTodasTareas] = useState<Tarea[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [estudiantesGlobal, setEstudiantesGlobal] = useState<Estudiante[]>([]);
  const [inscritosIds, setInscritosIds] = useState<string[]>([]);
  const [nombreDocente, setNombreDocente] = useState("");
  const [docenteId, setDocenteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [moduloAbierto, setModuloAbierto] = useState<Modulo | null>(null);
  const moduloAbiertoRef = useRef<Modulo | null>(null);
  const selectedClaseRef = useRef<Clase | null>(null);

  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null);
  const [formModulo, setFormModulo] = useState({ titulo: "", descripcion: "" });
  const [formEditModulo, setFormEditModulo] = useState({ titulo: "", descripcion: "" });

  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [formEval, setFormEval] = useState({ titulo: "", desc: "", fecha_apertura: "" });
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState<Evaluacion | null>(null);
  const [respuestasDocente, setRespuestasDocente] = useState<any[]>([]);
  const [nota, setNota] = useState("");

  const [modalClase, setModalClase] = useState(false);
  const [modalMatricula, setModalMatricula] = useState(false);
  const [modalCalificar, setModalCalificar] = useState(false);
  const [modalModulo, setModalModulo] = useState(false);
  const [modalEditModulo, setModalEditModulo] = useState(false);
  const [modalEvalResultados, setModalEvalResultados] = useState(false);
  const [modalAddElemento, setModalAddElemento] = useState(false);
  const [modalAddElementoTipo, setModalAddElementoTipo] = useState<"" | "tarea" | "evaluacion" | "aviso">("");

  const [formTarea, setFormTarea] = useState({ titulo: "", desc: "", fecha: "", link_contenido: "" });
  const [formEditTarea, setFormEditTarea] = useState({ titulo: "", desc: "", fecha: "", link_contenido: "" });
  const [formAviso, setFormAviso] = useState({ titulo: "", contenido: "", tipo: "info" as "info" | "alerta" | "exito", link_contenido: "" });
  const [file, setFile] = useState<File | null>(null);
  const [formClase, setFormClase] = useState({ nombre: "", desc: "" });

  useEffect(() => { moduloAbiertoRef.current = moduloAbierto; }, [moduloAbierto]);
  useEffect(() => { selectedClaseRef.current = selectedClase; }, [selectedClase]);

  // ─── FETCH ──────────────────────────────────────────────────────────────────
  const fetchInitialData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    setDocenteId(user.id);
    const { data: prof } = await supabase.from("profiles").select("nombre").eq("id", user.id).single();
    setNombreDocente(prof?.nombre || "Docente");
    const { data: cData } = await supabase.from("clases").select("*").order("created_at", { ascending: false });
    setClases(cData || []);
    const { data: eData } = await supabase.from("profiles").select("id, nombre").eq("role", "estudiante");
    setEstudiantesGlobal(eData || []);
    const { data: tData } = await supabase.from("tareas_clase").select("*").order("fecha_entrega", { ascending: true });
    const tareasConNombre = (tData || []).map((t: any) => {
      const clase = (cData || []).find((c: Clase) => c.id === t.clase_id);
      return { ...t, clase_nombre: clase?.nombre || "Sin clase" };
    });
    setTodasTareas(tareasConNombre);
  }, [router]);

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  const fetchModulos = async (claseId: string) => {
    const { data, error } = await supabase
      .from("modulos_clase")
      .select("*, avisos_modulo(*)")
      .eq("clase_id", claseId)
      .order("orden", { ascending: true });
    if (error) { setErrorMsg("Error al cargar módulos: " + error.message); return; }
    setModulos(data || []);
  };

  const fetchTareasClase = async (claseId: string) => {
    const { data } = await supabase.from("tareas_clase").select("*").eq("clase_id", claseId).order("created_at", { ascending: false });
    setTareas(data || []);
  };

  const fetchEvaluaciones = async (claseId: string) => {
    const { data } = await supabase.from("evaluaciones").select("*").eq("clase_id", claseId).order("created_at", { ascending: false });
    setEvaluaciones(data || []);
  };

  const entrarAClase = async (clase: Clase) => {
    setSelectedClase(clase);
    selectedClaseRef.current = clase;
    setView("detalle-clase");
    const { data: iData } = await supabase.from("inscripciones").select("alumno_id").eq("clase_id", clase.id);
    setInscritosIds(iData?.map(i => i.alumno_id) || []);
    await fetchModulos(clase.id);
    await fetchTareasClase(clase.id);
    await fetchEvaluaciones(clase.id);
  };

  // ─── CALENDARIO ─────────────────────────────────────────────────────────────
  const getSemana = () => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + 1 + semanaOffset * 7);
    lunes.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(lunes); d.setDate(lunes.getDate() + i); return d; });
  };
  const diasSemana = getSemana();
  const nombresDias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const coloresClase = ["#00C853", "#00BFA5", "#00C853", "#8b5cf6", "#ff5252", "#f59e0b", "#06b6d4"];
  const getColorClase = (claseId: string) => coloresClase[clases.findIndex(c => c.id === claseId) % coloresClase.length] || "#00C853";
  const tareasPorDia = (dia: Date) => todasTareas.filter(t => {
    if (!t.fecha_entrega) return false;
    const f = new Date(t.fecha_entrega);
    return f.getDate() === dia.getDate() && f.getMonth() === dia.getMonth() && f.getFullYear() === dia.getFullYear();
  });
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const tareasEstaSemana = todasTareas.filter(t => { if (!t.fecha_entrega) return false; const f = new Date(t.fecha_entrega); return f >= diasSemana[0] && f <= diasSemana[6]; });

  // ─── CRUD CLASES ────────────────────────────────────────────────────────────
  const handleCrearClase = async () => {
    if (!formClase.nombre || !docenteId) return;
    setLoading(true);
    const { error } = await supabase.from("clases").insert({ nombre: formClase.nombre, descripcion: formClase.desc, docente_id: docenteId });
    if (error) setErrorMsg("Error al crear clase: " + error.message);
    else { setModalClase(false); setFormClase({ nombre: "", desc: "" }); await fetchInitialData(); }
    setLoading(false);
  };

  const handleEliminarClase = async (id: string) => {
    if (!window.confirm("¿Eliminar esta clase?")) return;
    await supabase.from("clases").delete().eq("id", id);
    await fetchInitialData();
  };

  // ─── CRUD MÓDULOS ──────────────────────────────────────────────────────────
  const handleCrearModulo = async () => {
    const clase = selectedClaseRef.current;
    if (!clase || !formModulo.titulo) return;
    setLoading(true);
    const maxOrden = modulos.length > 0 ? Math.max(...modulos.map(m => m.orden)) + 1 : 1;
    const { error } = await supabase.from("modulos_clase").insert({
      clase_id: clase.id, titulo: formModulo.titulo,
      descripcion: formModulo.descripcion, orden: maxOrden,
    });
    if (error) setErrorMsg("Error al crear módulo: " + error.message);
    else { setModalModulo(false); setFormModulo({ titulo: "", descripcion: "" }); await fetchModulos(clase.id); }
    setLoading(false);
  };

  const handleGuardarModulo = async () => {
    const clase = selectedClaseRef.current;
    if (!editingModulo || !clase) return;
    setLoading(true);
    const { error } = await supabase.from("modulos_clase").update({
      titulo: formEditModulo.titulo, descripcion: formEditModulo.descripcion,
    }).eq("id", editingModulo.id);
    if (error) setErrorMsg("Error al guardar módulo: " + error.message);
    else {
      setEditingModulo(null);
      await fetchModulos(clase.id);
      if (moduloAbiertoRef.current?.id === editingModulo.id) {
        setModuloAbierto(prev => prev ? { ...prev, titulo: formEditModulo.titulo, descripcion: formEditModulo.descripcion } : null);
      }
    }
    setLoading(false);
  };

  const handleEliminarModulo = async (id: string) => {
    const clase = selectedClaseRef.current;
    if (!window.confirm("¿Eliminar este módulo?")) return;
    await supabase.from("avisos_modulo").delete().eq("modulo_id", id);
    await supabase.from("modulos_clase").delete().eq("id", id);
    if (moduloAbiertoRef.current?.id === id) setModuloAbierto(null);
    if (clase) await fetchModulos(clase.id);
  };

  // ─── CRUD TAREAS ────────────────────────────────────────────────────────────
  const handleCrearTarea = async () => {
    const clase = selectedClaseRef.current;
    const modulo = moduloAbiertoRef.current;
    if (!clase) { setErrorMsg("Error: no hay clase seleccionada"); return; }
    if (!modulo) { setErrorMsg("Error: no hay módulo abierto"); return; }
    if (!formTarea.titulo) { setErrorMsg("Error: falta el título de la tarea"); return; }
    setLoading(true);
    setErrorMsg("");
    let url = null;
    if (file) {
      const path = `${clase.id}/${Date.now()}_${file.name}`;
      const { error: upError } = await supabase.storage.from("materiales-tareas").upload(path, file);
      if (!upError) url = supabase.storage.from("materiales-tareas").getPublicUrl(path).data.publicUrl;
    }
    const fechaISO = formTarea.fecha ? new Date(formTarea.fecha).toISOString() : null;
    const { error } = await supabase.from("tareas_clase").insert({
      clase_id: clase.id, modulo_id: modulo.id, titulo: formTarea.titulo,
      descripcion: formTarea.desc, fecha_entrega: fechaISO,
      archivo_url: url, link_contenido: formTarea.link_contenido || null,
    });
    if (error) { setErrorMsg("Error al crear tarea: " + error.message); setLoading(false); return; }
    setModalAddElemento(false);
    setModalAddElementoTipo("");
    setFormTarea({ titulo: "", desc: "", fecha: "", link_contenido: "" });
    setFile(null);
    await fetchTareasClase(clase.id);
    await fetchInitialData();
    setLoading(false);
  };

  const handleEliminarTarea = async (id: string) => {
    const clase = selectedClaseRef.current;
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    await supabase.from("tareas_clase").delete().eq("id", id);
    if (clase) await fetchTareasClase(clase.id);
    await fetchInitialData();
  };

  const handleGuardarTarea = async () => {
    const clase = selectedClaseRef.current;
    if (!editingTarea || !clase) return;
    setLoading(true);
    const fechaISO = formEditTarea.fecha ? new Date(formEditTarea.fecha).toISOString() : null;
    const { error } = await supabase.from("tareas_clase").update({
      titulo: formEditTarea.titulo, descripcion: formEditTarea.desc,
      fecha_entrega: fechaISO, link_contenido: formEditTarea.link_contenido || null,
    }).eq("id", editingTarea.id);
    if (error) { setErrorMsg("Error al guardar tarea: " + error.message); }
    else { setEditingTarea(null); await fetchTareasClase(clase.id); await fetchInitialData(); }
    setLoading(false);
  };

  const verEntregas = async (tarea: Tarea) => {
    setSelectedTarea(tarea);
    const { data: eData } = await supabase.from("entregas_tareas").select("*").eq("tarea_id", tarea.id);
    const con = await Promise.all((eData || []).map(async (e) => {
      const { data: p } = await supabase.from("profiles").select("nombre").eq("id", e.alumno_id).single();
      return { ...e, alumno_nombre: p?.nombre || "Estudiante" };
    }));
    setEntregas(con);
    setModalCalificar(true);
  };

  const handleCalificar = async (entregaId: string) => {
    if (!nota) return;
    await supabase.from("entregas_tareas").update({ nota: parseFloat(nota) }).eq("id", entregaId);
    if (selectedTarea) await verEntregas(selectedTarea);
    setNota("");
  };

  // ─── CRUD EVALUACIONES ──────────────────────────────────────────────────────
  const addPregunta = () => setPreguntas([...preguntas, {
    id: Math.random().toString(36).substring(2, 9), tipo: "icfes", enunciado: "",
    opciones: ["", "", "", ""], correcta: 0, modoCorreccion: "auto", palabrasClave: "", respuestaSugerida: "",
  }]);
  const removePregunta = (id: string) => setPreguntas(preguntas.filter(p => p.id !== id));
  const updatePregunta = (id: string, field: keyof Pregunta, value: any) =>
    setPreguntas(preguntas.map(p => p.id === id ? { ...p, [field]: value } : p));

  const handleCrearEvaluacion = async () => {
    const clase = selectedClaseRef.current;
    const modulo = moduloAbiertoRef.current;
    if (!clase) { setErrorMsg("Error: no hay clase seleccionada"); return; }
    if (!modulo) { setErrorMsg("Error: no hay módulo abierto"); return; }
    if (!formEval.titulo) { setErrorMsg("Por favor completa el título de la evaluación"); return; }
    if (preguntas.length === 0) { setErrorMsg("Agrega al menos una pregunta"); return; }
    if (!formEval.fecha_apertura) { setErrorMsg("Por favor define la fecha de apertura"); return; }
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.from("evaluaciones").insert({
      clase_id: clase.id, modulo_id: modulo.id, docente_id: docenteId,
      titulo: formEval.titulo, descripcion: formEval.desc,
      preguntas, fecha_apertura: formEval.fecha_apertura,
    });
    if (error) { setErrorMsg("Error al crear evaluación: " + error.message); setLoading(false); return; }
    setModalAddElemento(false);
    setModalAddElementoTipo("");
    setFormEval({ titulo: "", desc: "", fecha_apertura: "" });
    setPreguntas([]);
    await fetchEvaluaciones(clase.id);
    setLoading(false);
  };

  const handleEliminarEvaluacion = async (id: string) => {
    const clase = selectedClaseRef.current;
    if (!window.confirm("¿Eliminar esta evaluación?")) return;
    await supabase.from("evaluaciones").delete().eq("id", id);
    if (clase) await fetchEvaluaciones(clase.id);
  };

  const verResultadosEvaluacion = async (ev: Evaluacion) => {
    setEvaluacionSeleccionada(ev);
    const { data: rData } = await supabase.from("respuestas_evaluacion").select("*").eq("evaluacion_id", ev.id);
    const con = await Promise.all((rData || []).map(async (r) => {
      const { data: p } = await supabase.from("profiles").select("nombre").eq("id", r.alumno_id).single();
      return { ...r, alumno_nombre: p?.nombre || "Estudiante" };
    }));
    setRespuestasDocente(con);
    setModalEvalResultados(true);
  };

  // ─── CRUD AVISOS ────────────────────────────────────────────────────────────
  const handleCrearAviso = async () => {
    const clase = selectedClaseRef.current;
    const modulo = moduloAbiertoRef.current;
    if (!modulo) { setErrorMsg("Error: no hay módulo abierto"); return; }
    if (!formAviso.contenido) { setErrorMsg("Escribe el contenido del aviso"); return; }
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.from("avisos_modulo").insert({
      modulo_id: modulo.id, titulo: formAviso.titulo, contenido: formAviso.contenido,
      tipo: formAviso.tipo, link_contenido: formAviso.link_contenido || null,
    });
    if (error) { setErrorMsg("Error al crear aviso: " + error.message); setLoading(false); return; }
    setModalAddElemento(false);
    setModalAddElementoTipo("");
    setFormAviso({ titulo: "", contenido: "", tipo: "info", link_contenido: "" });
    if (clase) {
      await fetchModulos(clase.id);
      const { data: updated, error: fetchErr } = await supabase
        .from("modulos_clase")
        .select("*, avisos_modulo(*)")
        .eq("id", modulo.id)
        .single();
      if (!fetchErr && updated) {
        setModuloAbierto(updated);
        moduloAbiertoRef.current = updated;
      }
    }
    setLoading(false);
  };

  const handleEliminarAviso = async (avisoId: string) => {
    const clase = selectedClaseRef.current;
    const modulo = moduloAbiertoRef.current;
    await supabase.from("avisos_modulo").delete().eq("id", avisoId);
    if (clase && modulo) {
      await fetchModulos(clase.id);
      const { data: updated, error } = await supabase
        .from("modulos_clase")
        .select("*, avisos_modulo(*)")
        .eq("id", modulo.id)
        .single();
      if (!error && updated) {
        setModuloAbierto(updated);
        moduloAbiertoRef.current = updated;
      }
    }
  };

  // ─── MATRÍCULA ──────────────────────────────────────────────────────────────
  const toggleMatricula = async (alumnoId: string) => {
    const clase = selectedClaseRef.current;
    const estaInscrito = inscritosIds.includes(alumnoId);
    if (estaInscrito) await supabase.from("inscripciones").delete().eq("clase_id", clase?.id).eq("alumno_id", alumnoId);
    else await supabase.from("inscripciones").insert({ clase_id: clase?.id, alumno_id: alumnoId });
    const { data: iData } = await supabase.from("inscripciones").select("alumno_id").eq("clase_id", clase?.id);
    setInscritosIds(iData?.map(i => i.alumno_id) || []);
  };

  const tareasDelModulo = (moduloId: string) => tareas.filter(t => t.modulo_id === moduloId);
  const evaluacionesDelModulo = (moduloId: string) => evaluaciones.filter(e => e.modulo_id === moduloId);

  const abrirModulo = async (m: Modulo) => {
    const { data, error } = await supabase
      .from("modulos_clase")
      .select("*, avisos_modulo(*)")
      .eq("id", m.id)
      .single();
    if (!error && data) {
      setModuloAbierto(data);
      moduloAbiertoRef.current = data;
    } else {
      setModuloAbierto(m);
      moduloAbiertoRef.current = m;
    }
  };

  const abrirModalAgregar = (tipo: "tarea" | "evaluacion" | "aviso") => {
    setErrorMsg("");
    setModalAddElementoTipo(tipo);
    setModalAddElemento(true);
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
            <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>ITP <span style={{ color: "#00C853" }}>LMS</span></span>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {[
              { label: "Mis Asignaturas", icon: <BookOpen size={18} />, v: "dashboard" },
              { label: "Estudiantes",     icon: <Globe size={18} />,    v: "estudiantes" },
              { label: "Calendario",      icon: <Calendar size={18} />, v: "calendario" },
              { label: "Calificaciones",  icon: <CheckCircle size={18} />, v: "calificar" },
            ].map((item) => (
              <button key={item.v} onClick={() => setView(item.v as any)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  background: view === item.v || (view === "detalle-clase" && item.v === "dashboard") ? "#00C853" : "transparent",
                  color:      view === item.v || (view === "detalle-clase" && item.v === "dashboard") ? "white"    : "#6b9e7e" }}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 20 }}>
            <p style={{ color: "white",   fontSize: 13, fontWeight: 600, padding: "8px 16px" }}>{nombreDocente}</p>
            <p style={{ color: "#00C853", fontSize: 11, padding: "0 16px 8px", textTransform: "uppercase", letterSpacing: "1px" }}>Docente</p>
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
            <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>ITP <span style={{ color: "#00C853" }}>LMS</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6b9e7e", fontSize: 12, fontWeight: 600 }}>{nombreDocente}</span>
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
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          {errorMsg && (
            <div style={{ background: "#ffebee", border: "1px solid #fecdd3", borderRadius: 12, padding: "12px 20px", marginBottom: 24, color: "#ff5252", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {errorMsg}
              <button onClick={() => setErrorMsg("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#ff5252" }}><X size={14} /></button>
            </div>
          )}

          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: isMobile ? 24 : 40, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 0 }}>
            <div>
              <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>Portal Docente</p>
              <h1 style={{ color: "#0d1b2a", fontSize: isMobile ? 24 : 32, fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>
                {view === "dashboard"     && "Mis Asignaturas"}
                {view === "estudiantes"  && "Estudiantes"}
                {view === "calificar"    && "Calificaciones"}
                {view === "calendario"   && "Calendario de Entregas"}
                {view === "detalle-clase" && selectedClase?.nombre}
              </h1>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {view === "dashboard" && (
                <button onClick={() => setModalClase(true)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d1b2a", color: "white", border: "none", borderRadius: 12, padding: isMobile ? "10px 16px" : "12px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <Plus size={16} /> Nueva Asignatura
                </button>
              )}
              {view === "detalle-clase" && (
                <>
                  <button onClick={() => setView("dashboard")}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "white", color: "#0d1b2a", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: isMobile ? "8px 12px" : "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <ArrowLeft size={16} /> {isMobile ? "" : "Volver"}
                  </button>
                  <button onClick={() => setModalMatricula(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "white", color: "#0d1b2a", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: isMobile ? "8px 12px" : "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <UserPlus size={16} /> {isMobile ? "" : "Matricular"}
                  </button>
                  <button onClick={() => setModalModulo(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "#00C853", color: "white", border: "none", borderRadius: 12, padding: isMobile ? "8px 12px" : "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <Layers size={16} /> {isMobile ? "" : "Nuevo Módulo"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── DASHBOARD ───────────────────────────────────────────────────── */}
          {view === "dashboard" && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {clases.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#6b9e7e", fontSize: 14, background: "white", borderRadius: 22 }}>
                  No hay asignaturas creadas. Crea la primera.
                </div>
              )}
              {clases.map(c => (
                <div key={c.id} style={{ background: "white", borderRadius: 22, padding: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ background: "#e8f5e9", width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <BookOpen size={22} color="#00C853" />
                  </div>
                  <h3 style={{ color: "#0d1b2a", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{c.nombre}</h3>
                  <p style={{ color: "#6b9e7e", fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>{c.descripcion || "Sin descripción"}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => entrarAClase(c)} style={{ flex: 1, background: "#0d1b2a", color: "white", border: "none", borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Gestionar</button>
                    <button onClick={() => handleEliminarClase(c.id)} style={{ background: "#ffebee", color: "#ff5252", border: "none", borderRadius: 10, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── ESTUDIANTES ─────────────────────────────────────────────────── */}
          {view === "estudiantes" && (
            <div style={{ background: "white", borderRadius: 22, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ color: "#0d1b2a", fontSize: 15, fontWeight: 600, margin: 0 }}>Estudiantes registrados</h3>
                <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980 }}>Total: {estudiantesGlobal.length}</span>
              </div>
              {estudiantesGlobal.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#6b9e7e", fontSize: 14 }}>No hay estudiantes registrados.</div>}
              {estudiantesGlobal.map((est, i) => (
                <div key={est.id} style={{ padding: "16px 28px", display: "flex", alignItems: "center", gap: 16, borderBottom: i < estudiantesGlobal.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#0d1b2a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{est.nombre?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 600, margin: 0 }}>{est.nombre}</p>
                    <p style={{ color: "#6b9e7e", fontSize: 12, margin: 0 }}>Estudiante</p>
                  </div>
                  <span style={{ marginLeft: "auto", background: "#e8f5e9", color: "#00C853", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980 }}>Activo</span>
                </div>
              ))}
            </div>
          )}

          {/* ── CALENDARIO ──────────────────────────────────────────────────── */}
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 24 }}>
                {diasSemana.map((dia, i) => {
                  const tareasDelDia = tareasPorDia(dia);
                  const esHoy = dia.getTime() === hoy.getTime();
                  return (
                    <div key={i} style={{ background: esHoy ? "#0d1b2a" : "white", borderRadius: 16, padding: "14px 10px", border: esHoy ? "2px solid #00C853" : "1px solid rgba(0,0,0,0.06)", minHeight: 130 }}>
                      <p style={{ color: esHoy ? "#00C853" : "#6b9e7e", fontSize: 10, fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px", textAlign: "center" }}>{nombresDias[i]}</p>
                      <p style={{ color: esHoy ? "white" : "#0d1b2a", fontSize: 20, fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>{dia.getDate()}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {tareasDelDia.map(t => (
                          <div key={t.id} style={{ background: getColorClase(t.clase_id) + "22", borderLeft: `3px solid ${getColorClase(t.clase_id)}`, borderRadius: 6, padding: "4px 6px" }}>
                            <p style={{ color: getColorClase(t.clase_id), fontSize: 9, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.titulo}</p>
                            <p style={{ color: "#4a7c6f", fontSize: 8, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.clase_nombre}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: "white", borderRadius: 22, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "#0d1b2a", fontSize: 15, fontWeight: 700, margin: 0 }}>Entregas de esta semana</h3>
                  <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980 }}>{tareasEstaSemana.length} tarea{tareasEstaSemana.length !== 1 ? "s" : ""}</span>
                </div>
                {tareasEstaSemana.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#6b9e7e", fontSize: 14 }}>No hay entregas programadas para esta semana.</div>
                ) : tareasEstaSemana.map((t, i) => {
                  const color = getColorClase(t.clase_id);
                  const fechaEntrega = new Date(t.fecha_entrega);
                  const esPasada = fechaEntrega < new Date();
                  return (
                    <div key={t.id} style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16, borderBottom: i < tareasEstaSemana.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                      <div style={{ width: 4, height: 48, borderRadius: 4, background: color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>{t.titulo}</p>
                        <p style={{ color: "#6b9e7e", fontSize: 12, margin: 0 }}>{t.clase_nombre}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: esPasada ? "#ff5252" : "#0d1b2a", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{fechaEntrega.toLocaleDateString()}</p>
                        <p style={{ color: "#6b9e7e", fontSize: 11, margin: 0 }}>{fechaEntrega.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <span style={{ background: esPasada ? "#ffebee" : "#e8f5e9", color: esPasada ? "#ff5252" : "#00C853", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 980 }}>{esPasada ? "Vencida" : "Activa"}</span>
                      <button onClick={() => { const clase = clases.find(c => c.id === t.clase_id); if (clase) entrarAClase(clase); }}
                        style={{ background: "#f0faf5", color: "#0d1b2a", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Ver clase</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CALIFICACIONES ──────────────────────────────────────────────── */}
          {view === "calificar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {clases.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#6b9e7e", fontSize: 14, background: "white", borderRadius: 22 }}>No hay asignaturas creadas aún.</div>}
              {clases.map(c => (
                <div key={c.id} style={{ background: "white", borderRadius: 22, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div style={{ padding: "16px 24px", background: "#f0faf5", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <BookOpen size={16} color="#00C853" />
                      <h3 style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700, margin: 0 }}>{c.nombre}</h3>
                    </div>
                    <button onClick={() => entrarAClase(c)} style={{ background: "#00C853", color: "white", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Ver módulos</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── DETALLE CLASE: MÓDULOS ───────────────────────────────────────── */}
          {view === "detalle-clase" && (
            <div>
              {modulos.length === 0 ? (
                <div style={{ textAlign: "center", padding: 80, color: "#6b9e7e", fontSize: 14, background: "white", borderRadius: 22, border: "2px dashed rgba(0,0,0,0.08)" }}>
                  <Layers size={40} color="#e2e8f0" style={{ marginBottom: 16 }} />
                  <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#4a7c6f" }}>No hay módulos creados</p>
                  <p style={{ margin: 0 }}>Crea el primero con el botón "Nuevo Módulo"</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {modulos.map((m, idx) => {
                    const tCount = tareasDelModulo(m.id).length;
                    const eCount = evaluacionesDelModulo(m.id).length;
                    const aCount = getAvisos(m).length;
                    return (
                      <div key={m.id} onClick={() => abrirModulo(m)}
                        style={{ background: "white", borderRadius: 22, padding: 28, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", transition: "box-shadow 0.2s", position: "relative" }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,200,83,0.12)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                          <div style={{ background: "#00C853", color: "white", width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
                            {idx + 1}
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={e => { e.stopPropagation(); setEditingModulo(m); setFormEditModulo({ titulo: m.titulo, descripcion: m.descripcion || "" }); setModalEditModulo(true); }}
                              style={{ background: "#f0faf5", color: "#4a7c6f", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                              <Edit3 size={13} />
                            </button>
                            <button onClick={e => { e.stopPropagation(); handleEliminarModulo(m.id); }}
                              style={{ background: "#ffebee", color: "#ff5252", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <h3 style={{ color: "#0d1b2a", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{m.titulo}</h3>
                        {m.descripcion && <p style={{ color: "#6b9e7e", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{m.descripcion}</p>}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                          {tCount > 0 && <span style={{ background: "#e0f2f1", color: "#00BFA5", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 980, display: "flex", alignItems: "center", gap: 4 }}><FileText size={10} /> {tCount} tarea{tCount > 1 ? "s" : ""}</span>}
                          {eCount > 0 && <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 980, display: "flex", alignItems: "center", gap: 4 }}><ClipboardList size={10} /> {eCount} eval{eCount > 1 ? "s" : "."}</span>}
                          {aCount > 0 && <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 980, display: "flex", alignItems: "center", gap: 4 }}><Bell size={10} /> {aCount} aviso{aCount > 1 ? "s" : ""}</span>}
                        </div>
                        <p style={{ color: "#00C853", fontSize: 12, fontWeight: 600, margin: 0 }}>Abrir módulo →</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: CONTENIDO DEL MÓDULO
          ── maxWidth subido a 960px ──
      ════════════════════════════════════════════════════════════════════ */}
      {moduloAbierto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: isMobile ? "flex-end" : "flex-start", justifyContent: "center", padding: isMobile ? 0 : "32px 24px", overflowY: "auto" }}>
          <div style={{ background: "#f0faf5", borderRadius: isMobile ? "24px 24px 0 0" : 28, width: "100%", maxWidth: isMobile ? "100%" : 960, margin: isMobile ? 0 : "auto", maxHeight: isMobile ? "92vh" : "none", overflowY: "auto" }}>

            <div style={{ background: "white", borderRadius: "28px 28px 0 0", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div>
                <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 4px" }}>Módulo</p>
                <h2 style={{ color: "#0d1b2a", fontSize: 24, fontWeight: 800, margin: 0 }}>{moduloAbierto.titulo}</h2>
                {moduloAbierto.descripcion && <p style={{ color: "#4a7c6f", fontSize: 13, margin: "6px 0 0" }}>{moduloAbierto.descripcion}</p>}
              </div>
              <button onClick={() => setModuloAbierto(null)}
                style={{ background: "#f0faf5", border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>
                <X size={18} color="#4a7c6f" />
              </button>
            </div>

            {/* Botones agregar */}
            <div style={{ padding: "20px 32px 0" }}>
              <p style={{ color: "#0d1b2a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Agregar al Módulo</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { tipo: "tarea",      label: "Nueva Tarea",      icon: <FileText size={14} />,     bg: "#e0f2f1", color: "#00BFA5" },
                  { tipo: "evaluacion", label: "Nueva Evaluación", icon: <ClipboardList size={14} />, bg: "#e8f5e9", color: "#00C853" },
                  { tipo: "aviso",      label: "Nuevo Aviso",      icon: <Bell size={14} />,          bg: "#e8f5e9", color: "#00C853" },
                ].map(btn => (
                  <button key={btn.tipo}
                    onClick={() => abrirModalAgregar(btn.tipo as any)}
                    style={{ display: "flex", alignItems: "center", gap: 7, background: btn.bg, color: btn.color, border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── TAREAS ─────────────────────────────────────────────────────── */}
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
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <h4 style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700, margin: 0 }}>{t.titulo}</h4>
                            {t.link_contenido && (
                              <span style={{ background: "#e0f2f1", color: "#00897B", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 980, display: "flex", alignItems: "center", gap: 3 }}>
                                <Video size={9} /> Video
                              </span>
                            )}
                            {t.archivo_url && (
                              <span style={{ background: "#e0f2f1", color: "#00BFA5", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 980, display: "flex", alignItems: "center", gap: 3 }}>
                                <FileText size={9} /> Adjunto
                              </span>
                            )}
                          </div>
                          <p style={{ color: "#4a7c6f", fontSize: 12, margin: "0 0 6px", lineHeight: 1.4 }}>{t.descripcion}</p>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b9e7e", fontSize: 11 }}>
                            <Clock size={11} color="#00C853" /> {t.fecha_entrega ? new Date(t.fecha_entrega).toLocaleString() : "Sin fecha"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                          <button onClick={() => verEntregas(t)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#e0f2f1", color: "#00BFA5", border: "none", borderRadius: 9, padding: "7px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}><Users size={12} /> Entregas</button>
                          <button onClick={() => { setEditingTarea(t); setFormEditTarea({ titulo: t.titulo, desc: t.descripcion, fecha: t.fecha_entrega?.slice(0, 16) || "", link_contenido: t.link_contenido || "" }); }}
                            style={{ background: "#e8f5e9", color: "#00C853", border: "none", borderRadius: 9, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" }}><Edit3 size={12} /></button>
                          <button onClick={() => handleEliminarTarea(t.id)} style={{ background: "#ffebee", color: "#ff5252", border: "none", borderRadius: 9, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={12} /></button>
                        </div>
                      </div>
                      {t.archivo_url && (
                        <div style={{ marginTop: 10, padding: "10px 14px", background: "#e0f2f1", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                          <FileText size={14} color="#00BFA5" />
                          <a href={t.archivo_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: "#00BFA5", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                            Ver material adjunto
                          </a>
                        </div>
                      )}
                      {t.link_contenido && <UniversalPlayer url={t.link_contenido} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── EVALUACIONES ────────────────────────────────────────────────── */}
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
                          <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 980 }}>{ev.preguntas?.length || 0} pregs.</span>
                        </div>
                        <p style={{ color: "#4a7c6f", fontSize: 12, margin: "0 0 6px" }}>{ev.descripcion || "Sin descripción"}</p>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b9e7e", fontSize: 11 }}>
                          <Calendar size={11} color="#00C853" /> Apertura: {new Date(ev.fecha_apertura).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 7 }}>
                        <button onClick={() => verResultadosEvaluacion(ev)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#e0f2f1", color: "#00BFA5", border: "none", borderRadius: 9, padding: "7px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}><Users size={12} /> Calificaciones</button>
                        <button onClick={() => handleEliminarEvaluacion(ev.id)} style={{ background: "#ffebee", color: "#ff5252", border: "none", borderRadius: 9, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── AVISOS ──────────────────────────────────────────────────────── */}
            <div style={{ padding: "24px 32px 32px" }}>
              <p style={{ color: "#0d1b2a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={13} color="#00C853" /> Avisos
                <span style={{ background: "#e8f5e9", color: "#00C853", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 980 }}>{getAvisos(moduloAbierto).length}</span>
              </p>
              {getAvisos(moduloAbierto).length === 0 ? (
                <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", color: "#6b9e7e", fontSize: 13, textAlign: "center" }}>Sin avisos en este módulo.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {getAvisos(moduloAbierto).map((av: Aviso) => {
                    const colors = avisoColors[av.tipo];
                    return (
                      <div key={av.id} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, padding: "12px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                            <span style={{ fontSize: 16 }}>{colors.icon}</span>
                            <div>
                              {av.titulo && (
                                <p style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.3 }}>{av.titulo}</p>
                              )}
                              <p style={{ color: "#0d2618", fontSize: 13, fontWeight: 400, margin: 0, lineHeight: 1.5 }}>{av.contenido}</p>
                            </div>
                          </div>
                          <button onClick={() => handleEliminarAviso(av.id)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#4a7c6f", flexShrink: 0, padding: "2px" }}>
                            <X size={13} />
                          </button>
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
          MODAL: AGREGAR ELEMENTO
      ════════════════════════════════════════════════════════════════════ */}
      {modalAddElemento && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflowY: "auto" }}>
          <div style={{ background: "white", borderRadius: 28, padding: 40, width: "100%", maxWidth: modalAddElementoTipo === "evaluacion" ? 650 : 480, margin: "auto", maxHeight: "90vh", overflowY: "auto" }}>

            {/* ── FORM TAREA ── */}
            {modalAddElementoTipo === "tarea" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                  <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Nueva Tarea</h3>
                  <button onClick={() => { setModalAddElemento(false); setModalAddElementoTipo(""); }} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
                </div>
                <p style={{ color: "#6b9e7e", fontSize: 12, margin: "0 0 20px" }}>Se agregará al módulo: <strong style={{ color: "#0d1b2a" }}>{moduloAbierto?.titulo}</strong></p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input placeholder="Título de la tarea" value={formTarea.titulo} onChange={e => setFormTarea({ ...formTarea, titulo: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a" }} />
                  <textarea placeholder="Instrucciones..." value={formTarea.desc} onChange={e => setFormTarea({ ...formTarea, desc: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", minHeight: 90, resize: "none" }} />
                  <div>
                    <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Fecha de entrega</label>
                    <input type="datetime-local" value={formTarea.fecha} onChange={e => setFormTarea({ ...formTarea, fecha: e.target.value })} style={{ width: "100%", background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <VideoLinkField value={formTarea.link_contenido} onChange={v => setFormTarea({ ...formTarea, link_contenido: v })} />
                  {formTarea.link_contenido && detectVideoType(formTarea.link_contenido) !== "unknown" && (
                    <UniversalPlayer url={formTarea.link_contenido} />
                  )}
                  <div style={{ background: "#f0faf5", border: "2px dashed rgba(0,0,0,0.08)", borderRadius: 12, padding: "20px", textAlign: "center" }}>
                    <label style={{ fontSize: 12, color: file ? "#0d1b2a" : "#6b9e7e", fontWeight: 500, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <FileText size={20} color={file ? "#00BFA5" : "#6b9e7e"} />
                      {file ? file.name : "Adjuntar material (PDF, DOCX, etc.) — opcional"}
                      <input type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] || null)} />
                    </label>
                    {file && (
                      <button onClick={() => setFile(null)} style={{ marginTop: 8, background: "#ffebee", color: "#ff5252", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>
                        Quitar archivo
                      </button>
                    )}
                  </div>
                  <button onClick={handleCrearTarea} disabled={loading} style={{ background: loading ? "rgba(0,200,83,0.5)" : "#00C853", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{loading ? "Publicando..." : "Publicar Tarea"}</button>
                  <button onClick={() => { setModalAddElemento(false); setModalAddElementoTipo(""); }} style={{ background: "transparent", color: "#6b9e7e", border: "none", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
                </div>
              </>
            )}

            {/* ── FORM AVISO ── */}
            {modalAddElementoTipo === "aviso" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Nuevo Aviso</h3>
                  <button onClick={() => { setModalAddElemento(false); setModalAddElementoTipo(""); }} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
                </div>
                <p style={{ color: "#6b9e7e", fontSize: 13, marginBottom: 24 }}>Para: <strong style={{ color: "#0d1b2a" }}>{moduloAbierto?.titulo}</strong></p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Tipo de Aviso</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {(["info", "alerta", "exito"] as const).map(tipo => {
                        const colors = avisoColors[tipo];
                        return (
                          <button key={tipo} onClick={() => setFormAviso({ ...formAviso, tipo })}
                            style={{ padding: "10px 8px", borderRadius: 10, border: formAviso.tipo === tipo ? `2px solid ${colors.text}` : "1px solid rgba(0,0,0,0.1)", background: formAviso.tipo === tipo ? colors.bg : "white", cursor: "pointer", fontSize: 12, fontWeight: 600, color: colors.text, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 18 }}>{colors.icon}</span>
                            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <input
                    placeholder="Título del aviso (ej: ¡Fecha límite importante!)"
                    value={formAviso.titulo}
                    onChange={e => setFormAviso({ ...formAviso, titulo: e.target.value })}
                    style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a" }}
                  />
                  <textarea placeholder="Descripción del aviso..." value={formAviso.contenido} onChange={e => setFormAviso({ ...formAviso, contenido: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", minHeight: 100, resize: "none" }} />
                  <VideoLinkField value={formAviso.link_contenido} onChange={v => setFormAviso({ ...formAviso, link_contenido: v })} />
                  {formAviso.link_contenido && detectVideoType(formAviso.link_contenido) !== "unknown" && (
                    <UniversalPlayer url={formAviso.link_contenido} />
                  )}
                  <button onClick={handleCrearAviso} disabled={loading || !formAviso.contenido}
                    style={{ background: "#00C853", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Bell size={15} /> {loading ? "Publicando..." : "Publicar Aviso"}
                  </button>
                </div>
              </>
            )}

            {/* ── FORM EVALUACIÓN ── */}
            {modalAddElementoTipo === "evaluacion" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Nueva Evaluación</h3>
                  <button onClick={() => { setModalAddElemento(false); setModalAddElementoTipo(""); }} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
                </div>
                <p style={{ color: "#6b9e7e", fontSize: 12, margin: "0 0 16px" }}>Módulo: <strong style={{ color: "#0d1b2a" }}>{moduloAbierto?.titulo}</strong></p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input placeholder="Título de la evaluación" value={formEval.titulo} onChange={e => setFormEval({ ...formEval, titulo: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a" }} />
                  <textarea placeholder="Instrucciones o descripción..." value={formEval.desc} onChange={e => setFormEval({ ...formEval, desc: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", minHeight: 60, resize: "none" }} />
                  <div>
                    <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Fecha y Hora de Apertura</label>
                    <input type="datetime-local" value={formEval.fecha_apertura} onChange={e => setFormEval({ ...formEval, fecha_apertura: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", width: "100%", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h4 style={{ color: "#0d1b2a", fontSize: 15, fontWeight: 700, margin: 0 }}>Preguntas ({preguntas.length})</h4>
                      <button type="button" onClick={addPregunta} style={{ background: "#0d1b2a", color: "white", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Añadir</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {preguntas.map((p, idx) => (
                        <div key={p.id} style={{ background: "#f0faf5", borderRadius: 16, padding: 18, border: "1px solid rgba(0,0,0,0.06)", position: "relative" }}>
                          <button type="button" onClick={() => removePregunta(p.id)} style={{ position: "absolute", top: 14, right: 14, background: "transparent", color: "#ff5252", border: "none", cursor: "pointer" }}><Trash2 size={15} /></button>
                          <div style={{ marginBottom: 10, paddingRight: 24 }}>
                            <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>TIPO</label>
                            <select value={p.tipo} onChange={e => updatePregunta(p.id, "tipo", e.target.value as any)} style={{ width: "100%", background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#0d1b2a" }}>
                              <option value="icfes">ICFES (Opción Múltiple)</option>
                              <option value="abierta">Abierta</option>
                            </select>
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>ENUNCIADO</label>
                            <textarea placeholder={`Pregunta #${idx + 1}...`} value={p.enunciado} onChange={e => updatePregunta(p.id, "enunciado", e.target.value)} style={{ width: "100%", background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "8px 10px", fontSize: 12, outline: "none", minHeight: 50, resize: "none" }} />
                          </div>
                          {p.tipo === "icfes" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600 }}>OPCIONES Y RESPUESTA CORRECTA</label>
                              {["A", "B", "C", "D"].map((letter, optIdx) => (
                                <div key={letter} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input type="radio" name={`correct-${p.id}`} checked={p.correcta === optIdx} onChange={() => updatePregunta(p.id, "correcta", optIdx)} style={{ accentColor: "#00C853" }} />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0d1b2a" }}>{letter}.</span>
                                  <input placeholder={`Opción ${letter}`} value={p.opciones[optIdx] || ""} onChange={e => { const o = [...p.opciones]; o[optIdx] = e.target.value; updatePregunta(p.id, "opciones", o); }} style={{ flex: 1, background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 7, padding: "7px 10px", fontSize: 12, color: "#0d1b2a" }} />
                                </div>
                              ))}
                            </div>
                          )}
                          {p.tipo === "abierta" && (
                            <div>
                              <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>MODO DE CORRECCIÓN</label>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button type="button" onClick={() => updatePregunta(p.id, "modoCorreccion", "auto")} style={{ flex: 1, padding: "8px", borderRadius: 9, fontSize: 11, fontWeight: 600, cursor: "pointer", border: p.modoCorreccion === "auto" ? "2px solid #00C853" : "1px solid rgba(0,0,0,0.1)", background: p.modoCorreccion === "auto" ? "#e8f5e9" : "white", color: p.modoCorreccion === "auto" ? "#00C853" : "#4a7c6f" }}>✦ Auto</button>
                                <button type="button" onClick={() => updatePregunta(p.id, "modoCorreccion", "docente")} style={{ flex: 1, padding: "8px", borderRadius: 9, fontSize: 11, fontWeight: 600, cursor: "pointer", border: p.modoCorreccion === "docente" ? "2px solid #0d1b2a" : "1px solid rgba(0,0,0,0.1)", background: p.modoCorreccion === "docente" ? "#0d1b2a" : "white", color: p.modoCorreccion === "docente" ? "white" : "#4a7c6f" }}>👤 Docente</button>
                              </div>
                              {p.modoCorreccion === "auto" && (
                                <div style={{ background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 10, padding: 12, marginTop: 10 }}>
                                  <input placeholder="Palabras clave (separadas por comas)" value={p.palabrasClave} onChange={e => updatePregunta(p.id, "palabrasClave", e.target.value)} style={{ width: "100%", background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 7, padding: "8px 10px", fontSize: 12, color: "#0d1b2a", boxSizing: "border-box", outline: "none" }} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleCrearEvaluacion} disabled={loading} style={{ background: loading ? "rgba(0,200,83,0.5)" : "#00C853", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 6 }}>{loading ? "Publicando..." : "Publicar Evaluación"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ════ MODAL CREAR CLASE ════ */}
      {modalClase && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 28, padding: 40, width: "100%", maxWidth: 440 }}>
            <h3 style={{ color: "#0d1b2a", fontSize: 24, fontWeight: 800, marginBottom: 28 }}>Nueva Asignatura</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Nombre de la asignatura" value={formClase.nombre} onChange={e => setFormClase({ ...formClase, nombre: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a" }} />
              <textarea placeholder="Descripción..." value={formClase.desc} onChange={e => setFormClase({ ...formClase, desc: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", minHeight: 100, resize: "none" }} />
              <button onClick={handleCrearClase} disabled={loading} style={{ background: loading ? "rgba(0,200,83,0.5)" : "#00C853", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{loading ? "Guardando..." : "Crear Asignatura"}</button>
              <button onClick={() => setModalClase(false)} style={{ background: "transparent", color: "#6b9e7e", border: "none", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL CREAR MÓDULO ════ */}
      {modalModulo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 28, padding: 40, width: "100%", maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Nuevo Módulo</h3>
              <button onClick={() => setModalModulo(false)} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Título del módulo (ej: Corte 1 – Introducción)" value={formModulo.titulo} onChange={e => setFormModulo({ ...formModulo, titulo: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a" }} />
              <textarea placeholder="Descripción del módulo..." value={formModulo.descripcion} onChange={e => setFormModulo({ ...formModulo, descripcion: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", minHeight: 80, resize: "none" }} />
              <button onClick={handleCrearModulo} disabled={loading || !formModulo.titulo}
                style={{ background: loading ? "rgba(15,23,42,0.4)" : "#0d1b2a", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Save size={16} /> {loading ? "Guardando..." : "Crear Módulo"}
              </button>
              <button onClick={() => setModalModulo(false)} style={{ background: "transparent", color: "#6b9e7e", border: "none", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL EDITAR MÓDULO ════ */}
      {modalEditModulo && editingModulo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 28, padding: 40, width: "100%", maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Editar Módulo</h3>
              <button onClick={() => { setModalEditModulo(false); setEditingModulo(null); }} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Título" value={formEditModulo.titulo} onChange={e => setFormEditModulo({ ...formEditModulo, titulo: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a" }} />
              <textarea placeholder="Descripción..." value={formEditModulo.descripcion} onChange={e => setFormEditModulo({ ...formEditModulo, descripcion: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", minHeight: 80, resize: "none" }} />
              <button onClick={async () => { await handleGuardarModulo(); setModalEditModulo(false); }} disabled={loading}
                style={{ background: "#00C853", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Save size={16} /> {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button onClick={() => { setModalEditModulo(false); setEditingModulo(null); }} style={{ background: "transparent", color: "#6b9e7e", border: "none", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL EDITAR TAREA ════ */}
      {editingTarea && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflowY: "auto" }}>
          <div style={{ background: "white", borderRadius: 28, padding: 40, width: "100%", maxWidth: 480, margin: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Editar Tarea</h3>
              <button onClick={() => setEditingTarea(null)} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Título" value={formEditTarea.titulo} onChange={e => setFormEditTarea({ ...formEditTarea, titulo: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a" }} />
              <textarea placeholder="Instrucciones..." value={formEditTarea.desc} onChange={e => setFormEditTarea({ ...formEditTarea, desc: e.target.value })} style={{ background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0d1b2a", minHeight: 90, resize: "none" }} />
              <div>
                <label style={{ color: "#4a7c6f", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Fecha de entrega</label>
                <input type="datetime-local" value={formEditTarea.fecha} onChange={e => setFormEditTarea({ ...formEditTarea, fecha: e.target.value })} style={{ width: "100%", background: "#f0faf5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <VideoLinkField value={formEditTarea.link_contenido} onChange={v => setFormEditTarea({ ...formEditTarea, link_contenido: v })} />
              {formEditTarea.link_contenido && detectVideoType(formEditTarea.link_contenido) !== "unknown" && (
                <UniversalPlayer url={formEditTarea.link_contenido} />
              )}
              <button onClick={handleGuardarTarea} disabled={loading} style={{ background: loading ? "rgba(0,200,83,0.5)" : "#00C853", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{loading ? "Guardando..." : "Guardar Cambios"}</button>
              <button onClick={() => setEditingTarea(null)} style={{ background: "transparent", color: "#6b9e7e", border: "none", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL MATRICULAR ════ */}
      {modalMatricula && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 28, padding: 40, width: "100%", maxWidth: 440, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Matricular Alumnos</h3>
              <button onClick={() => setModalMatricula(false)} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
            </div>
            {estudiantesGlobal.length === 0 && <p style={{ color: "#6b9e7e", fontSize: 14, textAlign: "center", padding: 20 }}>No hay estudiantes registrados.</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {estudiantesGlobal.map(est => {
                const isInc = inscritosIds.includes(est.id);
                return (
                  <div key={est.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#f0faf5", borderRadius: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#0d1b2a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{est.nombre?.charAt(0).toUpperCase()}</div>
                      <span style={{ color: "#0d1b2a", fontSize: 13, fontWeight: 600 }}>{est.nombre}</span>
                    </div>
                    <button onClick={() => toggleMatricula(est.id)} style={{ background: isInc ? "#ffebee" : "#0d1b2a", color: isInc ? "#ff5252" : "white", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {isInc ? "Retirar" : "Inscribir"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL CALIFICAR ENTREGAS ════ */}
      {modalCalificar && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 28, padding: 40, width: "100%", maxWidth: 560, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Entregas</h3>
                <p style={{ color: "#6b9e7e", fontSize: 13, margin: "4px 0 0" }}>{selectedTarea?.titulo}</p>
              </div>
              <button onClick={() => setModalCalificar(false)} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
            </div>
            {entregas.length === 0 ? (
              <p style={{ color: "#6b9e7e", fontSize: 14, textAlign: "center", padding: 40 }}>Ningún estudiante ha entregado aún.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {entregas.map(e => (
                  <div key={e.id} style={{ background: "#f0faf5", borderRadius: 16, padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700 }}>{e.alumno_nombre}</span>
                      {e.nota !== null ? (
                        <span style={{ background: parseFloat(String(e.nota)) >= 35 ? "#e8f5e9" : parseFloat(String(e.nota)) >= 25 ? "#fef3c7" : "#ffebee", color: parseFloat(String(e.nota)) >= 35 ? "#00C853" : parseFloat(String(e.nota)) >= 25 ? "#f59e0b" : "#ff5252", fontWeight: 700, fontSize: 14, padding: "4px 14px", borderRadius: 980 }}>Nota: {e.nota} / 50</span>
                      ) : (
                        <span style={{ background: "#fef9c3", color: "#854d0e", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980 }}>Sin calificar</span>
                      )}
                    </div>
                    {e.archivo_url && (
                      <a href={e.archivo_url} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#00BFA5", fontSize: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 8, background: "#e0f2f1", padding: "6px 12px", borderRadius: 8, width: "fit-content" }}>
                        <FileText size={13} color="#00BFA5" /> Ver archivo entregado
                      </a>
                    )}
                    {e.comentario && (
                      <div style={{ background: "white", borderRadius: 10, padding: "10px 14px", marginBottom: 10, border: "1px solid rgba(0,0,0,0.06)" }}>
                        <p style={{ color: "#6b9e7e", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Comentario del estudiante</p>
                        <p style={{ color: "#1a3a2a", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{e.comentario}</p>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="number" min="0" max="50" step="0.1" placeholder="Nota (0-50)" value={nota} onChange={e => setNota(e.target.value)} style={{ flex: 1, background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none" }} />
                      <button onClick={() => handleCalificar(e.id)} style={{ background: "#00C853", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Star size={13} /> Calificar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ MODAL RESULTADOS EVALUACIÓN ════ */}
      {modalEvalResultados && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 28, padding: 40, width: "100%", maxWidth: 560, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <h3 style={{ color: "#0d1b2a", fontSize: 22, fontWeight: 800, margin: 0 }}>Resultados del Examen</h3>
                <p style={{ color: "#6b9e7e", fontSize: 13, margin: "4px 0 0" }}>{evaluacionSeleccionada?.titulo}</p>
              </div>
              <button onClick={() => setModalEvalResultados(false)} style={{ background: "#f0faf5", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><X size={16} /></button>
            </div>
            {respuestasDocente.length === 0 ? (
              <p style={{ color: "#6b9e7e", fontSize: 14, textAlign: "center", padding: 40 }}>Ningún estudiante ha completado este examen aún.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {respuestasDocente.map(resp => (
                  <div key={resp.id} style={{ background: "#f0faf5", borderRadius: 16, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#0d1b2a", fontSize: 14, fontWeight: 700 }}>{resp.alumno_nombre}</span>
                    <span style={{ background: resp.nota >= 35 ? "#e8f5e9" : resp.nota >= 25 ? "#fef3c7" : "#ffebee", color: resp.nota >= 35 ? "#00C853" : resp.nota >= 25 ? "#f59e0b" : "#ff5252", fontWeight: 700, fontSize: 15, padding: "6px 16px", borderRadius: 980 }}>
                      {parseFloat(resp.nota).toFixed(1)} / 50.0
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── BARRA INFERIOR MÓVIL ── */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#060d14", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0 14px", zIndex: 50 }}>
          {[
            { label: "Asignaturas", icon: <BookOpen size={20} />, v: "dashboard" },
            { label: "Estudiantes", icon: <Globe size={20} />,    v: "estudiantes" },
            { label: "Calendario",  icon: <Calendar size={20} />, v: "calendario" },
            { label: "Notas",       icon: <CheckCircle size={20} />, v: "calificar" },
          ].map(item => {
            const active = view === item.v || (view === "detalle-clase" && item.v === "dashboard");
            return (
              <button key={item.v} onClick={() => setView(item.v as any)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", cursor: "pointer", padding: "4px 12px" }}>
                <span style={{ color: active ? "#00C853" : "#6b9e7e" }}>{item.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: active ? "#00C853" : "#6b9e7e" }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

    </div>
  );
}