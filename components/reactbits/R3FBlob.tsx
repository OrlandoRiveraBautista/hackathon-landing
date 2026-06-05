"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/lib/useMediaQuery";

// R3F still uses THREE.Clock internally — harmless deprecation noise from three r184
if (
  typeof window !== "undefined" &&
  !(window as Window & { __threeClockPatched?: boolean }).__threeClockPatched
) {
  const _warn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    _warn(...args);
  };
  (window as Window & { __threeClockPatched?: boolean }).__threeClockPatched =
    true;
}

/* ── Shaders: smooth organic morph + glossy iridescence ─────────────────── */

const vertexShader = /* glsl */ `
uniform float u_intensity;
uniform float u_time;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisplacement;

vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0/7.0; vec4 gy0 = fract(floor(gx0)/7.0)-0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5)-abs(gx0)-abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0*(step(0.0,gx0)-0.5); gy0 -= sz0*(step(0.0,gy0)-0.5);
  vec4 gx1 = ixy1/7.0; vec4 gy1 = fract(floor(gx1)/7.0)-0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5)-abs(gx1)-abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1*(step(0.0,gx1)-0.5); gy1 -= sz1*(step(0.0,gy1)-0.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x); vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z); vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x); vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z); vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x; g010*=norm0.y; g100*=norm0.z; g110*=norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x; g011*=norm1.y; g101*=norm1.z; g111*=norm1.w;
  float n000=dot(g000,Pf0);
  float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
  float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
  float n111=dot(g111,Pf1);
  vec3 fade_xyz=fade(Pf0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2*n_xyz;
}

void main() {
  vUv = uv;

  // Low-frequency noise = smooth breathing, not lumpy bumps
  float n1 = cnoise(position * 0.55 + vec3(u_time * 0.55));
  float n2 = cnoise(position * 0.28 + vec3(u_time * 0.28 + 4.0)) * 0.45;
  vDisplacement = n1 + n2;

  vec3 displaced = position + normal * (u_intensity * vDisplacement);
  vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
  vWorldPos = worldPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  vec4 viewPos = viewMatrix * worldPos;
  gl_Position = projectionMatrix * viewPos;
}
`;

