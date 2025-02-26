// filepath: c:\Repos\Work\Agent Test\next-todo\src\app\api\admin\users\route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse(null, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { todos: true },
      },
    },
    orderBy: {
      email: "asc",
    },
  });

  return NextResponse.json(users);
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse(null, { status: 403 });
  }

  const { id, role } = await request.json();

  if (!id || !role || !["user", "admin"].includes(role)) {
    return new NextResponse(null, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse(null, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse(null, { status: 400 });
  }

  // Don't allow admins to delete themselves
  if (id === session.user.id) {
    return new NextResponse(null, { status: 400 });
  }

  await prisma.user.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}
