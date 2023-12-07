//使用WebGL定义基本的物体
//包括三角形、正方形、圆形、圆环、球体、立方体、圆柱体、圆锥体、棱柱体、棱锥体、棱台体
//以及各种物体的变换、旋转、缩放、平移等操作
//定义三角形类
import Object3D from "../database/Object3D";
import Matrix4 from "../Math/Matrix";
//定义顶点着色器
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' + //声明attribute变量
    'attribute vec4 a_Color;\n' +    //声明attribute变量
    'uniform mat4 u_ModelMatrix;\n' + //声明uniform变量
    'varying vec4 v_Color;\n' +      //声明varying变量
    'void main() {\n' +
    '   gl_Position = u_ModelMatrix * a_Position;\n' + //设置坐标
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
    console.log(typeof(vshader))
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
        this.gl = gl;
        this.init();
    }
    init(){
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
        //设置背景色
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        //设置模型矩阵
        var modelMatrix = new Matrix4();
        modelMatrix.setTranslate(this.position.x,this.position.y,this.position.z);
        modelMatrix.setRotate(this.rotation.x,1,0,0);
        modelMatrix.setRotate(this.rotation.y,0,1,0);
        modelMatrix.setRotate(this.rotation.z,0,0,1);
        modelMatrix.setScale(this.scale.x,this.scale.y,this.scale.z);
        gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
        //清空颜色缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制三角形
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }
    initVertexBuffers(gl,a_Position,a_Color){
        //创建顶点数据的浮点类型数组
        var verticesColors = new Float32Array([
            //顶点坐标和颜色
            0.0, 0.5, 1.0, 0.0, 0.0,
            -0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, -0.5, 0.0, 0.0, 1.0
        ]);
        var n = 3; //顶点数量
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
        gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,verticesColors.BYTES_PER_ELEMENT * 5,0);
        //连接a_Position变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Position);
        //将缓冲区对象分配给a_Color变量
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,verticesColors.BYTES_PER_ELEMENT * 5,verticesColors.BYTES_PER_ELEMENT * 2);
        //连接a_Color变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Color);
        return n;
    }
    render(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }
}

export {Triangle};