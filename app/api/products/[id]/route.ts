import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/serverSupabase';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const sb = supabaseServer();
  const { data, error } = await sb.from('products').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
