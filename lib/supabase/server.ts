import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";

function getBearerTokenFromRequest(request: Request): string | null {
  const header =
    request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header) return null;

  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

export function createSupabaseServerClient(params?: { accessToken?: string }) {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variáveis de ambiente do Supabase ausentes. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    global: params?.accessToken
      ? {
          headers: {
            Authorization: `Bearer ${params.accessToken}`
          }
        }
      : undefined,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Route Handlers podem rodar em contexto onde o set falha; nesse caso, ignore.
        }
      }
    }
  });
}

export async function getAuthenticatedUserOrNull(request: Request) {
  const accessToken = getBearerTokenFromRequest(request);
  const supabase = createSupabaseServerClient({ accessToken: accessToken ?? undefined });

  const { data, error } = accessToken
    ? await supabase.auth.getUser(accessToken)
    : await supabase.auth.getUser();

  if (error || !data.user) return { supabase, user: null };
  return { supabase, user: data.user };
}
