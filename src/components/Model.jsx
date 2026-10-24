import React from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useIsMobile } from "./useIsMobile";

function BallMotion({ ballRef, motionRef }) {
  useFrame((_, delta) => {
    const motion = motionRef.current;
    const ball = ballRef.current;
    if (!motion || !ball) return;

    motion.elapsed += delta;
    const t = Math.min(motion.elapsed / motion.duration, 1);
    const eased = 0.5 - 0.5 * Math.cos(Math.PI * t);

    ball.position.x = motion.from + (motion.to - motion.from) * eased;
    ball.rotation.z =
      motion.rotationFrom + (motion.rotationTo - motion.rotationFrom) * eased;

    if (t === 1) motionRef.current = null;
  });

  return null;
}

export function Model({ ref, motionRef, ...props }) {
  const { nodes, materials } = useGLTF("3D Sphere Metronome.glb");
  const isMobile = useIsMobile(768);
  const isLg = useIsMobile(1024);
  const isXl = useIsMobile(1440);
  const is2xl = useIsMobile(1536);

  return (
    <group {...props} dispose={null}>
      <BallMotion ballRef={ref} motionRef={motionRef} />
      <PerspectiveCamera
        makeDefault={true}
        far={100}
        near={0.1}
        fov={22.895}
        position={
          isMobile
            ? [0, 9, 0]
            : isLg
              ? [0, 9, 0]
              : isXl
                ? [0, 16, 1.3]
                : is2xl
                  ? [0, 15, 1.05]
                  : [0, 14, 0.825]
        }
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={nodes.Icosphere001.geometry}
        material={materials["Red matte metal"]}
        position={[-1.8, 0, 0]}
      />
      <pointLight
        castShadow
        intensity={100}
        decay={2}
        position={[4.076, 5.904, -1.005]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <pointLight
        castShadow
        intensity={100}
        decay={2}
        position={[-4.076, 5.904, 1.5]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane001.geometry}
        material={materials["Brown matte metal"]}
      />
    </group>
  );
}

useGLTF.preload("3D Sphere Metronome.glb");
