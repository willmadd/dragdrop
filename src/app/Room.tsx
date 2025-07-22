import offsetPolygon from "offset-polygon";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Room } from "./Property";

const RoomMeshes = ({ room }: { room: Room }) => {
  const extrudeSettings = useMemo(
    () => ({ depth: 2.3, bevelEnabled: false }),
    []
  );

  const { floorShape, wallShape } = useMemo(() => {
    const basePoints = room.walls.map(
      (wall) => new THREE.Vector2(wall.position.x, wall.position.z)
    );

    const floorShape = new THREE.Shape(basePoints);

    const offsetPoints = offsetPolygon(basePoints, 0.2);
    const offsetVector2s = offsetPoints.map(
      (pt: { x: number; y: number }) => new THREE.Vector2(pt.x, pt.y)
    );

    const wallShape = new THREE.Shape(offsetVector2s);
    wallShape.holes = [new THREE.Path(basePoints)];

    return { floorShape, wallShape };
  }, [room]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Floor */}
      <mesh
        position={
          new THREE.Vector3(room.position.x, room.position.y, room.position.z)
        }
      >
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Walls */}
      <mesh
        position={
          new THREE.Vector3(room.position.x, room.position.y, room.position.z)
        }
      >
        <extrudeGeometry args={[wallShape, extrudeSettings]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      {/* Windows */}
      {room.walls.map((wall) =>
        wall.feature?.map((feature) => {
          if (feature.type !== "window") return null;

          const posX = wall.position.x + feature.position.x;
          const posY = feature.position.y + 0.5 * feature.size.y; // center the box vertically
          const posZ = wall.position.z;

          return (
            <mesh
              key={feature.id}
              position={new THREE.Vector3(posX, posY, posZ)}
            >
              <boxGeometry
                args={[feature.size.x, feature.size.y, feature.size.z]}
              />
              <meshStandardMaterial color="yellow" />
            </mesh>
          );
        })
      )}
    </group>
  );
};

export default RoomMeshes;
