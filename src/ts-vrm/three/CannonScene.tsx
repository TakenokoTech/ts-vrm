import CANNON, { IContactMaterialOptions, Shape, Vec3 } from "cannon";
import { ShapeType } from "./CannonSceneInterface";
import { CannonParam } from "./CannonSceneInterface";

interface Rigitbody {
    enable: boolean;
    body: CANNON.Body;
    target: THREE.Object3D;
}

interface BaseCannonScene {
    world: CANNON.World;
    addRigidbody(param: CannonParam, target: THREE.Object3D): void;
}

export default class CannonScene implements BaseCannonScene {
    public world: CANNON.World;
    private map: { [index: string]: Rigitbody } = {};

    constructor() {
        this.world = this.createCannon();
    }

    addScene() {
        Object.keys(this.map).forEach(key1 => {
            this.world.addBody(this.map[key1].body);
            Object.keys(this.map).forEach(key2 => {
                if (key1 == key2) {
                    return;
                }
                this.addContact(this.map[key1].body.material, this.map[key2].body.material, {
                    friction: 0.001, //摩擦係数
                    restitution: 0 // 反発係数
                    // contactEquationRelaxation: 3, // 接触式の緩和性
                    // contactEquationStiffness: 10000000, // 接触式の剛性
                    // frictionEquationRelaxation: 3, // 摩擦式の剛性
                    // frictionEquationStiffness: 10000000, // 摩擦式の緩和性
                });
            });
        });
    }

    addRigidbody(param: CannonParam, target: THREE.Object3D, enable = true) {
        const body = new CANNON.Body({ mass: param.mass, material: new CANNON.Material(param.name) });
        body.addShape(param.shape);
        body.position.set(param.position.x, param.position.y, param.position.z);
        body.quaternion.set(param.quaternion.x, param.quaternion.y, param.quaternion.z, param.quaternion.w);
        body.angularVelocity.set(0, 0, 0);
        this.map[body.material.name] = { enable: enable, body: body, target: target };
    }

    render() {
        this.world.step(1 / 10);
        Object.keys(this.map).forEach(key => {
            if (!this.map[key].enable) {
                return;
            }
            if (this.map[key].body.position.y < -100) {
                this.map[key].target.visible = false;
                return;
            }
            // console.log(key, this.map[key].body.position, this.map[key].body.quaternion);
            this.map[key].target.position.copy(this.map[key].body.position);
            this.map[key].target.quaternion.copy(this.map[key].body.quaternion);
        });
    }

    private createCannon(): CANNON.World {
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 5;
        // world.solver. = 0.1;
        return world;
    }

    private addContact(m1: CANNON.Material, m2: CANNON.Material, options?: CANNON.IContactMaterialOptions) {
        var mat3 = new CANNON.ContactMaterial(m1, m2, options);
        this.world.addContactMaterial(mat3);
    }
}
