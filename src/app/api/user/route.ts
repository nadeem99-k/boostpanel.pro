import { NextResponse } from 'next/server';

export async function GET() {
  // When Supabase is connected:
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // const { data } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
  // return NextResponse.json({ balance: data.balance });

  return NextResponse.json({ balance: 0, message: "Connect Supabase to enable server-side balance." });
}
