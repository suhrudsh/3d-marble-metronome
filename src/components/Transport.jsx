import { formatElapsed } from "../utils/time";

export default function Transport({
  isPlaying,
  isPaused,
  elapsedMs,
  onStart,
  onStop,
  onPause,
  onResume,
}) {
  return (
    <div className="flex w-full items-center justify-between md:flex-col md:justify-start md:gap-2.5">
      <div className="flex items-center gap-3">
        {/* Primary action */}
        {!isPlaying && (
          <button
            onClick={onStart}
            className="font-display focus-visible:outline-brass-bright from-brass-bright to-brass rounded-full bg-linear-to-b p-4 px-12 text-2xl tracking-wider text-[#221A13] uppercase shadow-[0_8px_20px_-6px_rgba(201,161,91,0.45)] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-[3px] active:translate-y-0 md:text-4xl 2xl:text-5xl"
          >
            Start
          </button>
        )}

        {isPlaying && (
          <button
            onClick={onStop}
            className="from-ember rounded-full bg-linear-to-b to-[#B84420] p-4 shadow-[0_8px_20px_-6px_rgba(225,89,47,0.4)]"
          >
            <img src="stop.svg" alt="" />
          </button>
        )}

        {/* Secondary: Pause (visible only while playing) */}
        {isPlaying && !isPaused && (
          <button
            onClick={onPause}
            className={
              "font-display rounded-full p-4 text-sm font-bold tracking-wider uppercase " +
              "transition-transform hover:-translate-y-px active:translate-y-0 " +
              "focus-visible:outline-brass-bright focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
              "from-brass-bright to-brass bg-linear-to-b text-base shadow-[0_8px_20px_-6px_rgba(201,161,91,0.45)]"
            }
          >
            <img src="pause.svg" alt="" />
          </button>
        )}
        {isPaused && isPlaying && (
          <button
            onClick={onResume}
            className={
              "font-display rounded-full p-4 text-sm font-bold tracking-wider uppercase " +
              "transition-transform hover:-translate-y-px active:translate-y-0 " +
              "focus-visible:outline-brass-bright focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
              "from-brass-bright to-brass bg-linear-to-b text-base shadow-[0_8px_20px_-6px_rgba(201,161,91,0.45)]"
            }
          >
            <img src="play.svg" alt="" />
          </button>
        )}
      </div>

      <div className="text-center">
        <div className="text-primary font-mono text-3xl tabular-nums md:text-5xl 2xl:text-6xl">
          {formatElapsed(elapsedMs)}
        </div>
        <div className="text-faint font-mono text-xs tracking-[0.18em] uppercase md:text-base 2xl:text-lg">
          session time
        </div>
      </div>
    </div>
  );
}
