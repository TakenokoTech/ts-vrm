declare module "three-orbitcontrols";
declare module "stats-js";

declare var window: Window;
interface Window {
    changeBoneAngle: (axis: string, value: number) => void;
    changeExpression: (value: number) => void;
}

declare class OrbitControls {}
