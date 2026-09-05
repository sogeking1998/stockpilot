export default function ProductsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-40 rounded bg-slate-200" />
        <div className="h-10 w-32 rounded-lg bg-slate-200" />
      </div>
      <div className="mb-4 flex gap-3">
        <div className="h-10 flex-1 rounded-lg bg-slate-200" />
        <div className="h-10 w-56 rounded-lg bg-slate-200" />
      </div>
      <div className="h-96 rounded-xl bg-slate-200" />
    </div>
  );
}
