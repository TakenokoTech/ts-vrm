import _ from "lodash";
import * as THREE from "three";
import VRMScene from "./VRMScene";
import { DomManager } from "..";

export interface InspectorManager extends DomManager {}

export interface MultipleInputsCol {
    value: number;
    step: number;
    type: string;
    callback: (value: number) => any;
}

export interface MultipleSelectCol {
    value: string;
    selected: boolean;
    callback: (value: number) => any;
}

export const paramList = (param: any): string[] => {
    const list: string[] = [];
    Object.entries(param).forEach(([key, value]) => {
        list.push(key);
    });
    return list;
};

/**
 * Geometry
 */

export enum GeometryType {
    BoxGeometry = "BoxGeometry",
    CircleGeometry = "CircleGeometry",
    SphereGeometry = "SphereGeometry"
}

export const BoxGeometryParam = {
    width: 100,
    height: 100,
    depth: 100
};

export const CircleGeometryParam = {
    radius: 48,
    segments: 16
};

export const SphereGeometryParam = {
    radius: 48,
    widthSegments: 16,
    heightSegments: 16
};

export const geometryParam = (geometryType: GeometryType): any => {
    switch (geometryType) {
        case GeometryType.BoxGeometry:
            return BoxGeometryParam;
        case GeometryType.CircleGeometry:
            return CircleGeometryParam;
        case GeometryType.SphereGeometry:
            return SphereGeometryParam;
    }
};

export const createGeometry = (geometryType: GeometryType, param: any): THREE.Geometry => {
    switch (geometryType) {
        case GeometryType.BoxGeometry:
            return new THREE.BoxGeometry(param.width, param.height, param.depth);
        case GeometryType.CircleGeometry:
            return new THREE.CircleGeometry(param.radius, param.segments);
        case GeometryType.SphereGeometry:
            return new THREE.SphereGeometry(param.radius, param.widthSegments, param.heightSegments);
        default:
            return new THREE.Geometry();
    }
};

/**
 * Material
 */

export enum MaterialType {
    MeshBasicMaterial = "MeshBasicMaterial",
    MeshLambertMaterial = "MeshLambertMaterial",
    MeshPhongMaterial = "MeshPhongMaterial"
}

export const MaterialParam = {
    color: THREE.Color,
    wireframe: false
};

export const materialParam = (materialType: MaterialType, param: any = {}): any => {
    switch (materialType) {
        case MaterialType.MeshBasicMaterial:
            return _.merge({}, MaterialParam, param);
        case MaterialType.MeshLambertMaterial:
            return _.merge({}, MaterialParam, param);
        case MaterialType.MeshPhongMaterial:
            return _.merge({}, MaterialParam, param);
    }
};

export const createMaterial = (materialType: MaterialType, param: any): THREE.Material => {
    switch (materialType) {
        case MaterialType.MeshBasicMaterial:
            return new THREE.MeshBasicMaterial(param);
        case MaterialType.MeshLambertMaterial:
            return new THREE.MeshLambertMaterial(param);
        case MaterialType.MeshPhongMaterial:
            return new THREE.MeshPhongMaterial(param);
        default:
            return new THREE.Material();
    }
};

export const castMaterial = (material: any): THREE.MeshBasicMaterial | THREE.MeshLambertMaterial => {
    switch (material.type) {
        case THREE.MeshBasicMaterial:
            return material as THREE.MeshBasicMaterial;
        case THREE.MeshLambertMaterial:
            return material as THREE.MeshLambertMaterial;
        default:
            return material as THREE.MeshBasicMaterial;
    }
};
