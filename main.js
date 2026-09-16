import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* =================================================================
   TUNING — change these, reload, repeat. Nothing else needs editing.
   ================================================================= */
const TUNE = {
  /* --- the wide shot --- */
  wideFov:     40,    // lens in degrees. LARGER = everything smaller, more lean.
  dolly:        0,    // along the viewing line. NEGATIVE = further back, smaller, less lean.
  subjectLeft:  0,    // moves the camera sideways. CAUSES LEAN. Prefer frameShiftX.
  subjectUp:    0,    // moves the camera up/down. CAUSES LEAN. Prefer frameShiftY.

  /* --- reframing with no lean (shifts the lens, not the camera) --- */
  frameShiftX: 0.25,  // fraction of the width. POSITIVE = subject moves LEFT.
  frameShiftY: 0.22,  // fraction of the height. POSITIVE = subject moves UP.

  /* --- the close shot --- */
  screenDropY: 1.25,   // lowers the close camera. Larger = screen sits higher in frame.

  /* --- feel --- */
  damping:     0.1,  // higher = snappier
  screenColor: 0x12356b,
};
/* ================================================================= */

const CREAM        = 0xf2e8d5;   // must equal --cream in css/style.css
const COLOUR_START = 0.85;
const PLATE_START  = 0.92;

history.scrollRestoration = 'manual';
scrollTo(0, 0);

if (matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 760) {
  document.body.classList.add('flat');
} else {
  boot();
}

function boot(){

const canvas  = document.querySelector('#c');
const intro   = document.querySelector('#intro');
const plate   = document.querySelector('#plate');
const content = document.querySelector('#content');
const drive   = document.querySelector('#drive');

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe3d2ac);

/* Optional reflections for your clearcoat/sheen materials.
   Uncomment the import above and these two lines, then lower key to ~1.2.*/
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

scene.add(new THREE.HemisphereLight(0xffffff, 0xb0a894, 0.10));
const key = new THREE.DirectionalLight(0xffffff, 0.8);
key.position.set(-8, 12, 6);
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 0.10);
fill.position.set(8, 3, -6);
scene.add(fill);

const camera = new THREE.PerspectiveCamera(40, innerWidth/innerHeight, 0.1, 500);

let posA, qA, fovA, posB, qB, fovB, ready = false;
let screenMat = null, screenFrom = null;
screenFrom = new THREE.Color(TUNE.screenColor);
screenMat = new THREE.MeshBasicMaterial({ color: screenFrom.clone() });
const screenTo = new THREE.Color(CREAM);

new GLTFLoader().load('assets/computer.glb', (gltf) => {
  scene.add(gltf.scene);

  gltf.cameras.forEach((c, i) =>
    console.log(i, c.parent ? c.parent.name : '(no parent)', 'fov', c.fov));

  gltf.scene.traverse(o => {
    if (o.isMesh && o.material && o.material.name === 'screen') {
      screenFrom = o.material.color.clone();
      screenMat = new THREE.MeshBasicMaterial({ color: screenFrom.clone() });
      screenMat.toneMapped = false;          // its hex then matches the CSS exactly
      o.material = screenMat;
    }
  });
  if (!screenMat) console.warn('No material named "screen" found.');

  const wide = gltf.cameras[1];    // cam_init
  const near = gltf.cameras[0];    // cam_screen

  posA = wide.getWorldPosition(new THREE.Vector3());
  qA   = wide.getWorldQuaternion(new THREE.Quaternion());
  fovA = TUNE.wideFov;

  const fwd   = new THREE.Vector3(0, 0, -1).applyQuaternion(qA);
  const right = new THREE.Vector3(1, 0,  0).applyQuaternion(qA);
  const up    = new THREE.Vector3(0, 1,  0).applyQuaternion(qA);
  posA.addScaledVector(fwd,   TUNE.dolly);
  posA.addScaledVector(right, TUNE.subjectLeft);
  posA.addScaledVector(up,   -TUNE.subjectUp);

  posB = near.getWorldPosition(new THREE.Vector3());
  qB   = near.getWorldQuaternion(new THREE.Quaternion());
  fovB = near.fov;
  posB.y -= TUNE.screenDropY;

  console.log('START at', posA.toArray().map(n => n.toFixed(2)).join(', '));
  console.log('END   at', posB.toArray().map(n => n.toFixed(2)).join(', '));

  ready = true;
}, undefined, err => console.error('LOAD FAILED — check assets/computer.glb', err));

let target = 0, eased = 0;
function readScroll(){
  const span = drive.offsetHeight - innerHeight;
  target = span > 0 ? Math.min(1, Math.max(0, scrollY / span)) : 0;
}
addEventListener('scroll', readScroll, { passive:true });

const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
const ramp = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));

function tick(){
  requestAnimationFrame(tick);
  if (!ready) return;

  eased += (target - eased) * TUNE.damping;
  const t = ease(eased);

  camera.position.lerpVectors(posA, posB, t);
  camera.quaternion.slerpQuaternions(qA, qB, t);
  camera.fov = THREE.MathUtils.lerp(fovA, fovB, t);

  /* The reframe belongs to the wide shot only, so fade it out by t = 1.
     Recomputed every frame, so a window resize can never break it. */
  const ox = TUNE.frameShiftX * innerWidth  * (1 - t);
  const oy = TUNE.frameShiftY * innerHeight * (1 - t);
  if (ox !== 0 || oy !== 0) {
    camera.setViewOffset(innerWidth, innerHeight, ox, oy, innerWidth, innerHeight);
  } else {
    camera.clearViewOffset();
  }
  camera.updateProjectionMatrix();

  if (screenMat) {
    screenMat.color.lerpColors(screenFrom, screenTo, ramp(t, COLOUR_START, 1));
  }

  renderer.render(scene, camera);

  intro.style.opacity = 1 - ramp(t, 0, 0.40);
  intro.style.pointerEvents = t < 0.40 ? 'auto' : 'none';

  plate.style.opacity = ramp(t, PLATE_START, 1);
  content.classList.toggle('on', t > 0.97);
}

function resize(){
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  readScroll();
}
addEventListener('resize', resize);
resize();
readScroll();
tick();

}