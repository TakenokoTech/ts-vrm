import GLTFLoader from "three-gltf-loader";
import { LoadingManager, DefaultLoadingManager } from "three";

/**
 * @author Takahiro / https://github.com/takahirox
 */

// VRM Specification: https://dwango.github.io/vrm/vrm_spec/
//
// VRM is based on glTF 2.0 and VRM extension is defined
// in top-level json.extensions.VRM
export default class VRMLoader {
    private manager: LoadingManager;
    private glTFLoader: GLTFLoader;

    constructor() {
        this.manager = DefaultLoadingManager;
        this.glTFLoader = new GLTFLoader(this.manager);
    }

    load(url, onLoad, onProgress, onError) {
        var scope = this;
        this.glTFLoader.load(url, gltf => scope.parse(gltf, onLoad), onProgress, onError);
    }

    setCrossOrigin(value) {
        this.glTFLoader.setCrossOrigin(value);
        return this;
    }

    setPath(value) {
        this.glTFLoader.setPath(value);
        return this;
    }

    setResourcePath(value) {
        this.glTFLoader.setResourcePath(value);
        return this;
    }

    setDRACOLoader(dracoLoader) {
        this.glTFLoader.setDRACOLoader(dracoLoader);
        return this;
    }

    parse(gltf, onLoad) {
        var gltfParser = gltf.parser;
        var gltfExtensions = gltf.userData.gltfExtensions || {};
        var vrmExtension = gltfExtensions.VRM || {};
        onLoad(gltf);
    }
}
