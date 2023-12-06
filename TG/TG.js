const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

class TG {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.shaderProgram = null;
        this.vertexShaderSource = null;
        this.fragmentShaderSource = null;
        this.buffers = {
            position: null,
            color: null,
        };
        this.object3DList = [];
    }
    init(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl');

        if (!this.gl) {
            console.error('Unable to initialize WebGL.');
            return;
        }

        this.initShaders();
        this.initBuffers();
    }
    initShaders() {
        // 顶点着色器代码
        this.vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
            vColor = aColor;
        }
        `;
        // 片段着色器代码
        this.fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
        `;

        // 创建顶点着色器
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
        // 创建片段着色器
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);

        // 创建着色器程序
        this.shaderProgram = this.gl.createProgram();
        // 将顶点着色器和片段着色器附加到着色器程序上
        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);
        // 链接着色器程序
        this.gl.linkProgram(this.shaderProgram);

        // 检查着色器程序是否链接成功
        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.shaderProgram));
            return;
        }

        // 使用着色器程序
        this.gl.useProgram(this.shaderProgram);

        // 获取着色器程序中的属性和 uniform 变量的位置
        this.shaderProgram.aPositionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPosition');
        this.shaderProgram.aColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'aColor');
        this.shaderProgram.uModelViewMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');
        this.shaderProgram.uProjectionMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
    }
    initBuffers() {
        // 顶点坐标数据
        const positionData = [
            // 线段的起点和终点坐标
            0, 0, 0,  // 起点
            1, 1, 1   // 终点
        ];

        // 颜色数据
        const colorData = [
            // 线段的起点和终点颜色
            1, 0, 0,  // 红色
            1, 0, 0   // 红色
        ];

        // 创建顶点缓冲区
        this.buffers.position = this.createBuffer(this.gl.ARRAY_BUFFER, new Float32Array(positionData));
        // 将顶点缓冲区绑定到属性变量 aPosition 上
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.enableVertexAttribArray(this.shaderProgram.aPositionLocation);
        this.gl.vertexAttribPointer(this.shaderProgram.aPositionLocation, 3, this.gl.FLOAT, false, 0, 0);

        // 创建颜色缓冲区
        this.buffers.color = this.createBuffer(this.gl.ARRAY_BUFFER, new Float32Array(colorData));
        // 将颜色缓冲区绑定到属性变量 aColor 上
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
        this.gl.enableVertexAttribArray(this.shaderProgram.aColorLocation);
        this.gl.vertexAttribPointer(this.shaderProgram.aColorLocation, 3, this.gl.FLOAT, false, 0, 0);
    }

    // 创建着色器函数
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        // 检查着色器是否编译成功
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    // 创建缓冲区函数
    createBuffer(target, data) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(target, buffer);
        this.gl.bufferData(target, data, this.gl.STATIC_DRAW);
        return buffer;
    }

    /** 设置相机参数，需自定义 */
    camera(gl) {
        var position = [0.2, 0.2, 1.5];
        var lookAt = [0, 0, 0];

        const modelViewMatrix = mat4.create();
        mat4.lookAt(modelViewMatrix, position, lookAt, [0, 1, 0]);

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 90 * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.1, 100);
        return { modelViewMatrix, projectionMatrix };
    }

    addObject3D(object3D) {
        this.object3DList.push(object3D);
    }

    rander() {
        // 清空画布
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // 设置相机参数
        const { modelViewMatrix, projectionMatrix } = this.camera(this.gl);
        this.gl.uniformMatrix4fv(this.shaderProgram.uModelViewMatrixLocation, false, modelViewMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.uProjectionMatrixLocation, false, projectionMatrix);

        // 绘制所有 3D 对象
        this.object3DList.forEach(object3D => {
            object3D.display(this);
        });
    }
};

