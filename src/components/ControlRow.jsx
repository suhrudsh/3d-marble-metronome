export default function ControlRow({ label, value, children, sub }) {
  return (
    <div className="bg-raised border-line flex w-full flex-col justify-between gap-4 rounded-xl border p-6">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
          {label}
        </span>
        {value && (
          <span className="text-brass-bright font-mono text-2xl tabular-nums">
            {value}
          </span>
        )}
      </div>
      {children}
      {sub && <div className="text-faint mt-0.5 font-mono text-xs">{sub}</div>}
    </div>
  );
}
