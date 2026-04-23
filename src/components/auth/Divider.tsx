export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[11px] uppercase tracking-[0.14em] text-tertiary">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
