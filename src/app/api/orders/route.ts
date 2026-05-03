import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo (replace with Supabase DB queries when ready)
// Orders are managed client-side via localStorage — this endpoint is ready for Supabase

export async function GET(_req: NextRequest) {
  // When Supabase is connected:
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // const { data } = await supabase.from('orders').select('*').eq('user_id', user.id);
  // return NextResponse.json(data);

  return NextResponse.json(
    { message: "Connect Supabase to enable server-side order fetching." },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { service_id, service_name, link, quantity, charge } = body;

  if (!service_id || !link || !quantity || !charge) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // When Supabase is connected:
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // const { error } = await supabase.from('orders').insert({ user_id: user.id, ... });

  // For now return the order object with a generated ID
  const order = {
    id: crypto.randomUUID(),
    service_id,
    service_name,
    link,
    quantity,
    charge,
    status: "Pending",
    created_at: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, order }, { status: 201 });
}
