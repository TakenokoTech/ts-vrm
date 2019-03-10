import * as THREE from "three";
import { Vector3 } from "three";
import { Quaternion } from "cannon";

/**
 * Box Wrapper
 */
export class BoxParam {
    name: string;
    width: number;
    height: number;
    depth: number;
    position: Vector3;
    quaternion: Quaternion;
    wireframe: boolean = false;

    constructor(name: string, width: number, height: number, depth: number, position: Vector3 = new Vector3(0, 0, 0), quaternion: Quaternion = new Quaternion(0, 0, 0, 1), wireframe: boolean = false) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.position = position;
        this.quaternion = quaternion;
        this.wireframe = wireframe;
    }
}

/**
 * Sphere Wrapper
 */
export class SphereParam {
    name: string;
    radius: number;
    position: Vector3;
    wireframe: boolean = false;

    constructor(name: string, radius: number = 64, position: Vector3 = new Vector3(0, 0, 0), wireframe: boolean = false) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.wireframe = wireframe;
    }
}
