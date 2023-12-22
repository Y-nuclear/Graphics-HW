
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // 检查着色器是否编译成功
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    // 创建顶点着色器
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    // 创建片段着色器
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // 创建着色器程序
    const shaderProgram = gl.createProgram();
    // 将顶点着色器和片段着色器附加到着色器程序上
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    // 链接着色器程序
    gl.linkProgram(shaderProgram);

    // 检查着色器程序是否链接成功
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function BasicShaderProgram(tg) {
    var gl = tg.gl;
    var vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aColor;

        varying vec3 vColor;

        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
            vColor = aColor;
        }
        `;
    var fragmentShaderSource = `
        precision mediump float;

        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
        `;

    var shaderProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    var uModelMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelMatrix');
    var uViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uViewMatrix');
    var uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

    function setShaderProgram(vertices, colors) {
        var modelMatrix = tg.modelMatrix;
        var viewMatrix = tg.viewMatrix;
        var projectionMatrix = tg.projectionMatrix;

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var aPositionLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
        gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPositionLocation);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        var aColorLocation = gl.getAttribLocation(shaderProgram, 'aColor');
        gl.vertexAttribPointer(aColorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aColorLocation);

        gl.useProgram(shaderProgram);

        gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);
    }
    return setShaderProgram;
}

function TextureShaderProgram(tg) {
    var gl = tg.gl;
    var vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;

        varying vec2 vTexCoord;

        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
            vTexCoord = aTexCoord;
        }
        `;
    var fragmentShaderSource = `
        precision mediump float;

        varying vec2 vTexCoord;

        uniform sampler2D uSampler;

        void main() {
            gl_FragColor = texture2D(uSampler, vTexCoord);
        }
        `;

    var shaderProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    var uModelMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelMatrix');
    var uViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uViewMatrix');
    var uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

    function setShaderProgram(vertices, texCoords, image) {
        var modelMatrix = tg.modelMatrix;
        var viewMatrix = tg.viewMatrix;
        var projectionMatrix = tg.projectionMatrix;

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var aPositionLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
        gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPositionLocation);

        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        var aTexCoordLocation = gl.getAttribLocation(shaderProgram, 'aTexCoord');
        gl.vertexAttribPointer(aTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aTexCoordLocation);

        gl.useProgram(shaderProgram);

        gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    return setShaderProgram;
}


function FaceShaderProgram(gl) {
    var vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aNormal;
        attribute vec3 aColor;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vFragPos;

        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
            vColor = aColor;
            vNormal = aNormal;
            vFragPos = aPosition;
        }
        `;

    var fragmentShaderSource = `
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

    var shaderProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    var uModelMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelMatrix');
    var uViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uViewMatrix');
    var uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

    var uLightModelLocation = gl.getUniformLocation(shaderProgram, 'uLightModel');
    var uLightPosLocation = gl.getUniformLocation(shaderProgram, 'uLightPos');
    var uLightDirLocation = gl.getUniformLocation(shaderProgram, 'uLightDir');
    var uViewPosLocation = gl.getUniformLocation(shaderProgram, 'uViewPos');
    var uLightColorLocation = gl.getUniformLocation(shaderProgram, 'uLightColor');


    function setShaderProgram(gl,
        modelMatrix, viewMatrix, projectionMatrix,
        vertices, normals, colors,
        lightModel, lightPos, lightDir, viewPos, lightColor,
    ) {
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var aPositionLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
        gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPositionLocation);

        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        var aNormalLocation = gl.getAttribLocation(shaderProgram, 'aNormal');
        gl.vertexAttribPointer(aNormalLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aNormalLocation);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        var aColorLocation = gl.getAttribLocation(shaderProgram, 'aColor');
        gl.vertexAttribPointer(aColorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aColorLocation);

        gl.useProgram(shaderProgram);

        gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);

        gl.uniform1i(uLightModelLocation, lightModel);
        gl.uniform3fv(uLightPosLocation, lightPos);
        gl.uniform3fv(uLightDirLocation, lightDir);
        gl.uniform3fv(uViewPosLocation, viewPos);
        gl.uniform3fv(uLightColorLocation, lightColor);
    }

    return setShaderProgram;
}

export { BasicShaderProgram, TextureShaderProgram };