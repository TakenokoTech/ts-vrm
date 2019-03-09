import * as THREE from "three";
import { Vector3 } from "three";
import { Quaternion } from "cannon";

/**
 * Sphere Wrapper
 */
export class SphereParam {
    radius: number;
    position: Vector3;

    get widthSegments(): number {
        return this.radius;
    }
    get heightSegments(): number {
        return this.radius;
    }
    constructor(radius: number = 64, position: Vector3 = new Vector3(0, 0, 0)) {
        this.radius = radius;
        this.position = position;
    }
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
