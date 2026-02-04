import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authCredentialsSchema } from "@/lib/validators/auth.validators";
import { AuthService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const bodyJson = await request.json().catch(() => null);
    const body = authCredentialsSchema.safeParse(bodyJson);

    if (!body.success) {
      return NextResponse.json(
        { error: "Body inválido.", details: body.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const service = new AuthService(supabase);

    const result = await service.signUp(body.data);

    // Obs: dependendo da configuração do Supabase (email confirmation),
    // a session pode vir nula até o usuário confirmar o email.
    return NextResponse.json(
      {
        data: {
          user: result.user ?? null,
          session: result.session ?? null
        }
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno ao cadastrar usuário." },
      { status: 500 }
    );
  }
}

