import React from "react";
import * as THREE from "three";
import RoomMeshes from "./Room";
import GhostWindow from "./GhostWindow";

const WINDOW_HEIGHT_FROM_FLOOR = 0.85;
const property: PropertyType = {
  rooms: [
    {
      id: "room-1",
      position: new THREE.Vector3(0, 0, 0),
      walls: [
        {
          id: "1-xxxxxx",
          position: new THREE.Vector3(-2, 0, -4),
          feature: [
            {
              id: "window-1",
              type: "window",
              position: new THREE.Vector2(0.5, WINDOW_HEIGHT_FROM_FLOOR),
              size: new THREE.Vector3(2, 1, 0.3),
            },
          ],
        },
        {
          id: "2-xxxxxx",
          position: new THREE.Vector3(4, 0, -4),
          feature: [
            {
              id: "window-3",
              type: "window",
              position: new THREE.Vector2(2, WINDOW_HEIGHT_FROM_FLOOR),
              size: new THREE.Vector3(2, 1, 0.3),
            },
          ],
        },
        {
          id: "3-xxxxxx",
          position: new THREE.Vector3(4, 0, 4),
          feature: [
            {
              id: "window-2",
              type: "window",
              position: new THREE.Vector2(3, WINDOW_HEIGHT_FROM_FLOOR),
              size: new THREE.Vector3(2, 1, 0.3),
            },
          ],
        },
        {
          id: "4-xxxxxx",
          position: new THREE.Vector3(-4, 0, 4),
          feature: [
            {
              id: "window-4",
              type: "window",
              position: new THREE.Vector2(2, WINDOW_HEIGHT_FROM_FLOOR),
              size: new THREE.Vector3(2, 1, 0.3),
            },
          ],
        },
      ],
    },
  ],
};

type Feature = {
  id: string;
  type: string;
  position: THREE.Vector2;
  size: THREE.Vector3;
};

type Walls = {
  id: string;
  position: THREE.Vector3;
  feature: Feature[];
};

export type Room = {
  id: string;
  walls: Walls[];
  position: THREE.Vector3;
};
type PropertyType = {
  rooms: Room[];
};

const Property = () => {
  const [houseData, setHouseData] = React.useState<PropertyType>(property);

  const wallsGroupRef = React.useRef<THREE.Group>(null!);

  const handleAddWindow = (wallId: string) => {
    const getWallId = () => console.log("getWallId" + wallId);
    getWallId();
  };

  return (
    <>
      <axesHelper args={[5]} />
      <group ref={wallsGroupRef}>
        {houseData.rooms.map((room) => (
          <RoomMeshes
            key={room.id}
            room={room}
            handleAddWindow={handleAddWindow}
            wallsGroupRef={wallsGroupRef}
          />
        ))}
      </group>
      <GhostWindow wallsGroupRef={wallsGroupRef} />
    </>
  );
};

export default Property;
