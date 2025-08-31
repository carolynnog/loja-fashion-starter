import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago';
import { supabaseServer } from '@/lib/serverSupabase';
import { Resend } from 'resend';

export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const payment_id = url.searchParams.get('payment_id');
    const email = url.searchParams.get('email') || '';

    if (!payment_id) return NextResponse.json({ ok: false, error: 'payment_id ausente' }, { status: 400 });

    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ ok: false, error: 'MP_ACCESS_TOKEN ausente' }, { status: 500 });
    }
    mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN });

    // Busca detalhes do pagamento
    const payment = await mercadopago.payment.findById(payment_id);
    const status = payment.body.status;
    const transaction_amount = payment.body.transaction_amount;
    const description = payment.body.description || 'Pedido Loja';
    const payer_email = email || payment.body.payer?.email;

    if (status !== 'approved') {
      return NextResponse.json({ ok: false, error: 'status != approved' }, { status: 400 });
    }

    // Salva pedido no banco
    const sb = supabaseServer();
    const { data: order, error: orderErr } = await sb
      .from('orders')
      .insert({
        buyer_email: payer_email,
        total_cents: Math.round(transaction_amount * 100),
        status: 'paid',
        mp_payment_id: payment_id
      })
      .select('*')
      .single();
    if (orderErr) return NextResponse.json({ ok: false, error: orderErr.message }, { status: 500 });

    // Envia e-mail
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Loja <onboarding@resend.dev>',
        to: [payer_email || 'seu-email@exemplo.com'],
        subject: `✉️ Confirmação do Pedido — ${process.env.NEXT_PUBLIC_STORE_NAME || 'Loja'}`,
        text: `Recebemos seu pagamento! Pedido ${order.id}. Total: R$ ${(order.total_cents/100).toFixed(2)}.`,
        html: `<div style="font-family:system-ui">
          <h2>Pedido confirmado!</h2>
          <p>Olá, recebemos seu pagamento e seu pedido foi registrado.</p>
          <p><strong>Código do pedido:</strong> ${order.id}</p>
          <p><strong>Total:</strong> R$ ${(order.total_cents/100).toFixed(2)}</p>
          <p>Obrigado por comprar na ${process.env.NEXT_PUBLIC_STORE_NAME || 'loja'}.</p>
        </div>`
      });
    }

    return NextResponse.json({ ok: true, order_id: order.id });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
