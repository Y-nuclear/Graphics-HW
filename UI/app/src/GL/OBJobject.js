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
        function parseOBJ(text) {
          // because indices are base 1 let's just fill in the 0th data
          const objPositions = [[0, 0, 0]];
          const objTexcoords = [[0, 0]];
          const objNormals = [[0, 0, 0]];
          const objColors = [[0, 0, 0]];
        
          // same order as `f` indices
          const objVertexData = [
            objPositions,
            objTexcoords,
            objNormals,
            objColors,
          ];
        
          // same order as `f` indices
          let webglVertexData = [
            [],   // positions
            [],   // texcoords
            [],   // normals
            [],   // colors
          ];
        
          const materialLibs = [];
          const geometries = [];
          let geometry;
          let groups = ['default'];
          let material = 'default';
          let object = 'default';
        
          const noop = () => {};
        
          function newGeometry() {
            // If there is an existing geometry and it's
            // not empty then start a new one.
            if (geometry && geometry.data.position.length) {
              geometry = undefined;
            }
          }
        
          function setGeometry() {
            if (!geometry) {
              const position = [];
              const texcoord = [];
              const normal = [];
              const color = [];
              webglVertexData = [
                position,
                texcoord,
                normal,
                color,
              ];
              geometry = {
                object,
                groups,
                material,
                data: {
                  position,
                  texcoord,
                  normal,
                  color,
                },
              };
              geometries.push(geometry);
            }
          }
        
          function addVertex(vert) {
            const ptn = vert.split('/');
            ptn.forEach((objIndexStr, i) => {
              if (!objIndexStr) {
                return;
              }
              const objIndex = parseInt(objIndexStr);
              const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
              webglVertexData[i].push(...objVertexData[i][index]);
              // if this is the position index (index 0) and we parsed
              // vertex colors then copy the vertex colors to the webgl vertex color data
              if (i === 0 && objColors.length > 1) {
                geometry.data.color.push(...objColors[index]);
              }
            });
          }
        
          const keywords = {
            v(parts) {
              // if there are more than 3 values here they are vertex colors
              if (parts.length > 3) {
                objPositions.push(parts.slice(0, 3).map(parseFloat));
                objColors.push(parts.slice(3).map(parseFloat));
              } else {
                objPositions.push(parts.map(parseFloat));
              }
            },
            vn(parts) {
              objNormals.push(parts.map(parseFloat));
            },
            vt(parts) {
              // should check for missing v and extra w?
              objTexcoords.push(parts.map(parseFloat));
            },
            f(parts) {
              setGeometry();
              const numTriangles = parts.length - 2;
              for (let tri = 0; tri < numTriangles; ++tri) {
                addVertex(parts[0]);
                addVertex(parts[tri + 1]);
                addVertex(parts[tri + 2]);
              }
            },
            s: noop,    // smoothing group
            mtllib(parts, unparsedArgs) {
              // the spec says there can be multiple filenames here
              // but many exist with spaces in a single filename
              materialLibs.push(unparsedArgs);
            },
            usemtl(parts, unparsedArgs) {
              material = unparsedArgs;
              newGeometry();
            },
            g(parts) {
              groups = parts;
              newGeometry();
            },
            o(parts, unparsedArgs) {
              object = unparsedArgs;
              newGeometry();
            },
          };
        
          const keywordRE = /(\w*)(?: )*(.*)/;
          const lines = text.split('\n');
          for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
              continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
              continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = keywords[keyword];
            if (!handler) {
              console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
              continue;
            }
            handler(parts, unparsedArgs);
          }
        
          // remove any arrays that have no entries.
          for (const geometry of geometries) {
            geometry.data = Object.fromEntries(
                Object.entries(geometry.data).filter(([, array]) => array.length > 0));
          }
        
          return {
            geometries,
            materialLibs,
          };
        }
        var objData = parseOBJ(objText);
        console.log(objData);
        function GetExtent(vertices){
            var min = [Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE];
            var max = [Number.MIN_VALUE,Number.MIN_VALUE,Number.MIN_VALUE];
            for(var i = 0;i < vertices.length;i+=3){
                vertices[i+0] < min[0] ? min[0] = vertices[i+0] : min[0] = min[0];
                vertices[i+1] < min[1] ? min[1] = vertices[i+1] : min[1] = min[1];
                vertices[i+2] < min[2] ? min[2] = vertices[i+2] : min[2] = min[2];
                vertices[i+0] > max[0] ? max[0] = vertices[i+0] : max[0] = max[0];
                vertices[i+1] > max[1] ? max[1] = vertices[i+1] : max[1] = max[1];
                vertices[i+2] > max[2] ? max[2] = vertices[i+2] : max[2] = max[2];

            }
            return [min,max];
        }
        var extent = GetExtent(objData.geometries[0].data.position);
        function GetCenter(extent){
            var min = extent[0];
            var max = extent[1];
            var center = [(min[0] + max[0]) / 2,(min[1] + max[1]) / 2,(min[2] + max[2]) / 2];
            return center;
        }
        var center = GetCenter(extent);
        function GetScale(extent){
            var min = extent[0];
            var max = extent[1];
            var scale = [max[0] - min[0],max[1] - min[1],max[2] - min[2]];
            return scale;
        }
        var scale = GetScale(extent);
        function fscale(vertices,scale){
            for (var i = 0;i < vertices.length;i+=3){
                vertices[i+0] = (vertices[i+0] - center[0]) / scale[0];
                vertices[i+1] = (vertices[i+1] - center[1]) / scale[1];
                vertices[i+2] = (vertices[i+2] - center[2]) / scale[2];
            }
        }

  
        this.vertices = objData.geometries[0].data.position;
        fscale(this.vertices,scale);
        // this.indices = objData.geometries[0].data.position;
        this.colors = objData.geometries[0].data.color;

    }
    // 缓冲区
    initVertexBuffers(gl,a_Position,a_Color){
        var vertices = new Float32Array(this.vertices);

        var colors = new Float32Array(this.colors);
        var vertexBuffer = gl.createBuffer();

        var colorBuffer = gl.createBuffer();
        if(!vertexBuffer || !colorBuffer){
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT * 4,0);
        gl.enableVertexAttribArray(a_Position);
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,colors,gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT * 4,0);
        gl.enableVertexAttribArray(a_Color);

        return vertices.length;
    }
    render(){
        var gl = this.gl;
        gl.enable(gl.DEPTH_TEST);
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
        gl.drawArrays(gl.TRIANGLES,0,n);
        for(var i = 0;i < this.children.length;i++){
            this.children[i].render();
        }
    }

}


export default OBJobject;