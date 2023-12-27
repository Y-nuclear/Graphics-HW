// canvas组件，可以添加各种Object
import React, { Component } from 'react';

import { vec3, mat4 } from 'gl-matrix';
import { TG } from '../GL/TG';
import * as TGCase from '../GL/TGCase';

import { ACamera } from '../GL/Camera';

import OBJobject from '../GL/OBJobject';
import ObjectList from './ObjectList';
import { Sphere, Triangle, Cube, Circle } from '../GL/BasicProperty';
import ObjectBox from './ObjectBox';

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
            obj3d.loadOBJ('./obj/obj.obj');
            objects.push(...obj3d.geometries);
            objects.push(cube);//2
            objects.push(circle);//3
            objects.push(sphere);//4

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
        // TGCase.case2Animate(tg, frame);
        // TGCase.case3Animate(tg, frame);

        tg.clear();

        var lightDir = [0.0, 0.0, -1.0];
        var lightColor = [1.0, 1.0, 1.0];
        tg.setLight(lightDir, lightColor);

        // 绘制光线
        tg.pushModelMatrix();
        {
            tg.translate(0.0, 0.0, 2.5);
            tg.drawArrow([0, 0, 0], lightDir, lightColor)
            tg.drawText("light", [lightDir[0] / 2, lightDir[1] / 2, lightDir[2] / 2], "#ffffff", 0.04, 1)
        }
        tg.popModelMatrix();

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
            // objects[1].geometries[0].glRotate(1 * Math.PI / 180, 1, 0, 1);
            objects[1].updateVertices();
            var vertices = objects[1].vertices;
            var texcoords = objects[1].uvs;
            var colors = objects[1].colors;
            var normals = objects[1].normals;
            var textures = objects[1].textures;
            var image = new Image();
            image.onload = () => {
                textures = tg.image2texture(image);
            }
            image.src = './obj/Slime_UV/diffuse.png';
            tg.translate(0.5, 0, 0);
            var scalef = 1 + 0.9 * Math.cos(frame / 80);
            tg.drawMaterialTriangle(vertices, colors, normals, {
                ambient: [0.2, 0.2, 0.2],
                diffuse: [1.0, 1.0, 1.0],
                specular: [0.5, 0.5, 0.5],
                shininess: 12,
                strength: 1,
            }, textures
            );
        }
        tg.popModelMatrix();

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
            <div style={{ display: "flex", flexDirection: "row" }}>
                <>
                    <canvas id="canvas" width={800} height={600} style={
                        {
                            border: '1px solid #000',
                            margin: '10px auto',
                            display: 'block',
                            background: '#ffd0d0'
                        }
                    }>canvas</canvas>
                </>
                <div>
                    <ObjectList objects={this.state.objects} />
                </div>
            </div>
        );
    }
}
export default CanvasScene;