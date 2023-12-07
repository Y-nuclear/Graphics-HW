// Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
// 使用WebGL
// 定义基本的物体
import { EventDispatcher } from "./EventDispatcher";
import  {Vector3}  from "../Math/Vector";
import  Matrix4  from "../Math/Matrix";
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
            this.modelMatrix.multiply(this.Matrixs.pop());

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

    // 渲染
    render(){
        this.dispatchEvent({type:'render'});
        for(var i=0;i<this.children.length;i++){
            this.children[i].render();
        }
    }

}
    
export default Object3D;