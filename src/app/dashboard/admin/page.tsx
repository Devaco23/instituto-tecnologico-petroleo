"use client";

import { useState, useEffect } from "react";
import { LogOut, ShieldCheck, Trash2, Edit3, Save, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

// ─── PALETA ITP ───────────────────────────────────────────────────────────────
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
  muted:     "#64748b",
  mutedLight:"rgba(255,255,255,0.5)",
  danger:    "#ef4444",
  dangerBg:  "#fff1f2",
  warn:      "#f59e0b",
  warnBg:    "#fef3c7",
} as const;

// ─── Emil: custom easings ─────────────────────────────────────────────────────
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

const roleConfig = {
  admin:      { bg: C.greenBg,  color: C.green,    label: "Admin" },
  docente:    { bg: C.tealBg,   color: C.greenMid, label: "Docente" },
  estudiante: { bg: C.greenBg,  color: C.greenDark,label: "Estudiante" },
} as const;

export default function AdminDashboard() {
  const router = useRouter();
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPass, setNewUserPass] = useState("");
  const [newUserRole, setNewUserRole] = useState("estudiante");
  const [newUserNombre, setNewUserNombre] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState("");
  const [editingNombre, setEditingNombre] = useState("");

  useEffect(() => { fetchUsuarios(); }, []);

  const fetchUsuarios = async () => {
    const { data } = await supabase
      .from("profiles_with_email")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsuarios(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: newUserEmail,
      password: newUserPass,
      options: { data: { role: newUserRole } },
    });
    if (data.user) {
      await supabase.from("profiles").update({ nombre: newUserNombre }).eq("id", data.user.id);
    }
    setNewUserEmail(""); setNewUserPass(""); setNewUserNombre("");
    await fetchUsuarios();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await supabase.from("profiles").delete().eq("id", id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const handleEditStart = (u: any) => {
    setEditingId(u.id);
    setEditingRole(u.role);
    setEditingNombre(u.nombre || "");
  };

  const handleEditSave = async (id: string) => {
    await supabase.from("profiles").update({ role: editingRole, nombre: editingNombre }).eq("id", id);
    setEditingId(null);
    await fetchUsuarios();
  };

  // Emil: role badge helper
  const getRoleConfig = (role: string) =>
    roleConfig[role as keyof typeof roleConfig] ?? { bg: C.greenBg, color: C.green, label: role };

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "'Segoe UI', Inter, system-ui, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        background: C.navyDeep,
        borderBottom: `1px solid rgba(0,200,83,0.15)`,
        padding: isMobile ? "14px 20px" : "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.green}, ${C.greenMid})`,
            width: 38, height: 38, borderRadius: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 12px rgba(0,200,83,0.3)`,
          }}>
            <ShieldCheck size={18} color="white" />
          </div>
          <div>
            <span style={{ color: "white", fontWeight: 800, fontSize: isMobile ? 15 : 17, display: "block", lineHeight: 1.1 }}>
              Instituto Tecnico de Petroleo
            </span>
            <span style={{ color: C.green, fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Panel de Administración
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="btn-signout"
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(0,200,83,0.1)",
            border: `1px solid rgba(0,200,83,0.3)`,
            color: C.green,
            padding: isMobile ? "8px 12px" : "9px 18px",
            borderRadius: 980, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          <LogOut size={13} />
          {!isMobile && "Cerrar Sesión"}
        </button>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px 40px" : "48px 28px" }}>

        {/* Page header */}
        <div style={{ marginBottom: isMobile ? 24 : 36 }}>
          <p style={{ color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 6px" }}>
            Administración
          </p>
          <h1 style={{ color: C.navy, fontSize: isMobile ? 26 : 34, fontWeight: 900, letterSpacing: "-1px", margin: 0, lineHeight: 1 }}>
            Gestión de <span style={{ color: C.green }}>Usuarios</span>
          </h1>
        </div>

        {/* ── LAYOUT: stack on mobile, grid on desktop ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
          gap: isMobile ? 20 : 24,
          alignItems: "start",
        }}>

          {/* ── FORM ── */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          }}>
            <div style={{ padding: "20px 24px 0", borderBottom: `1px solid ${C.border}`, paddingBottom: 16, marginBottom: 20 }}>
              <p style={{ color: C.navy, fontSize: 15, fontWeight: 700, margin: 0 }}>Crear nuevo usuario</p>
              <p style={{ color: C.muted, fontSize: 12, margin: "4px 0 0" }}>Autoriza el acceso al aula virtual</p>
            </div>
            <form onSubmit={handleCreateUser} style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { ph: "Nombre completo", val: newUserNombre, set: setNewUserNombre, type: "text" },
                { ph: "Email institucional", val: newUserEmail, set: setNewUserEmail, type: "email" },
                { ph: "Contraseña", val: newUserPass, set: setNewUserPass, type: "password" },
              ].map(({ ph, val, set, type }) => (
                <input
                  key={ph}
                  type={type}
                  placeholder={ph}
                  required
                  value={val}
                  onChange={e => set(e.target.value)}
                  className="field"
                  style={{
                    background: C.pageBg,
                    border: `1px solid rgba(0,0,0,0.08)`,
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontSize: 13,
                    outline: "none",
                    color: C.navy,
                    width: "100%",
                    boxSizing: "border-box" as const,
                  }}
                />
              ))}

              {/* Role selector — pill style */}
              <div>
                <p style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Rol</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["estudiante", "docente", "admin"] as const).map(r => {
                    const cfg = getRoleConfig(r);
                    const selected = newUserRole === r;
                    return (
                      <button
                        key={r} type="button"
                        onClick={() => setNewUserRole(r)}
                        style={{
                          flex: 1,
                          padding: "9px 4px",
                          borderRadius: 10,
                          border: selected ? `2px solid ${cfg.color}` : `1px solid rgba(0,0,0,0.08)`,
                          background: selected ? cfg.bg : "white",
                          color: selected ? cfg.color : C.muted,
                          fontSize: 11, fontWeight: 700, cursor: "pointer",
                          // Emil: specify exact props, custom easing
                          transition: `background 150ms ${EASE_OUT}, border-color 150ms ${EASE_OUT}, color 150ms ${EASE_OUT}`,
                          textTransform: "capitalize",
                        }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  background: loading ? `rgba(0,200,83,0.45)` : C.green,
                  color: "white", border: "none", borderRadius: 12,
                  padding: "13px 16px", fontSize: 13, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: 4,
                  boxShadow: loading ? "none" : `0 4px 16px rgba(0,200,83,0.3)`,
                }}
              >
                {loading ? "Registrando..." : "Autorizar Acceso"}
              </button>
            </form>
          </div>

          {/* ── TABLA / CARDS ── */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p style={{ color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 2px" }}>Directorio</p>
                <h2 style={{ color: C.navy, fontSize: isMobile ? 18 : 22, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>Usuarios registrados</h2>
              </div>
              <span style={{
                background: C.greenBg, color: C.greenDark,
                fontSize: 11, fontWeight: 700, padding: "5px 14px",
                borderRadius: 980,
              }}>
                {usuarios.length} total
              </span>
            </div>

            {usuarios.length === 0 ? (
              <div style={{ background: "white", borderRadius: 20, padding: 56, textAlign: "center", color: C.muted, fontSize: 14, border: `1px solid ${C.border}` }}>
                No hay usuarios registrados aún.
              </div>
            ) : isMobile ? (
              /* ── MOBILE: card list ── */
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {usuarios.map((u, i) => {
                  const cfg = getRoleConfig(u.role);
                  const isEditing = editingId === u.id;
                  return (
                    <div
                      key={u.id}
                      style={{
                        background: "white",
                        borderRadius: 18,
                        border: `1px solid ${C.border}`,
                        padding: "18px 20px",
                        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                        // Emil: stagger entrance
                        animation: `cardIn 300ms ${EASE_OUT} ${i * 40}ms both`,
                      }}
                    >
                      {/* Header row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {isEditing ? (
                            <input
                              value={editingNombre}
                              onChange={e => setEditingNombre(e.target.value)}
                              style={{
                                background: C.pageBg, border: `1px solid rgba(0,0,0,0.1)`,
                                borderRadius: 8, padding: "8px 12px", fontSize: 14,
                                fontWeight: 700, outline: "none", width: "100%", color: C.navy,
                                boxSizing: "border-box" as const,
                              }}
                            />
                          ) : (
                            <p style={{ color: C.navy, fontSize: 15, fontWeight: 700, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {u.nombre || <span style={{ color: C.muted, fontWeight: 400 }}>Sin nombre</span>}
                            </p>
                          )}
                          <p style={{ color: C.muted, fontSize: 12, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                        </div>
                        {/* Action icons */}
                        <div style={{ display: "flex", gap: 6, marginLeft: 12, flexShrink: 0 }}>
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleEditSave(u.id)}
                                className="icon-btn"
                                style={{ background: C.greenBg, color: C.green, border: "none", borderRadius: 9, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" }}
                              >
                                <Save size={14} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="icon-btn"
                                style={{ background: C.pageBg, color: C.muted, border: "none", borderRadius: 9, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" }}
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditStart(u)}
                                className="icon-btn"
                                style={{ background: C.tealBg, color: C.greenMid, border: "none", borderRadius: 9, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" }}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(u.id)}
                                className="icon-btn"
                                style={{ background: C.dangerBg, color: C.danger, border: "none", borderRadius: 9, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {/* Role */}
                      {isEditing ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          {(["estudiante", "docente", "admin"] as const).map(r => {
                            const rc = getRoleConfig(r);
                            const sel = editingRole === r;
                            return (
                              <button key={r} onClick={() => setEditingRole(r)}
                                style={{
                                  flex: 1, padding: "7px 4px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                                  border: sel ? `2px solid ${rc.color}` : `1px solid rgba(0,0,0,0.08)`,
                                  background: sel ? rc.bg : "white", color: sel ? rc.color : C.muted,
                                  cursor: "pointer", textTransform: "capitalize",
                                  transition: `background 150ms ${EASE_OUT}, border-color 150ms ${EASE_OUT}`,
                                }}
                              >
                                {rc.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ background: cfg.bg, color: cfg.color, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 980, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {cfg.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ── DESKTOP: tabla ── */
              <div style={{
                background: "white",
                borderRadius: 20,
                border: `1px solid ${C.border}`,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.pageBg }}>
                      {["Nombre", "Email", "Rol", "Acciones"].map((h, i) => (
                        <th key={h} style={{
                          padding: "14px 20px",
                          textAlign: i === 2 ? "center" : i === 3 ? "right" : "left",
                          color: C.muted, fontSize: 11, fontWeight: 700,
                          letterSpacing: "1px", textTransform: "uppercase",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u, i) => {
                      const cfg = getRoleConfig(u.role);
                      const isEditing = editingId === u.id;
                      return (
                        <tr
                          key={u.id}
                          style={{
                            borderBottom: i < usuarios.length - 1 ? `1px solid rgba(0,0,0,0.04)` : "none",
                            // Emil: stagger row entrance
                            animation: `rowIn 250ms ${EASE_OUT} ${i * 30}ms both`,
                          }}
                        >
                          <td style={{ padding: "16px 20px", color: C.navy, fontWeight: 600 }}>
                            {isEditing ? (
                              <input
                                value={editingNombre}
                                onChange={e => setEditingNombre(e.target.value)}
                                style={{
                                  background: C.pageBg, border: `1px solid rgba(0,0,0,0.1)`,
                                  borderRadius: 8, padding: "6px 10px", fontSize: 13, outline: "none", width: "100%",
                                }}
                              />
                            ) : (
                              u.nombre || <span style={{ color: C.muted, fontWeight: 400 }}>Sin nombre</span>
                            )}
                          </td>
                          <td style={{ padding: "16px 20px", color: C.muted }}>{u.email}</td>
                          <td style={{ padding: "16px 20px", textAlign: "center" }}>
                            {isEditing ? (
                              <select
                                value={editingRole}
                                onChange={e => setEditingRole(e.target.value)}
                                style={{
                                  background: C.pageBg, border: `1px solid rgba(0,0,0,0.1)`,
                                  borderRadius: 8, padding: "5px 10px", fontSize: 12, outline: "none", color: C.navy,
                                }}
                              >
                                <option value="estudiante">Estudiante</option>
                                <option value="docente">Docente</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <span style={{
                                background: cfg.bg, color: cfg.color,
                                fontSize: 10, fontWeight: 700,
                                padding: "4px 14px", borderRadius: 980,
                                textTransform: "uppercase", letterSpacing: "0.5px",
                              }}>
                                {cfg.label}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "16px 20px", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleEditSave(u.id)}
                                    className="icon-btn"
                                    style={{ background: C.greenBg, color: C.green, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                  >
                                    <Save size={14} />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="icon-btn"
                                    style={{ background: C.pageBg, color: C.muted, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditStart(u)}
                                    className="icon-btn"
                                    style={{ background: C.tealBg, color: C.greenMid, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(u.id)}
                                    className="icon-btn"
                                    style={{ background: C.dangerBg, color: C.danger, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "24px 28px", borderTop: `1px solid ${C.border}`, textAlign: "center", marginTop: 40 }}>
        <p style={{ color: C.muted, fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>
          Instituto Tecnico de Petroleo — 2026
        </p>
      </footer>

      <style>{`
        /* Emil: custom easing curves everywhere */

        /* Stagger animations */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes rowIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Emil: buttons — scale on :active for tactile press feedback */
        .btn-primary, .btn-signout, .icon-btn {
          transition: opacity 150ms ${EASE_OUT}, transform 120ms ${EASE_OUT}, box-shadow 150ms ${EASE_OUT};
        }

        /* Emil: hover only on real pointer devices — prevent false positives on touch */
        @media (hover: hover) and (pointer: fine) {
          .btn-primary:hover  { opacity: 0.9; transform: translateY(-1px); }
          .btn-signout:hover  { opacity: 0.88; }
          .icon-btn:hover     { opacity: 0.82; }
        }

        .btn-primary:active  { transform: scale(0.97); }
        .btn-signout:active  { transform: scale(0.97); }
        .icon-btn:active     { transform: scale(0.95); }

        /* Emil: input focus — border color only, no heavy shadow */
        .field:focus {
          border-color: ${C.green} !important;
          box-shadow: 0 0 0 3px rgba(0,200,83,0.12);
        }

        /* Emil: prefers-reduced-motion — keep opacity, remove movement */
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