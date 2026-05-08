"use client";

import { GraduationCap, LogOut, Plus, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useState, useEffect } from "react";

export default function TeacherDashboard() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("nombre, role")
          .eq("id", user.id)
          .single();
        if (data) {
          setNombre(data.nombre || "Docente");
          setRole(data.role || "docente");
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>

      <nav style={{ background: "#0F172A", borderBottom: "1px solid rgba(249,115,22,0.2)", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, borderRadius: "0 0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#F97316", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={18} color="white" />
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>Instituto Tecnico de Petroleo</span>
        </div>
        <button
          onClick={handleSignOut}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.4)", color: "#F97316", padding: "8px 18px", borderRadius: 980, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
        >
          Cerrar Sesion <LogOut size={13} />
        </button>
      </nav>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "52px 28px" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ color: "#F97316", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Portal Docente</p>
          <h1 style={{ color: "#0F172A", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1, margin: 0 }}>
            Hola, <span style={{ color: "#F97316" }}>{nombre}</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 8, fontWeight: 500 }}>
            ({role})
          </p>
          <p style={{ color: "#64748b", fontSize: 15, marginTop: 8, lineHeight: 1.6 }}>
            Gestiona tus clases y estudiantes desde aqui.
          </p>
        </div>

        <div style={{ background: "white", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)", padding: "64px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ background: "#fff7ed", width: 80, height: 80, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <Plus size={36} color="#F97316" />
          </div>
          <h2 style={{ color: "#0F172A", fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12 }}>
            Crea tu primera clase
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 15, maxWidth: 360, lineHeight: 1.6, margin: "0 0 32px" }}>
            Organiza tus materiales y comienza la formacion tecnica hoy.
          </p>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F172A", color: "white", border: "none", borderRadius: 980, padding: "13px 26px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Nueva Asignatura <ChevronRight size={16} />
          </button>
        </div>
      </main>

      <footer style={{ padding: "28px", borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase" }}>Instituto Tecnico de Petroleo - 2026</p>
      </footer>

    </div>
  );
}