"use client";
import { C } from "@/lib/constants";

export default function Footer({ isMobile }: { isMobile: boolean }) {
  return (
    <footer style={{ background: C.navy, padding: isMobile ? "24px 20px" : "28px 48px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/logo.png" alt="ITP" style={{ height: 32, width: "auto", objectFit: "contain" }} />
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Instituto Técnico de Petróleo · SSAAES NIT 900650018-5</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>© 2026</p>
    </footer>
  );
}
