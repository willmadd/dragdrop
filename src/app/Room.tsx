import offsetPolygon from "offset-polygon";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Room } from "./Property";
import { Text } from "@react-three/drei";

const WALL_THICKNESS = 0.2;

const RoomMeshes = ({
  room,
  handleAddWindow,
  wallsGroupRef,
}: {
  room: Room;
  handleAddWindow: (wallId: string) => void;
  wallsGroupRef: React.RefObject<THREE.Group>;
}) => {
  console.log("Rendering RoomMeshes for room:", room);
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

  const getWallSegmentEnds = (index: number) => {
    const startCorner = room.walls[index];
    const endCorner = room.walls[(index + 1) % room.walls.length];

    const start = new THREE.Vector3(
      startCorner.position.x,
      0,
      startCorner.position.z
    );
    const end = new THREE.Vector3(
      endCorner.position.x,
      0,
      endCorner.position.z
    );

    return { start, end };
  };

  const WALL_HEIGHT = 2.3;

  return (
    <>
      <group position={[room.position.x, 0, room.position.z]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <shapeGeometry args={[floorShape]} />
          <meshStandardMaterial color="black" side={THREE.DoubleSide} />
        </mesh>

        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, WALL_HEIGHT, 0]}
          onClick={() => handleAddWindow(room.id)}
        >
          <extrudeGeometry
            args={[
              wallShape,
              {
                depth: WALL_HEIGHT,
                bevelEnabled: false,
                curveSegments: 12,
                steps: 1,
              },
            ]}
          />
          <meshStandardMaterial color="red" side={THREE.DoubleSide} />
        </mesh>

        {room.walls.map((wall, i) => {
          const { start, end } = getWallSegmentEnds(i);
          const dir = end.clone().sub(start);
          const dirNorm = dir.clone().normalize();
          const length = dir.length();
          const mid = start.clone().addScaledVector(dir, 0.5);
          const angle = Math.atan2(dir.z, dir.x);

          return (
            <group key={wall.id}>
              <mesh
                position={[
                  mid.x + room.position.x,
                  WALL_HEIGHT / 2,
                  mid.z + room.position.z,
                ]}
                rotation={[0, -angle, 0]}
                onClick={(e) => {
                  e.stopPropagation();

                  console.log("%c%s", "color: #ff0000", wall.id);
                  handleAddWindow(wall.id);
                }}
                ref={(m) => {
                  if (m) {
                    m.userData.wallData = {
                      id: wall.id,
                      start,
                      dir: dirNorm,
                      length,
                      angle,
                    };
                  }
                }}
              >
                <boxGeometry args={[length, WALL_HEIGHT, 0.55]} />
                <meshBasicMaterial
                  transparent
                  opacity={0.5}
                  depthWrite={false}
                />
              </mesh>

              {wall.feature
                ?.filter((f) => f.type === "window")
                .map((f) => {
                  const winW = f.size.x;
                  const winH = f.size.y;
                  const winD = f.size.z ?? 0.18;

                  const along = f.position.x;
                  const y = f.position.y + winH / 2;
                  const centerAlong = along + winW / 2;

                  const worldStart = start.clone().add(room.position);
                  const center = worldStart
                    .clone()
                    .addScaledVector(dirNorm, centerAlong);

                  const inward = new THREE.Vector3(
                    -dirNorm.z,
                    0,
                    dirNorm.x
                  ).multiplyScalar(-0.1);
                  center.add(inward);

                  return (
                    <mesh
                      key={f.id}
                      position={[center.x, y, center.z]}
                      rotation={[0, -angle, 0]}
                    >
                      <boxGeometry args={[winW, winH, winD]} />
                      <meshStandardMaterial color="skyblue" />
                    </mesh>
                  );
                })}
            </group>
          );
        })}
      </group>
    </>
  );
};

export default RoomMeshes;
