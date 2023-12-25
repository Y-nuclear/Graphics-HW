//使用WebGL定义基本的物体
//包括三角形、正方形、圆形、球体圆环、、立方体、圆锥体、圆柱体、棱柱体、棱锥体、棱台体
//以及各种物体的变换、旋转、缩放、平移等操作
//定义三角形类
import Object3D from "../database/Object3D";


class Triangle extends Object3D{
    constructor(){
        super();
        //设置原型
        Object.setPrototypeOf(this,Triangle.prototype);
        this.name = "Triangle";
        this.vertices = [
            0.0, 0.5,0.0,
            -0.5, -0.5,0.0,
            0.5, -0.5,0.0
        ]
        this.colors = [
            //灰色
            0.5,0.5,0.5,
            0.5,0.5,0.5,
            0.5,0.5,0.5
        ]
    }
}

// cube
class Cube extends Object3D{
    constructor(){
        super();
        // console.log(this);
        var vertices = [
            [0.5, 0.5, 0.5],
            [-0.5, 0.5, 0.5],
            [-0.5, -0.5, 0.5],
            [0.5, -0.5, 0.5],
            [0.5, 0.5, -0.5],
            [-0.5, 0.5, -0.5],
            [-0.5, -0.5, -0.5],
            [0.5, -0.5, -0.5]
        ]
        var colors = [
            [1.0, 0.0, 0.0], //红色
            [1.0, 1.0, 0.0], //黄色
            [0.0, 1.0, 0.0], //绿色
            [0.0, 0.0, 1.0], //蓝色
            [1.0, 0.0, 1.0], //紫色
            [1.0, 1.0, 1.0], //白色
            [0.0, 1.0, 1.0], //青色
            [0.5, 0.5, 0.5]  //灰色
        ]
        
        let indices = [
            0,1,2,
            0,2,3,
            0,5,1,
            0,4,5,
            0,3,7,
            0,7,4,
            6,7,4,
            6,4,5,
            6,7,3,
            6,3,2,
            6,5,2,
            5,1,2
        ];
        this.triangles = indices;
        this.name = "Cube";
        for (let i = 0; i < indices.length; i++) {
            for (let j = 0; j < 3; j++) {
                this.vertices.push(vertices[indices[i]][j]);
                this.colors.push(colors[indices[i]][j]);
            }
        }
    }
}

class Circle extends Object3D {
    constructor(radius = 0.5) {
        super();
        // var radius = 0.5;
        var segmentCount = 360;
        var vertices = [[0, 0, 0]]; // 添加原点

        // 添加圆周上的顶点
        for (let i = 0; i <= segmentCount; i++) {
            let angle = (i * 2 * Math.PI) / segmentCount;
            let x = radius * Math.cos(angle);
            let y = radius * Math.sin(angle);
            vertices.push([x, y, 0]);
        }

        // 构建三角形
        for (let i = 1; i <= segmentCount; i++) {
            this.vertices.push(...vertices[0]); // 圆心
            this.colors.push(1.0, 0.0, 0.0);

            this.vertices.push(...vertices[i]); // 当前顶点
            this.colors.push(1.0, 0.0, 0.0);

            if (i === segmentCount) {
                this.vertices.push(...vertices[1]); // 最后一个顶点连接到第一个顶点
            } else {
                this.vertices.push(...vertices[i + 1]); // 下一个顶点
            }
            this.colors.push(1.0, 0.0, 0.0);
        }
    }
}

class Sphere extends Object3D {
    constructor(radius = 1, latitudeBands = 80, longitudeBands = 80) {
        super();
        var vertices = [];
        var indices = [];
        var ori = [0, 0, 0]
        var bottom=[0,-radius,0]
        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            const theta = latNumber * Math.PI / latitudeBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                const phi = longNumber * 2 * Math.PI / longitudeBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;

                vertices.push([radius * x, radius * y, radius * z]);
            }
        }
        console.log('vertices: ', vertices);

        for (let latNumber = 0; latNumber <latitudeBands ; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                const first = (latNumber * (longitudeBands )) + longNumber;
                const second = first + longitudeBands ;
                this.vertices.push(...vertices[first]);//黑色 左
                this.colors.push(0.0, 0.0, 0.0);

            
                if (longNumber === longitudeBands - 1) {//右
                    var index = latNumber * (longitudeBands);
                    // second
                    // console.log('index: ', index);
                    this.vertices.push(...vertices[index]);    
                    // this.colors.push(0.0, 0.0, 1.0);
                } 
                else {
                    this.vertices.push(...vertices[first + 1]);
                    // this.colors.push(1.0, 0.0, 0.0);
                }
                this.colors.push(0.3, 0.2, 1.0);

                if (latNumber == latitudeBands - 1) { 
                    this.vertices.push(...bottom)
                }
                else {
                    this.vertices.push(...vertices[second]);//下
                }
                this.colors.push(1.0, 1.0, 1.0);
//第二个三角

                if (latNumber == latitudeBands - 1) { 
                    this.vertices.push(...bottom)
                }
                else {
                    this.vertices.push(...vertices[second]);//下
                }
                this.colors.push(1.0, 1.0, 1.0);

                if (longNumber === longitudeBands - 1) {//右
                    var index = latNumber * (longitudeBands);
                    // console.log('右上特殊',index)
                    this.vertices.push(...vertices[index]);    
                    // this.colors.push(0.0, 0.0, 1.0);
                } 
                else {
                    this.vertices.push(...vertices[first + 1]);
                    // this.colors.push(1.0, 0.0, 0.0);
                }
                this.colors.push(0.3, 0.2, 1.0);
                if (latNumber == latitudeBands - 1) {
                    this.vertices.push(...bottom)
                }
                else if (longNumber === longitudeBands - 1) {
                    
                    var index = (latNumber+1) * (longitudeBands );
                    // console.log('右下特殊', index)
                    // console.log('左下 ', second);
                    this.vertices.push(...vertices[index]);
                }
                else {
                    this.vertices.push(...vertices[second+1]);//右下
                }

               
                
                this.colors.push(1.0, 1.0, 1.0);

                
            }
        }
    }
}



export {Sphere ,Circle,Triangle,Cube};