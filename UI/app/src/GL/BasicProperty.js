//使用WebGL定义基本的物体
//包括三角形、正方形、圆形、圆环、球体、立方体、圆柱体、圆锥体、棱柱体、棱锥体、棱台体
//以及各种物体的变换、旋转、缩放、平移等操作

//定义顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' + //声明attribute变量
    'attribute vec4 a_Color;\n' +    //声明attribute变量
    'uniform mat4 u_ModelMatrix;\n' + //声明uniform变量
    'varying vec4 v_Color;\n' +      //声明varying变量
    'void main() {\n' +
    '   gl_Position = u_ModelMatrix * a_Position;\n' + //设置坐标
    '   v_Color = a_Color;\n' +       //将数据传给片元着色器
    '}\n';

//定义片元着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +   //指定浮点数精度
    'varying vec4 v_Color;\n' +      //声明varying变量
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' + //设置颜色
    '}\n';

//定义三角形类
import Object3D from "../database/Object3D";
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
        modelMatrix.rotate(this.rotation.x,1,0,0);
        modelMatrix.rotate(this.rotation.y,0,1,0);
        modelMatrix.rotate(this.rotation.z,0,0,1);
        modelMatrix.scale(this.scale.x,this.scale.y,this.scale.z);
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
}