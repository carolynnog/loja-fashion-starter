import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email } = body as { items: any[]; email: string };

    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'MP_ACCESS_TOKEN ausente' }, { status: 500 });
    }
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_SITE_URL ausente' }, { status: 500 });
    }

    mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN });

    const preference = {
      items: items.map(i => ({
        title: i.name,
        quantity: i.qty,
        currency_id: 'BRL',
        unit_price: i.price_cents / 100
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/sucesso?email=${encodeURIComponent(email)}`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/carrinho`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/carrinho`
      },
      auto_return: 'approved',
      statement_descriptor: process.env.NEXT_PUBLIC_STORE_NAME || 'Loja',
      metadata: { email }
    } as any;

    const pref = await mercadopago.preferences.create(preference);
    return NextResponse.json({ init_point: pref.body.init_point || pref.body.sandbox_init_point });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
