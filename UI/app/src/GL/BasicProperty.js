//使用WebGL定义基本的物体
//包括三角形、正方形、圆形、圆环、球体、立方体、圆柱体、圆锥体、棱柱体、棱锥体、棱台体
//以及各种物体的变换、旋转、缩放、平移等操作
//定义三角形类
import Object3D from "../database/Object3D";


class Triangle extends Object3D{
    constructor(){
        super();
        //设置原型
        Object.setPrototypeOf(this,Triangle.prototype);
        this.vertices = [
            [0.0, 0.5,0.0],
            [-0.5, -0.5,0.0],
            [0.5, -0.5,0.0]
        ]
        this.colors = [
            //灰色
            [0.5,0.5,0.5],
            [0.5,0.5,0.5],
            [0.5,0.5,0.5]
        ]
    }
}

// cube
class Cube extends Object3D{
    constructor(){
        super();
        console.log(this);
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
        for (let i = 0; i < indices.length; i++) {
            for (let j = 0; j < 3; j++) {
                this.vertices.push(vertices[indices[i]][j]);
                this.colors.push(colors[indices[i]][j]);
            }
        }
    }
}


export {Triangle,Cube};