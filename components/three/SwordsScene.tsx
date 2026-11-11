'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { palette } from '@/styles/tokens';
import type { SkillSword } from '@/lib/data/skills';
import type { Theme } from '@/lib/hooks/useTheme';
import { seeded } from '@/lib/random';
import { Sword } from './Sword';
import type { SwordColors } from './Sword';
import { createOutlineMaterial, createToonMaterial, outlineGeometry } from './toon';

export type SwordsSceneProps = {
  swords: SkillSword[];
  hovered: string | null;
  selected: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  theme: Theme;
  /** versão leve: menos grama, DPR 1 */
  lite?: boolean;
  /** pausa o loop quando a seção sai da tela */
  active?: boolean;
  onReady?: () => void;
};

// posição de cada espada no campo (esquerda, centro, direita)
const LAYOUT = [
  { x: -2.7, z: 0.4, tilt: 0.13, yaw: 0.35 },
  { x: 0, z: 0, tilt: -0.04, yaw: -0.12 },
  { x: 2.7, z: 0.4, tilt: -0.15, yaw: -0.4 },
];

// morros ao fundo: [x, z, raio, altura, giro]
const HILLS = [
  [-9, -15, 5.5, 3.4, 0.4],
  [-3.5, -17, 4.5, 2.4, 1.1],
  [9.5, -15, 6.5, 4.2, 2.2],
] as const;

const accentHex = { red: palette.red, blue: palette.blue, orange: palette.orange } as const;

function sceneColors(theme: Theme) {
  const dark = theme.page === 'dark';
  const color = theme.ink === 'color';
  const paper = dark ? palette.nightPaper : palette.paper;
  const ink = dark ? palette.paper : palette.ink;
  return {
    paper,
    ink,
    ground: dark ? palette.nightPaperShade : palette.paperShade,
    blade: dark ? palette.nightPaperShade : palette.white,
    metal: dark ? '#3a2f33' : '#cfc8b8',
    dark: dark ? '#57494e' : '#2b2b2b',
    sun: color ? palette.red : dark ? palette.nightPaperShade : palette.white,
    color,
  };
}

function Rig({ focusX, lifted }: { focusX: number; lifted: boolean }) {
  const look = useRef(new THREE.Vector3(0, 1.7, 0));
  const started = useRef(false);
  useFrame(({ camera, size, pointer }, delta) => {
    const dt = Math.min(delta, 0.05);
    const aspect = size.width / size.height;
    const target = look.current;
    // em telas estreitas a câmera recua para caber as três espadas
    const z = Math.max(9, 13 / aspect) + (lifted ? 0.8 : 0);
    if (!started.current) {
      started.current = true;
      camera.position.z = z; // primeiro quadro: já nasce enquadrado
    }
    const tx = pointer.x * 0.8 + focusX * 0.3;
    const ty = 2.4 + pointer.y * 0.35 + (lifted ? 0.45 : 0);
    camera.position.set(
      THREE.MathUtils.damp(camera.position.x, tx, 3, dt),
      THREE.MathUtils.damp(camera.position.y, ty, 3, dt),
      THREE.MathUtils.damp(camera.position.z, z, 3, dt),
    );
    target.set(
      THREE.MathUtils.damp(target.x, focusX * 0.35, 3, dt),
      THREE.MathUtils.damp(target.y, lifted ? 2.2 : 1.7, 3, dt),
      0,
    );
    camera.lookAt(target);
  });
  return null;
}

/** Grama em traço: tufos de três riscos finos, instanciados. */
function Grass({ count, color }: { count: number; color: string }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const blades = [
      [-0.05, -0.1, 0.34],
      [0.0, 0.03, 0.46],
      [0.05, 0.16, 0.3],
    ];
    const v: number[] = [];
    for (const [bx, tx, h] of blades) v.push(bx - 0.016, 0, 0, bx + 0.016, 0, 0, tx, h, 0);
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    return g;
  }, []);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
    [color],
  );
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geometry, material, count);
    const rand = seeded(11);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const z = 5 - Math.pow(rand(), 1.4) * 15;
      dummy.position.set((rand() - 0.5) * (14 + (5 - z) * 1.2), 0, z);
      dummy.rotation.set(0, (rand() - 0.5) * 0.5, 0);
      dummy.scale.setScalar(0.6 + rand() * 0.9);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, [geometry, material, count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      mesh.dispose();
    },
    [geometry, material, mesh],
  );
  return <primitive object={mesh} />;
}

