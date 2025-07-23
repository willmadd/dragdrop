import React from "react";
import * as THREE from "three";
import RoomMeshes from "./Room";

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
type Property = {
  rooms: Room[];
};
const WINDOW_HEIGHT_FROM_FLOOR = 0.85;
const Property = () => {
  const property: Property = {
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

  const [houseData, setHouseData] = React.useState<Property>(property);

  const handleAddWindow = (wallId: string) => {
    const getWallId = () => console.log("getWallId" + wallId);
    getWallId();
  };

  return (
    <>
      <axesHelper args={[5]} />
      {houseData.rooms.map((room) => (
        <RoomMeshes
          key={room.id}
          room={room}
          handleAddWindow={handleAddWindow}
        />
      ))}
    </>
  );
};

export default Property;
