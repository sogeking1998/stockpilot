import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center">
      <div>
        <p className="text-sm font-semibold text-brand-600">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-slate-500">
          We couldn&apos;t find what you were looking for.
        </p>
        <Link href="/dashboard" className="btn-primary mt-6">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
