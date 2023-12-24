
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

function BasicShaderProgram2D(tg) {
    var gl = tg.gl;
    var vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        void main() {
            gl_Position = vec4(aPosition, 1.0);
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

    function setShaderProgram(vertices, colors) {

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
    }
    return setShaderProgram;
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

function TextureShaderProgram2D(tg) {
    var gl = tg.gl;

    var vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;
        varying vec2 vTexCoord;
        void main() {
            gl_Position = vec4(aPosition, 1.0);
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

    function setShaderProgram(vertices, texCoords) {

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

    function setShaderProgram(vertices, texCoords) {
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

    }
    return setShaderProgram;
}


function BasicLightShaderProgram(tg) {
    var gl = tg.gl;

    var vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aNormal;
        attribute vec3 aColor;

        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;

        uniform vec3 uLightDir;
        uniform vec3 uLightColor;

        varying vec3 vColor;

        void main() {
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);

            vec3 viewDir = -normalize((uViewMatrix * uModelMatrix * vec4(aPosition, 1.0)).xyz);
            vec3 normal = normalize((uViewMatrix * uModelMatrix * vec4(aNormal, 1.0)).xyz);
            vec3 lightDir = normalize((uViewMatrix * vec4(uLightDir, 1.0)).xyz);
            vec3 k_s = vec3(0.5, 0.5, 0.5);
            vec3 specular;
            if (dot(normal, lightDir) > 0.0) { // BUG
                vec3 reflectDir = reflect(lightDir, normal);

                float specularStrength = 2.0; // 镜面高光强度
                float spec = pow(max(dot(viewDir, reflectDir), 0.0), 2.5); // 反射高光的粗糙度

                specular = uLightColor * specularStrength * spec*k_s;// 镜面光强度
            } else {
                specular = vec3(0.0, 0.0, 0.0);
            }

            vec3 ambient = vec3(0.1, 0.1, 0.1); // 环境光强度
            vec3 diffuse = aColor * max(dot(normal, lightDir), 0.0)*k_s*uLightColor; // 漫反射项


            vColor = ambient + specular + diffuse;
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

    var uLightDirLocation = gl.getUniformLocation(shaderProgram, 'uLightDir');
    var uLightColorLocation = gl.getUniformLocation(shaderProgram, 'uLightColor');

    function setShaderProgram(vertices, colors, normals) {
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

        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        var aNormalLocation = gl.getAttribLocation(shaderProgram, 'aNormal');
        gl.vertexAttribPointer(aNormalLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aNormalLocation);

        gl.useProgram(shaderProgram);

        gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);

        gl.uniform3fv(uLightDirLocation, tg.lightDir);
        gl.uniform3fv(uLightColorLocation, tg.lightColor);
    }
    return setShaderProgram;
}


function MaterialShaderProgram(tg) {
    var gl = tg.gl;

    var vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;

    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    uniform vec3 uLightDir;
    uniform vec3 uLightColor;

    varying vec3 vColor;

    uniform vec3 uAmbient;
    uniform vec3 uDiffuse;
    uniform vec3 uSpecular;
    uniform float uShininess;
    uniform float uStrength;

    void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);

        vec3 viewDir = -normalize((uViewMatrix * uModelMatrix * vec4(aPosition, 1.0)).xyz);
        vec3 normal = normalize((uViewMatrix * uModelMatrix * vec4(aNormal, 1.0)).xyz);
        vec3 lightDir = normalize((uViewMatrix * vec4(uLightDir, 1.0)).xyz);
        vec3 specular;
        if (dot(normal, lightDir) > 0.0) { // BUG
            vec3 reflectDir = reflect(lightDir, normal);
            float specularStrength = uStrength; // 镜面高光强度
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess); // 反射高光的粗糙度
            specular = uLightColor * specularStrength * spec*uSpecular;// 镜面光强度

        } else {
            specular = vec3(0.0, 0.0, 0.0);
        }

        vec3 ambient = uAmbient; // 环境光强度
        vec3 diffuse = aColor * max(dot(normal, lightDir), 0.0)*uLightColor*uDiffuse; // 漫反射项


        vColor = ambient + specular + diffuse;
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

    var uLightDirLocation = gl.getUniformLocation(shaderProgram, 'uLightDir');
    var uLightColorLocation = gl.getUniformLocation(shaderProgram, 'uLightColor');

    function setShaderProgram(vertices, colors, normals, materials) {
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

        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        var aNormalLocation = gl.getAttribLocation(shaderProgram, 'aNormal');
        gl.vertexAttribPointer(aNormalLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aNormalLocation);
        // 设置材质，环境光，漫反射，镜面反射，高光粗糙度，镜面光强度

        var uAmbientLocation = gl.getUniformLocation(shaderProgram, 'uAmbient');
        var uDiffuseLocation = gl.getUniformLocation(shaderProgram, 'uDiffuse');
        var uSpecularLocation = gl.getUniformLocation(shaderProgram, 'uSpecular');
        var uShininessLocation = gl.getUniformLocation(shaderProgram, 'uShininess');
        var uStrengthLocation = gl.getUniformLocation(shaderProgram, 'uStrength');
        gl.useProgram(shaderProgram);
        gl.uniform3fv(uAmbientLocation, materials.ambient);
        gl.uniform3fv(uDiffuseLocation, materials.diffuse);
        gl.uniform3fv(uSpecularLocation, materials.specular);
        gl.uniform1f(uShininessLocation, materials.shininess);
        gl.uniform1f(uStrengthLocation, materials.strength);



       

        gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);

        gl.uniform3fv(uLightDirLocation, tg.lightDir);
        gl.uniform3fv(uLightColorLocation, tg.lightColor);
    }
    return setShaderProgram;
}
 


export {
    BasicShaderProgram,
    BasicShaderProgram2D,
    TextureShaderProgram,
    TextureShaderProgram2D,
    BasicLightShaderProgram,
    MaterialShaderProgram,
};