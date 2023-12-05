// 实现Vector类及其一系列的方法

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // 向量加法
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    // 向量减法
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    // 向量数乘
    multiply(s) {
        return new Vector(this.x * s, this.y * s);
    }

    // 向量数除
    divide(s) {
        return new Vector(this.x / s, this.y / s);
    }

    // 向量点乘
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    // 向量叉乘
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    // 向量模
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // 向量单位化
    normalize() {
        return this.divide(this.magnitude());
    }

    // 向量旋转
    rotate(angle) {
        return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
    }

    // 向量反向
    negate() {
        return new Vector(-this.x, -this.y);
    }

    // 向量转换为字符串
    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }

    // 向量转换为数组
    toArray() {
        return [this.x, this.y];
    }

    // 向量转换为对象
    toObject() {
        return {x: this.x, y: this.y};
    }

    // 向量转换为SVG路径
    toPath() {
        return "M 0 0 L " + this.x + " " + this.y;
    }

    // 向量转换为SVG路径
    toPath(x, y) {
        return "M " + x + " " + y + " L " + (x + this.x) + " " + (y + this.y);
    }

}

class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // 向量加法
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    // 向量减法
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    // 向量数乘
    multiply(s) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }

    // 向量数除
    divide(s) {
        return new Vector(this.x / s, this.y / s, this.z / s);
    }

    // 向量点乘
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    // 向量叉乘
    cross(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }

    // 向量模
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // 向量单位化
    normalize() {
        return this.divide(this.magnitude());
    }

    // 向量旋转
    rotate(angle) {
        return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle), this.z);
    }

    // 向量反向
    negate() {
        return new Vector(-this.x, -this.y, -this.z);
    }

    // 向量转换为字符串
    toString() {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }

    // 向量转换为数组
    toArray() {
        return [this.x, this.y, this.z];
    }

    // 向量转换为对象
    toObject() {
        return {x: this.x, y: this.y, z: this.z};
    }

    // 向量转换为SVG路径
    toPath() {
        return "M 0 0 L " + this.x + " " + this.y + " L " + this.z + " " + this.z;
    }
}

class Vector4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w
    }

    // 向量加法
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }

    // 向量减法
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }

    // 向量数乘
    multiply(s) {
        return new Vector(this.x * s, this.y * s, this.z * s, this.w * s);
    }

    // 向量数除
    divide(s) {
        return new Vector(this.x / s, this.y / s, this.z / s, this.w / s);
    }

    // 向量点乘
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }

    // 向量叉乘
    cross(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x, 0);
    }

    // 向量模
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    // 向量单位化
    normalize() {
        return this.divide(this.magnitude());
    }

    // 向量旋转
    rotate(angle) {
        return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle), this.z, this.w);
    }

    // 向量反向
    negate() {
        return new Vector(-this.x, -this.y, -this.z, -this.w);
    }

    // 向量转换为字符串
    toString() {
        return "(" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ")";
    }
}

export {Vector2, Vector3, Vector4};