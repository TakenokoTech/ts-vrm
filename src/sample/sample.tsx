import _ from "lodash";
import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import { GLTF, Scene, AnimationClip } from "three";
import Stats from "stats-js";
import OrbitControls from "three-orbitcontrols";
import WebVRM from "../react-vrm/vrm/WebVRM";
import sampleAnime from "../../schema/Animation/anime.json";
import { VrmAnimation, Key } from "../../schema/Animation/RootObject";

const clock = new THREE.Clock(true);

let avatar: WebVRM;
let stats: Stats;
let controls: OrbitControls;
let scene: THREE.Scene = new THREE.Scene();
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationMixer: THREE.AnimationMixer;
const avaterBones: { [key: string]: THREE.Bone } = {};
let messageData: any = null;

// 初期化
function init(targetCanvas: Element) {
    function initThree(canvas: Element) {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
        camera.position.set(0, 1.5, -1);

        controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 0.75, 0);
        controls.update();

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        // renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.shadowMap.autoUpdate = false;
        canvas.appendChild(renderer.domElement);
    }

    const initLight = () => {
        const light = new THREE.HemisphereLight(0xffffff, 0x0000000);
        light.position.set(0, 1, 0);
        // scene.add(light);

        const light2 = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 4, 1);
        light2.castShadow = true;
        light2.shadow.mapSize.width = 2048;
        light2.shadow.mapSize.height = 2048;
        // scene.add(light2);

        var light3 = new THREE.DirectionalLight(0xffffff);
        light3.position.set(0, 0, 1000);
        light3.shadowMapWidth = 2048;
        light3.shadowMapHeight = 2048;
        light3.castShadow = true;
        scene.add(light3);
    };

    // 床
    const initFloar = () => {
        const meshFloor = new THREE.Mesh(
            new THREE.BoxGeometry(100, 0.1, 100),
            new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                color: 0xcd5c5c
            })
        );
        meshFloor.receiveShadow = true;
        //scene.add(meshFloor);
    };

    //FPS表示
    const initStats = () => {
        stats = new Stats();
        stats.dom.style.position = "relative";
        stats.dom.style.top = "4px";
        stats.dom.style.left = "4px";
        stats.dom.style.margin = "auto";
        const debugWindow = document.getElementById("stat") as Element;
        debugWindow.appendChild(stats.dom);
    };

    const addTestObject = () => {
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshNormalMaterial();
        const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        threeCube.position.set(0, -0.5, 0);
        scene.add(threeCube);
    };

    //モデル読み込み
    const loadModel = (modelURL: string) => {
        const callback = () => {
            // setBoneMenu
            let boneSelector = document.getElementById("boneSelector");
            for (const key of avatar.boneKeys) {
                const element = document.createElement("option");
                element.value = key;
                element.innerHTML = key;
                boneSelector && boneSelector.appendChild(element);
            }
            // setExpressionMenu
            let expressionSelector = document.getElementById("expressionSelector");
            for (const key of avatar.expressionKeys) {
                const element = document.createElement("option");
                element.value = key;
                element.innerHTML = key;
                expressionSelector && expressionSelector.appendChild(element);
            }

            avatar.scene.traverse((object: any) => {
                // console.log(object.name);
                if (object.isBone) avaterBones[object.name] = object;
            });
            // anime();

            scene.add(avatar.scene);
        };
        avatar = new WebVRM(modelURL, callback);
    };

    const anime = () => {
        const zRadian = -(45 * Math.PI) / 180;
        const unitQuaternion = [0, 0, 0, 1];
        const armQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, zRadian, "XYZ")).toArray();

        const bones: THREE.Bone[] = [];
        const hierarchy: any[] = [];
        const animation: VrmAnimation[] = sampleAnime.vrmAnimation;
        for (let ani of animation) {
            bones.push(avaterBones[ani.name]);
            hierarchy.push({
                keys: _.map(ani.keys, (key: Key) => {
                    const newKey = key;
                    newKey.rot[0] = -newKey.rot[0];
                    newKey.rot[1] = -newKey.rot[1];
                    return newKey;
                })
            });
        }
        const clip = THREE.AnimationClip.parseAnimation({ hierarchy: hierarchy }, bones, bones.toString());

        _.each(avatar.scene.children, (child: any, i: number) => {
            if (!child.skeleton || !child.skeleton.bones) return;
            _.each(child.skeleton.bones, born => {
                if (bones[0] && bones[0].name == born.name) {
                    console.log(i, born.name);
                    animationMixer = new THREE.AnimationMixer(child);
                }
            });
        });

        animationMixer.clipAction(clip).play();
    };

    const realtimeAnimeWebsocket = () => {
        const socket: WebSocket = new WebSocket("ws://127.0.0.1:5001");
        socket.onopen = (event: Event) => {
            console.log("websocket open");
            socket.onmessage = message => {
                messageData = message.data;
            };
            socket.onclose = () => {
                console.log("websocket close");
            };
        };
    };

    const realtimeAnime = () => {
        const startTime = new Date();
        if (!messageData) return;
        const animation: VrmAnimation[] = JSON.parse(messageData).vrmAnimation;
        for (let ani of animation) {
            const bone = avaterBones[ani.name];
            const key = ani.keys[ani.keys.length - 1];
            if (!bone || !key) continue;
            // console.log(bone, key);
            avaterBones[ani.name].quaternion.set(-key.rot[0], -key.rot[1], key.rot[2], key.rot[3]);
        }
        const endTime = new Date();
        // console.log(endTime.getMilliseconds() - startTime.getMilliseconds() + "ms");
    };

    // 描画更新処理
    function update() {
        requestAnimationFrame(update);
        // animationMixer && animationMixer.update(clock.getDelta());
        realtimeAnime();
        renderer && renderer.render(scene, camera);
        stats.update();
    }

    initThree(targetCanvas);
    initStats();
    // addTestObject();
    initLight();
    initFloar();
    loadModel(`../../static/vrm/nokoko.vrm`);
    // loadModel(`../../static/vrm/panda.vrm`);
    // loadModel(`https://dl.dropboxusercontent.com/s/tiwmoh8te3g5i6b/monoGaku.vrm`);
    update();
    realtimeAnimeWebsocket();
}

// 関節
const changeBoneAngle = (axis: string, value: number) => {
    const boneSelector = document.getElementById("boneSelector") as HTMLSelectElement;
    if (boneSelector) {
        const key = boneSelector.value;
        if (key === "default") return;
        avatar.setBoneRotation(key, {
            [axis]: (value / 180) * Math.PI
        });
    }
};

// 表情
const changeExpression = (value: number) => {
    const expressionSelector = document.getElementById("expressionSelector") as HTMLSelectElement;
    if (expressionSelector) {
        const key = expressionSelector.value;
        if (key === "default") return;
        avatar.setExpression(key, value / 100);
    }
};

// ウィンドウサイズ変更
window.addEventListener(
    `resize`,
    () => {
        // camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
);

const threeCanvas = document.getElementById("threeCanvas");
if (threeCanvas) {
    init(threeCanvas);
}
window.changeBoneAngle = changeBoneAngle;
window.changeExpression = changeExpression;
