"use client";

import { useState, useEffect } from "react";
import { LogOut, ShieldCheck, Trash2, Edit3, Save, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
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
      options: { data: { role: newUserRole } }
    });

    if (data.user) {
      await supabase
        .from("profiles")
        .update({ nombre: newUserNombre })
        .eq("id", data.user.id);
    }

    setNewUserEmail("");
    setNewUserPass("");
    setNewUserNombre("");
    await fetchUsuarios();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Seguro que deseas eliminar este usuario?");
    if (!confirm) return;
    await supabase.from("profiles").delete().eq("id", id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const handleEditStart = (u: any) => {
    setEditingId(u.id);
    setEditingRole(u.role);
    setEditingNombre(u.nombre || "");
  };

  const handleEditSave = async (id: string) => {
    await supabase
      .from("profiles")
      .update({ role: editingRole, nombre: editingNombre })
      .eq("id", id);
    setEditingId(null);
    await fetchUsuarios();
  };

  const roleColor = (role: string) => {
    if (role === "admin") return { background: "#fff7ed", color: "#F97316" };
    if (role === "docente") return { background: "#eff6ff", color: "#3b82f6" };
    return { background: "#ecfdf5", color: "#10b981" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: "#0F172A", borderBottom: "1px solid rgba(249,115,22,0.2)", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, borderRadius: "0 0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#F97316", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={18} color="white" />
          </div>
          <div>
            <span style={{ color: "white", fontWeight: 700, fontSize: 18, display: "block", lineHeight: 1 }}>Instituto Tecnico de Petroleo</span>
            <span style={{ color: "#F97316", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Admin Dashboard</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.4)", color: "#F97316", padding: "8px 18px", borderRadius: 980, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
        >
          Cerrar Sesion <LogOut size={13} />
        </button>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>

          {/* FORMULARIO */}
          <div>
            <p style={{ color: "#F97316", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Administracion</p>
            <h1 style={{ color: "#0F172A", fontSize: 32, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 28 }}>
              Gestion de <span style={{ color: "#F97316" }}>Usuarios</span>
            </h1>

            <div style={{ background: "white", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)", padding: 28 }}>
              <p style={{ color: "#0F172A", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Crear nuevo usuario</p>
              <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  required
                  value={newUserNombre}
                  onChange={(e) => setNewUserNombre(e.target.value)}
                  style={{ background: "#F1F5F9", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0F172A" }}
                />
                <input
                  type="email"
                  placeholder="Email institucional"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{ background: "#F1F5F9", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0F172A" }}
                />
                <input
                  type="password"
                  placeholder="Contrasena"
                  required
                  value={newUserPass}
                  onChange={(e) => setNewUserPass(e.target.value)}
                  style={{ background: "#F1F5F9", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0F172A" }}
                />
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  style={{ background: "#F1F5F9", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, outline: "none", color: "#0F172A" }}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ background: loading ? "rgba(249,115,22,0.5)" : "#F97316", color: "white", border: "none", borderRadius: 12, padding: "13px 16px", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Registrando..." : "Autorizar Acceso"}
                </button>
              </form>
            </div>
          </div>

          {/* TABLA */}
          <div>
            <p style={{ color: "#F97316", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Directorio</p>
            <h2 style={{ color: "#0F172A", fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 28 }}>Usuarios registrados</h2>

            <div style={{ background: "white", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
              {usuarios.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                  No hay usuarios registrados aun.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#F8FAFC" }}>
                      <th style={{ padding: "14px 20px", textAlign: "left", color: "#94a3b8", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Nombre</th>
                      <th style={{ padding: "14px 20px", textAlign: "left", color: "#94a3b8", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Email</th>
                      <th style={{ padding: "14px 20px", textAlign: "center", color: "#94a3b8", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Rol</th>
                      <th style={{ padding: "14px 20px", textAlign: "right", color: "#94a3b8", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: i < usuarios.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                        <td style={{ padding: "16px 20px", color: "#0F172A", fontWeight: 600 }}>
                          {editingId === u.id ? (
                            <input
                              value={editingNombre}
                              onChange={(e) => setEditingNombre(e.target.value)}
                              style={{ background: "#F1F5F9", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "6px 10px", fontSize: 13, outline: "none", width: "100%" }}
                            />
                          ) : (
                            u.nombre || <span style={{ color: "#94a3b8", fontWeight: 400 }}>Sin nombre</span>
                          )}
                        </td>
                        <td style={{ padding: "16px 20px", color: "#64748b" }}>
                          {u.email}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          {editingId === u.id ? (
                            <select
                              value={editingRole}
                              onChange={(e) => setEditingRole(e.target.value)}
                              style={{ background: "#F1F5F9", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "4px 8px", fontSize: 12, outline: "none" }}
                            >
                              <option value="estudiante">Estudiante</option>
                              <option value="docente">Docente</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span style={{ ...roleColor(u.role), fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980, textTransform: "uppercase" }}>
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            {editingId === u.id ? (
                              <>
                                <button
                                  onClick={() => handleEditSave(u.id)}
                                  style={{ background: "#ecfdf5", color: "#10b981", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  style={{ background: "#F1F5F9", color: "#64748b", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditStart(u)}
                                  style={{ background: "#eff6ff", color: "#3b82f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(u.id)}
                                  style={{ background: "#fff1f2", color: "#ef4444", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ padding: "28px", borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center", marginTop: 40 }}>
        <p style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase" }}>Instituto Tecnico de Petroleo - 2026</p>
      </footer>

    </div>
  );
}