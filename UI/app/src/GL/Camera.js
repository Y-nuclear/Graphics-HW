import { mat4, vec3 } from 'gl-matrix';


//Camera类
// 用于控制相机的位置和方向
// 以及相机的投影矩阵和视图矩阵
// 以及 raycast

/**
 * 一个相机
 * 鼠标拖动旋转
 * 鼠标滚轮缩放
 */
class ACamera {
    constructor(canvas) {
        var isDragging = false;
        var lastMouseX;
        var lastMouseY;

        this.cameraPosition = vec3.fromValues(0.2, 0.2, 2.5);
        this.targetPosition = vec3.fromValues(0, 0, 0);
        this.cameraZoom = 1.0;

        canvas.addEventListener('mousedown', (event) => {
            isDragging = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        });
        canvas.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const deltaX = event.clientX - lastMouseX;
                const deltaY = event.clientY - lastMouseY;

                const sensitivity = 0.01;
                const yaw = deltaX * sensitivity;
                const pitch = deltaY * sensitivity;

                vec3.rotateY(this.cameraPosition, this.cameraPosition, this.targetPosition, -yaw);
                vec3.rotateX(this.cameraPosition, this.cameraPosition, this.targetPosition, -pitch);

                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }
        });
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
        canvas.addEventListener('wheel', (event) => {
            const zoomFactor = 0.0005;
            this.cameraZoom += event.deltaY * zoomFactor;
        });
    }
    getViewPprojectionMatrix(gl) {
        const viewMatrix = mat4.create();
        var cameraPositionZoomed = vec3.create();
        vec3.scale(cameraPositionZoomed, this.cameraPosition, this.cameraZoom);
        mat4.lookAt(viewMatrix, cameraPositionZoomed, this.targetPosition, [0, 1, 0]);

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 90 * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.1, 100);

        return { viewMatrix, projectionMatrix };
    }
}


export { ACamera };