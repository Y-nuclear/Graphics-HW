import { mat4, vec3 } from 'gl-matrix';
import * as TGShaderProgram from './TGShaderProgram';
import * as TGDraw from './TGDraw';

class TG {
    constructor(canvas) {
        this.modelMatrixStack = [];
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();

        this.canvas = canvas;
        var gl = canvas.getContext('webgl');
        this.gl = gl;

        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;

        if (!this.gl) {
            console.error('Unable to initialize WebGL.');
            return;
        }

        this.setBasicShaderProgram = TGShaderProgram.BasicShaderProgram(this);
        this.setTextureShaderProgram = TGShaderProgram.TextureShaderProgram(this);
        this.drawLine = (...args) => TGDraw.drawLine(this, ...args);
        this.drawXYZ = (...args) => TGDraw.drawXYZ(this, ...args);
        this.drawTriangle = (...args) => TGDraw.drawTriangle(this, ...args);
        this.drawImageTexture = (...args) => TGDraw.drawImageTexture(this, ...args);

        this.gl.enable(gl.DEPTH_TEST);
    }

    clear() {
        var gl = this.gl;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    pushModelMatrix() {
        this.modelMatrixStack.push(mat4.clone(this.modelMatrix));
    }
    popModelMatrix() {
        if (this.modelMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        this.setModelMatrix(this.modelMatrixStack.pop());
    }
    setModelMatrix(m) {
        this.modelMatrix = m;
    }
    setViewMatrix(m) {
        this.viewMatrix = m;
    }
    setProjectionMatrix(m) {
        this.projectionMatrix = m;
    }
    setCamera(camera) {
        var { viewMatrix, projectionMatrix } = camera.getViewPprojectionMatrix(this.gl);
        this.setViewMatrix(viewMatrix);
        this.setProjectionMatrix(projectionMatrix);
    }

    translate(x, y, z) {
        mat4.translate(this.modelMatrix, this.modelMatrix, [x, y, z]);
    }
    rotate(angle, x, y, z) {
        mat4.rotate(this.modelMatrix, this.modelMatrix, angle, [x, y, z]);
    }
    scale(x, y, z) {
        mat4.scale(this.modelMatrix, this.modelMatrix, [x, y, z]);
    }


};

export { TG };