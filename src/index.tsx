import * as THREE from "three";
import { GLTF, Scene, AnimationClip } from "three";
import GLTFLoader from "three-gltf-loader";
import OrbitControls from "three-orbitcontrols";
import { Vrm } from "../schema/vrm.schema";
import { VrmMaterial } from "../schema/vrm.material.schema";
import VRMLoader from "./vrm/VRMLoader";
import FBXLoader from "./loader/FBXLoader";
import _ from "lodash";
import born from "../schema/born.json";

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
let camera = new THREE.PerspectiveCamera(50, width / height, 1, 100);
camera.position.set(0, 1, 5);
// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
// camera.position.set(100, 200, 300);
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

// メッシュの作成と追加
const grid = new THREE.GridHelper(10, 5);
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshPhongMaterial({ color: 0x0074df }));
sphere.position.set(0, 1, 0);
// scene.add(grid, sphere);

let animeClip: AnimationClip;
const dancing = () => {
    new FBXLoader().load(
        "motion/Samba.fbx",
        object => {
            console.log(object);
            mixer = new THREE.AnimationMixer(object);
            mixer.clipAction(object.animations[0]).play();
            object.traverse(child => {
                if (child.isMesh) (child.castShadow = true), (child.receiveShadow = true);
            });
            animeClip = object.animations[0];
            scene.add(object);
        },
        xhr => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        err => {
            console.error("An error happened", err);
        }
    );
};
// dancing();

const pandaGltf = () => {
    new GLTFLoader().load("model/panda.gltf", data => {
        console.log(object);
        const gltf = data;
        const object = gltf.scene;
        const animations: AnimationClip[] = gltf.animations;
        if (animations && animations.length) {
            mixer = new THREE.AnimationMixer(object);
            for (let anim of animations) {
                // console.log(JSON.stringify(anim));
                mixer.clipAction(anim).play();
            }
        }
        animeClip = animations[1];
        // scene.add(object);
        fixAnimeClip();
        nokoko();
    });
};
pandaGltf();

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

        mixer = new THREE.AnimationMixer(vrmScene);
        if (animeClip) {
            mixer.clipAction(animeClip).play();
            gltf.animations = [animeClip];
        }

        const vrm: Vrm = gltf.userData.gltfExtensions.VRM;
        const materialProperties = vrm.materialProperties;
        scene.add(vrmScene);
    });
};
// nokoko();

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

// レンダリング
const animation = () => {
    if (scene.children && scene.children.length >= 2) {
        // camera = new THREE.PerspectiveCamera(45, width / height, 1, 300);
        // camera.position.set(scene.children[1].position.x, scene.children[1].position.y + 3, scene.children[1].position.z);
    }
    renderer.render(scene, camera);
    mixer && mixer.update(clock.getDelta());
    requestAnimationFrame(animation);
};

const clock = new THREE.Clock();
let mixer: THREE.AnimationMixer;
animation();

// https://github.com/Keshigom/WebVRM

function fixAnimeClip() {
    let newAnimeClip = _.cloneDeep(animeClip);
    newAnimeClip.tracks = _.map(newAnimeClip.tracks, (clip: AnimationClip) => {
        const oldKey = clip.name.split(".")[0];
        const opt = "." + clip.name.split(".")[1];
        const newKey = Object.keys(born).filter(k => born[k] === oldKey);
        if (newKey.length > 0 && newKey.toString() != "") {
            clip.name = newKey + opt;
            console.log(clip.name);
            return clip;
        } else {
            //console.log(oldKey);
            //console.log(clip.values);
            return null;
        }
    });
    newAnimeClip.tracks = _.compact(newAnimeClip.tracks);
    console.log(newAnimeClip);
    animeClip = newAnimeClip;
}
