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

function drawXYZ(tg) {
    drawLine(tg, [0, 0, 0], [1, 0, 0], [1, 0, 0]);
    drawLine(tg, [0, 0, 0], [0, 1, 0], [0, 1, 0]);
    drawLine(tg, [0, 0, 0], [0, 0, 1], [0, 0, 1]);
}

/**
 * 画线
 * 三个参数都是9维数组
 */
function drawTriangle(tg, vertices, colors) {
    var gl = tg.gl;

    tg.setBasicShaderProgram(vertices, colors);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawImageTexture(tg, vertices, texCoords, image) {
    var gl = tg.gl;
    tg.setTextureShaderProgram(vertices, texCoords, image);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export { drawLine, drawXYZ, drawTriangle, drawImageTexture };