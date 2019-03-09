import _ from "lodash";
import * as THREE from "three";
import { Vector3, MeshLambertMaterialParameters, MeshStandardMaterialParameters } from "three";
import OrbitControls from "three-orbitcontrols";
import Stats from "stats-js";
import WebVRM from "../../react-vrm/vrm/WebVRM";
import { SphereParam } from "./IVRMScene";

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

    private width = 0;
    private height = 0;
    private avaterBones: { [key: string]: THREE.Bone } = {};
    private modelURL = `../../static/vrm/nokoko.vrm`;

    constructor(private canvas: HTMLElement, private statsDom: HTMLElement) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.stats = this.createStats();
        this.camera = this.createCamera();
        this.controls = this.createControls();
        this.renderer = this.createRenderer();
        this.avatar = new WebVRM(this.modelURL, this.onLoad.bind(this));
        canvas.appendChild(this.renderer.domElement);
        this.addScene();
        this.render();
    }

    addScene() {
        this.scene.add(this.createAmbientLight());
        this.scene.add(this.createDictLight(new Vector3(-128, 256, -128)));
        this.scene.add(this.createBall(new SphereParam(64, new Vector3(64, 128, 64))));
        this.scene.add(this.createFloar());
        this.scene.add(this.createFloar(true));
        // this.scene.add(this.createBackgroud());
    }

    createCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 2000);
        camera.position.set(150, 300, -300);
        return camera;
    }

    createControls(): OrbitControls {
        const controls = new OrbitControls(this.camera, this.canvas);
        controls.target.set(0, 0.75, 0);
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
        light.position.set(0, 256, -100);
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        light.castShadow = true;
        this.scene.add(new THREE.PointLightHelper(light, 0xff0000));
        return light;
    }

    createAmbientLight(): THREE.Light {
        const ambient = new THREE.AmbientLight(0x333333);
        return ambient;
    }

    createDictLight(position: Vector3 = new Vector3(0, 256, -256)): THREE.Light | THREE.Object3D {
        const FIELD_SIZE = 256;
        const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 1.6);
        directionalLight.position.set(position.x, position.y, position.z);
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.top = FIELD_SIZE;
        directionalLight.shadow.camera.bottom = FIELD_SIZE * -1;
        directionalLight.shadow.camera.left = FIELD_SIZE;
        directionalLight.shadow.camera.right = FIELD_SIZE * -1;
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        this.scene.add(new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000));
        return directionalLight;
    }

    createFloar(wireframe: boolean = false): THREE.Object3D {
        const material = this.material({ color: 0xcccccc, wireframe: wireframe });
        const meshFloor = new THREE.Mesh(new THREE.BoxGeometry(600, 100, 600), new THREE.MeshLambertMaterial(material));
        meshFloor.position.y = -50;
        meshFloor.receiveShadow = true;
        return meshFloor;
    }

    material(param: THREE.MeshLambertMaterialParameters | THREE.MeshStandardMaterialParameters): {} {
        return _.merge({}, param, {
            color: param.wireframe ? 0x00ff00 : param.color,
            wireframe: param.wireframe || false
        });
    }

    createBall(param: SphereParam = new SphereParam()): THREE.Object3D {
        const wireframe = new THREE.Mesh(new THREE.SphereGeometry(param.radius, param.widthSegments, param.heightSegments), new THREE.MeshLambertMaterial({ color: 0x00ff00, wireframe: true }));
        wireframe.position.set(param.position.x, param.position.y, param.position.z);
        this.scene.add(wireframe);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(param.radius, param.widthSegments, param.heightSegments), new THREE.MeshLambertMaterial({ color: 0x88ccff }));
        ball.position.set(param.position.x, param.position.y, param.position.z);
        ball.castShadow = true;
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
        this.statsDom.appendChild(stats.dom);
        return stats;
    }

    onLoad() {
        this.avatar.scene.traverse((object: any) => {
            if (object.isBone) this.avaterBones[object.name] = object;
        });
        this.avatar.scene.scale.x = 100;
        this.avatar.scene.scale.y = 100;
        this.avatar.scene.scale.z = 100;
        this.scene.add(this.avatar.scene);
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }
}
