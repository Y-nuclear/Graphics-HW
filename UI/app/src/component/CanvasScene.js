// canvas组件，可以添加各种Object
import React, { Component } from 'react';
import OBJobject from '../GL/OBJobject';
import { TG } from '../GL/TG';
import NURBSObject from '../GL/NURBS';
import { ACamera } from '../GL/Camera';
// import axios from 'axios';
import { Sphere ,Triangle,Cube,Circle,Cone,Pyramid,Prism,Ring,Prismoid,Conecylinder,Rectangle } from '../GL/BasicProperty';
import Toolbar from './ToolBar';
import NavBar from './NavBar';
import { saveAs } from 'file-saver';

class CanvasScene extends Component {
    constructor(props) {
        super(props);
        var objects = [];
        var obj3d = new OBJobject();
        obj3d.loadOBJ('./obj/obj.obj');
        objects.push(...obj3d.geometries);//1
        let nurbs = new NURBSObject();
        console.log(nurbs)
        objects.push(nurbs)
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

        window.addEventListener('keydown', (event) => {
            if (event.key == 'x' || event.key == 'X') {
                tg.shot();
            } else if (event.key == 'c' || event.key == 'C') {
                tg.startCapture();
            } else if (event.key == 'v' || event.key == 'V') {
                tg.endCapture();
            }
        });

        // console.log(objects);
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

        tg.clear();

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
    zoomToObject(object) { //缩放到物体
        var camera = this.state.camera;
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        // console.log("zoom")
        if (index !== -1) {
            console.log("computeBox")
            // 计算物体的包围盒和包围球
            object.computeBox();
            object.computeSphere();
            var box = objects[index].box;
            var sphere = objects[index].sphere;
            // 计算物体的中心点
            var centerX = (box.minX + box.maxX) / 2;
            var centerY = (box.minY + box.maxY) / 2;
            var centerZ = (box.minZ + box.maxZ) / 2;
            var distance = sphere.r *1.5;
            var position = [centerX, centerY, centerZ + distance];
            // console.log("position", position);
            var target = [sphere.x, sphere.y, sphere.z];
            // console.log("target", target);
            camera.setParams(position, target);
        }
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
            objects[index].glRotate(x / 180 * Math.PI, 1, 0, 0);
            objects[index].glRotate(y / 180 * Math.PI, 0, 1, 0);
            objects[index].glRotate(z / 180 * Math.PI, 0, 0, 1);
            objects[index].updateVertices();
            objects[index].rotation[0] += x;
            objects[index].rotation[1] += y;
            objects[index].rotation[2] += z;
            for (var i = 0; i < 3; i++) {
                if (objects[index].rotation[i] > 360) {
                    objects[index].rotation[i] -= 360;
                }
                if (objects[index].rotation[i] < 0) {
                    objects[index].rotation[i] += 360;
                }
            }
        }
    }
    chanegScale(object, x, y, z) {
        x = x / object.scale[0];
        y = y / object.scale[1];
        z = z / object.scale[2];
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
        var tg = this.state.tg;
        console.log(e)
        var filename = e;
        
        var change = ()=>{
            var texture = filename;
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
        change();
        
    }

    changeMaterial(object, material) {
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if (index !== -1) {
            objects[index].materials = material;
        }
        this.setState({
            objects: objects
        });
    }

    //修改NURBS曲线相关函数
    onChangeControlPoint(object, axis,value,index_u,index_v) {
        console.log(index_u,index_v)
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if (index !== -1) {
            if(axis == 'x'){    
                objects[index].ControlLines[index_u][index_v][0] = value;
            }
            else if(axis == 'y'){
                objects[index].ControlLines[index_u][index_v][1] = value;
            }
            else if(axis == 'z'){
                objects[index].ControlLines[index_u][index_v][2] = value;
            }
            objects[index].calculateSurface();
        }
        this.setState({
            objects: objects
        });
    }

    onChangeKnot(object, axis,value,index_) {
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if (index !== -1) {
            if(axis == 'u'){    
                objects[index].uknots[index_] = value;
            }
            else if(axis == 'v'){
                objects[index].vknots[index_] = value;
            }
            objects[index].calculateSurface();
        }
        this.setState({
            objects: objects
        });
    }

    onChangeWeight(object, axis,value,index_) {
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if (index !== -1) {
            if(axis == 'u'){    
                objects[index].uweights[index_] = value;
            }
            else if(axis == 'v'){
                objects[index].vweights[index_] = value;
            }
            objects[index].calculateSurface();
        }
        this.setState({
            objects: objects
        });
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
    createCircle(radius) {
        var circle = new Circle(radius);
        this.addObject(circle);
    }
    createSphere() { 
        var sphere = new Sphere();
        this.addObject(sphere);
    }
    createCone(radius,height) { 
        var cone = new Cone(radius,height);
        this.addObject(cone);
    }
    createPyramid(degree,height,radius){ 
        var pyramid = new Pyramid(degree,height,radius);
        this.addObject(pyramid);
    }
    createPrism(degree,height,radius) { 
        var prism = new Prism(degree,height,radius);
        this.addObject(prism);
    }
    createRing(r, R) { 
        var ring = new Ring(r, R);
        this.addObject(ring);
    }
    createPrismoid(degree,height,radius) { 
        var prismoid = new Prismoid(degree,height,radius);
        this.addObject(prismoid);

    }
    createConecylinder(radius,height) { 
        var conecylinder = new Conecylinder(radius,height);
        this.addObject(conecylinder);
    }
    createRectangle() { 
        var rectangle = new Rectangle();
        this.addObject(rectangle);
    }


    CreateNURBS(uControlNum, vControlNum, deg) {
        var nurbs = new NURBSObject(uControlNum, vControlNum, deg);
        this.addObject(nurbs);
    }

    openOBJ(filename) {
        var obj3d = new OBJobject();
        obj3d.loadOBJ('./'+filename);
        var objects = this.state.objects;
        objects.push(...obj3d.geometries);
        this.setState({
            objects: objects
        });
    }

    saveOBJ(objobject,filename) {
        var objText = objobject.saveOBJ();
        var blob = new Blob([objText], { type: "text/plain;charset=utf-8" });
        saveAs(blob, filename);
    }

    changeLight(lightDirection, lightColor) {
        var tg = this.state.tg;
        tg.setLight(lightDirection, lightColor);
        this.setState({
            tg: tg
        });
    }




    render() {
        return (
            <div className="Main" width='100%' height='100%'>
                <NavBar
                    objects={this.state.objects}
                    createSquare={this.createSquare.bind(this)}
                    createTriangle={this.createTriangle.bind(this)}
                    createCircle={this.createCircle.bind(this)}
                    CreateNURBS={this.CreateNURBS.bind(this)}
                    OpenOBJFile={this.openOBJ.bind(this)}
                    changeLight={this.changeLight.bind(this)}
                    createSphere={this.createSphere.bind(this)}
                    createCone={this.createCone.bind(this)}
                    createPyramid={this.createPyramid.bind(this)}
                    createPrism={this.createPrism.bind(this)}
                    createRing={this.createRing.bind(this)}
                    createPrismoid={this.createPrismoid.bind(this)}
                    createConecylinder={this.createConecylinder.bind(this)}
                    createRectangle={this.createRectangle.bind(this)}
                    tg = {this.state.tg}

                />
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', padding: '0 auto' }}>

                <>
                    <canvas id="canvas" width={window.innerWidth * 0.64} height={window.innerHeight * 0.48} style={
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
                    changeMaterial={this.changeMaterial.bind(this)}
                    deleteObject={this.removeObject.bind(this)}
                    zoomToObject={this.zoomToObject.bind(this)}
                    onChangeControlPoint={this.onChangeControlPoint.bind(this)}
                    onChangeWeight={this.onChangeWeight.bind(this)}
                    onChangeKnot={this.onChangeKnot.bind(this)}
                />
            </div>
            </div>
        );
    }
}
export default CanvasScene;