import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  ConeGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type {GlobeMethods} from 'react-globe.gl';


const METEOR_DEPTH = 900;
const LAUNCH_SITES: [number, number][] = [
  [28.47, -80.56],
  [45.96, 63.31],
  [5.24, -52.77],
  [25.99, -97.15],
  [30.4, 130.97],
  [13.72, 80.23],
];

function disableRaycast(root: Object3D) {
  root.traverse((o) => {
    o.raycast = () => {};
  });
}

function orbit(radius: number, inclination: number, node: number) {
  const plane = new Group();
  plane.rotation.set(inclination, node, 0, 'YXZ');
  const spinner = new Group();
  plane.add(spinner);
  return {plane, spinner, radius};
}

function makeStars() {
  const positions: number[] = [];
  for (let i = 0; i < 1400; i++) {
    const v = new Vector3().randomDirection().multiplyScalar(1800 + Math.random() * 600);
    positions.push(v.x, v.y, v.z);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return new Points(
    geometry,
    new PointsMaterial({color: '#ffffff', size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0.55, depthWrite: false}),
  );
}

function makeTrain(radius: number, count: number) {
  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    const a = i * 0.03;
    positions.push(Math.cos(a) * radius, 0, -Math.sin(a) * radius);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return new Points(
    geometry,
    new PointsMaterial({color: '#e5e7eb', size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.9}),
  );
}

function makeStation() {
  const station = new Group();
  const metal = new MeshStandardMaterial({color: '#d4d4d8', metalness: 0.6, roughness: 0.4});
  const panel = new MeshStandardMaterial({color: '#1e3a5f', metalness: 0.3, roughness: 0.5, emissive: '#0b1a2e'});
  const gold = new MeshStandardMaterial({color: '#c9a227', metalness: 0.8, roughness: 0.3});
  station.add(new Mesh(new BoxGeometry(10, 0.25, 0.25), metal));
  const core = new Mesh(new CylinderGeometry(0.45, 0.45, 3.2, 12), metal);
  core.rotation.x = Math.PI / 2;
  station.add(core);
  const module = new Mesh(new CylinderGeometry(0.35, 0.35, 1.6, 12), gold);
  module.position.set(0, 0, 2);
  module.rotation.x = Math.PI / 2;
  station.add(module);
  for (const x of [-4.2, -2.6, 2.6, 4.2]) {
    for (const y of [-1, 1]) {
      const wing = new Mesh(new BoxGeometry(1.3, 0.04, 2.2), panel);
      wing.position.set(x, 0, y * 1.25);
      station.add(wing);
    }
  }
  const beacon = new Mesh(new SphereGeometry(0.18, 8, 6), new MeshBasicMaterial({color: '#ff3b30'}));
  beacon.position.set(0, 0.5, 0);
  station.add(beacon);
  station.scale.setScalar(0.9);
  return {station, beacon};
}

function makeRocket() {
  const rocket = new Group();
  const white = new MeshStandardMaterial({color: '#f4f4f5', metalness: 0.2, roughness: 0.5});
  const body = new Mesh(new CylinderGeometry(0.35, 0.35, 2.6, 10), white);
  rocket.add(body);
  const nose = new Mesh(new ConeGeometry(0.35, 0.9, 10), white);
  nose.position.y = 1.75;
  rocket.add(nose);
  const flame = new Mesh(
    new ConeGeometry(0.3, 1.4, 10),
    new MeshBasicMaterial({color: '#FF6B35', transparent: true, opacity: 0.9, blending: AdditiveBlending}),
  );
  flame.position.y = -2;
  flame.rotation.x = Math.PI;
  rocket.add(flame);
  rocket.scale.setScalar(0.9);

  const trailCount = 70;
  const trailGeometry = new BufferGeometry();
  trailGeometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(trailCount * 3), 3));
  const trail = new Points(
    trailGeometry,
    new PointsMaterial({
      color: '#ffb38a',
      size: 3,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  return {rocket, flame, trail, trailCount};
}

function meteorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.8, 'rgba(190,255,230,0.6)');
    gradient.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 8);
  }
  return new CanvasTexture(canvas);
}

type Meteor = {mesh: Mesh; velocity: Vector3; life: number; ttl: number};
type Launch = {
  parts: ReturnType<typeof makeRocket>;
  lat: number;
  lng: number;
  t: number;
  duration: number;
  history: Vector3[];
};

