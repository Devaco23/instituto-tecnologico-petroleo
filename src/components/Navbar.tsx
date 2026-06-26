"use client";
import { Menu, X, MessageCircle, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { C, WHATSAPP, EMAIL, NAV_LINKS } from "@/lib/constants";

export default function Navbar({ isMobile }: { isMobile: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Cierra el menú móvil automáticamente al cambiar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || (pathname !== "/" && pathname !== "/contacto") ? "rgba(13,27,42,0.97)" : "transparent", backdropFilter: scrolled || (pathname !== "/" && pathname !== "/contacto") ? "blur(12px)" : "none", borderBottom: scrolled || (pathname !== "/" && pathname !== "/contacto") ? "1px solid rgba(0,200,83,0.15)" : "none", padding: isMobile ? "14px 20px" : "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s ease" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="ITP" style={{ height: isMobile ? 38 : 48, width: "auto", objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }} />
          <div>
            <span style={{ color: "white", fontWeight: 800, fontSize: isMobile ? 16 : 20, letterSpacing: "-0.5px" }}>ITP</span>
            {!isMobile && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>Instituto Tecnico de Petroleo</p>}
          </div>
        </Link>

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {NAV_LINKS.map(([label, href]) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  style={{ color: active ? C.green : "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.green)}
                  onMouseLeave={e => (e.currentTarget.style.color = active ? C.green : "rgba(255,255,255,0.85)")}>
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/login" target="_blank" rel="noopener noreferrer" style={{ background: C.green, color: "white", padding: isMobile ? "8px 16px" : "10px 22px", borderRadius: 980, fontSize: isMobile ? 13 : 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(0,200,83,0.35)" }}>Aula Virtual</a>
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", color: "white" }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 70, left: 0, right: 0, zIndex: 99, background: "rgba(13,27,42,0.97)", backdropFilter: "blur(12px)", padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: 4, borderBottom: "1px solid rgba(0,200,83,0.15)" }}>
          {NAV_LINKS.map(([label, href]) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ color: active ? C.green : "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 600, textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {label}
              </Link>
            );
          })}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.green, color: "white", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><MessageCircle size={15} /> WhatsApp</a>
            <a href={EMAIL} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "rgba(255,255,255,0.08)", color: "white", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}><Mail size={15} /> Email</a>
          </div>
        </div>
      )}
    </>
  );
}
