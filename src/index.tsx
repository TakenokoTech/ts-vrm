import * as THREE from "three";
import { GLTF, Scene, AnimationClip } from "three";
import GLTFLoader from "three-gltf-loader";
import OrbitControls from "three-orbitcontrols";
import { Vrm } from "../schema/vrm.schema";
import { VrmMaterial } from "../schema/vrm.material.schema";
import VRMLoader from "./vrm/VRMLoader";

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

const pandaGltf = () => {
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
};

const nokoko = () => {
    new GLTFLoader().load("vrm/nokoko.vrm", data => {
        const gltf: GLTF = data;
        const vrmScene: Scene = gltf.scene;
        const animations: AnimationClip[] = gltf.animations;
        if (animations && animations.length) {
            mixer = new THREE.AnimationMixer(vrmScene);
            for (let anim of animations) {
                mixer.clipAction(anim).play();
            }
        }
        const vrm: Vrm = data.userData.gltfExtensions.VRM;
        const materialProperties = vrm.materialProperties;
        console.trace(materialProperties);
        scene.add(vrmScene);
    });
};

const nokokoVRM = () => {
    new VRMLoader().load("vrm/nokoko.vrm", function(vrm) {
        // vrm.scene.traverse(function(object) {
        //     if (object.material) {
        //         if (Array.isArray(object.material)) {
        //             for (var i = 0, il = object.material.length; i < il; i++) {
        //                 var material = new THREE.MeshBasicMaterial();
        //                 THREE.Material.prototype.copy.call(
        //                     material,
        //                     object.material[i]
        //                 );
        //                 material.color.copy(object.material[i].color);
        //                 material.map = object.material[i].map;
        //                 material.lights = false;
        //                 material.skinning = object.material[i].skinning;
        //                 material.morphTargets = object.material[i].morphTargets;
        //                 material.morphNormals = object.material[i].morphNormals;
        //                 object.material[i] = material;
        //             }
        //         } else {
        //             var material = new THREE.MeshBasicMaterial();
        //             THREE.Material.prototype.copy.call(
        //                 material,
        //                 object.material
        //             );
        //             material.color.copy(object.material.color);
        //             material.map = object.material.map;
        //             material.lights = false;
        //             material.skinning = object.material.skinning;
        //             material.morphTargets = object.material.morphTargets;
        //             material.morphNormals = object.material.morphNormals;
        //             object.material = material;
        //         }
        //     }
        // });
        scene.add(vrm.scene);
    });
};
nokoko();

// レンダリング
const animation = () => {
    renderer.render(scene, camera);
    mixer && mixer.update(clock.getDelta());
    requestAnimationFrame(animation);
};

const clock = new THREE.Clock();
let mixer: THREE.AnimationMixer;
animation();

// https://github.com/Keshigom/WebVRM
