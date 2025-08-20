import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/serverSupabase';

export async function GET() {
  const sb = supabaseServer();
  const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
