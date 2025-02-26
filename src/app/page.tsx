import TodoList from "@/components/TodoList";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {session?.user ? (
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            My Todo List
          </h1>
          <TodoList />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to the Next.js Todo App
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            An elegant, professional todo application built with Next.js 15,
            featuring user authentication, dark mode, and an admin panel.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
        </div>
      )}
    </main>
  );
}
