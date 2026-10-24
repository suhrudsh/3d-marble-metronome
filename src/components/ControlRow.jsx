import { useState } from "react";

export default function ControlRow({
  label,
  value,
  children,
  sub,
  isTempo = false,
  tempoInputRef,
  MIN_TEMPO,
  MAX_TEMPO,
  onChange,
}) {
  const [draft, setDraft] = useState(String(value));

  return (
    <div className="bg-raised border-line flex w-full flex-col justify-between gap-4 rounded-xl border p-6">
      <div className="flex items-baseline justify-between">
        <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
          {label}
        </span>
        {value && isTempo ? (
          <div className="text-brass-bright flex items-center gap-1 bg-transparent text-right font-mono tabular-nums focus:outline-none md:text-2xl">
            <input
              ref={tempoInputRef}
              type="number"
              inputMode="numeric"
              min={MIN_TEMPO}
              max={MAX_TEMPO}
              className="field-sizing-content [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              value={draft}
              onChange={(e) => {
                const text = e.target.value;
                setDraft(text);

                const next = Number(text);
                if (text !== "" && next >= MIN_TEMPO && next <= MAX_TEMPO) {
                  onChange(next);
                }
              }}
              onBlur={() => {
                const next = Math.min(
                  MAX_TEMPO,
                  Math.max(MIN_TEMPO, Number(draft) || MIN_TEMPO),
                );
                setDraft(String(next));
                onChange(next);
              }}
            />
            <span>BPM</span>
          </div>
        ) : (
          <span className="text-brass-bright font-mono tabular-nums md:text-2xl">
            {value}
          </span>
        )}
      </div>
      {children}
      {sub && <div className="text-faint font-mono text-xs">{sub}</div>}
    </div>
  );
}
