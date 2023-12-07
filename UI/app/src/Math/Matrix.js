import { Vector3 } from "./Vector";
class Matrix4{
    constructor(){
        this.elements = new Float32Array([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0, 
            0,0,0,1
        ]);
    }
    // 设置为单位矩阵
    setIdentity(){
        this.elements[0] = 1;
        this.elements[1] = 0;
        this.elements[2] = 0;
        this.elements[3] = 0;

        this.elements[4] = 0;
        this.elements[5] = 1;
        this.elements[6] = 0;
        this.elements[7] = 0;

        this.elements[8] = 0;
        this.elements[9] = 0;
        this.elements[10] = 1;
        this.elements[11] = 0;

        this.elements[12] = 0;
        this.elements[13] = 0;
        this.elements[14] = 0;
        this.elements[15] = 1;
    }
    // 设置为平移矩阵
    setTranslate(x,y,z){
        this.setIdentity();
        this.elements[12] = x;
        this.elements[13] = y;
        this.elements[14] = z;
    }
    // 设置为缩放矩阵
    setScale(x,y,z){
        this.setIdentity();
        this.elements[0] = x;
        this.elements[5] = y;
        this.elements[10] = z;
    }
    // 设置为绕X轴旋转矩阵
    setRotateX(angle){
        this.setIdentity();
        var sinB = Math.sin(angle);
        var cosB = Math.cos(angle);
        this.elements[5] = cosB;
        this.elements[6] = sinB;
        this.elements[9] = -sinB;
        this.elements[10] = cosB;
    }
    // 设置为绕Y轴旋转矩阵
    setRotateY(angle){
        this.setIdentity();
        var sinB = Math.sin(angle);
        var cosB = Math.cos(angle);
        this.elements[0] = cosB;
        this.elements[2] = -sinB;
        this.elements[8] = sinB;
        this.elements[10] = cosB;
    }
    // 设置为绕Z轴旋转矩阵
    setRotateZ(angle){
        this.setIdentity();
        var sinB = Math.sin(angle);
        var cosB = Math.cos(angle);
        this.elements[0] = cosB;
        this.elements[1] = sinB;
        this.elements[4] = -sinB;
        this.elements[5] = cosB;
    }
    // 设置为绕任意轴旋转矩阵
    setRotate(angle,x,y,z){
        this.setIdentity();
        var sinB = Math.sin(angle);
        var cosB = Math.cos(angle);
        var sinA = x;
        var cosA = Math.sqrt(1 - x * x);
        var sinC = y;
        var cosC = Math.sqrt(1 - y * y);
        var sinD = z;
        var cosD = Math.sqrt(1 - z * z);
        this.elements[0] = cosA * cosD;
        this.elements[1] = cosA * sinD;
        this.elements[2] = -sinA;
        this.elements[4] = sinB * sinA * cosD - cosB * sinD;
        this.elements[5] = sinB * sinA * sinD + cosB * cosD;
        this.elements[6] = sinB * cosA;
        this.elements[8] = cosB * sinA * cosD + sinB * sinD;
        this.elements[9] = cosB * sinA * sinD - sinB * cosD;
        this.elements[10] = cosB * cosA;
    }
    // 设置为视图矩阵
    setLookAt(eyeX,eyeY,eyeZ,atX,atY,atZ,upX,upY,upZ){
        var zAxis = new Vector3(eyeX - atX,eyeY - atY,eyeZ - atZ);
        zAxis.normalize();
        var xAxis = new Vector3(upX,upY,upZ);
        xAxis = xAxis.cross(zAxis);
        xAxis.normalize();
        var yAxis = zAxis.cross(xAxis);
        yAxis.normalize();
        this.elements[0] = xAxis.x;
        this.elements[1] = yAxis.x;
        this.elements[2] = zAxis.x;
        this.elements[3] = 0;
        this.elements[4] = xAxis.y;
        this.elements[5] = yAxis.y;
        this.elements[6] = zAxis.y;
        this.elements[7] = 0;
        this.elements[8] = xAxis.z;
        this.elements[9] = yAxis.z;
        this.elements[10] = zAxis.z;
        this.elements[11] = 0;
        this.elements[12] = -xAxis.dot(new Vector3(eyeX,eyeY,eyeZ));
        this.elements[13] = -yAxis.dot(new Vector3(eyeX,eyeY,eyeZ));
        this.elements[14] = -zAxis.dot(new Vector3(eyeX,eyeY,eyeZ));
        this.elements[15] = 1;
    }
    // 设置为透视投影矩阵
    setPerspective(fovy,aspect,near,far){
        var halfHeight = near * Math.tan(fovy / 2);
        var halfWidth = halfHeight * aspect;
        this.setFrustum(-halfWidth,halfWidth,-halfHeight,halfHeight,near,far);
    }
    // 设置为正交投影矩阵
    setOrtho(left,right,bottom,top,near,far){
        this.setIdentity();
        this.elements[0] = 2 / (right - left);
        this.elements[5] = 2 / (top - bottom);
        this.elements[10] = 2 / (near - far);
        this.elements[12] = (left + right) / (left - right);
        this.elements[13] = (bottom + top) / (bottom - top);
        this.elements[14] = (near + far) / (near - far);
    }
    // 设置为视锥体矩阵
    setFrustum(left,right,bottom,top,near,far){
        this.setIdentity();
        this.elements[0] = 2 * near / (right - left);
        this.elements[5] = 2 * near / (top - bottom);
        this.elements[8] = (right + left) / (right - left);
        this.elements[9] = (top + bottom) / (top - bottom);
        this.elements[10] = (near + far) / (near - far);
        this.elements[11] = -1;
        this.elements[14] = 2 * near * far / (near - far);
        this.elements[15] = 0;
    }
    // 矩阵相乘
    multiply(matrix){
        var result = new Matrix4();
        for(var i = 0;i < 4;i++){
            for(var j = 0;j < 4;j++){
                var sum = 0;
                for(var k = 0;k < 4;k++){
                    sum += this.elements[i * 4 + k] * matrix.elements[k * 4 + j];
                }
                result.elements[i * 4 + j] = sum;
            }
        }
        this.elements = result.elements;
        return result;
    }
    // 矩阵向量相乘
    multiplyVector(vector){
        var result = new Vector3();
        result.x = this.elements[0] * vector.x + this.elements[4] * vector.y + this.elements[8] * vector.z + this.elements[12];
        result.y = this.elements[1] * vector.x + this.elements[5] * vector.y + this.elements[9] * vector.z + this.elements[13];
        result.z = this.elements[2] * vector.x + this.elements[6] * vector.y + this.elements[10] * vector.z + this.elements[14];
        return result;
    }
    // 矩阵转置
    transpose(){
        var result = new Matrix4();
        for(var i = 0;i < 4;i++){
            for(var j = 0;j < 4;j++){
                result.elements[i * 4 + j] = this.elements[j * 4 + i];
            }
        }
        return result;
    }
    // 矩阵求逆 JoccoBi迭代法
                
        
}

export default Matrix4;