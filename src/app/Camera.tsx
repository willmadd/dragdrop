import {
  MapControls,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import React from "react";

const Camera = () => {
  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[0, 10, 0]}
        zoom={50}
        near={0.1}
        far={1000}
      />
      <OrbitControls />
    </>
  );
};

export default Camera;
