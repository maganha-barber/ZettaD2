import { NextResponse } from "next/server";

import { getAuthenticatedUserOrNull } from "@/lib/supabase/server";
import {
  createTaskBodySchema,
  listTasksQuerySchema
} from "@/lib/validators/task.validators";
import { TasksService } from "@/services/tasks.service";

export async function GET(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedUserOrNull(request);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const url = new URL(request.url);
    const query = listTasksQuerySchema.safeParse({
      status: url.searchParams.get("status") ?? undefined
    });

    if (!query.success) {
      return NextResponse.json(
        { error: "Query inválida.", details: query.error.flatten() },
        { status: 400 }
      );
    }

    const service = new TasksService(supabase);
    const tasks = await service.listByUser({
      userId: user.id,
      status: query.data.status
    });

    return NextResponse.json({ data: tasks }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao listar tarefas." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedUserOrNull(request);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const bodyJson = await request.json().catch(() => null);
    const body = createTaskBodySchema.safeParse(bodyJson);

    if (!body.success) {
      return NextResponse.json(
        { error: "Body inválido.", details: body.error.flatten() },
        { status: 400 }
      );
    }

    const service = new TasksService(supabase);
    const task = await service.createForUser({
      userId: user.id,
      input: body.data
    });

    return NextResponse.json({ data: task }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao criar tarefa." },
      { status: 500 }
    );
  }
}

