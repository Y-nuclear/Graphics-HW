// Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
// 使用WebGL
// 定义基本的物体
import { EventDispatcher } from "./EventDispatcher";
import { Vector3 } from "../Math/Vector";
import { Matrix4 } from "../Math/Matrix";
class Object3D extends EventDispatcher{
    constructor(){
        super();
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1,1,1);
        this.modelMatrix = new Matrix4();
        this.children = [];
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
        this.modelMatrix.setTranslate(this.position.x,this.position.y,this.position.z);
        this.modelMatrix.rotate(this.rotation.x,1,0,0);
        this.modelMatrix.rotate(this.rotation.y,0,1,0);
        this.modelMatrix.rotate(this.rotation.z,0,0,1);
        this.modelMatrix.scale(this.scale.x,this.scale.y,this.scale.z);
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