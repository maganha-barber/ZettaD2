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

    const result = await service.signInWithPassword(body.data);

    return NextResponse.json(
      {
        data: {
          user: result.user,
          session: result.session
        }
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Credenciais inválidas." },
      { status: 401 }
    );
  }
}

