import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center transition-colors duration-200">
      <h1 className="font-mono text-6xl font-bold text-[#f09d1a] tabular-nums mb-4">
        404
      </h1>
      <h2 className="font-serif text-2xl font-bold mb-3">
        الصفحة غير موجودة
      </h2>
      <p className="text-sm text-[#68645C] dark:text-[#8C867B] mb-8 max-w-sm">
        المسار أو الوثيقة التي تبحث عنها غير متوفرة في السجل الأرشيفي.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-full bg-white dark:bg-[#171715] hover:bg-[#f09d1a] hover:text-[#0D0D0C] border border-black/10 dark:border-white/10 text-sm font-mono active:scale-95 transition-all shadow-md"
      >
        العودة إلى الأرشيف
      </Link>
    </div>
  );
}
