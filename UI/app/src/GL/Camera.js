import { mat4, vec3,quat } from 'gl-matrix';


/**
 * 一个相机，也许能用？ \
 * 鼠标左键拖动旋转 \
 * 鼠标中键拖动平移 \
 * 鼠标滚轮缩放 \
 * A、D、W、S、Q、E 键控制相机左右前后上下移动 \
 * R 键重置相机位置
 */
class ACamera {
    constructor(canvas) {
        var isDragging = false;
        var isMidClickDragging = false;
        var lastMouseX;
        var lastMouseY;

        this.initCameraPosition = vec3.fromValues(1.0, 0.2, 2.5);
        this.initTargetPosition = vec3.fromValues(0, 0, 0);
        this.initCameraZoom = 1.0;
        this.initFov = 90;
        this.initNear = 0.1;
        this.initFar = 100;
        this.rotationQuat = quat.create();//四元数

        this.cameraPosition = vec3.copy(vec3.create(), this.initCameraPosition);
        this.targetPosition = vec3.copy(vec3.create(), this.initTargetPosition);
        this.cameraZoom = this.initCameraZoom;
        this.fov = this.initFov;
        this.near = this.initNear;
        this.far = this.initFar;
        this.yaw = 0;   // 偏航角，绕Y轴旋转
        this.pitch = 0; // 俯仰角，绕X轴旋转

        canvas.addEventListener('mousedown', (event) => {
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            if (event.button === 0) {
                isDragging = true;
            } else if (event.button === 1) {
                isMidClickDragging = true;
            }
        });
            // 更新相机位置
    

        canvas.addEventListener('mousemove', (event) => {
            const deltaX = -event.clientX + lastMouseX;
            const deltaY = -event.clientY + lastMouseY;

            if (isDragging) {
                const sensitivity = 0.005;
                const yaw = deltaX * sensitivity;
                const pitch = deltaY * sensitivity;

                // 计算绕Y轴的旋转（偏航）
                let rotY = quat.setAxisAngle(quat.create(), vec3.fromValues(0, 1, 0), yaw);
                // 计算绕X轴的旋转（俯仰）
                let rotX = quat.setAxisAngle(quat.create(), vec3.fromValues(1, 0, 0), pitch);

                var rotQ = quat.multiply(quat.create(), rotY, rotX);

                // 首先应用偏航旋转，然后应用俯仰旋转
                
                // quat.multiply(this.rotationQuat, rotX, this.rotationQuat);
                // quat.multiply(this.rotationQuat,  this.rotationQuat,rotY);
                
                quat.multiply(this.rotationQuat, this.rotationQuat, rotQ);
                    
                let rotatedPosition = vec3.create();
                vec3.transformQuat(rotatedPosition, this.initCameraPosition, this.rotationQuat);
                this.cameraPosition = rotatedPosition;

            } else if (isMidClickDragging) {
                // 中键拖动时移动相机位置的逻辑
                const moveSpeed = 0.01;

                // 与相机朝向垂直的方向
                var cameraDir = vec3.create();
                vec3.sub(cameraDir, this.targetPosition, this.cameraPosition);

                var right = vec3.create();
                vec3.cross(right, cameraDir, [0, 1, 0]);
                vec3.normalize(right, right);

                var up = vec3.create();
                vec3.cross(up, cameraDir, right);
                vec3.normalize(up, up);

                vec3.scale(right, right, -deltaX * moveSpeed);
                vec3.scale(up, up, -deltaY * moveSpeed);

                vec3.add(this.cameraPosition, this.cameraPosition, right);
                vec3.add(this.cameraPosition, this.cameraPosition, up);
                vec3.add(this.targetPosition, this.targetPosition, right);
                vec3.add(this.targetPosition, this.targetPosition, up);
            }

            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        });
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            isMidClickDragging = false;
        });
        // 鼠标离开画布时停止拖动的逻辑
        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
            isMidClickDragging = false;
        });

        // 滚轮缩放
        canvas.addEventListener('wheel', (event) => {
            const zoomFactor = 0.0005;
            this.cameraZoom += event.deltaY * zoomFactor;
        });

        // 键盘控制
        window.addEventListener('keydown', (event) => {
            const moveAmount = 0.1;
            switch (event.key) {
                case 'w':
                    vec3.add(this.cameraPosition, this.cameraPosition, vec3.fromValues(0, 0, -moveAmount));
                    vec3.add(this.targetPosition, this.targetPosition, vec3.fromValues(0, 0, -moveAmount));
                    break;
                case 's':
                    vec3.add(this.cameraPosition, this.cameraPosition, vec3.fromValues(0, 0, moveAmount));
                    vec3.add(this.targetPosition, this.targetPosition, vec3.fromValues(0, 0, moveAmount));
                    break;
                case 'a':
                    vec3.add(this.cameraPosition, this.cameraPosition, vec3.fromValues(moveAmount, 0, 0));
                    vec3.add(this.targetPosition, this.targetPosition, vec3.fromValues(moveAmount, 0, 0));
                    break;
                case 'd':
                    vec3.add(this.cameraPosition, this.cameraPosition, vec3.fromValues(-moveAmount, 0, 0));
                    vec3.add(this.targetPosition, this.targetPosition, vec3.fromValues(-moveAmount, 0, 0));
                    break;
                case 'q':
                    vec3.add(this.cameraPosition, this.cameraPosition, vec3.fromValues(0, moveAmount, 0));
                    vec3.add(this.targetPosition, this.targetPosition, vec3.fromValues(0, moveAmount, 0));
                    break;
                case 'e':
                    vec3.add(this.cameraPosition, this.cameraPosition, vec3.fromValues(0, -moveAmount, 0));
                    vec3.add(this.targetPosition, this.targetPosition, vec3.fromValues(0, -moveAmount, 0));
                    break;
                case 'r':
                    this.cameraPosition = vec3.copy(vec3.create(), this.initCameraPosition);
                    this.targetPosition = vec3.copy(vec3.create(), this.initTargetPosition);
                    this.cameraZoom = this.initCameraZoom;
                    this.fov = this.initFov;
                    this.near = this.initNear;
                    this.far = this.initFar;
                    break;
            }
        });
    }
    getParams() {
        var cameraPositionZoomed = vec3.create();//
        vec3.scale(cameraPositionZoomed, this.cameraPosition, this.cameraZoom);

        var position = cameraPositionZoomed;
        var target = this.targetPosition;
        var mode = 'perspective';
        var fov = this.fov;
        var near = this.near;
        var far = this.far;

        return { position, target, mode, fov, near, far };
    }
    setParams(pos,tar) {
        // console.log("setParams", params,"ww",ww);   
        // console.log("this.cameraPosition", this.cameraPosition);
        // console.log("this.targetPosition", this.targetPosition);
        // console.log("params.position[0]", params.position[0]);
        var CameraPosition = vec3.fromValues(pos[0], pos[1], pos[2]);
        var TargetPosition = vec3.fromValues(tar[0], tar[1], tar[2]);
        this.cameraZoom = this.initCameraZoom;
        this.cameraPosition = vec3.copy(vec3.create(), CameraPosition);
        this.targetPosition = vec3.copy(vec3.create(), TargetPosition);
        // console.log("this.cameraPosition", this.cameraPosition);
    }
    
}


export { ACamera };