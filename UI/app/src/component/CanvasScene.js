// canvas组件，可以添加各种Object
import OBJobject from '../GL/OBJobject';
import React, { Component } from 'react';
import { vec3, mat4 } from 'gl-matrix';
// import { Triangle, Rectangle, Cube } from '../GL/BasicProperty';
// import OBJobject from '../GL/OBJobject';

import { TG } from '../GL/TG';
import * as TGCase from '../GL/TGCase';
import { ACamera } from '../GL/Camera';

import { Sphere ,Triangle,Cube,Circle } from '../GL/BasicProperty';

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
        // var cube = new Cube();
        var triangle = new Triangle();
        var cube = new Cube();
        var circle = new Circle();
        var sphere = new Sphere();
        var objects = [triangle]//0

        {// 临时
            var obj3d = new OBJobject();
            obj3d.loadOBJ('./shuibei.obj');
            objects.push(obj3d);//1
            objects.push(cube);//2
            objects.push(circle);//3
            objects.push(sphere);//4
            // console.log('objects; ',objects);
            TGCase.case1Init(tg);
            TGCase.case2Init(tg);
            TGCase.case3Init(tg);
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
        // console.log('tg: ', tg);
        var camera = this.state.camera;
        var objects = this.state.objects;

        var { position, target, mode, fov, near, far } = camera.getParams();
        tg.setCamera(position, target, mode, fov, near, far);

        // TGCase.case1Animate(tg, frame);
        TGCase.case2Animate(tg, frame);
        // TGCase.case3Animate(tg, frame);


        // var flag = 4;

        // if (flag == 1) { // case 1
            // tg.clear();
            // tg.setCamera(camera);
            tg.drawXYZ();

        //三角形 objects[0]
        tg.pushModelMatrix(); {
            tg.translate(0.2, -1.2, 1);
            tg.drawTriangle(objects[0].vertices, objects[0].colors);        
        }
        tg.popModelMatrix();

        //正方体objects[2]
        tg.pushModelMatrix(); {
            tg.translate(-1.5, -1.2, 1);
            tg.drawTriangle(objects[2].vertices, objects[2].colors);        
        } tg.popModelMatrix();
        //圆objects[3]
        tg.pushModelMatrix(); {
            tg.translate(-1.5, 1.2, 1);
            tg.drawTriangle(objects[3].vertices, objects[3].colors);        
        } tg.popModelMatrix();
        
        //球objects[4]
        tg.pushModelMatrix(); {
            tg.translate(-4.5, -1.2, 1);
            tg.drawTriangle(objects[4].vertices, objects[4].colors);        
        } tg.popModelMatrix();
        
        //旋转水杯
            tg.pushModelMatrix();
        {       
                
                objects[1].geometries[0].glRotate(1 * Math.PI / 180, 1, 0, 1);
                objects[1].geometries[0].updateVertices();
                var vertices = objects[1].geometries[0].vertices;
                var texcoords = objects[1].geometries[0].uvs;
                var colors = objects[1].geometries[0].colors;
                var normals = objects[1].geometries[0].normals;

                // tg.rotate(frame / 100, 0, 1, 0);
                tg.translate(0.5, 0, 0);
                var scalef = 1 + 0.9 * Math.cos(frame / 80);
                // tg.scale(scalef, scalef, scalef);
                tg.drawMaterialTextureTriangle(vertices, texcoords, normals,{
                    ambient: [0.2, 0.2, 0.2],
                    diffuse: [1.0, 1.0, 1.0],
                    specular: [0.5, 0.5, 0.5],
                    shininess: 1,
                    strength: 1,
                },tg.goutouTexture
                
                );
            }
            tg.popModelMatrix();
        // } else if (flag == 2) { // case 2
        //     tg.clear();
        //     tg.setCamera(camera);
        //     tg.drawXYZ();

        //     for (var i = 0; i < objects.length; i++) {

        //         if (objects[i].type == 'image') {
        //             var image = objects[i].data;

        //             var vertices = [
        //                 -0.5, 0.5, 0.0,  // 左上角
        //                 -0.5, -0.5, 0.0,  // 左下角
        //                 0.5, 0.5, 0.0,  // 右上角
        //                 0.5, -0.5, 0.0,   // 右下角
        //             ];

        //             var texCoords = [
        //                 0.0, 0.0,  // 左上角
        //                 0.0, 1.0,  // 左下角
        //                 1.0, 0.0,  // 右上角
        //                 1.0, 1.0,   // 右下角
        //             ];

        //             tg.pushModelMatrix();
        //             {
        //                 tg.translate(0.2, 0.5, 0.2);
        //                 tg.rotate(45, 0, 1, 0);
        //                 tg.drawImageTexture(vertices, texCoords, image);
        //             }
        //             tg.popModelMatrix();
        //         }
        //     }
        // } else if (flag == 3) { // case 3
        //     tg.clear();
        //     tg.setCamera(camera);
        //     tg.setLight([0.0, 0.0, -1.0], [1.0, 1.0, 1.0]);
        //     tg.drawXYZ();

        //     tg.pushModelMatrix();
        //     {
        //         var vertices = [
        //             -0.5, 0.5, 0.0,  // 左上角
        //             -0.5, -0.5, 0.0,  // 左下角
        //             0.5, 0.5, 0.0,  // 右上角
        //             0.5, -0.5, 0.0,   // 右下角
        //         ];

        //         var colors = [
        //             1.0, 0.0, 0.0,  // 左上角
        //             0.0, 1.0, 0.0,  // 左下角
        //             0.0, 0.0, 1.0,  // 右上角
        //             1.0, 1.0, 1.0,   // 右下角
        //         ];

        //         var normals = [
        //             0.0, 0.0, 1.0,  // 左上角
        //             0.0, 0.0, 1.0,  // 左下角
        //             0.0, 0.0, 1.0,  // 右上角
        //             0.0, 0.0, 1.0,   // 右下角
        //         ];

        //         tg.rotate(frame / 50, 0, 1, 0);
        //         // tg.translate(0.2, 0.5, 0.2);
        //         tg.drawLightTriangle(vertices, colors, normals);
        //     }
        //     tg.popModelMatrix();
        // } else if (flag == 4) { // case 4
        //     tg.clear();
        //     tg.setCamera(camera);
        //     tg.drawXYZ();

        //     tg.drawLine2D([-1, 0, -1], [-0.5, 0.5, -1], [1, 0, 0]);
        //     tg.drawArrow([0, 0, 0], [0.5, 0.5, 0], [1, 1, 0]);
        //     tg.drawText("Hallo World", [-0.5, 0.5, 0], "#ffffff", 0.05, 1);

        // } else if (flag == 5) { // case 5
        // } else if (flag == 6) { // case 6
        // }

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