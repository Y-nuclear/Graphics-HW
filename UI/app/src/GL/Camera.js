//Camera类
// 用于控制相机的位置和方向
// 以及相机的投影矩阵和视图矩阵
// 以及 raycast

import Matrix4 from "../Math/Matrix";
import { Vector3 } from "../Math/Vector";
class Camera {
    constructor() {
        this.position = new Vector3(0, 0, 0);
        this.rotation = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.modelMatrix = new Matrix4();
        this.Matrixs = [];
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
        this.fov = 45;
        this.aspect = 1;
        this.near = 0.1;
        this.far = 100;
        this.ray = new Vector3(0, 0, 0);
        this.rayMatrix = new Matrix4();
        this.rayMatrixInverse = new Matrix4();
        this.rayOrigin = new Vector3(0, 0, 0);
        this.rayDirection = new Vector3(0, 0, 0);
    }
    // 更新模型矩阵
    updateModelMatrix() {
        while (this.Matrixs.length > 0) {
            this.modelMatrix.multiply(this.Matrixs.shift());
        }
    }
    // 平移
    glTranslate(x, y, z) {
        var Matrix = new Matrix4();
        Matrix.setTranslate(x, y, z);
        this.Matrixs.push(Matrix);
    }
    // 旋转
    glRotate(angle, x, y, z) {
        var Matrix = new Matrix4();
        Matrix.setRotate(angle, x, y, z);
        this.Matrixs.push(Matrix);
    }
    // 缩放
    glScale(x, y, z) {
        var Matrix = new Matrix4();
        Matrix.setScale(x, y, z);
        this.Matrixs.push(Matrix);
    }
    // 设置相机位置
    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
    // 设置相机旋转
    setRotation(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }
    // 设置相机缩放
    setScale(x, y, z) {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
    }
    // 设置相机投影矩阵
    setPerspective(fov, aspect, near, far) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.projectionMatrix.setPerspective(fov, aspect, near, far);
    }
    // 设置相机正视投影矩阵
    setOrtho(left, right, bottom, top, near, far) {
        this.projectionMatrix.setOrtho(left, right, bottom, top, near, far);
    }
    // 设置相机视图矩阵
    setViewMatrix() {
        this.viewMatrix.setIdentity();
        this.viewMatrix.multiply(this.modelMatrix);
        // this.viewMatrix.multiply(this.rayMatrixInverse);
    }
    // 设置相机射线
    setRay() {
        this.rayMatrix.setIdentity();
        this.rayMatrix.multiply(this.modelMatrix);
        this.rayMatrixInverse.setInverseOf(this.rayMatrix);
        this.rayOrigin.set(0, 0, 0);
        this.rayDirection.set(0, 0, -1);
        this.rayDirection = this.rayMatrix.multiplyVector(this.rayDirection);
        this.rayDirection.normalize();
    }
}

export default Camera;