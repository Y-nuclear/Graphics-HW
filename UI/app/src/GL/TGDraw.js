import { mat4, vec3 } from 'gl-matrix';

function drawLine(tg, start, end, color) {
    var gl = tg.gl;

    var vertices = [
        start[0], start[1], start[2],
        end[0], end[1], end[2],
    ];
    var colors = [
        color[0], color[1], color[2],
        color[0], color[1], color[2],
    ];

    tg.setBasicShaderProgram(vertices, colors);

    gl.drawArrays(gl.LINES, 0, 2);
}

function drawLine2D(tg, start, end, color) {
    var gl = tg.gl;

    var vertices = [
        start[0], start[1], start[2],
        end[0], end[1], end[2],
    ];
    var colors = [
        color[0], color[1], color[2],
        color[0], color[1], color[2],
    ];

    tg.setBasicShaderProgram2D(vertices, colors);

    gl.drawArrays(gl.LINES, 0, 2);
}

function drawArrow(tg, start, end, color) {
    var modelMatrix = tg.modelMatrix;
    var viewMatrix = tg.viewMatrix;
    var projectionMatrix = tg.projectionMatrix;

    var TMat = mat4.create();
    mat4.mul(TMat, projectionMatrix, viewMatrix);
    mat4.mul(TMat, TMat, modelMatrix);

    // 在屏幕上的起始点和终点
    var startScreen = vec3.create();
    var endScreen = vec3.create();
    vec3.transformMat4(startScreen, start, TMat);
    vec3.transformMat4(endScreen, end, TMat);

    var len = vec3.distance(startScreen, endScreen);
    var arrowLen = len / 8;

    var dir = vec3.create();
    vec3.sub(dir, endScreen, startScreen);
    vec3.normalize(dir, dir);

    var right = vec3.create();
    vec3.rotateZ(right, dir, [0, 0, 0], Math.PI * (7 / 8));
    vec3.normalize(right, right);
    right[0] *= arrowLen;
    right[1] *= arrowLen;

    var left = vec3.create();
    vec3.rotateZ(left, dir, [0, 0, 0], -Math.PI * (7 / 8));
    vec3.normalize(left, left);
    left[0] *= arrowLen;
    left[1] *= arrowLen;

    drawLine(tg, start, end, color);
    drawLine2D(tg, endScreen, [endScreen[0] + right[0], endScreen[1] + right[1], endScreen[2]], color);
    drawLine2D(tg, endScreen, [endScreen[0] + left[0], endScreen[1] + left[1], endScreen[2]], color);
}

function drawXYZ(tg) {
    drawArrow(tg, [0, 0, 0], [1, 0, 0], [1, 0, 0]);
    drawText(tg, "X", [1, 0, 0], "#ffffff", 0.04, 1);
    drawArrow(tg, [0, 0, 0], [0, 1, 0], [0, 1, 0]);
    drawText(tg, "Y", [0, 1, 0], "#ffffff", 0.04, 1);
    drawArrow(tg, [0, 0, 0], [0, 0, 1], [0, 0, 1]);
    drawText(tg, "Z", [0, 0, 1], "#ffffff", 0.04, 1);
}

function drawText(tg, text, position, fontColor, renderHeight, scale) {
    var gl = tg.gl;
    var fontSize = 32 * scale; // 字体大小

    var modelMatrix = tg.modelMatrix;
    var viewMatrix = tg.viewMatrix;
    var projectionMatrix = tg.projectionMatrix;
    var TMat = mat4.create();
    mat4.mul(TMat, projectionMatrix, viewMatrix);
    mat4.mul(TMat, TMat, modelMatrix);

    var positionScreen = vec3.create();
    vec3.transformMat4(positionScreen, position, TMat);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 设置透明背景

    // 设置文字样式
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.canvas.width = ctx.measureText(text).width;
    ctx.canvas.height = fontSize;

    // 设置文字样式
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    var renderWidth = renderHeight * ctx.canvas.width / ctx.canvas.height;

    // 创建和配置纹理
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);

    // 启用透明度混合
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 准备顶点和纹理坐标
    var vertices = [
        positionScreen[0], positionScreen[1], positionScreen[2],
        positionScreen[0] + renderWidth, positionScreen[1], positionScreen[2],
        positionScreen[0], positionScreen[1] + renderHeight, positionScreen[2],
        positionScreen[0] + renderWidth, positionScreen[1] + renderHeight, positionScreen[2],
    ];
    var texCoords = [
        0, 1,
        1, 1,
        0, 0,
        1, 0,
    ];
    tg.setTextureShaderProgram2D(vertices, texCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

function drawColorFaces(tg, vertices, colors, indices) {
    var gl = tg.gl;
    tg.setBasicShaderProgram(vertices, colors);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawTextureFaces (tg, vertices, texCoords, image, indices) {
    var gl = tg.gl;

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    tg.setTextureShaderProgram(vertices, texCoords);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

}

function drawTriangle(tg, vertices, colors) {
    var gl = tg.gl;
    tg.setBasicShaderProgram(vertices, colors);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

function drawImageTexture(tg, vertices, texCoords, image) {
    var gl = tg.gl;

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    tg.setTextureShaderProgram(vertices, texCoords);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

function drawLightTriangle(tg, vertices, colors, normals) {
    var gl = tg.gl;
    tg.setBasicLightShaderProgram(vertices, colors, normals);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

export {
    drawLine, drawLine2D, drawXYZ, drawArrow, drawText,
    drawColorFaces,drawTextureFaces,
    drawTriangle, drawImageTexture, drawLightTriangle,
};