import { VRMLoaderManager } from "./VRMLoaderSceneInterface";
import { VrmAnimation } from "../../../schema/Animation/RootObject";
import WebVRM from "../vrm/WebVRM";

import nokokoBone from "../../../static/vrm/nokoko_bone.json";
import aliciaBone from "../../../static/vrm/alicia_bone.json";
import pandaBone from "../../../static/vrm/panda_bone.json";

export class WebSocketReciver {
    private manager: VRMLoaderManager;
    private avaterBones: { [key: string]: THREE.Bone } = {};
    private messageData: any = null;
    private socket: WebSocket | undefined;

    constructor(manager: VRMLoaderManager) {
        try {
            this.manager = manager;
            this.onLoad = this.onLoad.bind(this);
            this.socket = new WebSocket("ws://127.0.0.1:5001");
        } catch (e) {
            console.warn(e);
        }
    }

    onLoad(manager: VRMLoaderManager) {
        this.manager = manager;
        this.realtimeAnimeWebsocket();
        this.attachBone(this.manager.vrmScene.avatar);
    }

    attachBone(avatar: WebVRM) {
        if (!avatar || !avatar.scene) {
            return;
        }

        this.avaterBones = {};
        avatar.scene.traverse((object: any) => {
            if (object.isBone) this.avaterBones[object.name] = object;
        });
    }

    realtimeAnimeWebsocket() {
        if (!this.socket) return;
        const socket = this.socket;
        socket.onopen = (event: Event) => {
            console.log("websocket open");
            socket.onmessage = message => {
                this.messageData = message.data;
            };
            socket.onclose = () => {
                console.log("websocket close");
            };
        };
    }

    updateFrame() {
        if (!this.messageData) {
            return;
        }

        const animation: VrmAnimation[] = JSON.parse(this.messageData).vrmAnimation;
        for (let ani of animation) {
            const name = this.manager.vrmScene.avatar.humanoidBone[ani.name];
            const bone = this.avaterBones[name];
            const key = ani.keys[ani.keys.length - 1];
            if (!bone || !key) continue;
            this.avaterBones[name].quaternion.set(-key.rot[0], -key.rot[1], key.rot[2], key.rot[3]);
        }
    }
}
