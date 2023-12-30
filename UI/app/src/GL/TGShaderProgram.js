
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

function ColorShaderProgram2D(tg) {
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

function ColorShaderProgram(tg) {
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

function ColorLightShaderProgram(tg) {
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

        if (tg.lightDir == null) {
            console.error("not set light");
        }

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

function TextureLightShaderProgram(tg) {
    var gl = tg.gl;

    var vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;
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
        varying vec2 vTexCoord;
        
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
            vTexCoord = aTexCoord;
        }
        `;

    var fragmentShaderSource = `
        precision mediump float;

        varying vec3 vNormal;
        varying vec3 vLightRay;
        varying vec3 vViewRay;
        varying vec2 vTexCoord;

        uniform sampler2D uSampler;
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
        
            vec3 result = (ambient + diffuse + specular) * texture2D(uSampler, vTexCoord).rgb;
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

    function setShaderProgram(vertices, texCoords, normals) {
        var modelMatrix = tg.modelMatrix;
        var viewMatrix = tg.viewMatrix;
        var projectionMatrix = tg.projectionMatrix;
        var normalMatrix = tg.normalMatrix;

        if (tg.lightDir == null) {
            console.error("not set light");
        }

        var lightDirection = tg.lightDir;
        var lightColor = tg.lightColor;
        var viewPosition = tg.cameraPosition;

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


function TextureMaterialShaderProgram(tg) {
    var gl = tg.gl;

    var vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
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
    varying vec2 vTexCoord;
    
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
        vTexCoord = aTexCoord;
    }
    `;

    var fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vLightRay;
    varying vec3 vViewRay;
    varying vec2 vTexCoord;

    uniform sampler2D uSampler;
    uniform vec3 uLightColor;

    uniform vec3 uAmbient;
    uniform vec3 uDiffuse;
    uniform vec3 uSpecular;
    uniform float uShininess;
    uniform float uStrength;

    void main() {
        vec3 lightDir = -normalize(vLightRay);
        vec3 norm = normalize(vNormal);
        vec3 viewDir = normalize(vViewRay);
        vec3 halfwayDir = normalize(lightDir + viewDir);

        vec3 ambient = uAmbient * uLightColor;
    
        // 漫反射光
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = diff * uLightColor* uDiffuse;
    
        // 镜面高光
        float specularStrength = uStrength;
        float spec = pow(max(dot(norm, halfwayDir), 0.0), uShininess);
        vec3 specular = specularStrength * spec * uLightColor* uSpecular;
    
        vec3 result = (ambient + diffuse + specular) * texture2D(uSampler, vTexCoord).rgb;
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

    function setShaderProgram(vertices, texCoords, normals, materials) {
        var modelMatrix = tg.modelMatrix;
        var viewMatrix = tg.viewMatrix;
        var projectionMatrix = tg.projectionMatrix;
        var normalMatrix = tg.normalMatrix;

        if (tg.lightDir == null) {
            console.error("not set light");
        }

        var lightDirection = tg.lightDir;
        var lightColor = tg.lightColor;
        var viewPosition = tg.cameraPosition;

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

        gl.uniform3fv(uLightDirectionLocation, lightDirection);
        gl.uniform3fv(uLightColorLocation, lightColor);
        gl.uniform3fv(uViewPositionLocation, viewPosition);


        gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix3fv(uNormalMatrixLocation, false, normalMatrix);

    }
    return setShaderProgram;
}

function ColorMaterialShaderProgram(tg) {
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
        vNormal = normalize(vNormal);
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

    uniform sampler2D uSampler;
    uniform vec3 uLightColor;

    uniform vec3 uAmbient;
    uniform vec3 uDiffuse;
    uniform vec3 uSpecular;
    uniform float uShininess;
    uniform float uStrength;

    void main() {
        vec3 lightDir = -normalize(vLightRay);
        vec3 norm = normalize(vNormal);
        vec3 viewDir = normalize(vViewRay);
        vec3 halfDir = normalize(lightDir + viewDir);

        vec3 ambient = uAmbient * uLightColor;
    
        // 漫反射光
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = diff * uLightColor* uDiffuse;
    
        // 镜面高光
        float specularStrength = uStrength;
        float spec = pow(max(dot(norm, halfDir), 0.0), uShininess);
        vec3 specular = specularStrength * spec * uLightColor * uSpecular;
    
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

    function setShaderProgram(vertices, colors, normals, materials) {
        var modelMatrix = tg.modelMatrix;
        var viewMatrix = tg.viewMatrix;
        var projectionMatrix = tg.projectionMatrix;
        var normalMatrix = tg.normalMatrix;

        if (tg.lightDir == null) {
            console.error("not set light");
        }

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

        gl.uniform3fv(uLightDirectionLocation, lightDirection);
        gl.uniform3fv(uLightColorLocation, lightColor);
        gl.uniform3fv(uViewPositionLocation, viewPosition);


        gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix3fv(uNormalMatrixLocation, false, normalMatrix);

    }
    return setShaderProgram;
}



export {
    ColorShaderProgram,
    ColorShaderProgram2D,
    TextureShaderProgram,
    TextureShaderProgram2D,
    ColorLightShaderProgram,
    TextureLightShaderProgram,
    TextureMaterialShaderProgram,
    ColorMaterialShaderProgram
};