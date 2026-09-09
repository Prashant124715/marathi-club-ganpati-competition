import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-white/70 dark:bg-stone-900/80 backdrop-blur-md p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 flex items-center justify-center text-4xl font-serif text-amber-600 dark:text-amber-400 border border-amber-500/30">
          ४०४
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
            Page Not Found / पृष्ठ सापडले नाही
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-orange-500/20 transition-all text-center"
          >
            Go to Home
          </Link>
          <Link
            href="/categories"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full font-medium text-sm text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all border border-stone-200 dark:border-stone-700 text-center"
          >
            Explore Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
