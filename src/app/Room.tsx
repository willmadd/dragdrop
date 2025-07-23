import offsetPolygon from "offset-polygon";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Room } from "./Property";

const RoomMeshes = ({ room }: { room: Room }) => {
  const extrudeSettings = useMemo(
    () => ({ depth: 2.3, bevelEnabled: false }),
    []
  );

  // 2D footprint
  const basePts = useMemo(
    () => room.walls.map((w) => new THREE.Vector2(w.position.x, w.position.z)),
    [room.walls]
  );

  const { floorShape, wallShape } = useMemo(() => {
    const floorShape = new THREE.Shape(basePts);

    const offsetPts = offsetPolygon(basePts, 0.2);
    const wallShape = new THREE.Shape(
      offsetPts.map((p) => new THREE.Vector2(p.x, p.y))
    );
    wallShape.holes = [new THREE.Path(basePts)];

    return { floorShape, wallShape };
  }, [basePts]);

  const centroid = useMemo(() => {
    const c = basePts.reduce(
      (acc, p) => acc.add(new THREE.Vector3(p.x, 0, p.y)),
      new THREE.Vector3()
    );
    return c.multiplyScalar(1 / basePts.length);
  }, [basePts]);

  // Helper: get start/end of wall i
  const getWallEnds = (i: number) => {
    const a = room.walls[i];
    const b = room.walls[(i + 1) % room.walls.length]; // next corner
    const A = new THREE.Vector3(a.position.x, 0, a.position.z);
    const B = new THREE.Vector3(b.position.x, 0, b.position.z);
    return { A, B };
  };

  // Small offset outward from wall to avoid z-fighting
  const EPS = 0.01;

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[room.position.x, 0, room.position.z]}
      >
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Walls */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[room.position.x, 0, room.position.z]}
      >
        <extrudeGeometry args={[wallShape, extrudeSettings]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      {/* Windows */}
      {room.walls.flatMap(
        (wall, i) =>
          wall.feature?.map((feature) => {
            if (feature.type !== "window") return null;

            // 1. segment & direction
            const { A, B } = getWallEnds(i);

            const dir = B.clone().sub(A); // vector along wall
            const wallLen = dir.length();
            const dirN = dir.clone().normalize();

            // clamp/check feature.position.x so it doesn't run past wall
            const distAlong = Math.min(
              Math.max(feature.position.x, 0),
              wallLen
            );

            // 2. point along the wall
            const along = A.clone().add(dirN.clone().multiplyScalar(distAlong));

            // 3. vertical center
            const y = feature.position.y + feature.size.y * 0.5;

            // 4. outward normal (2D)
            const normal2D = new THREE.Vector3(-dirN.z, 0, dirN.x); // rotate 90° around Y
            const outward = normal2D.multiplyScalar(EPS);

            const pos = along.clone().add(outward);
            pos.y = y;

            let n = normal2D.clone().normalize();

            // Flip if pointing inwards
            const toCenter = centroid.clone().sub(pos).normalize();
            if (n.dot(toCenter) > 0) {
              n.multiplyScalar(-1);
            }

            // final offset to avoid z-fighting or to embed half depth
            const offset = n.clone().multiplyScalar(EPS); // or (wallThickness/2 - feature.size.z/2)
            pos.add(offset);

            // orient the mesh so local +Z faces `n`
            const quat = new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 0, 1),
              n
            );

            return (
              <mesh key={feature.id} position={pos} quaternion={quat}>
                <boxGeometry
                  args={[feature.size.x, feature.size.y, feature.size.z]}
                />
                <meshStandardMaterial color="yellow" />
              </mesh>
            );
          }) ?? []
      )}
    </group>
  );
};

export default RoomMeshes;
