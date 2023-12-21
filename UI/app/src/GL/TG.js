import { mat4, vec3 } from 'gl-matrix';
import { BasicShaderProgram } from './TGShaderProgram';
import { drawLine } from './TGDraw';

class TG {
    constructor() {
        this.canvas = null;
        this.gl = null;

        this.modelMatrixStack = [];
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    }
    init(canvas) {
        console.log('TG init');
        this.canvas = canvas;
        var gl = canvas.getContext('webgl');
        this.gl = gl;
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;

        if (!this.gl) {
            console.error('Unable to initialize WebGL.');
            return;
        }

        this.setBasicShaderProgram = BasicShaderProgram(gl);
        this.drawLine = (...args) => drawLine(this, ...args);

        this.gl.enable(gl.DEPTH_TEST);
    }

    clear() {
        var gl = this.gl;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    pushModelMatrix() {
        var copy = mat4.create();
        mat4.set(this.modelMatrix, copy);
        this.modelMatrixStack.push(copy);
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

};

export { TG };