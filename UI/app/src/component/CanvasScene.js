// canvas组件，可以添加各种Object

import React, { Component } from 'react';
import { vec3, mat4 } from 'gl-matrix';
// import { Triangle, Rectangle, Cube } from '../GL/BasicProperty';
// import OBJobject from '../GL/OBJobject';

import { TG } from '../GL/TG';
import { ACamera } from '../GL/Camera';
import { Cube } from '../GL/BasicProperty';

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
        var tg = new TG(canvas);
        var camera = new ACamera(canvas);
        var cube = new Cube();
        var objects = [cube]

        {// 临时
            // var obj3d = new OBJobject(gl);
            // obj3d.loadOBJ('./shuibei.obj');
            // objects.push(obj3d);

            var image = new Image();
            image.onload = () => {
                objects.push({
                    type: 'image',
                    data: image,
                });
            }
            image.src = './goutou.png';
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
        var frame = this.state.frame;

        var tg = this.state.tg;
        var camera = this.state.camera;
        var objects = this.state.objects;

        var flag = 1;

        if (flag == 1) { // case 1
            tg.clear();
            tg.setCamera(camera);
            tg.drawXYZ();

            tg.pushModelMatrix();
            {
                objects[0].glRotate(1*Math.PI/180,1,0,1);

                

                var vertices = objects[0].updateVertices() //用该函数获取对象变换后的点
                var colors = objects[0].colors

                tg.rotate(frame / 100, 0, 1, 0);
                tg.translate(0.5, 0, 0);
                var scalef = 1 + 0.9 * Math.cos(frame / 80);
                tg.scale(scalef, scalef, scalef);
                tg.drawTriangle(vertices, colors);
            }
            tg.popModelMatrix();
        }
        else if (flag == 2) { // case 2
            tg.clear();
            tg.setCamera(camera);
            tg.drawXYZ();

            for (var i = 0; i < objects.length; i++) {

                if (objects[i].type == 'image') {
                    var image = objects[i].data;

                    var vertices = [
                        -0.5, 0.5, 0.0,  // 左上角
                        -0.5, -0.5, 0.0,  // 左下角
                        0.5, 0.5, 0.0,  // 右上角
                        0.5, -0.5, 0.0,   // 右下角
                    ];

                    var texCoords = [
                        0.0, 0.0,  // 左上角
                        0.0, 1.0,  // 左下角
                        1.0, 0.0,  // 右上角
                        1.0, 1.0,   // 右下角
                    ];
                    tg.pushModelMatrix();
                    {
                        tg.translate(0.2, 0.5, 0.2);
                        tg.rotate(45, 0, 1, 0);
                        tg.drawImageTexture(vertices, texCoords, image);
                    }
                    tg.popModelMatrix();
                }
            }
        } else if (flag == 3) { // case 3
            tg.clear();
            tg.setCamera(camera);
            tg.setLight([0.0, 0.0, -1.0], [1.0, 1.0, 1.0]);
            tg.drawXYZ();

            tg.pushModelMatrix();
            {
                var vertices = [
                    -0.5, 0.5, 0.0,  // 左上角
                    -0.5, -0.5, 0.0,  // 左下角
                    0.5, 0.5, 0.0,  // 右上角
                    0.5, -0.5, 0.0,   // 右下角
                ];

                var colors = [
                    1.0, 0.0, 0.0,  // 左上角
                    0.0, 1.0, 0.0,  // 左下角
                    0.0, 0.0, 1.0,  // 右上角
                    1.0, 1.0, 1.0,   // 右下角
                ];

                var normals = [
                    0.0, 0.0, 1.0,  // 左上角
                    0.0, 0.0, 1.0,  // 左下角
                    0.0, 0.0, 1.0,  // 右上角
                    0.0, 0.0, 1.0,   // 右下角
                ];

                tg.rotate(frame / 50, 0, 1, 0);
                // tg.translate(0.2, 0.5, 0.2);
                tg.drawLightTriangle(vertices, colors,normals);
            }
            tg.popModelMatrix();
        }

        // old case
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