import _ from "lodash";
import * as THREE from "three";
import { Vector3, MeshLambertMaterialParameters, MeshStandardMaterialParameters, Quaternion, Euler, Object3D } from "three";
import OrbitControls from "three-orbitcontrols";
import CANNON from "cannon";
import Stats from "stats-js";
import WebVRM from "../../react-vrm/vrm/WebVRM";
import { SphereParam } from "./VRMSceneInterface";
import CannonScene from "./CannonScene";
import { BoxParam } from "./VRMSceneInterface";
import { CannonParam } from "./CannonSceneInterface";
import { DomManager } from "..";

interface BaseThreeScene {
    scene: THREE.Scene;
    camera: THREE.Camera;
    avatar: WebVRM;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    stats: Stats;

    createCamera(): THREE.PerspectiveCamera;
    createControls(): OrbitControls;
    createRenderer(): THREE.WebGLRenderer;
    createLight(): THREE.Light;
    createStats(): Stats;
    onLoad(): void;
    render(): void;
}

export default class VRMScene implements BaseThreeScene {
    public scene = new THREE.Scene();
    public camera: THREE.Camera;
    public avatar: WebVRM;
    public renderer: THREE.WebGLRenderer;
    public controls: OrbitControls;
    public stats: Stats;

    private cannon: CannonScene = new CannonScene();

    private width = 0;
    private height = 0;
    private avaterBones: { [key: string]: THREE.Bone } = {};

    private ballCount: number = 0;
    private objList: THREE.Object3D[] = [];

    constructor(private domManager: DomManager) {
        this.addScene = this.addScene.bind(this);
        this.render = this.render.bind(this);

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.stats = this.createStats();
        this.camera = this.createCamera();
        this.controls = this.createControls();
        this.renderer = this.createRenderer();

        this.objList.push(this.createFloar(new BoxParam("floar", 800, 100, 800, new Vector3(0, -50, 0), new Quaternion(0, 0, 0, 1), false)));
        this.objList.push(this.createFloar(new BoxParam("floar1", 100, 600, 900, new Vector3(400, 200, 0), new Quaternion(0, 0, 0, 1), true)));
        this.objList.push(this.createFloar(new BoxParam("floar2", 900, 600, 100, new Vector3(0, 200, 400), new Quaternion(0, 0, 0, 1), false)));
        this.objList.push(this.createFloar(new BoxParam("floar3", 100, 600, 900, new Vector3(-400, 200, 0), new Quaternion(0, 0, 0, 1), false)));
        this.objList.push(this.createFloar(new BoxParam("floar4", 900, 600, 100, new Vector3(0, 200, -400), new Quaternion(0, 0, 0, 1), true)));

        this.ball = this.createBall(new SphereParam("ball", 64, new Vector3(64, 128, 64)));
        this.domManager.stageDom.appendChild(this.renderer.domElement);
        this.domManager.loadVRM = this.loadVRM;

        this.loadVRM(this.domManager.modelURL);
        this.addScene();
        this.render();
    }

    addScene() {
        this.scene.add(this.createAmbientLight());
        this.scene.add(this.createDictLight(new Vector3(-128, 256, -128)));
        // this.scene.add(this.ball);
        this.objList.forEach(element => this.scene.add(element));
        // this.scene.add(this.createFloar(true));
        // this.scene.add(this.createBackgroud());
    }

    loadVRM(url: string) {
        const obj = this.scene.getObjectByName("VRM");
        obj && this.scene.remove(obj);
        this.avatar = new WebVRM(url, this.onLoad.bind(this));

        for (let i = this.ballCount, last = this.ballCount + 5; i < last; i++, this.ballCount++) {
            const rand = Math.random() * 64;
            this.objList.push(this.createBall(new SphereParam(`ball_${i}`, 48, new Vector3(rand, 800 + 128 * i, rand))));
        }
        this.objList.forEach(element => this.scene.add(element));
    }

    createCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 50000);
        camera.position.set(100, 150, -300);
        return camera;
    }

    createControls(): OrbitControls {
        const controls = new OrbitControls(this.camera, this.domManager.stageDom);
        controls.target.set(0, 75, 0);
        controls.enableKeys = false;
        controls.update();
        return controls;
    }

    createRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(this.width, this.height);
        // renderer.setClearColor(0xaacccc, 1);
        // renderer.setPixelRatio(1);
        // renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    createLight(): THREE.Light {
        const light = new THREE.PointLight(0xffffff, 1.6);
        light.name = "point light";
        light.position.set(0, 256, -100);
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        light.castShadow = true;
        this.scene.add(new THREE.PointLightHelper(light, 0xff0000));
        return light;
    }

    createAmbientLight(): THREE.Light {
        const ambient = new THREE.AmbientLight(0x333333);
        ambient.name = "Ambient Light";
        return ambient;
    }

    createDictLight(position: Vector3 = new Vector3(0, 256, -256)): THREE.Light | THREE.Object3D {
        const FIELD_SIZE = position.y;
        const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 1.6);
        directionalLight.name = "Directional Light";
        directionalLight.position.set(position.x, position.y, position.z);
        directionalLight.shadow.camera.near = 0; //0.5;
        directionalLight.shadow.camera.top = FIELD_SIZE;
        directionalLight.shadow.camera.bottom = FIELD_SIZE * -1;
        directionalLight.shadow.camera.left = FIELD_SIZE;
        directionalLight.shadow.camera.right = FIELD_SIZE * -1;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.castShadow = true;
        this.createDirectionalLightHelper(directionalLight);
        return directionalLight;
    }

    createDirectionalLightHelper(directionalLight: THREE.DirectionalLight) {
        const light = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
        light.name = "Directional Light Helper";
        this.scene.add(light);
    }

    createFloar(param: BoxParam): THREE.Object3D {
        const material = this.material({ color: 0xcccccc, wireframe: param.wireframe });
        const meshFloor = new THREE.Mesh(new THREE.BoxGeometry(param.width, param.height, param.depth), new THREE.MeshLambertMaterial(material));
        meshFloor.name = param.name;
        meshFloor.position.set(param.position.x, param.position.y, param.position.z);
        meshFloor.receiveShadow = true;
        const cannon = new CannonParam(param.name, 0, param.position, param.quaternion, new CANNON.Box(new CANNON.Vec3(param.width / 2, param.height / 2, param.depth / 2)));
        this.cannon.addRigidbody(cannon, meshFloor, false);
        return meshFloor;
    }

    createBall(param: SphereParam): THREE.Object3D {
        const material = this.material({ color: 0x88ccff, wireframe: param.wireframe });
        const ball = new THREE.Mesh(new THREE.SphereGeometry(param.radius, param.radius, param.radius), new THREE.MeshLambertMaterial(material));
        ball.name = param.name;
        ball.position.set(param.position.x, param.position.y, param.position.z);
        ball.castShadow = true;
        const cannon = new CannonParam(param.name, 1, param.position, new Quaternion(), new CANNON.Sphere(param.radius));
        this.cannon.addRigidbody(cannon, ball);
        return ball;
    }

    createBackgroud(): THREE.Object3D {
        const background = new THREE.Mesh(new THREE.PlaneBufferGeometry(2.0, 2.0), new THREE.MeshPhongMaterial({ color: 0x88ccff }));
        background.renderOrder = -1;
        return background;
    }

    createStats(): Stats {
        const stats = new Stats();
        stats.dom.style.position = "relative";
        stats.dom.style.top = "4px";
        stats.dom.style.left = "4px";
        stats.dom.style.margin = "auto";
        const debugWindow = document.body as Element;
        this.domManager.statDom.appendChild(stats.dom);
        return stats;
    }

    material(param: THREE.MeshLambertMaterialParameters | THREE.MeshStandardMaterialParameters): {} {
        return _.merge({}, param, {
            color: param.wireframe ? 0x00ff00 : param.color,
            wireframe: param.wireframe || false
        });
    }

    onLoad() {
        this.avatar.scene.traverse((object: any) => {
            if (object.isBone) {
                this.avaterBones[object.name] = object;
            }
            if (object.position.y > 0.5) {
                // console.log(object.name, object.position);
                const material = { color: 0xff0000, wireframe: true };
                const ball = new THREE.Mesh(new THREE.SphereGeometry(0.6 * 100, 8, 8), new THREE.MeshLambertMaterial(material));
                ball.position.set(object.position.x * 100, object.position.y * 100, object.position.z * 100);
                ball.castShadow = true;
                // this.scene.add(ball);
                const cannon = new CannonParam(object.name, 0, ball.position, new Quaternion(), new CANNON.Sphere(0.6 * 100));
                this.cannon.addRigidbody(cannon, ball /*this.avatar.scene*/);
            }
        });

        this.avatar.scene.scale.x = 100;
        this.avatar.scene.scale.y = 100;
        this.avatar.scene.scale.z = 100;
        this.scene.add(this.avatar.scene);

        this.cannon.addScene();
        this.domManager.render();
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.cannon.render();
        this.stats.update();
    }
}
