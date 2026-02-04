import type { SupabaseClient } from "@supabase/supabase-js";

export class AuthService {
  constructor(private readonly supabase: SupabaseClient) {}

  async signUp(params: { email: string; password: string }) {
    const { data, error } = await this.supabase.auth.signUp({
      email: params.email,
      password: params.password
    });

    if (error) throw error;
    return data;
  }

  async signInWithPassword(params: { email: string; password: string }) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password
    });

    if (error) throw error;
    return data;
  }
}

