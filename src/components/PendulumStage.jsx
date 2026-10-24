import { useImperativeHandle, useRef, useEffect } from "react";
import { Model } from "./Model";
import { Canvas } from "@react-three/fiber";

const BALL_POSITION = 1.8;

// Which side a given beat index sits on. Beat 0 (the downbeat) is always left.
const sideFor = (beatIndex) => (beatIndex % 2 === 0 ? -1 : 1);

/**
 * Pendulum arm + beat dots.
 *
 * Built as one SVG with a viewBox, scaled purely by container width
 * (`w-full h-auto`) — every coordinate (pivot, arm, weight) lives in the
 * same 260x140 unit space, so it resizes cleanly at any breakpoint without
 * separate fixed-pixel layouts for mobile vs. desktop.
 *
 * Exposes an imperative handle (onBeat/prepareStart/reset) rather than
 * taking beatIndex as a prop, because the parent's scheduler drives beats
 * via setTimeout timed to the audio clock — routing that through React
 * state would add a render in the critical path and risk visible jitter.
 * Direct DOM writes keep the animation locked to audio time.
 */
export default function PendulumStage({ numerator, beatDuration, ref }) {
  const ballRef = useRef(null);
  const motionRef = useRef(null);
  const dotRefs = useRef([]);
  const reducedMotionRef = useRef(false);
  const animationDurationRef = useRef(0);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const positionBallInstant = (beatIndex) => {
    const ball = ballRef.current;
    if (!ball) return;
    animationDurationRef.current = 0;
    ball.position.x = sideFor(beatIndex) * BALL_POSITION;
    // void group.getBoundingClientRect(); // force reflow so the next transition doesn't merge with this snap
  };

  const highlightDot = (beatIndex) => {
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      // bg-line/border-line and bg-brass/bg-ember are same-specificity
      // single-class selectors — leaving both on an element lets source
      // order (not which was added last) decide the winner. So the resting
      // color classes must be explicitly removed, not just left in place.
      dot.classList.remove(
        "bg-line",
        "border-line",
        "bg-brass",
        "border-brass",
        "bg-ember",
        "border-ember",
        "scale-110",
      );
      if (i !== beatIndex) {
        dot.classList.add("bg-line", "border-line");
        return;
      }
      dot.classList.add("scale-110");
      if (beatIndex === 0) dot.classList.add("bg-ember", "border-ember");
      else dot.classList.add("bg-brass", "border-brass");
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      // Called once per beat, at the same moment that beat's click sounds.
      onBeat(beatIndex) {
        highlightDot(beatIndex);

        if (!reducedMotionRef.current && ballRef.current) {
          // Snap to this beat's side (should already be here from the
          // previous beat's animation), then animate toward the *next*
          // beat's side so the arm lands exactly when it clicks.
          positionBallInstant(beatIndex);
          const nextBeatIndex = (beatIndex + 1) % numerator;
          motionRef.current = {
            from: ballRef.current.position.x,
            to: BALL_POSITION * sideFor(nextBeatIndex),
            rotationFrom: ballRef.current.rotation.z,
            rotationTo: -Math.PI * sideFor(nextBeatIndex),
            duration: beatDuration(),
            elapsed: 0,
          };
        }
      },
      // Pre-position the arm at the downbeat's side before the first click,
      // so it isn't caught mid-swing when playback starts.
      prepareStart() {
        positionBallInstant(0);
      },
      reset() {
        highlightDot(-1);
        if (ballRef.current) {
          animationDurationRef.current = 0;
          ballRef.current.position.x = -BALL_POSITION;
        }
      },
    }),
    [numerator, beatDuration],
  );

  return (
    <>
      <div className="relative -z-10 aspect-video w-screen lg:absolute lg:top-0 lg:left-0 lg:aspect-auto lg:h-screen">
        <Canvas>
          <ambientLight intensity={0.5} />
          <Model ref={ballRef} motionRef={motionRef} />
        </Canvas>
        <div className="absolute top-0 left-0 h-full w-full bg-linear-to-b from-[#24150E] via-transparent to-[#24150E] lg:via-none lg:from-transparent lg:to-75% xl:to-90%" />
      </div>

      <div className="w-full">
        <div className="flex min-h-2.5 justify-center gap-2">
          {Array.from({ length: numerator }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              className="bg-line border-line h-2 w-2 rounded-full border transition-transform duration-75"
            />
          ))}
        </div>
      </div>
    </>
  );
}
