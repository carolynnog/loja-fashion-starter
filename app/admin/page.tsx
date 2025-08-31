export default function AdminHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Painel</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <a href="/admin/produtos" className="card p-6">Produtos</a>
        <a href="/admin/pedidos" className="card p-6">Pedidos</a>
        <a href="/admin/debug" className="card p-6">Debug</a>
      </div>
    </div>
  );
}





