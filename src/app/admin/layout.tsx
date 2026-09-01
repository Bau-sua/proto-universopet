export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-slate-50">
      <div className="container-app py-8">
        {/* Demo notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          <strong>Panel demo</strong> — sin autenticación ni persistencia
          operativa. Muestra la estructura del panel real (stock, pedidos,
          estadísticas) con datos de ejemplo.
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}