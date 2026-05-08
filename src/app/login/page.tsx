"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { type FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setErrorMessage("Credenciales invalidas. Verifica tu correo y contrasena.");
      setIsLoading(false);
      return;
    }

    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsLoading(false);

      if (profileError || !profile) {
        router.push("/dashboard");
        return;
      }

      if (profile.role === 'admin') {
        router.push("/dashboard/admin");
      } else if (profile.role === 'docente') {
        router.push("/dashboard/profesor");
      } else {
        router.push("/dashboard/estudiante");
      }

      router.refresh();
    }
  };

  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#0F172A", padding: "40px 24px", fontFamily: "Inter, sans-serif" }}>
      <section style={{ width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "36px 32px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#F97316", width: 48, height: 48, borderRadius: 14, marginBottom: 16 }}>
            <span style={{ color: "white", fontWeight: 800, fontSize: 13 }}>ITP</span>
          </div>
          <p style={{ color: "#F97316", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>
            Portal Academico
          </p>
          <h1 style={{ color: "white", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>
            Aula Virtual ITP
          </h1>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
            <p style={{ color: "#fca5a5", fontSize: 13, margin: 0 }}>{errorMessage}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Correo Institucional
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@itp.edu.co"
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Contrasena
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: "100%", background: isLoading ? "rgba(249,115,22,0.5)" : "#F97316", color: "white", border: "none", borderRadius: 12, padding: "13px 16px", fontSize: 14, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", transition: "all 0.2s" }}
          >
            {isLoading ? "Verificando identidad..." : "Acceder al Aula"}
          </button>
        </form>

        {/* FOOTER */}
        <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, margin: 0 }}>
            Olvidaste tu acceso o no tienes cuenta?
          </p>
          <p style={{ color: "#F97316", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginTop: 4 }}>
            Contactar a Soporte Tecnico ITP
          </p>
        </div>

      </section>
    </main>
  );
}