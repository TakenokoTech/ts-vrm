import { Vector3 } from "three";
import { Quaternion } from "cannon";

enum SharpType {
    Sphere,
    Box
}

export class CannonParam {
    name: string;
    mass: number;
    position: Vector3 = new Vector3(0, 0, 0);
    quaternion: Quaternion = new Quaternion(0, 0, 0, 0);
    shape: CANNON.Shape;

    constructor(name: string, mass: number, position: Vector3, quaternion: Quaternion, shape: CANNON.Shape) {
        this.name = name;
        this.mass = mass;
        this.position = position;
        this.quaternion = quaternion;
        this.shape = shape;
    }
}
