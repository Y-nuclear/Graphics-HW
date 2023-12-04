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
class Triangle {
    constructor(gl, x, y, z, r, g, b, a) {
        this.gl = gl;
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;

        this.vertexBuffer = null;
        this.colorBuffer = null;
        this.indexBuffer = null;
        this.vertexData = new Float32Array([
            0.0, 0.5, 0.0,
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0
        ]);
        this.colorData = new Float32Array([
            r, g, b, a,
            r, g, b, a,
            r, g, b, a
        ]);
        this.indexData = new Uint8Array([
            0, 1, 2
        ]);
    }

    init() {
        var gl = this.gl;
        this.vertexBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorData, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);

        this.vertexBuffer.num = 3;
        this.vertexBuffer.type = gl.FLOAT;
        this.vertexBuffer.stride = 0;
        this.vertexBuffer.offset = 0;

        this.colorBuffer.num = 4;
        this.colorBuffer.type = gl.FLOAT;
        this.colorBuffer.stride = 0;
        this.colorBuffer.offset = 0;

        this.indexBuffer.num = 1;
        this.indexBuffer.type = gl.UNSIGNED_BYTE;
        this.indexBuffer.stride = 0;
        this.indexBuffer.offset = 0;
    }

    draw() {
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, this.vertexBuffer.num, this.vertexBuffer.type, false, this.vertexBuffer.stride, this.vertexBuffer.offset);
        gl.enableVertexAttribArray(a_Position);
    }
}