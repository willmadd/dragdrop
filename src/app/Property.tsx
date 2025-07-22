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
                position: new THREE.Vector2(2, 1),
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
                position: new THREE.Vector2(2, 1.5),
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
                position: new THREE.Vector2(3, 1.5),
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
                position: new THREE.Vector2(5, 1.5),
                size: new THREE.Vector3(2, 1, 0.3),
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <>
      {property.rooms.map((room) => (
        <RoomMeshes key={room.id} room={room} />
      ))}
    </>
  );
};

export default Property;
