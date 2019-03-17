import _ from "lodash";
import VRMScene from "./three/VRMScene";
import { HierarchyScene } from "./three/HierarchyScene";
import Draggable from "../dom/Draggable";
import { InspectorScene } from "./three/InspectorScene";
import { VRMLoaderScene } from "./three/VRMLoaderScene";
import { WebSocketReciver } from "./three/WebSocketReciver";

export interface DomManager {
    stageDom: HTMLElement;
    hierarchyDom: HTMLElement;
    inspectorDom: HTMLElement;
    vrmloaderDom: HTMLElement;
    statDom: HTMLElement;
    vrmScene: VRMScene;
    hierarchyScene: HierarchyScene;
    inspectorScene: InspectorScene;
    vrmloaderScene: VRMLoaderScene;
    webSocketReciver: WebSocketReciver;
    modelName: string;
    modelURL: string;
    selectNumber: number;
    render: () => void;
    updateFrame: () => void;
    loadVRM: null | (() => void);
}

class main {
    private domManager: DomManager;

    constructor() {
        this.render = this.render.bind(this);
        this.updateFrame = this.updateFrame.bind(this);

        const stage: HTMLElement = document.getElementById("stage") || new HTMLElement();
        const hierarchy: HTMLElement = document.getElementById("hierarchy_contents") || new HTMLElement();
        const inspector: HTMLElement = document.getElementById("inspector_contents") || new HTMLElement();
        const vrmloader: HTMLElement = document.getElementById("vrmloader_contents") || new HTMLElement();
        const stat: HTMLElement = document.getElementById("stat") || new HTMLElement();

        this.domManager = {
            stageDom: stage,
            hierarchyDom: hierarchy,
            inspectorDom: inspector,
            vrmloaderDom: vrmloader,
            statDom: stat,
            vrmScene: null,
            hierarchyScene: null,
            inspectorScene: null,
            vrmloaderScene: null,
            webSocketReciver: null,
            modelName: "",
            modelURL: "",
            render: this.render,
            updateFrame: this.updateFrame,
            loadVRM: null,
            selectNumber: 0
        };
        this.domManager.modelName = `nokoko`;
        this.domManager.modelURL = `../../static/vrm/nokoko.vrm`;
        this.domManager.vrmScene = new VRMScene(this.domManager);
        this.domManager.hierarchyScene = new HierarchyScene(this.domManager);
        this.domManager.inspectorScene = new InspectorScene(this.domManager);
        this.domManager.vrmloaderScene = new VRMLoaderScene(this.domManager);
        this.domManager.webSocketReciver = new WebSocketReciver(this.domManager);

        this.render();
        this.draggable();
    }

    private draggable() {
        var hierarchy_p = document.getElementById("hierarchy");
        var hierarchy_h = document.getElementById("hierarchy_header");
        hierarchy_p && hierarchy_h && new Draggable(hierarchy_p, hierarchy_h);

        var inspector_p = document.getElementById("inspector");
        var inspector_h = document.getElementById("inspector_header");
        inspector_p && inspector_h && new Draggable(inspector_p, inspector_h);

        var vrmloader_p = document.getElementById("vrmloader");
        var vrmloader_h = document.getElementById("vrmloader_header");
        vrmloader_p && vrmloader_h && new Draggable(vrmloader_p, vrmloader_h);
    }

    render() {
        // vrmScene.render();
        this.domManager.hierarchyScene.render(this.domManager);
        this.domManager.inspectorScene.render(this.domManager);
        this.domManager.vrmloaderScene.render(this.domManager);
        this.domManager.webSocketReciver.render(this.domManager);
    }

    updateFrame() {
        this.domManager.webSocketReciver && this.domManager.webSocketReciver.updateFrame();
    }
}

new main();
