import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import OrbitControls from "three-orbitcontrols";

// 幅、高さ取得
const width = window.innerWidth;
const height = window.innerHeight;

// レンダラの作成、DOMに追加
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xf3f3f3, 1.0);
document.body.appendChild(renderer.domElement);

// シーンの作成、カメラの作成と追加、ライトの作成と追加
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 100);
camera.position.set(0, 1, 5);
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// OrbitControls の追加
const controls = new OrbitControls(camera, renderer.domElement);
controls.userPan = false;
controls.userPanSpeed = 0.0;
controls.maxDistance = 5000.0;
controls.maxPolarAngle = Math.PI * 0.495;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// // メッシュの作成と追加
// const grid = new THREE.GridHelper(10, 5);
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1),
//     new THREE.MeshPhongMaterial({ color: 0x0074df })
// );
// sphere.position.set(0, 1, 0);
// scene.add(grid, sphere);

new GLTFLoader().load("model/panda.gltf", data => {
    const gltf = data;
    const object = gltf.scene;
    const animations = gltf.animations;

    if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(object);
        for (let anim of animations) {
            mixer.clipAction(anim).play();
        }
    }

    scene.add(object);
});

// レンダリング
const animation = () => {
    renderer.render(scene, camera);
    mixer && mixer.update(clock.getDelta());
    requestAnimationFrame(animation);
};

const clock = new THREE.Clock();
let mixer: THREE.AnimationMixer;
animation();
