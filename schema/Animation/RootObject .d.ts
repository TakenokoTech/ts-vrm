export interface Key {
    pos: number[];
    rot: number[];
    scl: number[];
    time: number;
}

export interface VrmAnimation {
    name: string;
    keys: Key[];
}

export interface RootObject {
    vrmAnimation: VrmAnimation[];
}
