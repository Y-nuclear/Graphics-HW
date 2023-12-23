import { mat4, vec3 } from 'gl-matrix';
import { BasicShaderProgram } from './TGShaderProgram';

/**
 * 画线
 * 三个参数都是3维数组
 */
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
        start[0], start[1],
        end[0], end[1],
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
    drawLine2D(tg, endScreen, [endScreen[0] + right[0], endScreen[1] + right[1]], color);
    drawLine2D(tg, endScreen, [endScreen[0] + left[0], endScreen[1] + left[1]], color);
}

function drawXYZ(tg) {
    drawLine(tg, [0, 0, 0], [1, 0, 0], [1, 0, 0]);
    drawLine(tg, [0, 0, 0], [0, 1, 0], [0, 1, 0]);
    drawLine(tg, [0, 0, 0], [0, 0, 1], [0, 0, 1]);
}

/**
 * 画线
 */
function drawTriangle(tg, vertices, colors) {
    var gl = tg.gl;
    tg.setBasicShaderProgram(vertices, colors);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

/**
 * 纹理
 */
function drawImageTexture(tg, vertices, texCoords, image) {
    var gl = tg.gl;
    tg.setTextureShaderProgram(vertices, texCoords, image);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

/**
 * 光照绘制
 */
function drawLightTriangle(tg, vertices, colors, normals) {
    var gl = tg.gl;
    tg.setBasicLightShaderProgram(vertices, colors, normals);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

export { drawLine, drawLine2D, drawXYZ, drawArrow, drawTriangle, drawImageTexture, drawLightTriangle };