export function createSpace(globe: GlobeMethods) {
  const scene = globe.scene();
  const camera = globe.camera() as PerspectiveCamera;
  if (!camera.parent) scene.add(camera);
  const root = new Group();
  scene.add(root);
  const cameraRoot = new Group();
  camera.add(cameraRoot);

  root.add(makeStars());

  const orbits: {spinner: Group; speed: number}[] = [];
  const addOrbit = (object: Object3D, radius: number, inclination: number, node: number, speed: number, phase: number) => {
    const o = orbit(radius, inclination, node);
    object.position.x = radius;
    o.spinner.add(object);
    o.spinner.rotation.y = phase;
    root.add(o.plane);
    orbits.push({spinner: o.spinner, speed});
  };

  for (let i = 0; i < 3; i++) {
    const radius = 112 + i * 3;
    const t = makeTrain(radius, 14);
    const o = orbit(radius, 0.5 + i * 0.35, i * 2.1);
    o.spinner.add(t);
    o.spinner.rotation.y = i * 1.7;
    root.add(o.plane);
    orbits.push({spinner: o.spinner, speed: 0.16 - i * 0.02});
  }

  for (let i = 0; i < 8; i++) {
    const sat = new Points(
      new BufferGeometry().setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3)),
      new PointsMaterial({color: '#a7f3d0', size: 2.6, sizeAttenuation: false}),
    );
    addOrbit(sat, 118 + Math.random() * 40, Math.random() * Math.PI, Math.random() * Math.PI * 2, 0.08 + Math.random() * 0.1, Math.random() * Math.PI * 2);
  }

  const {station, beacon} = makeStation();
  station.rotation.y = Math.PI / 2;
  addOrbit(station, 138, (51.6 * Math.PI) / 180, 0.8, 0.07, 2.4);

  const texture = meteorTexture();
  const meteorGeometry = new PlaneGeometry(1, 1);
  const meteors: Meteor[] = [];
  const launches: Launch[] = [];

  const spawnMeteor = (ndcX?: number, ndcY?: number) => {
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * METEOR_DEPTH;
    const halfW = halfH * camera.aspect;
    const head = new Vector3(
      (ndcX ?? Math.random() * 1.6 - 0.4) * halfW,
      (ndcY ?? Math.random() * 0.6 + 0.3) * halfH,
      -METEOR_DEPTH,
    );
    const angle = Math.PI + 0.35 + Math.random() * 0.5;
    const speed = halfW * (1.4 + Math.random() * 0.8);
    const velocity = new Vector3(Math.cos(angle) * speed, Math.sin(angle) * speed, 0);
    const length = halfW * (0.18 + Math.random() * 0.12);
    const mesh = new Mesh(
      meteorGeometry,
      new MeshBasicMaterial({map: texture, transparent: true, blending: AdditiveBlending, depthWrite: false}),
    );
    mesh.scale.set(length, Math.max(1.6, halfH / 260), 1);
    mesh.rotation.z = angle;
    mesh.position.copy(head);
    mesh.raycast = () => {};
    cameraRoot.add(mesh);
    meteors.push({mesh, velocity, life: 0, ttl: 0.9 + Math.random() * 0.4});
  };

  const launch = () => {
    const pov = globe.pointOfView();
    const site = [...LAUNCH_SITES].sort(
      (a, b) => Math.hypot(a[0] - pov.lat, a[1] - pov.lng) - Math.hypot(b[0] - pov.lat, b[1] - pov.lng),
    )[Math.floor(Math.random() * 2)];
    const parts = makeRocket();
    disableRaycast(parts.rocket);
    parts.trail.raycast = () => {};
    root.add(parts.rocket, parts.trail);
    launches.push({parts, lat: site[0], lng: site[1], t: 0, duration: 7, history: []});
  };

  const position = (l: Launch, s: number) => {
    const c = globe.getCoords(l.lat + 6 * s, l.lng + 40 * s * s, 0.004 + 0.75 * Math.pow(s, 1.5));
    return new Vector3(c.x, c.y, c.z);
  };

  let meteorTimer = 1.5;
  let launchTimer = 2.5;
  let elapsed = 0;

  const update = (dt: number) => {
    elapsed += dt;
    for (const o of orbits) o.spinner.rotation.y += o.speed * dt;
    beacon.visible = Math.sin(elapsed * 6) > 0;

    meteorTimer -= dt;
    if (meteorTimer <= 0) {
      spawnMeteor();
      meteorTimer = 2.5 + Math.random() * 4;
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.life += dt;
      m.mesh.position.addScaledVector(m.velocity, dt);
      const k = m.life / m.ttl;
      (m.mesh.material as MeshBasicMaterial).opacity = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
      if (m.life >= m.ttl) {
        cameraRoot.remove(m.mesh);
        (m.mesh.material as MeshBasicMaterial).dispose();
        meteors.splice(i, 1);
      }
    }

    launchTimer -= dt;
    if (launchTimer <= 0) {
      launch();
      launchTimer = 9 + Math.random() * 8;
    }
    for (let i = launches.length - 1; i >= 0; i--) {
      const l = launches[i];
      l.t += dt;
      const s = Math.min(1, l.t / l.duration);
      const p = position(l, s);
      const ahead = position(l, Math.min(1, s + 0.01));
      l.parts.rocket.position.copy(p);
      l.parts.rocket.up.copy(p).normalize();
      l.parts.rocket.lookAt(ahead);
      l.parts.rocket.rotateX(Math.PI / 2);
      l.parts.flame.scale.y = 0.8 + Math.random() * 0.5;
      l.history.unshift(p.clone());
      if (l.history.length > l.parts.trailCount) l.history.pop();
      const attr = l.parts.trail.geometry.getAttribute('position') as Float32BufferAttribute;
      for (let j = 0; j < l.parts.trailCount; j++) {
        const h = l.history[Math.min(j, l.history.length - 1)];
        attr.setXYZ(j, h.x, h.y, h.z);
      }
      attr.needsUpdate = true;
      const fade = s > 0.8 ? 1 - (s - 0.8) / 0.2 : 1;
      (l.parts.trail.material as PointsMaterial).opacity = 0.5 * fade;
      l.parts.rocket.visible = fade > 0.05;
      if (s >= 1) {
        root.remove(l.parts.rocket, l.parts.trail);
        l.parts.trail.geometry.dispose();
        launches.splice(i, 1);
      }
    }
  };

  disableRaycast(root);
  disableRaycast(cameraRoot);

  let frame = 0;
  let last = 0;
  const loop = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    update(dt);
    frame = requestAnimationFrame(loop);
  };

  return {
    start() {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(loop);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
    spawnMeteor,
    dispose() {
      cancelAnimationFrame(frame);
      scene.remove(root);
      camera.remove(cameraRoot);
      texture.dispose();
      meteorGeometry.dispose();
    },
  };
}
