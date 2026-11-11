'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { SwordDesign } from '@/lib/data/skills';
import { createOutlineMaterial, createToonMaterial, outlineGeometry } from './toon';

/**
 * Espada procedural low-poly. Três designs originais, montados só com formas básicas:
 * - pixel:  sabre fino de ponta em degraus e guarda de cubos (front-end / pixel art)
 * - neural: montante largo com "neurônios" na guarda e pomo em anel (machine learning)
 * - root:   gládio curto de ponta chanfrada e guarda em colchete (back-end / base)
 * Modelada com a guarda em y=0, lâmina para baixo (-y) e cabo para cima (+y).
 */

type PartKind = 'blade' | 'metal' | 'dark' | 'accent';
type Part = {
  geometry: THREE.BufferGeometry;
  kind: PartKind;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

export const SWORD_SPECS: Record<SwordDesign, { blade: number; buried: number; top: number }> = {
  pixel: { blade: 2.15, buried: 0.6, top: 1.05 },
  neural: { blade: 3.0, buried: 0.85, top: 1.4 },
  root: { blade: 1.95, buried: 0.5, top: 0.9 },
};

function blade(points: Array<[number, number]>, depth: number, bevel: number) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 1.3,
    bevelSegments: 1,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

function buildSword(design: SwordDesign): Part[] {
  switch (design) {
    case 'pixel':
      return [
        {
          kind: 'blade',
          geometry: blade(
            [
              [-0.1, 0],
              [0.1, 0],
              [0.1, -1.75],
              [0.04, -1.75],
              [0.04, -1.95],
              [-0.02, -1.95],
              [-0.02, -2.15],
              [-0.1, -2.15],
            ],
            0.05,
            0.02,
          ),
        },
        { kind: 'accent', geometry: box(0.52, 0.14, 0.18), position: [0, 0.07, 0] },
        { kind: 'dark', geometry: box(0.14, 0.14, 0.18), position: [-0.33, 0.21, 0] },
        { kind: 'dark', geometry: box(0.14, 0.14, 0.18), position: [0.33, 0.21, 0] },
        { kind: 'dark', geometry: box(0.11, 0.6, 0.11), position: [0, 0.44, 0] },
        {
          kind: 'accent',
          geometry: box(0.2, 0.2, 0.14),
          position: [0, 0.86, 0],
          rotation: [0, 0, Math.PI / 4],
        },
      ];
    case 'neural':
      return [
        {
          kind: 'blade',
          geometry: blade(
            [
              [-0.3, 0],
              [0.3, 0],
              [0.36, -1.2],
              [0.3, -2.4],
              [0, -3.0],
              [-0.3, -2.4],
              [-0.36, -1.2],
            ],
            0.08,
            0.04,
          ),
        },
        { kind: 'dark', geometry: box(0.09, 1.9, 0.2), position: [0, -1.1, 0] },
        { kind: 'metal', geometry: box(1.2, 0.16, 0.2), position: [0, 0.08, 0] },
        {
          kind: 'accent',
          geometry: new THREE.IcosahedronGeometry(0.15, 0),
          position: [-0.64, 0.08, 0],
        },
        { kind: 'accent', geometry: new THREE.IcosahedronGeometry(0.22, 0), position: [0, 0.1, 0] },
        {
          kind: 'accent',
          geometry: new THREE.IcosahedronGeometry(0.15, 0),
          position: [0.64, 0.08, 0],
        },
        {
          kind: 'dark',
          geometry: new THREE.CylinderGeometry(0.08, 0.09, 0.9, 6),
          position: [0, 0.62, 0],
        },
        {
          kind: 'metal',
          geometry: new THREE.TorusGeometry(0.17, 0.055, 5, 8),
          position: [0, 1.22, 0],
        },
      ];
    case 'root':
      return [
        {
          kind: 'blade',
          geometry: blade(
            [
              [-0.17, 0],
              [0.17, 0],
              [0.17, -1.6],
              [-0.17, -1.95],
            ],
            0.07,
            0.03,
          ),
        },
        { kind: 'metal', geometry: box(0.74, 0.14, 0.2), position: [0, 0.07, 0] },
        { kind: 'accent', geometry: box(0.12, 0.3, 0.2), position: [-0.31, -0.15, 0] },
        { kind: 'accent', geometry: box(0.12, 0.3, 0.2), position: [0.31, -0.15, 0] },
        {
          kind: 'dark',
          geometry: new THREE.CylinderGeometry(0.075, 0.075, 0.55, 6),
          position: [0, 0.42, 0],
        },
        {
          kind: 'accent',
          geometry: new THREE.CylinderGeometry(0.15, 0.15, 0.14, 6),
          position: [0, 0.78, 0],
        },
      ];
  }
}

function starShape() {
  const shape = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? 1 : 0.22;
    const a = (i / 8) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i) shape.lineTo(x, y);
    else shape.moveTo(x, y);
  }
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

