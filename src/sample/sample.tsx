import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import { GLTF, Scene, AnimationClip } from "three";
import Stats from "stats-js";
import OrbitControls from "three-orbitcontrols";
import WebVRM from "../vrm/WebVRM";

let avatar: WebVRM;
let stats: Stats;
let controls: OrbitControls;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;

// 初期化
function init(targetCanvas: Element) {
    function initThree(canvas: Element) {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
        camera.position.set(0, 1.5, -1);

        controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 1.5, 0);
        controls.update();

        scene = new THREE.Scene();
        const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
        light.position.set(0, 1, 0);
        scene.add(light);

        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        //renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setPixelRatio(1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        renderer.shadowMap.autoUpdate = false;
        canvas.appendChild(renderer.domElement);
    }

    //FPS表示
    const initStats = () => {
        stats = new Stats();
        stats.dom.style.position = "relative";
        stats.dom.style.top = "5px";
        stats.dom.style.margin = "auto";
        const debugWindow = document.getElementById("debugWindow") as Element;
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
            // animator
            // let mixer: THREE.AnimationMixer;
            // const gltf: GLTF = avatar.vrm;
            // const animations = gltf.animations;
            // if (animations && animations.length) {
            //     console.log("animations.length: ", animations.length);
            //     mixer = new THREE.AnimationMixer(gltf);
            //     for (let anim of animations) {
            //         mixer.clipAction(anim).play();
            //     }
            // }
        };
        avatar = new WebVRM(modelURL, scene, callback);
    };

    // 描画更新処理
    function update() {
        requestAnimationFrame(update);
        renderer.render(scene, camera);
        stats.update();
    }

    initThree(targetCanvas);
    initStats();
    // addTestObject();
    loadModel(`../../static/vrm/nokoko.vrm`);
    // loadModel(`../../static/vrm/panda.vrm`);
    // loadModel(`https://dl.dropboxusercontent.com/s/tiwmoh8te3g5i6b/monoGaku.vrm`);
    update();
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
