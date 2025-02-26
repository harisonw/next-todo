// filepath: c:\Repos\Work\Agent Test\next-todo\src\app\api\admin\todos\route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse(null, { status: 403 });
  }

  // Allow filtering by userId
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const todos = await prisma.todo.findMany({
    where: userId ? { userId } : undefined,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(todos);
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse(null, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  // Delete a specific todo
  if (id) {
    await prisma.todo.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  }

  // Delete all todos for a user
  if (userId) {
    await prisma.todo.deleteMany({
      where: { userId },
    });
    return new NextResponse(null, { status: 204 });
  }

  return new NextResponse(null, { status: 400 });
}
