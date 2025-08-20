'use client';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading'|'ok'|'fail'>('loading');
  const [msg, setMsg] = useState('Validando pagamento...');
  const [orderId, setOrderId] = useState<string|undefined>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment_id = params.get('payment_id');
    const preference_id = params.get('preference_id');
    const email = params.get('email');

    const run = async () => {
      try {
        const res = await fetch(`/api/confirm?payment_id=${payment_id}&preference_id=${preference_id}&email=${encodeURIComponent(email||'')}`);
        const data = await res.json();
        if (data.ok) {
          setStatus('ok');
          setOrderId(data.order_id);
          setMsg('Pagamento confirmado! Seu pedido foi registrado e você receberá um e-mail.');
          localStorage.removeItem('cart');
        } else {
          setStatus('fail');
          setMsg('Pagamento não confirmado: ' + (data.error || 'desconhecido'));
        }
      } catch (e:any) {
        setStatus('fail');
        setMsg('Erro na confirmação.');
      }
    };
    run();
  }, []);

  return (
    <div className="card p-6 text-center space-y-3">
      <h1 className="text-2xl font-semibold">Status do Pedido</h1>
      <p>{msg}</p>
      {status === 'ok' && orderId && (
        <p className="text-neutral-400 text-sm">Código do pedido: <strong className="text-white">{orderId}</strong></p>
      )}
    </div>
  );
}
