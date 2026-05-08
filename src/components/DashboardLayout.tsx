"use client";

import {
  BookOpen,
  CalendarDays,
  CheckCheck,
  Home,
  LayoutDashboard,
  LifeBuoy,
  List,
  LogOut,
  NotebookPen,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isProfesorRoute = pathname.includes("/profesor");
  const isEstudianteRoute = pathname.includes("/estudiante");
  const roleLabel = isProfesorRoute ? "Docente" : "Estudiante";

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
          setNombre(data.nombre || roleLabel);
          setRole(data.role || roleLabel.toLowerCase());
        }
      }
    };
    fetchProfile();
  }, []);

  const navItems = isProfesorRoute
    ? [
        { label: "Panel de Control", href: "/dashboard/profesor", icon: LayoutDashboard },
        { label: "Mis Clases", href: "/dashboard/profesor", icon: BookOpen },
        { label: "Calificar Tareas", href: "/dashboard/profesor", icon: CheckCheck },
        { label: "Listado de Alumnos", href: "/dashboard/profesor", icon: Users },
        { label: "Cargar Material", href: "/dashboard/profesor", icon: Upload },
      ]
    : isEstudianteRoute
      ? [
          { label: "Inicio", href: "/dashboard/estudiante", icon: Home },
          { label: "Mis Cursos", href: "/dashboard/estudiante", icon: BookOpen },
          { label: "Mis Notas", href: "/dashboard/estudiante", icon: NotebookPen },
          { label: "Horario", href: "/dashboard/estudiante", icon: CalendarDays },
          { label: "Soporte", href: "/dashboard/estudiante", icon: LifeBuoy },
        ]
      : [{ label: "Inicio", href: "/dashboard", icon: List }];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl px-4 py-6 md:px-6">
        <aside className="hidden w-72 shrink-0 rounded-2xl border border-slate-200 bg-slate-950 p-5 shadow-xl md:flex md:flex-col">
          <div className="mb-8 border-b border-white/10 pb-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Plataforma Academica
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">Dashboard</h2>
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316] text-xs font-semibold text-white">
                {nombre ? nombre.slice(0, 1).toUpperCase() : roleLabel.slice(0, 1)}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Usuario
                </p>
                <p className="text-sm font-medium text-white">{nombre || roleLabel}</p>
                <p className="text-xs text-slate-400">({role || roleLabel.toLowerCase()})</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-3">
            {navItems.map((item) => (
              <SidebarLink
                key={`${item.label}-${item.href}`}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
              />
            ))}
          </nav>

          <Link
            href="/"
            className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-[#F97316] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesion
          </Link>
        </aside>

        <main className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Aula Virtual
              </p>
              <h1 className="text-lg font-semibold text-slate-900">
                Panel de Control
              </h1>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Online
            </span>
          </div>
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  isActive: boolean;
};

function SidebarLink({ href, label, icon: Icon, isActive }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition ${
        isActive
          ? "border-[#F97316]/40 bg-[#F97316]/15 text-white"
          : "border-white/10 bg-white/5 text-slate-100 hover:border-[#F97316]/30 hover:bg-white/10"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}