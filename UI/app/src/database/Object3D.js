// Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
// 使用WebGL
// 定义基本的物体
import { EventDispatcher } from "./EventDispatcher";
import { mat4, vec3 } from "gl-matrix";

//Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
//包括顶点数据、顶点索引、顶点颜色、位置、旋转、缩放、模型矩阵、子对象等
class Object3D extends EventDispatcher{
    constructor(){
        super();
        this.vertices = [];
        this.colors = [];

        this.uvs = [];
        this.normals = [];
        this.materials = {
            ambient: [0.2,0.2,0.2],
            diffuse: [1.0,1.0,1.0],
            specular: [0.5,0.5,0.5],
            shininess: 15,
            strength: 1,
        }
        this.textures = [];

        this.modelMatrix = mat4.create();
        this.box = null;
        this.sphere = null;
    }

    // 平移
    glTranslate(x,y,z){
        mat4.translate(this.modelMatrix,this.modelMatrix,[x,y,z])
    }
    // 旋转
    glRotate(angle,x,y,z){
        mat4.rotate(this.modelMatrix,this.modelMatrix,angle,[x,y,z])
    }
    // 缩放
    glScale(x,y,z){
        mat4.scale(this.modelMatrix,this.modelMatrix,[x,y,z])
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

    // 对对象进行更新
    updateVertices(){
        let vertex_temp = [];
        for(let i=0;i<this.vertices.length;i+=3){
            var Vertex = vec3.fromValues(this.vertices[i],this.vertices[i+1],this.vertices[i+2])
            vec3.transformMat4(Vertex,Vertex,this.modelMatrix);
            vertex_temp.push(Vertex[0])
            vertex_temp.push(Vertex[1])
            vertex_temp.push(Vertex[2])
        }
        this.vertices = vertex_temp;
        let normal_temp = [];
        for(let i=0;i<this.normals.length;i+=3){
            var normal = vec3.fromValues(this.normals[i],this.normals[i+1],this.normals[i+2])
            vec3.transformMat4(normal,normal,mat4.invert(mat4.create(),this.modelMatrix));
            normal_temp.push(normal[0])
            normal_temp.push(normal[1])
            normal_temp.push(normal[2])
        }
        this.normals = normal_temp;
        this.modelMatrix = mat4.create();
        return vertex_temp;
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