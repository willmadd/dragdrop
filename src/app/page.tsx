"use client";
import Scene from "./Scene";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <main className="h-full w-full">
        <Canvas>
          <Scene />
        </Canvas>
      </main>
    </div>
  );
}
