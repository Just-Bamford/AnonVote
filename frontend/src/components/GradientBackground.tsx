import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

interface GradientConfig {
  color1: string;
  color2: string;
  color3: string;
  type: "plane" | "sphere" | "waterPlane";
  animate: "on" | "off";
  uSpeed: number;
  uStrength: number;
  uDensity: number;
  uFrequency: number;
  brightness: number;
  grain: "on" | "off";
}

interface Props {
  config: GradientConfig;
}

export default function GradientBackground({ config }: Props) {
  return (
    <ShaderGradientCanvas
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
      pixelDensity={1}
      fov={45}
    >
      <ShaderGradient
        animate={config.animate}
        type={config.type}
        color1={config.color1}
        color2={config.color2}
        color3={config.color3}
        uSpeed={config.uSpeed}
        uStrength={config.uStrength}
        uDensity={config.uDensity}
        uFrequency={config.uFrequency}
        brightness={config.brightness}
        grain={config.grain}
        lightType="3d"
        envPreset="city"
        reflection={0.1}
        cAzimuthAngle={180}
        cPolarAngle={90}
        cDistance={3.6}
        cameraZoom={1}
        positionX={-1.4}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
      />
    </ShaderGradientCanvas>
  );
}
