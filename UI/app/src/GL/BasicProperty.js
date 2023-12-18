//使用WebGL定义基本的物体
//包括三角形、正方形、圆形、圆环、球体、立方体、圆柱体、圆锥体、棱柱体、棱锥体、棱台体
//以及各种物体的变换、旋转、缩放、平移等操作
//定义三角形类
import Object3D from "../database/Object3D";
import Matrix4 from "../Math/Matrix";

//定义顶点着色器
const VSHADER_SOURCE =
    'attribute vec3 a_Position;\n' + //声明attribute变量
    'attribute vec4 a_Color;\n' +    //声明attribute变量
    'uniform mat4 u_ModelMatrix;\n' + //声明uniform变量
    'varying vec4 v_Color;\n' +      //声明varying变量
    'void main() {\n' +
    '   gl_Position = u_ModelMatrix * vec4(a_Position,1.0);\n' + //设置坐标
    '   v_Color = a_Color;\n' +       //将数据传给片元着色器
    '}\n';

//定义片元着色器
const FSHADER_SOURCE =
    'precision mediump float;\n' +   //指定浮点数精度
    'varying vec4 v_Color;\n' +      //声明varying变量
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' + //设置颜色
    '}\n';



/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current
 */
function initShaders(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('无法创建程序对象');
        return false;
    }
 
    gl.useProgram(program);
    gl.program = program;
 
    return true;
}
 
