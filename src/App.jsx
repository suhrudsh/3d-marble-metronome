import { useRef, useState, useCallback } from "react";
import { useMetronome } from "./hooks/useMetronome";
import PendulumStage from "./components/PendulumStage";
import Transport from "./components/Transport";
import TempoControl from "./components/TempoControl";
import SpeedControl from "./components/SpeedControl";
import { SPEED_OPTIONS } from "./constants/speed";
import TimeSignatureControl from "./components/TimeSignatureControl";

export default function App() {
  const [tempo, setTempo] = useState(120);
  const [speedKey, setSpeedKey] = useState("normal");
  const [numerator, setNumerator] = useState(4);
  const [denominator, setDenominator] = useState(4);

  const speedMultiplier = SPEED_OPTIONS.find(
    (o) => o.key === speedKey,
  ).multiplier;
  const pendulumRef = useRef(null);

  const handleBeat = useCallback((beatIndex) => {
    pendulumRef.current?.onBeat(beatIndex);
  }, []);

  const {
    isPlaying,
    isPaused,
    elapsedMs,
    start,
    stop,
    pause,
    resume,
    beatDuration,
  } = useMetronome({
    tempo,
    speedMultiplier,
    numerator,
    onBeat: handleBeat,
  });

  const handleStart = () => {
    pendulumRef.current?.prepareStart();
    start();
  };

  const handleStop = () => {
    stop();
    pendulumRef.current?.reset();
  };

  const handlePause = () => {
    pause();
    pendulumRef.current?.reset();
  };

  const handleResume = () => {
    pendulumRef.current?.prepareStart();
    resume();
  };

  return (
    <div className="flex h-lvh flex-col items-center justify-between px-6 py-8 md:p-16">
      <div className="flex flex-col items-center xl:gap-2">
        <p className="font-mono text-xs font-bold tracking-widest text-[#605144] xl:text-2xl">
          MUSIC PRACTICE
        </p>
        <h1 className="font-display text-3xl font-bold text-[#f5ead7] xl:text-6xl">
          METRONOME
        </h1>
      </div>

      <div className="flex w-full flex-col items-center gap-4 xl:gap-8">
        <div className="flex w-full flex-col items-center gap-4">
          <PendulumStage
            ref={pendulumRef}
            numerator={numerator}
            beatDuration={beatDuration}
          />
          <Transport
            isPlaying={isPlaying}
            isPaused={isPaused}
            elapsedMs={elapsedMs}
            onStart={handleStart}
            onStop={handleStop}
            onPause={handlePause}
            onResume={handleResume}
          />
        </div>

        <div className="flex w-full flex-col gap-2 md:flex-row md:gap-4">
          <TempoControl tempo={tempo} onChange={setTempo} />

          <SpeedControl
            speedKey={speedKey}
            onChange={setSpeedKey}
            effectiveBpm={tempo * speedMultiplier}
          />

          <TimeSignatureControl
            numerator={numerator}
            denominator={denominator}
            onNumeratorChange={setNumerator}
            onDenominatorChange={setDenominator}
          />
        </div>
      </div>
    </div>
  );
}
