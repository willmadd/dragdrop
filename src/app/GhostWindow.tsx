import { useThree, useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";

type WallData = {
  id: string;
  start: THREE.Vector3;
  dir: THREE.Vector3; // normalized
  length: number;
  angle: number;
};

export default function GhostWindow({
  size = new THREE.Vector3(2, 1, 0.3),
  color = "lime",
  wallsGroupRef, // ref to the group that contains the clickable wall meshes
}: {
  size?: THREE.Vector3;
  color?: string;
  wallsGroupRef: React.RefObject<THREE.Group>;
}) {
  const ghostRef = useRef<THREE.Mesh>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const { camera, scene, gl } = useThree();

  const [visible, setVisible] = useState(false);

  const onPointerMove = (e: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  React.useEffect(() => {
    gl.domElement.addEventListener("pointermove", onPointerMove);
    return () =>
      gl.domElement.removeEventListener("pointermove", onPointerMove);
  }, [gl.domElement]);

  useFrame(() => {
    if (!ghostRef.current) return;

    raycaster.current.setFromCamera(mouse.current, camera);

    // 1) Intersect with wall meshes (children of wallsGroupRef)
    let hits: THREE.Intersection[] = [];
    if (wallsGroupRef.current) {
      hits = raycaster.current.intersectObjects(
        wallsGroupRef.current.children,
        true
      );
    }

    if (hits.length) {
      // Assume the first hit is the wall
      const hit = hits[0];
      console.log("Hit wall:", hit.object.userData.wallData);
      const wall: WallData | undefined = hit.object.userData.wallData as
        | WallData
        | undefined;
      if (wall) {
        // Projection along wall axis
        const localHit = hit.point.clone().sub(wall.start);
        const along = localHit.dot(wall.dir);

        // keep box inside the segment (account for half width)
        const halfW = size.x / 2;
        const clampedAlong = THREE.MathUtils.clamp(
          along,
          halfW,
          wall.length - halfW
        );

        // Position center
        const center = wall.start
          .clone()
          .addScaledVector(wall.dir, clampedAlong);

        // Offset slightly inward from wall plane if you used an inward normal; optional
        const inward = new THREE.Vector3(
          -wall.dir.z,
          0,
          wall.dir.x
        ).multiplyScalar(-0.1);

        center.add(inward);

        center.y = 1.35;

        ghostRef.current.position.copy(center);
        ghostRef.current.rotation.set(0, -wall.angle, 0);
        setVisible(true);
        return;
      }
    }

    // 2) Not over a wall -> hide or drop to floor
    setVisible(false);
  });

  return (
    <mesh ref={ghostRef} visible={visible}>
      <boxGeometry args={[size.x, size.y, size.z]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
