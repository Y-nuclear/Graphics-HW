// Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
// 使用WebGL
// 定义基本的物体
import { EventDispatcher } from "./EventDispatcher";
import { mat4 } from "gl-matrix";

//Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
//包括顶点数据、顶点索引、顶点颜色、位置、旋转、缩放、模型矩阵、子对象等
function IdentityMat4(){
    return mat4.fromValues(1,0,0,0, 0,1,0,0,0,0,1,0,0,0,0,1);
}
class Object3D extends EventDispatcher{
    constructor(){
        super();
        this.vertices = [];
        this.colors = [];

        this.uvs = [];
        this.normals = [];
        this.materials = [];

        this.modelMatrix = IdentityMat4();
        this.box = null;
        this.sphere = null;
    }

    // 平移
    glTranslate(x,y,z){
        mat4.fromTranslation(this.modelMatrix,this.modelMatrix,[x,y,z])
    }
    // 旋转
    glRotate(angle,x,y,z){
        mat4.fromRotation(this.modelMatrix,this.modelMatrix,angle,[x,y,z])
    }
    // 缩放
    glScale(x,y,z){
        mat4.fromScaling(this.modelMatrix,this.modelMatrix,[x,y,z])
    }
    // 设置顶点数据
    setVertices(vertices){
        this.vertices = vertices;
    }
    // 设置顶点索引
    setUVs(uvs){
        this.uvs = uvs;
    }
    // 设置顶点法线
    setNormals(normals){
        this.normals = normals;
    }
    // 设置材质
    setMaterials(materials){
        this.materials = materials;
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

}
    
export default Object3D;