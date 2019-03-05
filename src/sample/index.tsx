import _ from "lodash";
import * as THREE from "three";
import { GLTF, Scene, AnimationClip } from "three";
import GLTFLoader from "three-gltf-loader";
import OrbitControls from "three-orbitcontrols";
import { Vrm } from "../../schema/vrm.schema";
import VRMLoader from "../react-vrm/vrm/VRMLoader";
import FBXLoader from "../react-vrm/fbx/FBXLoader";
import born from "../../schema/born.json";

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

const dancing = () => {
    new FBXLoader().load(
        "fbx/takenoko_nokono.fbx",
        object => {
            console.log(object);
            animeClip = object.animations[object.animations.length - 1];
            // mixer = new THREE.AnimationMixer(object);
            // mixer.clipAction(object.animations[0]).play();
            // object.traverse(child => {
            //     if (child.isMesh) (child.castShadow = true), (child.receiveShadow = true);
            // });
            // animeClip = object.animations[0];
            nokoko();
            // scene.add(object);
        },
        xhr => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        err => {
            console.error("An error happened", err);
        }
    );
};
dancing();

const clock1 = new THREE.Clock();
let animeClip: AnimationClip;
let pandaMixer: THREE.AnimationMixer;
const pandaGltf = () => {
    new GLTFLoader().load("model/panda.gltf" /*"motion/nokoko/nokono_v1.0.2.glb"*/, data => {
        const gltf = data;
        const object = gltf.scene;
        const animations: AnimationClip[] = gltf.animations;
        if (animations) {
            animeClip = animations[animations.length - 1];

            let newAnimeClip = [];
            if (animeClip) {
                for (let i = 0; i < animeClip.tracks.length; i = i + 3) {
                    animeClip.tracks[i].name = animeClip.tracks[i].name;
                    newAnimeClip.push(animeClip.tracks[i]);
                }
                animeClip.tracks = newAnimeClip;

                pandaMixer = new THREE.AnimationMixer(object);
                pandaMixer.clipAction(animeClip).play();

                // mixer = new THREE.AnimationMixer(object);
                // for (let anim of animations) {
                //     mixer.clipAction(anim).play();
                //     console.log(anim);
                // }
            }
        }
        scene.add(object);
        // nokoko();
    });
};
// pandaGltf();

const clock2 = new THREE.Clock();
let nokokoAnimeClip: AnimationClip;
let nokokoMixer: THREE.AnimationMixer;
const nokoko = () => {
    new GLTFLoader().load("vrm/nokoko.vrm", data => {
        const gltf: GLTF = data;
        const vrmScene: Scene = gltf.scene;
        const animations: AnimationClip[] = gltf.animations;
        if (animations && animations.length) {
            nokokoMixer = new THREE.AnimationMixer(vrmScene);
            for (let anim of animations) {
                nokokoMixer.clipAction(anim).play();
            }
        }

        // nokokoAnimeClip = fixAnimeClip(animeClip);
        nokokoMixer = new THREE.AnimationMixer(vrmScene);
        if (nokokoAnimeClip) {
            gltf.animations = [nokokoAnimeClip];
            nokokoMixer.clipAction(nokokoAnimeClip).play();
        }

        const vrm: Vrm = gltf.userData.gltfExtensions.VRM;
        const materialProperties = vrm.materialProperties;
        scene.add(vrmScene);

        const roop = children => {
            for (let c of children) {
                console.log(c.name);
                roop(c.children);
            }
        };
        // roop(scene.children[1].children[0].children);
        // roop(scene.children[2].children[0].children);
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
    pandaMixer && pandaMixer.update(clock1.getDelta());
    nokokoMixer && nokokoMixer.update(clock2.getDelta());
    // console.log(pandaMixer && pandaMixer.time, nokokoMixer && nokokoMixer.time);
    requestAnimationFrame(animation);
};
animation();

// https://github.com/Keshigom/WebVRM

function fixAnimeClip(animeClip: AnimationClip): AnimationClip {
    console.log(animeClip);
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
    return newAnimeClip;
}
