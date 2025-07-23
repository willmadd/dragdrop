import Camera from "./Camera";
import GhostWindow from "./GhostWindow";
import Property from "./Property";
import RoomMeshes from "./Room";

export default function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[20, 20, 20]} intensity={4} />
      <directionalLight position={[-20, 10, -20]} intensity={4} />
      <Camera />
      {/* <group rotation={[-Math.PI / 2, 0, 0]}>
        <RoomMeshes />
      </group> */}
      <Property />
    </>
  );
}
