// canvas组件，可以添加各种Object
import React, { Component } from 'react';
import OBJobject from '../GL/OBJobject';
import { TG } from '../GL/TG';
import * as TGCase from '../GL/TGCase';

import { ACamera } from '../GL/Camera';
import axios from 'axios';
import { Sphere ,Triangle,Cube,Circle,Cone,Pyramid,Prism,Ring,Prismoid,Conecylinder,Rectangle } from '../GL/BasicProperty';
import Toolbar from './ToolBar';
import NavBar from './NavBar';

class CanvasScene extends Component {
    constructor(props) {
        super(props);
        var objects = [];
        var obj3d = new OBJobject();
        obj3d.loadOBJ('./obj/obj.obj');
        objects.push(...obj3d.geometries);//1

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
            if (element.textures instanceof WebGLTexture) {
                tg.drawMaterialTextureTriangle(element.vertices, element.uvs, element.normals, element.materials, element.textures);
            }
            else{
            tg.drawMaterialTriangle(element.vertices, element.colors, element.normals, element.materials);
            }
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
        this.setState({
            frame: this.state.frame + 1,
        });
        // 继续下一帧动画
        this.animationFrameId = requestAnimationFrame(this.animate);
    };
    componentWillUnmount() {
        this.stopAnimation();
    }

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
    changeName(object, name) {
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if (index !== -1) {
            objects[index].name = name;
        }
        this.setState({
            objects: objects
        });
    }
    
    changeTexture(object,e) {
        e.preventDefault();
        
        var tg = this.state.tg;
        var file = e.target.files[0];
        var formData = new FormData();
        
        formData.append('file', file);
        if(!file){
            return;
        }
        var filename = file.name;
        
        var change = ()=>{
            var texture = './'+filename;
            console.log(texture);
            var objects = this.state.objects;
            var index = objects.indexOf(object);

            if (index !== -1) {
                var image = new Image();
                image.onload = () => {
                    objects[index].textures = tg.image2texture(image)
                }
                image.src = texture;
                console.log(objects);
            }

            this.setState({
                objects: objects
            });
            }
        var upload =  ()=>{
            axios({
                method: 'POST',
                url: 'http://localhost:5000/api/upload',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((res) => {
                console.log(res);
                change();
            }).catch((err) => {
                console.log(err);
            })
        };
        upload();
        
    }

    //创建物体
    createTriangle() {
        var triangle = new Triangle();
        this.addObject(triangle);
    }
    createSquare() {
        var cube = new Cube();
        this.addObject(cube);
    }
    createCircle() {
        var circle = new Circle();
        this.addObject(circle);
    }

    render() {
        return (
            <div className="Main" width='100%' height='100%'>
                <NavBar 
                    createSquare={this.createSquare.bind(this)} 
                    createTriangle={this.createTriangle.bind(this)} 
                    createCircle={this.createCircle.bind(this)}
                />
            <div style={{display: 'flex', flexDirection: 'row', height: '100%',width:'100%', padding:'0 auto'}}>

                <>
                    <canvas id="canvas" width={900} height={600} style={
                        {
                            border: '1px solid #000',
                            margin: '10px auto',
                            display: 'block',
                            background: '#eeeeee'
                        }
                    }>canvas</canvas>
                </>
                <Toolbar
                    objects={this.state.objects}
                    addObject={this.addObject.bind(this)}
                    addEvent={this.addEvent.bind(this)}
                    removeEvent={this.removeEvent.bind(this)}
                    changeName={this.changeName.bind(this)}
                    changePosition={this.changePosition.bind(this)}
                    changeRotation={this.changeRotation.bind(this)}
                    changeScale={this.chanegScale.bind(this)}
                    changeTexture={this.changeTexture.bind(this)}
                    deleteObject={this.removeObject.bind(this)}
                />
            </div>
            </div>
        );
    }
}
export default CanvasScene;