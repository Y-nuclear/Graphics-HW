const gl = document.querySelector('canvas').getContext('webgl');
gl.clearColor(1, 0, 0, 1); // 红色
gl.clear(gl.COLOR_BUFFER_BIT);
gl.clearColor(0, 1, 0, 1); // 绿色
//创建一个顶点着色器
const vertex = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertex, `
    attribute vec3 position;
    void main() {
        gl_Position = vec4(position, 1);
    }
`);
gl.compileShader(vertex);
if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertex));
}
//创建一个片元着色器
const fragment = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragment, `
    precision highp float;
    uniform vec4 color;
    void main() {
        gl_FragColor = color;
    }
`);
gl.compileShader(fragment);
if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragment));
}
//使用着色器创建一个程序
const program = gl.createProgram();
gl.attachShader(program, vertex);
gl.attachShader(program, fragment);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
}
gl.useProgram(program);
// 绘制一个球
function drawBall(x,y,R){
    let n = 100,m=100;
    let vertices = [];
    for(let i=0;i<=n;i++){
      let tempz = R*Math.cos(i*Math.PI/n);
      let tempr = R*Math.sin(i*Math.PI/n);
      for(let j=0;j<=m;j++){
        let tempx = tempr*Math.cos(j*2*Math.PI/m);
        let tempy = tempr*Math.sin(j*2*Math.PI/m);
        vertices.push(tempx,tempy,tempz);
      }
    }
    vertices = new Float32Array(vertices);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    let position = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n*m);
}

// drawBall(0,0,0.5);
// 绘制一个立方体并给立方体添加纹理
function drawCube(x,y,z){
    let vertices = new Float32Array([
      x,y,z,  x,y,-z,  x,-y,z,  x,-y,-z,
      -x,y,z, -x,y,-z, -x,-y,z, -x,-y,-z,
      x,y,z,  x,y,-z,  -x,y,z, -x,y,-z,
      x,-y,z, x,-y,-z, -x,-y,z, -x,-y,-z,
      x,y,z,  x,-y,z,  -x,y,z, -x,-y,z,
      x,y,-z, x,-y,-z, -x,y,-z, -x,-y,-z
    ]);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    let position = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 24);
}

// 添加纹理
function addTexture(){
    let texture = gl.createTexture();
    let image = new Image();
    image.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
    image.onload = function() {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    };
    return texture;
}

// let texture = addTexture();
// let color = gl.getUniformLocation(program, 'color');
// gl.uniform4fv(color, [1, 1, 1, 1]);
// gl.activeTexture(gl.TEXTURE0);
// gl.bindTexture(gl.TEXTURE_2D, texture);
// let sampler = gl.getUniformLocation(program, 'sampler');
// gl.uniform1i(sampler, 0);
let color = gl.getUniformLocation(program, 'color');
gl.uniform4fv(color, [1, 0, 1, 1]);
drawCube(0.5,0.5,0.5);
// import OBJLoader from '../../backend/OBJLoader';
LoaderList = [];
//从uploadFile中读取文件
function uploadFile(){
    let file = document.getElementById('file').files[0];
    let objLoader = new OBJLoader();
    objLoader.read(file,function(data){
        objLoader.parse_data(data);
        console.log(objLoader.vertices);
        console.log(objLoader.vertexNormals);
        console.log(objLoader.uvs);
    });
    LoaderList.push(objLoader);
    // await sleep(1000);
    
    
}
// 显示obj文件
function DrawOBJ(){
    //颜色为紫
    
    //绘制
    let vertices = new Float32Array(LoaderList[0].vertices);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    let position = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
}

function show(){
    DrawOBJ();
}