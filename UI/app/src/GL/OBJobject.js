import Object3D from "../database/Object3D";
import { Vector3 } from "../Math/Vector";
import Matrix4 from "../Math/Matrix";
import { initShaders,VSHADER_SOURCE,FSHADER_SOURCE } from "./BasicProperty";
class OBJobject extends Object3D{
    constructor(gl){
        super();
        this.vertices = [];
        this.indices = [];
        this.colors = [];
        this.position = new Vector3(0,0,0);
        this.rotation = new Vector3(0,0,0);
        this.scale = new Vector3(1,1,1);
        this.modelMatrix = new Matrix4();
        this.Matrixs = [];
        this.gl = gl;
        this.children = [];
    }
    loadOBJ(objPath){
        function loadTextFileAJAX(filePath){
            //读取本地文件，跨域
            var xmlhttp;
            if(window.XMLHttpRequest){
                xmlhttp = new XMLHttpRequest();
                }
            xmlhttp.open("GET",filePath,false);
            xmlhttp.send();
            return xmlhttp.responseText;

        }
        var objText = loadTextFileAJAX(objPath);
        // console.log(objText);
        var objTextLines = objText.split("\n");
        var positions = [];
        var normals = [];
        var uvs = [];
        var indices = [];
        for(var i = 0;i < objTextLines.length;i++){
            var line = objTextLines[i];
            var lineData = line.split(" ");
            //删除lineData中的空字符串
            for(var j = 0;j < lineData.length;j++){
                if(lineData[j] === ""){
                    lineData.splice(j,1);
                    j--;
                }
            }
            if(lineData[0] === "v"){
                positions.push(parseFloat(lineData[1])/10);
                positions.push(parseFloat(lineData[2])/10);
                positions.push(parseFloat(lineData[3])/10);
            }else if(lineData[0] === "vn"){
                normals.push(parseFloat(lineData[1]));
                normals.push(parseFloat(lineData[2]));
                normals.push(parseFloat(lineData[3]));
            }else if(lineData[0] === "vt"){
                uvs.push(parseFloat(lineData[1]));
                uvs.push(parseFloat(lineData[2]));
            }else if(lineData[0] === "f"){
                for(var j = 1;j < lineData.length;j++){
                    var indexData = lineData[j].split("/");
                    if(indexData.length!=3){
                        continue;
                    }
                    indices.push(parseInt(indexData[0]) - 1);
                    indices.push(parseInt(indexData[1]) - 1);
                    indices.push(parseInt(indexData[2]) - 1);
                }
            }
        }
        this.vertices = positions;
        console.log(this.vertices);
        this.indices = indices;
        console.log(this.indices)
        this.colors = [];
    }
    // 缓冲区
    initVertexBuffers(gl,a_Position,a_Color){
        var vertices = new Float32Array(this.vertices);
        var indices = new Uint16Array(this.indices);
        var colors = new Float32Array(this.colors);
        var vertexBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        var colorBuffer = gl.createBuffer();
        if(!vertexBuffer || !indexBuffer || !colorBuffer){
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT * 8,0);
        gl.enableVertexAttribArray(a_Position);
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,colors,gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT * 8,0);
        gl.enableVertexAttribArray(a_Color);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
        return indices.length;
    }
    render(){
        var gl = this.gl;
        if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
            return -1;
        }
        var a_Position = gl.getAttribLocation(gl.program,"a_Position");
        var a_Color = gl.getAttribLocation(gl.program,"a_Color");
        var u_ModelMatrix = gl.getUniformLocation(gl.program,"u_ModelMatrix");
        var n = this.initVertexBuffers(gl,a_Position,a_Color);
        if(n < 0){
            return;
        }
        gl.uniformMatrix4fv(u_ModelMatrix,false,this.modelMatrix.elements);
        gl.drawElements(gl.TRIANGLE_STRIP,n,gl.UNSIGNED_SHORT,0);
        for(var i = 0;i < this.children.length;i++){
            this.children[i].render();
        }
    }

}

export default OBJobject;