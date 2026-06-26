"use client";
import { WHATSAPP } from "@/lib/constants";

export default function WhatsappFloat({ isMobile }: { isMobile: boolean }) {
  return (
    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
      title="Chatea con nosotros en WhatsApp"
      style={{ position: "fixed", bottom: isMobile ? 80 : 32, right: 24, zIndex: 999, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(37,211,102,0.5)", textDecoration: "none", transition: "transform 0.18s ease, box-shadow 0.18s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(37,211,102,0.65)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(37,211,102,0.5)"; }}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.003 3C8.833 3 3 8.832 3 16.003c0 2.298.614 4.453 1.686 6.31L3 29l6.875-1.663A13.02 13.02 0 0016.003 29C23.17 29 29 23.168 29 16.003 29 8.832 23.17 3 16.003 3z" fill="white"/>
        <path d="M21.892 19.338c-.296-.149-1.751-.865-2.022-.963-.271-.1-.468-.149-.665.149-.198.296-.765.963-.938 1.16-.172.198-.345.223-.641.074-.296-.149-1.25-.461-2.38-1.469-.88-.785-1.473-1.754-1.646-2.05-.173-.297-.018-.457.13-.605.133-.133.297-.347.445-.52.149-.172.198-.297.297-.494.1-.198.05-.371-.025-.52-.074-.149-.665-1.604-.911-2.196-.24-.577-.484-.499-.665-.508l-.568-.01c-.198 0-.519.074-.79.371-.271.297-1.04 1.016-1.04 2.477 0 1.462 1.065 2.875 1.213 3.073.149.198 2.097 3.203 5.082 4.492.71.307 1.264.49 1.696.627.713.227 1.362.195 1.875.118.572-.085 1.751-.716 1.998-1.408.247-.692.247-1.285.173-1.408-.074-.124-.271-.198-.568-.347z" fill="#25D366"/>
      </svg>
    </a>
  );
}
