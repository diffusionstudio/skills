import { createEffect, createSignal, onCleanup } from "solid-js";
import { useTicker } from "@diffusionstudio/jsx";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const MODEL_URL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb";

const TURN_SECONDS = 6; // one full revolution per 6s of composition time

export default function ThreeHelmet() {
  const { time } = useTicker();
  const [loaded, setLoaded] = createSignal(false);

  const setup = (el) => {
    const renderer = new THREE.WebGLRenderer({
      canvas: el,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(el.width, el.height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, el.width / el.height, 0.1, 100);
    camera.position.set(0, 0.35, 4);
    camera.lookAt(0, 0, 0);

    // In-memory image-based lighting: gives the PBR metal real reflections
    // without fetching an external HDR.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Key + hemisphere fill, so the helmet reads with shape and highlights.
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(5, 8, 6);
    scene.add(key);
    scene.add(new THREE.HemisphereLight(0xbad6ff, 0x1a1a22, 1.1));

    // Rotating around the pivot keeps the model centred as it spins.
    const pivot = new THREE.Group();
    scene.add(pivot);

    let disposed = false;
    new GLTFLoader()
      .loadAsync(MODEL_URL)
      .then((gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        // Centre on the pivot and normalise scale so the helmet fills the frame.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        pivot.scale.setScalar(2.6 / size);
        pivot.add(model);
        setLoaded(true); // wake the effect so the first frame renders even when paused
      })
      .catch((err) => console.error("Helmet model load failed:", err));

    // The playhead is the only clock. Reading time() (and loaded()) subscribes
    // the effect, so it re-renders every tick and once the model streams in.
    createEffect(() => {
      loaded();
      pivot.rotation.y = time() * ((Math.PI * 2) / TURN_SECONDS);
      renderer.render(scene, camera);
    });

    onCleanup(() => {
      disposed = true;
      pmrem.dispose();
      renderer.dispose();
    });
  };

  return (
    <rect scene="example-three" name="Three helmet" width={960} height={540} fill="#0b0d12">
      <surface x={0} y={0} width={960} height={540} ref={setup} />
    </rect>
  );
}
