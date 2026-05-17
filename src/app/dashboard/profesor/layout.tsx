// src/app/dashboard/profesor/layout.tsx
export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Este layout no añade nada, solo deja pasar el contenido de la page */}
      {children}
    </section>
  );
}