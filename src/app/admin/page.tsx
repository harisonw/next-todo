import AdminTodoList from "@/components/admin/AdminTodoList";
import UserManagementPanel from "@/components/admin/UserManagementPanel";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
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

  const todos = await prisma.todo.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* User Management Section */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              User Management
            </h2>
            <UserManagementPanel users={users} />
          </div>

          {/* Recent Todos Section */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Recent Todos
            </h2>
            <AdminTodoList initialTodos={todos} />
          </div>
        </div>
      </div>
    </main>
  );
}
