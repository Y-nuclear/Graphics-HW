// canvas组件，可以添加各种Object

import React, { Component } from 'react';
import { vec3, mat4 } from 'gl-matrix';
// import { Triangle, Rectangle, Cube } from '../GL/BasicProperty';
// import OBJobject from '../GL/OBJobject';

import { TG } from '../GL/TG';
import { ACamera } from '../GL/Camera';

class CanvasScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frame: 0,
            canvas: null,
            tg: null,
            objects: [],
            camera: null,
        }
    }
    componentDidMount() {
        var canvas = document.getElementById('canvas');
        var tg = new TG();
        tg.init(canvas);
        var camera = new ACamera(canvas);
        var objects = []

        {// 临时
            // var obj3d = new OBJobject(gl);
            // obj3d.loadOBJ('./shuibei.obj');
            // objects.push(obj3d);
        }

        this.setState({
            canvas: canvas,
            tg: tg,
            camera: camera,
            objects: objects,
        });
        this.startAnimation();
    }
    componentDidUpdate() {
        // 60帧刷新
        // console.log(this.state.frame);
        var frame = this.state.frame;

        var tg = this.state.tg;
        var camera = this.state.camera;
        var objects = this.state.objects;

        tg.clear();
        tg.setCamera(camera);
        tg.drawXYZ();

        var vertices = [
            0.0, 0.0, 0.0,
            0.7, 0.3, 0.0,
            -0.6, 0.3, 0.4
        ];
        var colors = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
        ];

        tg.pushModelMatrix();
        {
            tg.rotate(frame / 100, 0, 1, 0);
            tg.translate(0.5, 0, 0);
            var scalef = 1 + 0.9 * Math.cos(frame / 80);
            tg.scale(scalef, scalef, scalef);
            tg.drawTriangle(vertices, colors);
        }
        tg.popModelMatrix();

        // for (var i = 0; i < objects.length; i++) {
        //     objects[i].glRotate(0.5, 0, 0, 1);
        //     // objects[i].glRotate(0.5,0,1,0);
        //     // objects[i].glTranslate(0.2,0,0);
        //     // this.state.Camera.setPerspective(45,1,0.1,100);
        //     // this.state.Camera.setPosition(0,0,2.5);
        //     // this.state.Camera.updateModelMatrix();
        //     // this.state.Camera.setViewMatrix();
        //     // objects[i].modelMatrix.multiply(this.state.Camera.viewMatrix);
        //     // objects[i].update();

        //     // console.log(objects[i].modelMatrix.elements);

        //     this.state.Camera.setPerspective(45, 1, 0.1, 100);
        //     this.state.Camera.setPosition(0, 0, 2.5);
        //     this.state.Camera.updateModelMatrix();
        //     this.state.Camera.setViewMatrix();
        //     objects[i].modelMatrix.multiply(this.state.Camera.viewMatrix);
        //     objects[i].update();


        //     objects[i].render();
        // }

    }
    startAnimation() {
        this.animationFrameId = requestAnimationFrame(this.animate);
    }
    stopAnimation() {
        cancelAnimationFrame(this.animationFrameId);
    }
    animate = () => {
        // 更新状态，触发重新渲染
        this.setState((prevState) => ({
            frame: prevState.frame + 1,
        }));
        // 继续下一帧动画
        this.animationFrameId = requestAnimationFrame(this.animate);
    };

    // 添加物体
    addObject(object) {
        var objects = this.state.objects;
        objects.push(object);
        this.setState({
            objects: objects
        });
    }
    // 删除物体
    removeObject(object) {
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if (index !== -1) {
            objects.splice(index, 1);
        }
        this.setState({
            objects: objects
        });
    }
    // 添加canvas事件
    addEvent(type, func) {
        var canvas = this.state.canvas;
        canvas.addEventListener(type, func);
    }
    // 删除canvas事件
    removeEvent(type, func) {
        var canvas = this.state.canvas;
        canvas.removeEventListener(type, func);
    }
    render() {
        return (
            <div>
                <canvas id="canvas" width={720} height={480} style={
                    {
                        border: '1px solid #000',
                        margin: '10px auto',
                        display: 'block',
                        background: '#ffd0d0'
                    }
                }>canvas</canvas>
            </div>
        );
    }
}
export default CanvasScene;