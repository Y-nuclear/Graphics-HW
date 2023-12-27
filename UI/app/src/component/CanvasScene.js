// canvas组件，可以添加各种Object
import OBJobject from '../GL/OBJobject';
import React, { Component } from 'react';

import { TG } from '../GL/TG';
import * as TGCase from '../GL/TGCase';
import { ACamera } from '../GL/Camera';

import { Sphere ,Triangle,Cube,Circle } from '../GL/BasicProperty';
import Toolbar from './ToolBar';
class CanvasScene extends Component {
    constructor(props) {
        super(props);
        var triangle = new Triangle();
        console.log(triangle);
        this.state = {
            frame: 0,
            canvas: null,
            tg: null,
            objects: [triangle],
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
            // var obj3d = new OBJobject();
            // obj3d.loadOBJ('./obj/obj.obj');
            // objects.push(...obj3d.geometries);
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
        TGCase.case2Animate(tg, frame);
        // TGCase.case3Animate(tg, frame);
        tg.drawXYZ();
        objects.forEach(element => {

            tg.drawMaterialTriangle(element.vertices, element.colors, element.normals, element.materials, element.textures);
        });
        
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

    //修改物体属性相关函数
    //修改物体位置
    changePosition(object, x, y, z) {
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        x = x - object.position[0];
        y = y - object.position[1];
        z = z - object.position[2];

        if (index !== -1) {
            objects[index].glTranslate(x, y, z);
            objects[index].updateVertices();
            objects[index].position[0] += x;
            objects[index].position[1] += y;
            objects[index].position[2] += z;
        }
        console.log(objects[index]);
        this.setState({
            objects: objects
        });
    }

    render() {
        return (
            <div style={{display:"flex",flexDirection:"row"}}>
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
                <Toolbar
                    objects={this.state.objects}
                    addObject={this.addObject.bind(this)}
                    removeObject={this.removeObject.bind(this)}
                    addEvent={this.addEvent.bind(this)}
                    removeEvent={this.removeEvent.bind(this)}
                    changePosition={this.changePosition.bind(this)}
                />
            </div>
        );
    }
}
export default CanvasScene;