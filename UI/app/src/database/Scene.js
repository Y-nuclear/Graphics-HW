import { EventDispatcher } from "./EventDispatcher";

// Scene作为场景类，主要管理所有的3D对象和相机、光源等
// 使用WebGL
// 定义基本的场景

class Scene extends EventDispatcher {
    constructor() {
        super();
        this.objects = [];
        this.camera = null;
        this.lights = [];
    }

    // 添加物体
    add(object) {
        if (object == null) {
            console.log("添加物体为空");
            return;
        }
        if (this.objects == undefined) {
            this.objects = [];
        }
        this.objects.push(object);
    }
    // 移除物体
    remove(object) {
        var index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }
    // 设置相机
    setCamera(camera) {
        this.camera = camera;
    }
    // 设置光源
    addLight(light) {
        this.lights.push(light);
    }
    // 移除光源
    removeLight(light) {
        var index = this.lights.indexOf(light);
        if (index > -1) {
            this.lights.splice(index, 1);
        }
    }

    // 绘制
    render(gl) {
        // 绘制所有的物体
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].render(gl,this.camera, this.lights);
        }
    }
}

export { Scene };