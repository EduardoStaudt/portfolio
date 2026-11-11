import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Cel shading de mangá: luz chapada + sombra em retícula (pontos em espaço de tela),
 * com normal por face (low-poly facetado). O contorno preto é feito à parte, com casca invertida.
 */

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uShade;
  uniform vec3 uLight;
  uniform float uDot;
  varying vec3 vWorldPos;

  void main() {
    // normal da face a partir das derivadas: facetas duras, sem depender das normais da malha
    vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
    float ndl = dot(n, normalize(uLight));

    // 4 degraus: luz, retícula leve, retícula densa, sombra cheia
    float tone = 1.0 - smoothstep(-0.4, 0.5, ndl);
    tone = floor(tone * 3.0 + 0.5) / 3.0;

    // retícula girada 45 graus, fixa na tela como screentone colado no papel
    vec2 cell = mat2(0.7071, -0.7071, 0.7071, 0.7071) * gl_FragCoord.xy / uDot;
    float dist = length(fract(cell) - 0.5);
    float radius = tone * 0.74;
    float dots = tone < 0.01 ? 0.0 : 1.0 - smoothstep(radius - 0.05, radius + 0.05, dist);

    gl_FragColor = vec4(mix(uColor, uShade, dots), 1.0);
    #include <colorspace_fragment>
  }
`;

export const LIGHT_DIR = new THREE.Vector3(2.2, 3, 2.6).normalize();

export function createToonMaterial(color: string, shade: string, dot = 5) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uShade: { value: new THREE.Color(shade) },
      uLight: { value: LIGHT_DIR },
      uDot: { value: dot },
    },
  });
}

/**
 * Contorno de nanquim por casca invertida: a mesma malha, com normais suavizadas,
 * inflada ao longo da normal e desenhada só pelas faces de trás.
 */
export function createOutlineMaterial(color: string, thickness = 0.035) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uThickness: { value: thickness } },
    vertexShader: /* glsl */ `
      uniform float uThickness;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * uThickness, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

/** Cópia da geometria com vértices fundidos e normais suaves, para a casca não abrir nas quinas. */
export function outlineGeometry(source: THREE.BufferGeometry) {
  const stripped = source.clone();
  stripped.deleteAttribute('normal');
  stripped.deleteAttribute('uv');
  const merged = mergeVertices(stripped, 1e-3);
  merged.computeVertexNormals();
  stripped.dispose();
  return merged;
}
