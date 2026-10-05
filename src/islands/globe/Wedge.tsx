import { useMemo } from 'react';
import * as THREE from 'three';
import { R } from './targets';

const toRad = (d: number) => (d * Math.PI) / 180;
const sph = (lat: number, lon: number, r = R) =>
  new THREE.Vector3(r * Math.cos(lat) * Math.sin(lon), r * Math.sin(lat), r * Math.cos(lat) * Math.cos(lon));

function arc(points: THREE.Vector3[], radius: number) {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, Math.max(8, points.length * 2), radius, 6, false);
}

export const rebarMat = new THREE.MeshStandardMaterial({ color: '#777c85', metalness: 0.8, roughness: 0.42 });
export const stirrupMat = new THREE.MeshStandardMaterial({ color: '#9aa0a8', metalness: 0.85, roughness: 0.32 });
export const meshMat = new THREE.MeshStandardMaterial({ color: '#b4b9bf', metalness: 0.75, roughness: 0.45 });

/** Um gomo = 30° de longitude: um meridiano (vergalhão), paralelos (estribo) e, em alguns, tela soldada. */
export function useWedgeGeometry(index: number, withMesh: boolean) {
  return useMemo(() => {
    const lon0 = toRad(index * 30), lon1 = toRad((index + 1) * 30);
    const geos: { geo: THREE.BufferGeometry; mat: THREE.Material }[] = [];

    // meridiano pole-to-pole no lon0 — vergalhão com nervura sugerida pela espessura
    const mer: THREE.Vector3[] = [];
    for (let a = -88; a <= 88; a += 8) mer.push(sph(toRad(a), lon0));
    geos.push({ geo: arc(mer, 0.038), mat: rebarMat });

    // paralelos: estribos a cada 30° de latitude, só o trecho deste gomo
    for (const latDeg of [-60, -30, 0, 30, 60]) {
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 6; k++) pts.push(sph(toRad(latDeg), lon0 + ((lon1 - lon0) * k) / 6, R - 0.02));
      geos.push({ geo: arc(pts, 0.022), mat: stirrupMat });
    }

    // tela soldada em alguns gomos: malha fina entre -45° e 45°
    if (withMesh) {
      for (let a = -45; a <= 45; a += 15) {
        const pts: THREE.Vector3[] = [];
        for (let k = 0; k <= 4; k++) pts.push(sph(toRad(a), lon0 + ((lon1 - lon0) * k) / 4, R - 0.06));
        geos.push({ geo: arc(pts, 0.008), mat: meshMat });
      }
      for (let k = 1; k < 4; k++) {
        const lon = lon0 + ((lon1 - lon0) * k) / 4;
        const pts: THREE.Vector3[] = [];
        for (let a = -45; a <= 45; a += 15) pts.push(sph(toRad(a), lon, R - 0.06));
        geos.push({ geo: arc(pts, 0.008), mat: meshMat });
      }
    }
    return geos;
  }, [index, withMesh]);
}

/** Centro de massa aproximado do gomo (para pivot ao animar). */
export function wedgeCenter(index: number) {
  return sph(0, toRad(index * 30 + 15), R * 0.6);
}
