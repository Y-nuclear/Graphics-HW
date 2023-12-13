// Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
// 使用WebGL
// 定义基本的物体
import { EventDispatcher } from "./EventDispatcher";
import  {Vector3}  from "../Math/Vector";
import  Matrix4  from "../Math/Matrix";
//Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
//包括顶点数据、顶点索引、顶点颜色、位置、旋转、缩放、模型矩阵、子对象等

class Object3D extends EventDispatcher{
    constructor(){
        super();
        this.vertices = [];
        this.indices = [];
        this.colors = [];
        this.position = new Vector3(0,0,0);
        this.rotation = new Vector3(0,0,0);
        this.scale = new Vector3(1,1,1);
        this.modelMatrix = new Matrix4();
        this.children = [];
        this.Matrixs = [];
    }
    // 添加子对象
    add(obj){
        this.children.push(obj);
    }
    // 删除子对象
    remove(obj){
        var index = this.children.indexOf(obj);
        if(index !== -1){
            this.children.splice(index,1);
        }
    }
    // 清空子对象
    clear(){
        this.children = [];
    }
    // 更新模型矩阵
    updateModelMatrix(){
        while(this.Matrixs.length > 0){
            this.modelMatrix.multiply(this.Matrixs.shift());
        }
    }
    // 平移
    glTranslate(x,y,z){
        var Matrix = new Matrix4();
        Matrix.setTranslate(x,y,z);
        this.Matrixs.push(Matrix);
    }
    // 旋转
    glRotate(angle,x,y,z){
        var Matrix = new Matrix4();
        Matrix.setRotate(angle,x,y,z);
        this.Matrixs.push(Matrix);
    }
    // 缩放
    glScale(x,y,z){
        var Matrix = new Matrix4();
        Matrix.setScale(x,y,z);
        this.Matrixs.push(Matrix);
    }
    // 设置顶点数据
    setVertices(vertices){
        this.vertices = vertices;
    }
    // 设置顶点索引
    setIndices(indices){
        this.indices = indices;
    }
    // 设置顶点颜色
    setColors(colors){
        this.colors = colors;
    }
    // 设置位置
    setPosition(x,y,z){
        this.position = new Vector3(x,y,z);
    }

    // 更新
    update(){
        this.updateModelMatrix();
        this.dispatchEvent({type:'update'});
        for(var i=0;i<this.children.length;i++){
            this.children[i].update();
        }
    }
    // 计算Box
    computeBox(){
        var minX = 0;
        var minY = 0;
        var minZ = 0;
        var maxX = 0;
        var maxY = 0;
        var maxZ = 0;
        for(var i=0;i<this.vertices.length;i+=3){
            var x = this.vertices[i];
            var y = this.vertices[i+1];
            var z = this.vertices[i+2];
            if(x < minX){
                minX = x;
            }
            if(x > maxX){
                maxX = x;
            }
            if(y < minY){
                minY = y;
            }
            if(y > maxY){
                maxY = y;
            }
            if(z < minZ){
                minZ = z;
            }
            if(z > maxZ){
                maxZ = z;
            }
        }
        this.box = {
            minX: minX,
            minY: minY,
            minZ: minZ,
            maxX: maxX,
            maxY: maxY,
            maxZ: maxZ
        }
    }
    // 计算Sphere
    computeSphere(){
        var x = (this.box.minX + this.box.maxX) / 2;
        var y = (this.box.minY + this.box.maxY) / 2;
        var z = (this.box.minZ + this.box.maxZ) / 2;
        var r = Math.sqrt(Math.pow(this.box.maxX - this.box.minX,2) + Math.pow(this.box.maxY - this.box.minY,2) + Math.pow(this.box.maxZ - this.box.minZ,2)) / 2;
        this.sphere = {
            x: x,
            y: y,
            z: z,
            r: r
        }
    }
    
    // 渲染
    render(){
        this.dispatchEvent({type:'render'});
        for(var i=0;i<this.children.length;i++){
            this.children[i].render();
        }
    }

}
    
export default Object3D;