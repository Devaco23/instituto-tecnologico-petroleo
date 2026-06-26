"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { type FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sesionExpirada = searchParams.get("reason") === "inactividad";

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage]   = useState<string | null>(null);
  const [isLoading, setIsLoading]       = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(true);

    const { data: { user }, error: signInError } =
      await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (signInError) {
      setErrorMessage("Credenciales invalidas. Verifica tu correo y contraseña.");
      setIsLoading(false);
      return;
    }

    if (user) {
      if (!user.email_confirmed_at) {
        await supabase.auth.resend({ type: "signup", email: email.trim() });
        await supabase.auth.signOut();
        setInfoMessage(
          "Tu correo aún no ha sido verificado. Te enviamos un nuevo enlace de confirmación. Revisa tu bandeja de entrada (y spam)."
        );
        setIsLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsLoading(false);

      if (profileError || !profile) { router.push("/dashboard"); return; }

      if (profile.role === "admin")        router.push("/dashboard/admin");
      else if (profile.role === "docente") router.push("/dashboard/profesor");
      else                                 router.push("/dashboard/estudiante");

      router.refresh();
    }
  };

  return (
    <main style={{
      display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", fontFamily: "Inter, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Fondo */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/fondlog.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
      {/* Overlay oscuro */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(13,27,42,0.88) 0%, rgba(10,42,26,0.85) 100%)" }} />

      <section style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24, padding: "36px 32px",
        backdropFilter: "blur(16px)",
      }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <img src="/logo.png" alt="ITP Logo" style={{ height: 72, width: "auto", objectFit: "contain" }} />
          </div>
          <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Portal Academico</p>
          <h1 style={{ color: "white", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>Aula Virtual ITP</h1>
        </div>

        {sesionExpirada && (
          <div style={{ background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⏱️</span>
            <p style={{ color: "#ffe082", fontSize: 13, margin: 0, lineHeight: 1.5 }}>Tu sesión se cerró por 20 minutos de inactividad. Inicia sesión de nuevo.</p>
          </div>
        )}

        {errorMessage && (
          <div style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5252", flexShrink: 0, marginTop: 4 }} />
            <p style={{ color: "#ff8a80", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{errorMessage}</p>
          </div>
        )}

        {infoMessage && (
          <div style={{ background: "rgba(0,200,83,0.08)", border: "1px solid rgba(0,200,83,0.25)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>📧</span>
            <p style={{ color: "#b9f6ca", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{infoMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Correo Institucional</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="usuario@itp.edu.co"
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Contraseña</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button type="submit" disabled={isLoading}
            style={{ width: "100%", background: isLoading ? "rgba(0,200,83,0.5)" : "#00C853", color: "white", border: "none", borderRadius: 12, padding: "13px 16px", fontSize: 14, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {isLoading ? "Verificando identidad..." : "Acceder al Aula"}
          </button>
        </form>

        <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, margin: 0 }}>¿Olvidaste tu acceso o no tienes cuenta?</p>
          <p style={{ color: "#00C853", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginTop: 4 }}>Contactar a Soporte Técnico ITP</p>
        </div>

      </section>
    </main>
  );
}