//使用WebGL定义基本的物体
//包括三角形、正方形、圆形、球体、立方体、圆环、圆锥体、圆柱体、棱锥体、棱柱体、棱台体
//以及各种物体的变换、旋转、缩放、平移等操作
//定义三角形类
import Object3D from "../database/Object3D";
class Prismoid extends Object3D { //棱台体
     constructor(degree = 5,height=1.0,radius=0.4,Radius=1.0) {
        super();
        //设置原型
        Object.setPrototypeOf(this, Triangle.prototype);
        this.name = "Prism";
        var verticesBottom = []
        var verticesTop = []
        var topPoint = [0, height, 0];
        var color=[]
        for (var j = 0; j < degree; j++) {
            var x = Math.cos(2 * Math.PI * j / degree);
            var y = Math.sin(2 * Math.PI * j / degree);
            verticesBottom.push([Radius*x, 0, Radius*y]);
            verticesTop.push([radius*x, height, radius*y]);
        }
        //侧面
        for(var i=0;i<degree;i++){
            var Left = i;
            var Right = (i + 1) % degree;
            
            // var topLeft = degree;
            this.vertices.push(...verticesTop[Left]);
            this.vertices.push(...verticesBottom[Left]);
            this.vertices.push(...verticesBottom[Right]);
            this.colors.push(0.8, 0.8, 0.8);
            this.colors.push(0.8, 0.8, 0.8);
            this.colors.push(0.8, 0.8, 0.8);
            
            

            this.vertices.push(...verticesTop[Left]);
            this.vertices.push(...verticesBottom[Right]);
            this.vertices.push(...verticesTop[Right]);
            this.colors.push(0.8, 0.8, 0.8);
            this.colors.push(0.8, 0.8, 0.8);
            this.colors.push(0.8, 0.8, 0.8);
        }
        //底面 + 顶面
        for (var i = 0; i < degree; i++) {
            var Left = i;
            var Right = (i + 1) % degree;
            this.vertices.push(...[0, 0, 0]);
            this.vertices.push(...verticesBottom[Left]);
            this.vertices.push(...verticesBottom[Right]);
            
            this.vertices.push(...[0, height, 0]);
            this.vertices.push(...verticesTop[Left]);
            this.vertices.push(...verticesTop[Right]);

            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
        }
        this.computeNormals();
        this.fillUVs();
    }
}
class Prism extends Object3D { //棱柱体
    constructor(degree = 5,height=1.0,radius=0.8) {
        super();
        //设置原型
        Object.setPrototypeOf(this, Triangle.prototype);
        this.name = "Prism";
        var verticesBottom = []
        var verticesTop = []
        var topPoint = [0, height, 0];
        var color=[]
        for (var j = 0; j < degree; j++) {
            var x = radius*Math.cos(2 * Math.PI * j / degree);
            var y = radius*Math.sin(2 * Math.PI * j / degree);
            verticesBottom.push([x, 0, y]);
            verticesTop.push([x, height, y]);
        }
        //侧面
        for(var i=0;i<degree;i++){
            var Left = i;
            var Right = (i + 1) % degree;
            
            // var topLeft = degree;
            this.vertices.push(...verticesTop[Left]);
            this.vertices.push(...verticesBottom[Left]);
            this.vertices.push(...verticesBottom[Right]);
            this.colors.push(0.1, 0.1, 0.1);
            this.colors.push(0.1, 0.1, 0.1);
            this.colors.push(0.1, 0.1, 0.1);
            
            

            this.vertices.push(...verticesTop[Left]);
            this.vertices.push(...verticesBottom[Right]);
            this.vertices.push(...verticesTop[Right]);
            this.colors.push(0.1, 0.1, 0.1);
            this.colors.push(0.1, 0.1, 0.1);
            this.colors.push(0.1, 0.1, 0.1);
        }
        //底面 + 顶面
        for (var i = 0; i < degree; i++) {
            var Left = i;
            var Right = (i + 1) % degree;
            this.vertices.push(...[0, 0, 0]);
            this.vertices.push(...verticesBottom[Left]);
            this.vertices.push(...verticesBottom[Right]);
            
            this.vertices.push(...[0, height, 0]);
            this.vertices.push(...verticesTop[Left]);
            this.vertices.push(...verticesTop[Right]);

            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
            this.colors.push(0.5, 0.5, 0.5);
        }
        this.computeNormals();
        this.fillUVs();
    }
}
class Pyramid extends Object3D { //棱锥体
    constructor(degree = 5,height=1.0,radius=0.8) {
        super();
        //设置原型
        Object.setPrototypeOf(this, Triangle.prototype);
        this.name = "Pyramid";
        var vertices = []
        var topPoint=[0,height,0];
        for (var j = 0; j < degree; j++) {
            var x = radius*Math.cos(2 * Math.PI * j / degree);
            var y = radius*Math.sin(2 * Math.PI * j / degree);
            vertices.push([x, 0, y]);
        }
        //侧面
        for(var i=0;i<degree;i++){
            var bottomLeft = i;
            var bottomRight = (i + 1) % degree;
            // var topLeft = degree;
            this.vertices.push(...topPoint);
            this.vertices.push(...vertices[bottomLeft]);
            this.vertices.push(...vertices[bottomRight]);
            this.colors.push(0.0, 1.0, 1.0);
            this.colors.push(1.0, 0.4, 0.0);
            this.colors.push(1.0, 1.0, 1.0);
        }
        //底面
        for (var i = 0; i < degree; i++) {
            var bottomLeft = i;
            var bottomRight = (i + 1) % degree;
            var topLeft = degree;
            this.vertices.push(...[0, 0, 0]);
            this.vertices.push(...vertices[bottomLeft]);
            this.vertices.push(...vertices[bottomRight]);
            
            this.colors.push(1.0, 1.0, 1.0);
            this.colors.push(1.0, 1.0, 1.0);
            this.colors.push(1.0, 1.0, 1.0);
        }
        this.computeNormals();
        this.fillUVs();
    }
}
class Conecylinder extends Object3D { //圆柱体
    constructor(radius = 0.5,height = 1.0) {
        super();
        //设置原型
        Object.setPrototypeOf(this, Triangle.prototype);
        this.name = "Conecylinder";
        // var radius = 0.5;
        // var height = 1.0;
        var segmentCount = 360;
        var ySegmentCount = 100;
        // var vertices = [[0, 0, 0]]; // 添加原点
        var bottom = [0, 0, 0]; // 添加底部顶点
        var vertices = [];
        var tantheta = radius / height;

        for (let i = 0; i <= ySegmentCount; i++) {
            var h = height - i * height / ySegmentCount;
            var b = i * height / ySegmentCount;
            var r = radius;
            for (let j = 0; j <= segmentCount; j++) {
                let angle = (j * 2 * Math.PI) / segmentCount;
                let x = r * Math.cos(angle);
                let y = r * Math.sin(angle);
                vertices.push([x, b, y]);
            }
        }
        //底面圆+顶面圆
        for (let i = 0; i <= segmentCount; i++) {
            //顶面
            var topIndex = i + (segmentCount + 1) * (ySegmentCount);
            this.vertices.push(...[0, height, 0]); // 圆心
            this.colors.push(1.0, 1.0, 1.0);

            this.vertices.push(...vertices[topIndex]); // 当前顶点
            this.colors.push(1.0, 1.0, 1.0);

            if (i === segmentCount) {
                this.vertices.push(...vertices[topIndex]); // 最后一个顶点连接到第一个顶点
            }
            else { 
                this.vertices.push(...vertices[topIndex + 1]); // 下一个顶点
            }
            this.colors.push(1.0, 1.0, 1.0);
            //底面
            this.vertices.push(...[0, 0, 0]); // 圆心
            this.colors.push(1.0, 1.0, 1.0);

            this.vertices.push(...vertices[i]); // 当前顶点
            this.colors.push(1.0, 1.0, 1.0);

            if (i === segmentCount) {
                this.vertices.push(...vertices[0]); // 最后一个顶点连接到第一个顶点
            } else {
                this.vertices.push(...vertices[i + 1]); // 下一个顶点
            }
            this.colors.push(1.0, 1.0, 1.0);
        }
    
        //侧面
        for (let i = 0; i < ySegmentCount; i++) {
            for (let j = 0; j <= segmentCount; j++) {
                var bottomLeft = i * segmentCount + j;
                if (j === segmentCount) {
                    var bottomRight = i * segmentCount;
                } else {
                    var bottomRight = bottomLeft + 1;
                }
                
                
                var topLeft = (i + 1) * segmentCount + j;
                if (j === segmentCount) { 
                    var topRight = (i + 1) * segmentCount;
                } else {
                    var topRight = (i + 1) * segmentCount + j + 1;
                }
                
                
                this.vertices.push(...vertices[bottomLeft]);
                this.vertices.push(...vertices[bottomRight]);
                this.vertices.push(...vertices[topLeft]);
                this.vertices.push(...vertices[topLeft]);
                this.vertices.push(...vertices[bottomRight]);
                this.vertices.push(...vertices[topRight]);

                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                // this.colors.push(0.4, 0.0, 0.0);
                // this.colors.push(0.4, 0.0, 0.0);
                // this.colors.push(0.4, 0.0, 0.0);
            }
        }
        this.computeNormals();
        this.fillUVs();
    }
}
class Cone extends Object3D { //圆锥体
    constructor(radius = 0.5,height = 1.0) {
        super();
        //设置原型
        Object.setPrototypeOf(this, Triangle.prototype);
        this.name = "Cone";
        // var radius = 0.5;
        // var height = 1.0;
        var segmentCount = 360;
        var ySegmentCount = 100;
        // var vertices = [[0, 0, 0]]; // 添加原点
        var bottom = [0, 0, 0]; // 添加底部顶点
        var vertices = [];
        var tantheta = radius / height;

        for (let i = 0; i <= ySegmentCount; i++) {
            var h = height - i * height / ySegmentCount;
            var b = i * height / ySegmentCount;
            var r = h * tantheta;
            for (let j = 0; j <= segmentCount; j++) {
                let angle = (j * 2 * Math.PI) / segmentCount;
                let x = r * Math.cos(angle);
                let y = r * Math.sin(angle);
                vertices.push([x, b, y]);
            }
        }
        //底面圆
        for (let i = 0; i <= segmentCount; i++) {
            this.vertices.push(...[0, 0, 0]); // 圆心
            this.colors.push(1.0, 1.0, 1.0);

            this.vertices.push(...vertices[i]); // 当前顶点
            this.colors.push(1.0, 1.0, 1.0);

            if (i === segmentCount) {
                this.vertices.push(...vertices[0]); // 最后一个顶点连接到第一个顶点
            } else {
                this.vertices.push(...vertices[i + 1]); // 下一个顶点
            }
            this.colors.push(1.0, 1.0, 1.0);
        }
    
        //侧面
        for (let i = 0; i < ySegmentCount; i++) {
            for (let j = 0; j <= segmentCount; j++) {
                var bottomLeft = i * segmentCount + j;
                if (j === segmentCount) {
                    var bottomRight = i * segmentCount;
                } else {
                    var bottomRight = i * segmentCount + j + 1;
                }
                
                var topLeft = (i + 1) * segmentCount + j;
                if (j === segmentCount) { 
                    var topRight = (i + 1) * segmentCount;
                } else {
                    var topRight = (i + 1) * segmentCount + j + 1;
                }
                
                
                this.vertices.push(...vertices[bottomLeft]);
                this.vertices.push(...vertices[bottomRight]);
                this.vertices.push(...vertices[topLeft]);
                this.vertices.push(...vertices[topLeft]);
                this.vertices.push(...vertices[bottomRight]);
                this.vertices.push(...vertices[topRight]);

                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                this.colors.push(1.0, 1.0, 1.0);
                // this.colors.push(0.4, 0.0, 0.0);
                // this.colors.push(0.4, 0.0, 0.0);
                // this.colors.push(0.4, 0.0, 0.0);
            }
        }
        this.computeNormals();
        this.fillUVs();
    }
}
class Rectangle extends Object3D { 
    constructor(){
        super();
        //设置原型
        Object.setPrototypeOf(this,Triangle.prototype);
        this.name = "Rectangle";
        this.vertices = [
            0.5, -0.5,0.0,
            -0.5, 0.5,0.0,
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.5, 0.5, 0.0,
            -0.5, 0.5,0.0
        ]
        this.colors = [
            //灰色
            0.5,0.5,0.5,
            0.5,0.5,0.5,
            0.5, 0.5, 0.5,
            0.5,0.5,0.5,
            0.5,0.5,0.5,
            0.5,0.5,0.5
        ]
        this.computeNormals();
        this.fillUVs();
    }
}
class Ring extends Object3D { 
    constructor(r = 0.8,R=1.0) {
        super();
        this.name = "Ring";
        // var radius = 0.5;
        var segmentCount = 360;
        var verticesr = [[0, 0, 0]]; // 添加原点
        var verticesR = [[0, 0, 0]]; // 添加原点

        // 添加圆周上的顶点
        for (let i = 0; i <= segmentCount; i++) {
            let angle = (i * 2 * Math.PI) / segmentCount;
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            let Rx = R * Math.cos(angle);
            let Ry = R * Math.sin(angle);
            verticesR.push([Rx, Ry, 0]);
            verticesr.push([x, y, 0]);
        }
//r1 r2 R1; R2 R1 r2;r2 r3 R2; R3 R2 r3;r3 r4 R3; R4 R3 r4;r4 r1 R4; R1 R4 r1;

        for (let i = 0; i <= segmentCount; i++) { 
            if (true) {
                this.vertices.push(...verticesr[i]);
                this.vertices.push(...verticesr[i + 1]);
                this.vertices.push(...verticesR[i]);

                this.vertices.push(...verticesR[i + 1]);
                this.vertices.push(...verticesR[i]);
                this.vertices.push(...verticesr[i + 1])

            } else {
                this.vertices.push(...verticesr[i]);
                this.vertices.push(...verticesr[0]);
                this.vertices.push(...verticesR[i]);

                this.vertices.push(...verticesR[0]);
                this.vertices.push(...verticesR[i]);
                this.vertices.push(...verticesr[0])
            
            }
            for(let j=0;j<6;j++){
                this.colors.push(0.4, 0.0, 0.0);
            }
        }
        this.computeNormals();
        this.fillUVs();
    }
}
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
        this.computeNormals();
        this.fillUVs();
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
        this.computeNormals();
        this.fillUVs();
    }
}

class Circle extends Object3D {
    constructor(radius = 0.5) {
        super();
        this.name = "Circle";
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
        this.computeNormals();
        this.fillUVs();
    }
}

class Sphere extends Object3D {
    constructor(radius = 1, latitudeBands = 80, longitudeBands = 80) {
        super();
        this.name = "Sphere";
        var vertices = [];
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
        this.computeNormals();
        this.fillUVs();
    }
}



export {Sphere ,Cone,Ring,Prism,Conecylinder,Pyramid,Circle,Triangle,Cube,Rectangle,Prismoid};