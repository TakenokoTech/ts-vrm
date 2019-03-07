import * as THREE from "three";
import { Vector3 } from "three";

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
