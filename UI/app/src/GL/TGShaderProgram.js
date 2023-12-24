
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
        attribute vec3 aColor;
        attribute vec3 aNormal;
        
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform mat3 uNormalMatrix;
        
        uniform vec3 uLightDirection;
        uniform vec3 uViewPosition;
        
        varying vec3 vNormal;
        varying vec3 vLightRay;
        varying vec3 vViewRay;
        varying vec3 vColor;
        
        void main() {
            vec4 vertexPosition = uModelMatrix * vec4(aPosition, 1.0);
            gl_Position = uProjectionMatrix * uViewMatrix * vertexPosition;
        
            // Transform the normal to the eye space
            vNormal = uNormalMatrix * aNormal;
        
            // Since it's a directional light, the light ray is constant everywhere
            vLightRay = normalize(uLightDirection);
        
            // Calculate the view direction
            vec3 viewDirection = uViewPosition - vertexPosition.xyz;
            vViewRay = normalize(viewDirection);
            vColor = aColor;
        }
        `;

    var fragmentShaderSource = `
        precision mediump float;

        varying vec3 vNormal;
        varying vec3 vLightRay;
        varying vec3 vViewRay;
        varying vec3 vColor;
        
        uniform vec3 uLightColor;
        
        void main() {
            float uShininess = 2.33;
            vec3 norm = normalize(vNormal);
            vec3 viewDir = normalize(vViewRay);
            vec3 reflectDir = reflect(vLightRay, norm);  

            // 环境光
            float ambientStrength = 0.1;
            vec3 ambient = ambientStrength * uLightColor;
        
            // 漫反射光
            float diff = max(dot(norm, vLightRay), 0.0);
            vec3 diffuse = diff * uLightColor;
        
            // 镜面高光
            float specularStrength = 0.9;
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
            vec3 specular = specularStrength * spec * uLightColor;
        
            vec3 result = (ambient + diffuse + specular) * vColor;
            gl_FragColor = vec4(result, 1.0);
        }
        `;
    var shaderProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    var uModelMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelMatrix');
    var uViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uViewMatrix');
    var uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    var uNormalMatrixLocation = gl.getUniformLocation(shaderProgram, 'uNormalMatrix');

    var uLightDirectionLocation = gl.getUniformLocation(shaderProgram, 'uLightDirection');
    var uLightColorLocation = gl.getUniformLocation(shaderProgram, 'uLightColor');
    var uViewPositionLocation = gl.getUniformLocation(shaderProgram, 'uViewPosition');

    function setShaderProgram(vertices, colors, normals) {
        var modelMatrix = tg.modelMatrix;
        var viewMatrix = tg.viewMatrix;
        var projectionMatrix = tg.projectionMatrix;
        var normalMatrix = tg.normalMatrix;

        var lightDirection = tg.lightDir;
        var lightColor = tg.lightColor;
        var viewPosition = tg.cameraPosition;

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
        gl.uniformMatrix3fv(uNormalMatrixLocation, false, normalMatrix);

        gl.uniform3fv(uLightDirectionLocation, lightDirection);
        gl.uniform3fv(uLightColorLocation, lightColor);
        gl.uniform3fv(uViewPositionLocation, viewPosition);
    }
    return setShaderProgram;
}

export {
    BasicShaderProgram,
    BasicShaderProgram2D,
    TextureShaderProgram,
    TextureShaderProgram2D,
    BasicLightShaderProgram,
};