function Field({ theme, lite }: { theme: Theme; lite: boolean }) {
  const c = sceneColors(theme);
  const hill = useMemo(() => createToonMaterial(c.ground, c.ink, 4), [c.ground, c.ink]);
  const hillLine = useMemo(() => createOutlineMaterial(c.ink, 0.07), [c.ink]);
  const hills = useMemo(
    () =>
      HILLS.map(([, , r, h]) => {
        const geometry = new THREE.ConeGeometry(r, h, 5);
        return { geometry, outline: outlineGeometry(geometry) };
      }),
    [],
  );
  useEffect(
    () => () => {
      hill.dispose();
      hillLine.dispose();
    },
    [hill, hillLine],
  );
  useEffect(
    () => () =>
      hills.forEach((g) => {
        g.geometry.dispose();
        g.outline.dispose();
      }),
    [hills],
  );

  return (
    <>
      <color attach="background" args={[c.paper]} />

      {/* sol chapado */}
      <mesh position={[3.4, 4.6, -16]}>
        <circleGeometry args={[3.6, 40]} />
        <meshBasicMaterial color={c.sun} />
      </mesh>
      <mesh position={[3.4, 4.6, -16.05]}>
        <circleGeometry args={[3.75, 40]} />
        <meshBasicMaterial color={c.ink} />
      </mesh>

      {/* morros ao fundo, sombreados com retícula */}
      {HILLS.map(([x, z, , h, rot], i) => (
        <group key={i} position={[x, h / 2 - 0.02, z]} rotation={[0, rot, 0]}>
          <mesh geometry={hills[i].geometry} material={hill} />
          <mesh geometry={hills[i].outline} material={hillLine} />
        </group>
      ))}

      {/* chão + linha do horizonte */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[40, 48]} />
        <meshBasicMaterial color={c.ground} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[39.6, 40, 64]} />
        <meshBasicMaterial color={c.ink} />
      </mesh>

      {/* marca de tinta onde cada espada entra no chão */}
      {LAYOUT.map((p, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, i]}
          position={[p.x, 0.02, p.z]}
          scale={[1.5, 0.75, 1]}
        >
          <circleGeometry args={[i === 1 ? 0.62 : 0.42, 7]} />
          <meshBasicMaterial color={c.ink} />
        </mesh>
      ))}

      <Grass count={lite ? 110 : 260} color={c.ink} />
    </>
  );
}

/**
 * Cap. 2: três espadas fincadas em um campo estilizado, em cel shading com contorno.
 * Carregada só no cliente, sob demanda (ver sections/Skills).
 */
export default function SwordsScene({
  swords,
  hovered,
  selected,
  onHover,
  onSelect,
  theme,
  lite = false,
  active = true,
  onReady,
}: SwordsSceneProps) {
  const c = sceneColors(theme);
  const selectedIndex = swords.findIndex((s) => s.id === selected);
  const focusX = selectedIndex >= 0 ? LAYOUT[selectedIndex].x : 0;

  const colors = useMemo(
    () =>
      swords.map<SwordColors>((s) => ({
        ink: c.ink,
        blade: c.blade,
        metal: c.metal,
        dark: c.dark,
        accent: c.color ? accentHex[s.accent] : c.metal,
        glint: c.color ? accentHex[s.accent] : c.ink,
      })),
    [swords, c.ink, c.blade, c.metal, c.dark, c.color],
  );

  return (
    <Canvas
      flat
      dpr={lite ? 1 : [1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 2.4, 9], fov: 35, near: 0.1, far: 80 }}
      gl={{ antialias: !lite, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
      onPointerMissed={() => selected && onSelect(selected)}
      aria-hidden
    >
      <Rig focusX={focusX} lifted={selectedIndex >= 0} />
      <Field theme={theme} lite={lite} />
      {swords.map((s, i) => (
        <Sword
          key={s.id}
          design={s.design}
          {...LAYOUT[i % LAYOUT.length]}
          hovered={hovered === s.id}
          selected={selected === s.id}
          colors={colors[i]}
          lite={lite}
          onHover={(over) => onHover(over ? s.id : null)}
          onSelect={() => onSelect(s.id)}
        />
      ))}
    </Canvas>
  );
}