/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
    // 创建着色器对象
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        return null;
    }
 
    // 创建程序对象
    var program = gl.createProgram();
    if (!program) {
        return null;
    }
 
    // 为程序对象分配顶点着色器和片元着色器
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
 
    // 连接着色器
    gl.linkProgram(program);
 
    // 检查连接
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('无法连接程序对象: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}
 
/**
 * 创建着色器对象
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
    // 创建着色器对象
    
    var shader = gl.createShader(type);
    if (shader == null) {
        console.log('无法创建着色器');
        return null;
    }
 
    // 设置着色器源代码
    gl.shaderSource(shader, source);
 
    // 编译着色器
    gl.compileShader(shader);
 
    // 检查着色器的编译状态
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }
 
    return shader;
}



class Triangle extends Object3D{
    constructor(gl){
        super();
        //设置原型
        Object.setPrototypeOf(this,Triangle.prototype);
        this.gl = gl;
        this.vertices = [
            [0.0, 0.5,0.0],
            [-0.5, -0.5,0.0],
            [0.5, -0.5,0.0]
        ]
        this.color = [
            //灰色
            [0.5,0.5,0.5],
            [0.5,0.5,0.5],
            [0.5,0.5,0.5]
        ]
        this.indices = [0,1,2];
    }
    initVertexBuffers(gl,a_Position,a_Color){
        //创建顶点数据的浮点类型数组
        var verticesColors  = [];
        for(var i = 0;i < this.vertices.length;i++){
            verticesColors.push(this.vertices[i][0],this.vertices[i][1],this.vertices[i][2],this.color[i][0],this.color[i][1],this.color[i][2]);
        }
        verticesColors = new Float32Array(verticesColors);

        var n = this.vertices.length;
        //创建缓冲区对象
        var vertexColorBuffer = gl.createBuffer();
        if(!vertexColorBuffer){
            console.log('Failed to create the buffer object');
            return -1;
        }
        //将顶点坐标和颜色写入缓冲区对象
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);
        //将缓冲区对象分配给a_Position变量
        gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,verticesColors.BYTES_PER_ELEMENT * 6,0);
        //连接a_Position变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Position);
        //将缓冲区对象分配给a_Color变量
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,verticesColors.BYTES_PER_ELEMENT * 6,verticesColors.BYTES_PER_ELEMENT * 3);
        //连接a_Color变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Color);
        return n;
    }

    render(){
        var gl = this.gl;
        gl.enable(gl.DEPTH_TEST);
        //初始化着色器
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Fail to initialize shaders');
            return;
        }
        //获取attribute变量的存储位置
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        //获取uniform变量的存储位置
        var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        //设置顶点位置
        var n = this.initVertexBuffers(gl,a_Position,a_Color);
        if(n < 0){
            console.log('Failed to set the positions of the vertices');
            return;
        }
        //设置模型矩阵
        gl.uniformMatrix4fv(u_ModelMatrix,false,this.modelMatrix.elements);
        //清空颜色缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制三角形
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }
}

//rectangle

class Rectangle extends Object3D{
    constructor(gl){
        super();
        //设置原型
        Object.setPrototypeOf(this,Rectangle.prototype);
        this.gl = gl;
        this.vertices = [
            [0.5, 0.5,0.0],
            [-0.5, 0.5,0.0],
            [0.5, -0.5,0.0],
            [-0.5, -0.5,0.0]
        ]
        this.color = [
            //灰色
            [0.5,0.5,0.5],
            [0.5,0.5,0.5],
            [0.5,0.5,0.5],
            [0.5,0.5,0.5]
        ]
        this.indices = [0,1,2,1,2,3];
    }
    initVertexBuffers(gl,a_Position,a_Color){
        //创建顶点数据的浮点类型数组
        var verticesColors  = [];
        for(var i = 0;i < this.vertices.length;i++){
            verticesColors.push(this.vertices[i][0],this.vertices[i][1],this.vertices[i][2],this.color[i][0],this.color[i][1],this.color[i][2]);
        }
        verticesColors = new Float32Array(verticesColors);

        var n = this.vertices.length;
        //创建缓冲区对象
        var vertexColorBuffer = gl.createBuffer();
        if(!vertexColorBuffer){
            console.log('Failed to create the buffer object');
            return -1;
        }
        //将顶点坐标和颜色写入缓冲区对象
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);
        //将缓冲区对象分配给a_Position变量
        gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,verticesColors.BYTES_PER_ELEMENT * 6,0);
        //连接a_Position变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Position);
        //将缓冲区对象分配给a_Color变量
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,verticesColors.BYTES_PER_ELEMENT * 6,verticesColors.BYTES_PER_ELEMENT * 3);
        //连接a_Color变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Color);
        return n;
    }
    render(){
        var gl = this.gl;
        //初始化着色器
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Fail to initialize shaders');
            return;
        }
        //获取attribute变量的存储位置
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        //获取uniform变量的存储位置
        var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        //设置顶点位置
        var n = this.initVertexBuffers(gl,a_Position,a_Color);
        if(n < 0){
            console.log('Failed to set the positions of the vertices');
            return;
        }
        //设置模型矩阵
        gl.uniformMatrix4fv(u_ModelMatrix,false,this.modelMatrix.elements);
        //清空颜色缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制矩形
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}

// cube
class Cube extends Object3D{
    constructor(gl){
        super();
        //设置原型
        Object.setPrototypeOf(this,Cube.prototype);
        this.gl = gl;
        this.vertices = [
            [0.5, 0.5, 0.5],
            [-0.5, 0.5, 0.5],
            [-0.5, -0.5, 0.5],
            [0.5, -0.5, 0.5],
            [0.5, 0.5, -0.5],
            [-0.5, 0.5, -0.5],
            [-0.5, -0.5, -0.5],
            [0.5, -0.5, -0.5]
        ]
        this.color = [
            [1.0, 0.0, 0.0], //红色
            [1.0, 1.0, 0.0], //黄色
            [0.0, 1.0, 0.0], //绿色
            [0.0, 0.0, 1.0], //蓝色
            [1.0, 0.0, 1.0], //紫色
            [1.0, 1.0, 1.0], //白色
            [0.0, 1.0, 1.0], //青色
            [0.5, 0.5, 0.5]  //灰色
        ]
        this.indices = [
            0,1,2,
            0,2,3,
            0,5,1,
            0,4,5,
            0,3,7,
            0,7,4,
            6,7,4,
            6,4,5,
            6,7,3,
            6,3,2,
            6,5,2,
            5,1,2
        ];
    }
    initVertexBuffers(gl,a_Position,a_Color){
        //创建顶点数据的浮点类型数组
        var verticesColors  = [];
        for(var i = 0;i < this.vertices.length;i++){
            verticesColors.push(this.vertices[i][0],this.vertices[i][1],this.vertices[i][2],this.color[i][0],this.color[i][1],this.color[i][2]);
        }
        verticesColors = new Float32Array(verticesColors);
        gl.enable(gl.DEPTH_TEST);
        var n = this.vertices.length;
        //创建缓冲区对象
        var vertexColorBuffer = gl.createBuffer();
        if(!vertexColorBuffer){
            console.log('Failed to create the buffer object');
            return -1;
        }
        //将顶点坐标和颜色写入缓冲区对象
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);
        //将索引写入缓冲区对象
        var indexBuffer = gl.createBuffer();
        if(!indexBuffer){
            console.log('Failed to create the buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint8Array(this.indices),gl.STATIC_DRAW);
        //将缓冲区对象分配给a_Position变量
        gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,verticesColors.BYTES_PER_ELEMENT * 6,0);
        //连接a_Position变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Position);
        //将缓冲区对象分配给a_Color变量
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,verticesColors.BYTES_PER_ELEMENT * 6,verticesColors.BYTES_PER_ELEMENT * 3);
        //连接a_Color变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Color);

        return n;
    }
    render(){
        var gl = this.gl;
        //初始化着色器
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Fail to initialize shaders');
            return;
        }
        //获取attribute变量的存储位置
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        //获取uniform变量的存储位置
        var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        //设置顶点位置
        var n = this.initVertexBuffers(gl,a_Position,a_Color);
        if(n < 0){
            console.log('Failed to set the positions of the vertices');
            return;
        }
        //设置模型矩阵
        gl.uniformMatrix4fv(u_ModelMatrix,false,this.modelMatrix.elements);
        //清空颜色缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //绘制立方体
        gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }
}


export {Triangle,Rectangle,Cube};
export {initShaders,createProgram,loadShader,VSHADER_SOURCE,FSHADER_SOURCE};