"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Verifica si son 2 o 3 puntos según tu carpeta

export default function DashboardController() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        router.push("/dashboard/admin");
      } else if (profile?.role === "docente") {
        router.push("/dashboard/profesor");
      } else {
        router.push("/dashboard/estudiante");
      }
    };
    checkRole();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400 animate-pulse text-sm">Cargando plataforma...</p>
    </div>
  );
}