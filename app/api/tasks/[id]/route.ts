import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateTaskBodySchema } from "@/lib/validators/task.validators";
import { TasksService } from "@/services/tasks.service";

type RouteContext = {
  params: { id: string };
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const taskId = context.params.id;
    if (!taskId) {
      return NextResponse.json({ error: "ID ausente." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const bodyJson = await request.json().catch(() => null);
    const body = updateTaskBodySchema.safeParse(bodyJson);

    if (!body.success) {
      return NextResponse.json(
        { error: "Body inválido.", details: body.error.flatten() },
        { status: 400 }
      );
    }

    const service = new TasksService(supabase);
    const updated = await service.updateByIdForUser({
      userId: user.id,
      taskId,
      patch: body.data
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Tarefa não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao atualizar tarefa." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const taskId = context.params.id;
    if (!taskId) {
      return NextResponse.json({ error: "ID ausente." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const service = new TasksService(supabase);
    const deleted = await service.deleteByIdForUser({
      userId: user.id,
      taskId
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Tarefa não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao deletar tarefa." },
      { status: 500 }
    );
  }
}

