// src/app/dashboard/estudiante/layout.tsx
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0F172A' }}>
      {children}
    </div>
  );
}