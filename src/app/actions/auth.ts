'use server'

import { redirect } from 'next/navigation'

// These server actions are placeholders.
// When Supabase is configured, replace the body of each function.

export async function login(_formData: FormData) {
  // Supabase auth goes here when ready
  redirect('/dashboard')
}

export async function signup(_formData: FormData) {
  // Supabase signup goes here when ready
  redirect('/dashboard')
}

export async function signout() {
  // Supabase signout goes here when ready
  redirect('/login')
}
