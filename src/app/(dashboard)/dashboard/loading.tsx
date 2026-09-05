export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-8 w-40 rounded bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="h-80 rounded-xl bg-slate-200 lg:col-span-3" />
        <div className="h-80 rounded-xl bg-slate-200 lg:col-span-2" />
      </div>
    </div>
  );
}