export type SwordColors = {
  ink: string;
  blade: string;
  metal: string;
  dark: string;
  accent: string;
  glint: string;
};

type Props = {
  design: SwordDesign;
  x: number;
  z: number;
  tilt: number;
  yaw: number;
  hovered: boolean;
  selected: boolean;
  colors: SwordColors;
  /** contorno mais barato para a versão leve */
  lite?: boolean;
  onHover: (over: boolean) => void;
  onSelect: () => void;
};

export function Sword({
  design,
  x,
  z,
  tilt,
  yaw,
  hovered,
  selected,
  colors,
  lite = false,
  onHover,
  onSelect,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const glint = useRef<THREE.Mesh>(null);
  const anim = useRef({ tilt, glint: 1 });
  const spec = SWORD_SPECS[design];

  const parts = useMemo(
    () => buildSword(design).map((p) => ({ ...p, outline: outlineGeometry(p.geometry) })),
    [design],
  );
  const outline = useMemo(
    () => createOutlineMaterial(colors.ink, lite ? 0.03 : 0.036),
    [colors.ink, lite],
  );
  const star = useMemo(() => starShape(), []);
  const materials = useMemo(
    () => ({
      blade: createToonMaterial(colors.blade, colors.ink, 4),
      metal: createToonMaterial(colors.metal, colors.ink, 3.2),
      dark: createToonMaterial(colors.dark, colors.ink, 3),
      accent: createToonMaterial(colors.accent, colors.ink, 3.2),
    }),
    [colors],
  );

  useEffect(
    () => () => {
      Object.values(materials).forEach((m) => m.dispose());
      outline.dispose();
    },
    [materials, outline],
  );
  useEffect(
    () => () => {
      parts.forEach((p) => {
        p.geometry.dispose();
        p.outline.dispose();
      });
      star.dispose();
    },
    [parts, star],
  );

  // brilho de corte: dispara a cada novo hover
  useEffect(() => {
    if (hovered) anim.current.glint = 0;
  }, [hovered]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const a = anim.current;

    const restY = spec.blade - spec.buried;
    const targetY = selected ? spec.blade + 0.5 : restY;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, selected ? 4.5 : 7, dt);

    a.tilt = THREE.MathUtils.damp(a.tilt, selected ? 0 : tilt, 6, dt);
    const tremble = hovered && !selected ? Math.sin(t * 58) * 0.012 + Math.sin(t * 37) * 0.008 : 0;
    g.rotation.z = a.tilt + tremble;

    if (selected) {
      g.rotation.y += dt * 0.9;
    } else {
      g.rotation.y = THREE.MathUtils.damp(
        ((g.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI,
        yaw,
        5,
        dt,
      );
    }

    const s = glint.current;
    if (s) {
      a.glint = Math.min(1, a.glint + dt * 1.7);
      const on = a.glint < 1;
      s.visible = on;
      if (on) {
        const size = Math.sin(Math.PI * a.glint) * 0.42;
        s.scale.setScalar(size);
        s.position.y = THREE.MathUtils.lerp(-0.15, -(spec.blade - spec.buried) + 0.2, a.glint);
        s.rotation.z = a.glint * 2.4;
      }
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(true);
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };
  const height = spec.blade + spec.top;

  return (
    <group ref={group} position={[x, spec.blade - spec.buried, z]} rotation={[0, yaw, tilt]}>
      {parts.map((part, i) => (
        <group key={i} position={part.position} rotation={part.rotation}>
          <mesh geometry={part.geometry} material={materials[part.kind]} />
          <mesh geometry={part.outline} material={outline} />
        </group>
      ))}

      <mesh ref={glint} geometry={star} position={[0.05, -0.2, 0.3]} visible={false}>
        <meshBasicMaterial color={colors.glint} side={THREE.DoubleSide} />
      </mesh>

      {/* área de clique generosa e invisível */}
      <mesh
        position={[0, spec.top - height / 2, 0]}
        onPointerOver={over}
        onPointerOut={() => onHover(false)}
        onClick={click}
      >
        <boxGeometry args={[1.5, height, 0.9]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
