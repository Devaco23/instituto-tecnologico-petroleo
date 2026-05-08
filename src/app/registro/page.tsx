"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { type FormEvent, useState } from "react";

export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("estudiante"); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    // REGISTRO AUTOMATIZADO
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          role: role, // Esto le avisa al Trigger qué rol crear
        },
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setErrorMessage(signUpError.message);
      return;
    }

    if (data.user) {
      setSuccessMessage("¡Cuenta creada con éxito! Configurando tu perfil...");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-10">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/80 p-7 shadow-2xl backdrop-blur md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-200">ITP - Registro</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Crear Cuenta</h1>
        
        {errorMessage && (
          <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-100">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-950/50 px-3 py-2 text-sm text-emerald-100">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-200">Correo Institucional</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@itp.edu" className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400 transition" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200">Contraseña</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400 transition" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200">Tipo de Usuario</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400 transition bg-slate-800 cursor-pointer">
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-500 transition disabled:opacity-60">
            {isLoading ? "Procesando..." : "Registrarse"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">¿Ya tienes cuenta? <Link href="/login" className="font-medium text-blue-300 hover:underline">Inicia sesión</Link></p>
      </section>
    </main>
  );
}