const fragmentShader = /* glsl */ `
uniform float u_time;
uniform float u_intensity;
uniform vec3 u_colorShift;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisplacement;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);

  // Fresnel rim — glossy edge glow
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);

  // View-angle iridescence (oil-slick streaks)
  float iriAngle = dot(N, V) * 3.5 + u_time * 0.35 + vUv.y * 2.0;
  vec3 iri = vec3(
    0.5 + 0.5 * sin(iriAngle + u_colorShift.r),
    0.5 + 0.5 * sin(iriAngle + 2.1 + u_colorShift.g),
    0.5 + 0.5 * sin(iriAngle + 4.2 + u_colorShift.b)
  );

  // Core palette: deep indigo body, pink/cyan/lime highlights
  vec3 deepBody  = vec3(0.03, 0.02, 0.10);
  vec3 midTone   = vec3(0.12, 0.06, 0.32);
  vec3 highlight = mix(
    vec3(0.95, 0.25, 0.85),  // pink
    vec3(0.15, 0.85, 0.95),  // cyan
    0.5 + 0.5 * sin(u_time * 0.3 + vUv.x * 4.0)
  );
  highlight = mix(highlight, vec3(0.75, 0.95, 0.20), fresnel * 0.35); // lime rim

  // Specular hot-spot
  vec3 L = normalize(vec3(-0.5, 0.9, 0.6));
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 48.0);

  // Subtle displacement tint
  float breathe = vDisplacement * u_intensity * 0.6 + 0.5;

  vec3 col = mix(deepBody, midTone, breathe * 0.7);
  col = mix(col, highlight, fresnel * 0.85);
  col = mix(col, iri * 0.9, fresnel * 0.55);
  col += vec3(1.0, 0.9, 1.0) * spec * 0.7;

  // Soft ambient lift so silhouette isn't pure black
  col += midTone * 0.12;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ── Geometry builders ────────────────────────────────────────────────────── */

function buildMushroomGeometry(): THREE.BufferGeometry {
  // Smooth dome cap + longer tapered stem + soft pointed tip
  const points: THREE.Vector2[] = [
    new THREE.Vector2(0.0, -3.35),
    new THREE.Vector2(0.05, -3.05),
    new THREE.Vector2(0.1, -2.72),
    new THREE.Vector2(0.16, -2.38),
    new THREE.Vector2(0.22, -2.02),
    new THREE.Vector2(0.26, -1.65),
    new THREE.Vector2(0.28, -1.28),
    new THREE.Vector2(0.27, -0.92),
    new THREE.Vector2(0.24, -0.55),
    new THREE.Vector2(0.22, -0.18),
    new THREE.Vector2(0.24, 0.15),
    new THREE.Vector2(0.38, 0.42),
    new THREE.Vector2(0.62, 0.68),
    new THREE.Vector2(0.95, 0.92),
    new THREE.Vector2(1.28, 1.12),
    new THREE.Vector2(1.52, 1.32),
    new THREE.Vector2(1.62, 1.55),
    new THREE.Vector2(1.58, 1.78),
    new THREE.Vector2(1.38, 1.96),
    new THREE.Vector2(1.05, 2.1),
    new THREE.Vector2(0.62, 2.18),
    new THREE.Vector2(0.22, 2.22),
    new THREE.Vector2(0.0, 2.22),
  ];

  const geo = new THREE.LatheGeometry(points, 72);
  geo.computeVertexNormals();
  return geo;
}

function buildClawGeometry(): THREE.BufferGeometry {
  class ClawCurve extends THREE.Curve<THREE.Vector3> {
    constructor() {
      super();
    }

    getPoint(t: number): THREE.Vector3 {
      // Smooth arc: thick left → tapered right tip
      const eased = t * t * (3 - 2 * t); // smoothstep for nicer taper
      const angle = THREE.MathUtils.lerp(
        Math.PI * 1.08,
        -Math.PI * 0.12,
        eased,
      );
      const r = 1.75;
      return new THREE.Vector3(
        r * Math.cos(angle) + 0.15,
        r * Math.sin(angle) * 0.48,
        Math.sin(angle * 0.5) * 0.18,
      );
    }
  }

  const segments = 160;
  const radialSegments = 32;
  const geo = new THREE.TubeGeometry(
    new ClawCurve(),
    segments,
    0.68,
    radialSegments,
    false,
  );
  const pos = geo.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const taper = Math.pow(1.0 - t * 0.92, 1.65);
    const zScale = 0.42 + (1 - t) * 0.58;

    const eased = t * t * (3 - 2 * t);
    const angle = THREE.MathUtils.lerp(Math.PI * 1.08, -Math.PI * 0.12, eased);
    const cx = 1.75 * Math.cos(angle) + 0.15;
    const cy = 1.75 * Math.sin(angle) * 0.48;
    const cz = Math.sin(angle * 0.5) * 0.18;

    for (let j = 0; j <= radialSegments; j++) {
      const idx = i * (radialSegments + 1) + j;
      const ox = pos.getX(idx) - cx;
      const oy = pos.getY(idx) - cy;
      const oz = pos.getZ(idx) - cz;

      // Elliptical cross-section for a flatter, ribbon-like claw
      pos.setXYZ(
        idx,
        cx + ox * taper,
        cy + oy * taper * 0.82,
        cz + oz * zScale * taper,
      );
    }
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/* ── Animated mesh ────────────────────────────────────────────────────────── */

interface BlobMeshProps {
  variant: "claw" | "mushroom";
  intensity?: number;
  speed?: number;
  colorShift?: [number, number, number];
}

function BlobMesh({
  variant,
  intensity = 0.14,
  speed = 0.35,
  colorShift = [0, 0, 0],
}: BlobMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(
    () => (variant === "claw" ? buildClawGeometry() : buildMushroomGeometry()),
    [variant],
  );

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: intensity },
      u_colorShift: { value: new THREE.Vector3(...colorShift) },
    }),
    [intensity, colorShift],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = t * speed;
    }

    if (meshRef.current) {
      // Gentle idle sway — keeps them alive without feeling jittery
      meshRef.current.rotation.y = Math.sin(t * 0.22) * 0.06;
      meshRef.current.rotation.x = Math.sin(t * 0.17 + 1.2) * 0.04;
      meshRef.current.rotation.z = Math.sin(t * 0.13 + 2.4) * 0.03;
    }
  });

  const transform =
    variant === "claw"
      ? {
          position: [0.1, -0.15, 0] as [number, number, number],
          rotation: [0.1, -0.35, 0.15] as [number, number, number],
          scale: [1.05, 1, 1.1] as [number, number, number],
        }
      : {
          position: [0.15, 0.12, 0] as [number, number, number],
          rotation: [0.08, -0.25, 0.12] as [number, number, number],
          scale: [0.9, 1.28, 0.95] as [number, number, number],
        };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={transform.position}
      rotation={transform.rotation}
      scale={transform.scale}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/* ── Public component ─────────────────────────────────────────────────────── */

export interface R3FBlobProps {
  variant: "claw" | "mushroom";
  width?: number | string;
  height?: number | string;
  intensity?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function R3FBlob({
  variant,
  width = 300,
  height = 300,
  intensity,
  speed,
  className,
  style,
}: R3FBlobProps) {
  const isMobile = useIsMobile();
  const defaults =
    variant === "claw"
      ? {
          intensity: 0.12,
          speed: 0.32,
          colorShift: [0.0, 1.2, 2.4] as [number, number, number],
          cam: [0.2, -0.15, 6.8] as [number, number, number],
        }
      : {
          intensity: 0.1,
          speed: 0.28,
          colorShift: [1.8, 0.4, 3.0] as [number, number, number],
          cam: [0.1, 0.05, 5.6] as [number, number, number],
        };

  return (
    <div
      className={className}
      style={{
        width,
        height,
        filter: "drop-shadow(0 0 28px rgba(120, 60, 220, 0.35))",
        ...style,
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: !isMobile }}
        camera={{ position: defaults.cam, fov: 38 }}
        style={{ background: "transparent" }}
        dpr={isMobile ? 1 : [1, 2]}
      >
        <BlobMesh
          variant={variant}
          intensity={intensity ?? defaults.intensity}
          speed={speed ?? defaults.speed}
          colorShift={defaults.colorShift}
        />
      </Canvas>
    </div>
  );
}
