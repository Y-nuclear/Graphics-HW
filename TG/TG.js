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
        var gl = canvas.getContext('webgl');
        this.gl = gl;
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;

        if (!this.gl) {
            console.error('Unable to initialize WebGL.');
            return;
        }

        this.initShaders();
        this.gl.enable(gl.DEPTH_TEST);
    }
    initShaders() {
        // 顶点着色器代码
        this.vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aNormal;
        attribute vec3 aColor;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vFragPos;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
            vColor = aColor;
            vNormal = aNormal;
            vFragPos = aPosition;
        }
        `;

        // 片段着色器代码
        this.fragmentShaderSource = `
        precision mediump float;

        uniform int uLightModel;
        uniform vec3 uLightPos;
        uniform vec3 uLightDir;
        uniform vec3 uViewPos;
        uniform vec3 uLightColor;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vFragPos;

        void main() {
            if (uLightModel == 0) {
                gl_FragColor = vec4(vColor, 1.0);
            } else if (uLightModel == 1) {
                // 平行光，漫反射
                vec3 Kd = vec3(0.9, 0.9, 0.9); // 漫反射系数
                float diffuseIntensity = abs(dot(normalize(uLightDir), normalize(vNormal)));

                if (length(vNormal) == 0.0) { // 检查法线是否有效
                    gl_FragColor = vec4(vColor, 1.0); // 如果法线无效，直接输出颜色
                } else {
                    vec3 diffuse = Kd * vColor * diffuseIntensity; // 计算漫反射颜色
                    gl_FragColor = vec4(diffuse, 1.0); // 输出漫反射颜色
                }
            }
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
        this.gl.enableVertexAttribArray(this.shaderProgram.aPositionLocation);
        this.gl.vertexAttribPointer(this.shaderProgram.aPositionLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.shaderProgram.aColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'aColor');
        this.gl.enableVertexAttribArray(this.shaderProgram.aColorLocation);
        this.gl.vertexAttribPointer(this.shaderProgram.aColorLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.shaderProgram.aNormalLocation = this.gl.getAttribLocation(this.shaderProgram, 'aNormal');
        this.gl.enableVertexAttribArray(this.shaderProgram.aNormalLocation);
        this.gl.vertexAttribPointer(this.shaderProgram.aNormalLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.shaderProgram.uModelViewMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');
        this.shaderProgram.uProjectionMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        this.shaderProgram.uLightModel = this.gl.getUniformLocation(this.shaderProgram, 'uLightModel');
        this.shaderProgram.uLightPos = this.gl.getUniformLocation(this.shaderProgram, 'uLightPos');
        this.shaderProgram.uLightDir = this.gl.getUniformLocation(this.shaderProgram, 'uLightDir');
        this.shaderProgram.uViewPos = this.gl.getUniformLocation(this.shaderProgram, 'uViewPos');
        this.shaderProgram.uLightColor = this.gl.getUniformLocation(this.shaderProgram, 'uLightColor');

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
        var gl = this.gl;
        // 清空画布
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(this.gl.COLOR_BUFFER_BIT);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

