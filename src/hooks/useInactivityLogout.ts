"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export function useInactivityLogout(tiempoMs: number = 30 * 60 * 1000) {
  const router = useRouter();

  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout>;

    const reiniciar = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        supabase.auth.signOut().then(() => router.push("/login"));
      }, tiempoMs);
    };

    const eventos = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    eventos.forEach(e => window.addEventListener(e, reiniciar));
    reiniciar();

    return () => {
      clearTimeout(temporizador);
      eventos.forEach(e => window.removeEventListener(e, reiniciar));
    };
  }, [tiempoMs, router]);
}