"use client";
import { MessageCircle, Mail } from "lucide-react";
import { C, WHATSAPP, EMAIL } from "@/lib/constants";
import { useWindowSize } from "@/lib/useWindowSize";

export default function ContactoPage() {
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;

  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/fondo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,27,42,0.6) 0%, rgba(13,27,42,0.5) 50%, rgba(13,27,42,0.82) 100%)" }} />
      <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "120px 16px 80px" : "160px 48px 80px", maxWidth: 860, margin: "0 auto", width: "100%" }}>
      <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0d1b2a 0%, #0a2a1a 100%)", borderRadius: isMobile ? 20 : 28, padding: isMobile ? "36px 24px" : "56px 60px", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(0,200,83,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,191,165,0.06)", pointerEvents: "none" }} />
        <span style={{ display: "inline-block", background: "rgba(0,200,83,0.12)", color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "6px 16px", borderRadius: 980, marginBottom: 16, border: "1px solid rgba(0,200,83,0.2)" }}>Contáctanos</span>
        <h3 style={{ color: "white", fontSize: isMobile ? 22 : 32, fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 12px" }}>Resuelve tus dudas ahora</h3>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
          Un asesor te contactará y te guiará en el proceso de inscripción.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexDirection: isMobile ? "column" : "row" }}>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.green, color: "white", padding: isMobile ? "14px 24px" : "13px 28px", borderRadius: 980, fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,200,83,0.35)" }}>
            <MessageCircle size={16} /> 321 8837010 / 311 5267054
          </a>
          <a href={EMAIL} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "white", padding: isMobile ? "14px 24px" : "13px 28px", borderRadius: 980, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
            <Mail size={16} /> institutodepetroleo01@gmail.com
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}