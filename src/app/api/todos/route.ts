import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  const { title } = await request.json();

  const todo = await prisma.todo.create({
    data: {
      title,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(todo);
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  const { id, title, completed } = await request.json();

  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo || todo.userId !== session.user.id) {
    return new NextResponse(null, { status: 404 });
  }

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: {
      title: title !== undefined ? title : todo.title,
      completed: completed !== undefined ? completed : todo.completed,
    },
  });

  return NextResponse.json(updatedTodo);
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse(null, { status: 400 });
  }

  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo || todo.userId !== session.user.id) {
    return new NextResponse(null, { status: 404 });
  }

  await prisma.todo.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}
