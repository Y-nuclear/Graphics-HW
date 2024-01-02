// Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
// 使用WebGL
// 定义基本的物体
import { EventDispatcher } from "./EventDispatcher";
import { mat4, vec2, vec3 } from "gl-matrix";

//Object3D作为所有3D对象的基类，提供了一些基本的属性和方法
//包括顶点数据、顶点索引、顶点颜色、位置、旋转、缩放、模型矩阵、子对象等
class Object3D extends EventDispatcher{
    constructor(){
        super();
        this.id = null;
        this.vertices = [];
        this.colors = [];

        this.uvs = [];
        this.normals = [];
        this.materials = {
            ambient: [0.2,0.2,0.2],
            diffuse: [1.0,1.0,1.0],
            specular: [1.0,1.0,1.0],
            shininess: 15,
            strength: 1,
        }
        this.textures = null;

        this.position = [0,0,0];
        this.rotation = [0,0,0];
        this.scale = [1,1,1];
        this.modelMatrix = mat4.create();
        this.type = 'Object3D';
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

    computeNormals(){
        if(this.normals.length != 0){
            return;
        }
        var normals = [];
        var vertices = [];
        var equal = function(v1,v_a){
            for(let i=0;i<v_a.length;i++){
                if(v1[0] == v_a[i][0] && v1[1] == v_a[i][1] && v1[2] == v_a[i][2]){
                    return i;
                }
            }
            return -1;
        };
        for(var i=0;i<this.vertices.length;i+=9){
            var v1 = vec3.fromValues(this.vertices[i],this.vertices[i+1],this.vertices[i+2]);
            var v2 = vec3.fromValues(this.vertices[i+3],this.vertices[i+4],this.vertices[i+5]);
            var v3 = vec3.fromValues(this.vertices[i+6],this.vertices[i+7],this.vertices[i+8]);
            var normal = vec3.create();
            vec3.cross(normal,vec3.sub(vec3.create(),v2,v1),vec3.sub(vec3.create(),v3,v1));
            vec3.normalize(normal,normal);
            if(equal(v1,vertices) == -1){
                vertices.push(v1);
                normals.push(normal);
            }
            else{
                vec3.add(normals[equal(v1,vertices)],normals[equal(v1,vertices)],normal);
            }
            if(equal(v2,vertices) == -1){
                vertices.push(v2);
                normals.push(normal);
            }
            else{
                vec3.add(normals[equal(v2,vertices)],normals[equal(v2,vertices)],normal);
            }
            if(equal(v3,vertices) == -1){
                vertices.push(v3);
                normals.push(normal);
            }
            else{
                vec3.add(normals[equal(v3,vertices)],normals[equal(v3,vertices)],normal);
            }
        }
        for(var i=0;i<normals.length;i++){
            vec3.normalize(normals[i],normals[i]);
        }
        console.log(normals);
        console.log(vertices)
        for(var i=0;i<this.vertices.length;i+=3){
            var v = vec3.fromValues(this.vertices[i],this.vertices[i+1],this.vertices[i+2]);
            var normal = normals[equal(v,vertices)];
            this.normals.push(normal[0]);
            this.normals.push(normal[1]);
            this.normals.push(normal[2]);
        }
    }

    // 填充uv
    fillUVs(){
        if(this.uvs.length != 0){
            return;
        }
        for(var i=0;i<this.vertices.length;i+=3){
            var norm = vec2.fromValues(this.vertices[i],this.vertices[i+1]);
            vec2.normalize(norm,norm);
            this.uvs.push(norm[0]);
            this.uvs.push(norm[1]);
        }
    }
    // 对对象进行更新
    updateVertices(){
        if (this.vertices.length != 0)
        {let vertex_temp = [];
        for(let i=0;i<this.vertices.length;i+=3){
            var Vertex = vec3.fromValues(this.vertices[i],this.vertices[i+1],this.vertices[i+2])
            vec3.transformMat4(Vertex,Vertex,this.modelMatrix);
            vertex_temp.push(Vertex[0])
            vertex_temp.push(Vertex[1])
            vertex_temp.push(Vertex[2])
        }
        this.vertices = vertex_temp;}
        if (this.normals.length != 0)
        {let normal_temp = [];
        for(let i=0;i<this.normals.length;i+=3){
            var normal = vec3.fromValues(this.normals[i],this.normals[i+1],this.normals[i+2])
            vec3.transformMat4(normal,normal,mat4.invert(mat4.create(),this.modelMatrix));
            normal_temp.push(normal[0])
            normal_temp.push(normal[1])
            normal_temp.push(normal[2])
        }
        this.normals = normal_temp;}
        this.modelMatrix = mat4.create();
        return this.vertices;
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
    saveOBJ(){
        // 保存为obj文件
        var indices_v = [];
        var objText = "";
        var objfText = "";
        function equal(v1,v_a){
            for(let i=0;i<v_a.length;i++){
                if(v1[0] == v_a[i][0] && v1[1] == v_a[i][1] && v1[2] == v_a[i][2]){
                    return i;
                }
            }
            return -1;
        };
        //处理顶点
        var vertex_temp = [];
        for(let i=0;i<this.vertices.length;i+=3){
            var Vertex =[this.vertices[i],this.vertices[i+1],this.vertices[i+2]];
            var index = equal(Vertex,vertex_temp);
            if (index == -1){
                vertex_temp.push(Vertex);
                objText += "v "+Vertex[0]+" "+Vertex[1]+" "+Vertex[2]+"\n";
                indices_v.push(vertex_temp.length-1);
            }
            else{
                indices_v.push(index);
            }
        }
        //处理法线
        var normal_temp = [];
        var indices_n = [];
        for(let i=0;i<this.normals.length;i+=3){
            var normal =[this.normals[i],this.normals[i+1],this.normals[i+2]];
            var index = equal(normal,normal_temp);
            if (index == -1){
                normal_temp.push(normal);
                objText += "vn "+normal[0]+" "+normal[1]+" "+normal[2]+"\n";
                indices_n.push(normal_temp.length-1);
            }
            else{
                indices_n.push(index);
            }
        }
        //处理uv
        var uv_temp = [];
        var indices_uv = [];
        function equal2(v1,v_a){
            for(let i=0;i<v_a.length;i++){
                if(v1[0] == v_a[i][0] && v1[1] == v_a[i][1]){
                    return i;
                }
            }
            return -1;
        };
        for(let i=0;i<this.uvs.length;i+=2){
            var uv =[this.uvs[i],this.uvs[i+1]];
            var index = equal2(uv,uv_temp);
            if (index == -1){
                uv_temp.push(uv);
                objText += "vt "+uv[0]+" "+uv[1]+"\n";
                indices_uv.push(uv_temp.length-1);
            }
            else{
                indices_uv.push(index);
            }
        }
        //处理面
        for(let i=0;i<indices_v.length;i+=3){
            // objfText += "f "+(indices_v[i]+1)+" "+(indices_v[i+1]+1)+" "+(indices_v[i+2]+1)+"\n";
            objfText += "f "+(indices_v[i]+1)+"/"+(indices_uv[i]+1)+"/"+(indices_n[i]+1)+" "+(indices_v[i+1]+1)+"/"+(indices_uv[i+1]+1)+"/"+(indices_n[i+1]+1)+" "+(indices_v[i+2]+1)+"/"+(indices_uv[i+2]+1)+"/"+(indices_n[i+2]+1)+"\n";
        }
        objText += objfText;
        return objText;
    }

}
    
export default Object3D;