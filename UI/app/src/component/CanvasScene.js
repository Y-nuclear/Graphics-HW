// canvas组件，可以添加各种Object
import React, { Component } from 'react';
import OBJobject from '../GL/OBJobject';
import { TG } from '../GL/TG';
import * as TGCase from '../GL/TGCase';

import { ACamera } from '../GL/Camera';

import { Sphere ,Triangle,Cube,Circle,Cone,Pyramid,Prism,Ring,Prismoid,Conecylinder,Rectangle } from '../GL/BasicProperty';
import Toolbar from './ToolBar';
import NavBar from './NavBar';
class CanvasScene extends Component {
    constructor(props) {
        super(props);
        var triangle = new Triangle();
        var cube = new Cube();
        var circle = new Circle();
        var sphere = new Sphere();
        var rectangle = new Rectangle();
        var ring =new Ring();
        var objects = [triangle]//0
    

        {// 临时
            var obj3d = new OBJobject();
            obj3d.loadOBJ('./obj/obj.obj');
            objects.push(...obj3d.geometries);//1
            objects.push(cube);//2 立方体
            objects.push(circle);//3 圆
            objects.push(sphere);//4 球
            objects.push(rectangle);//5 矩形
            objects.push(ring);//6 环
            objects.push(new Cone());//7 圆锥
            objects.push(new Conecylinder());//8 圆柱
            objects.push(new Pyramid());//9 金字塔
            objects.push(new Prism());//10 棱柱
            objects.push(new Prismoid());//11 棱台
        }

        this.state = {
            frame: 0,
            canvas: null,
            tg: null,
            objects: objects,
            camera: null,
        }
    }
    componentDidMount() {
        var canvas = document.getElementById('canvas');
        var tg = new TG(canvas);
        var camera = new ACamera(canvas);
        var objects = this.state.objects;
        // var cube = new Cube();
        
            TGCase.case1Init(tg);
            TGCase.case2Init(tg);
            TGCase.case3Init(tg);
            console.log(objects);
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
        tg.drawXYZ();
        
        // tg.drawTriangle(objects[11].vertices, objects[11].colors, objects[11].normals);//棱台
        // objects[11].glTranslate(1.0, 1.0, 0);
        objects.forEach(element => {
            // tg.drawTriangle(element.vertices, element.colors, element.normals);
            tg.drawMaterialTriangle(element.vertices, element.colors, element.normals, element.materials);
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
    changeRotation(object, x, y, z) {
        x = x - object.rotation[0];
        y = y - object.rotation[1];
        z = z - object.rotation[2];
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if (index !== -1) {
            objects[index].glRotate(x/180*Math.PI, 1, 0, 0);
            objects[index].glRotate(y/180*Math.PI, 0, 1, 0);
            objects[index].glRotate(z/180*Math.PI, 0, 0, 1);
            objects[index].updateVertices();
            objects[index].rotation[0] += x;
            objects[index].rotation[1] += y;
            objects[index].rotation[2] += z;
            for(var i=0;i<3;i++){
                if(objects[index].rotation[i]>360){
                    objects[index].rotation[i]-=360;
                }
                if(objects[index].rotation[i]<0){
                    objects[index].rotation[i]+=360;
                }
            }
        }
    }
    chanegScale(object, x, y, z) {
        x = x/object.scale[0];
        y = y/object.scale[1];
        z = z/object.scale[2];
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if (index !== -1) {
            objects[index].glScale(x, y, z);
            objects[index].updateVertices();
            objects[index].scale[0] *= x;
            objects[index].scale[1] *= y;
            objects[index].scale[2] *= z;
        }
    }

    render() {
        return (
            <div className="Main" width='100%' height='100%'>
                <NavBar />
            <div style={{display: 'flex', flexDirection: 'row', height: '100%',width:'100%', padding:'0 auto'}}>

                <>
                    <canvas id="canvas" width={900} height={600} style={
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
                    addEvent={this.addEvent.bind(this)}
                    removeEvent={this.removeEvent.bind(this)}
                    changePosition={this.changePosition.bind(this)}
                    changeRotation={this.changeRotation.bind(this)}
                    changeScale={this.chanegScale.bind(this)}
                    deleteObject={this.removeObject.bind(this)}
                />
            </div>
            </div>
        );
    }
}
export default CanvasScene;