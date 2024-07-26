import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 text-center p-6">
      <h1 className="text-8xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text mb-4">
        404
      </h1>
      <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link href="/"className="inline-block px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 dark:bg-blue-500 dark:hover:bg-blue-400">
          Go back to Home
      </Link>
    </div>
  );
}
