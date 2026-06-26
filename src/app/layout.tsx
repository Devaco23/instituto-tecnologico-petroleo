"use client";
import { C } from "@/lib/constants";
import { useWindowSize } from "@/lib/useWindowSize";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";

const RUTAS_SIN_CHROME = ["/login"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { width, mounted } = useWindowSize();
  const isMobile = mounted && width < 768;
  const pathname = usePathname();
  const sinChrome = RUTAS_SIN_CHROME.some(r => pathname.startsWith(r));

  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: "100vh", background: sinChrome ? "#0d1b2a" : C.pageBg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {!sinChrome && <Navbar isMobile={isMobile} />}
        <main>{children}</main>
        {!sinChrome && <Footer isMobile={isMobile} />}
        {!sinChrome && <WhatsappFloat isMobile={isMobile} />}
        <style>{`
          @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(10px);} }
          a { transition: opacity 0.2s; }
          * { box-sizing: border-box; }
        `}</style>
      </body>
    </html>
  );
}