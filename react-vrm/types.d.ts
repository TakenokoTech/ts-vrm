interface Window {
    changeBoneAngle: (axis: string, value: number) => void;
    changeExpression: (value: number) => void;
}

declare var window: Window;
declare module "three-orbitcontrols";
declare module "stats-js";
