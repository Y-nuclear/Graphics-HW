import Object3D from "../database/Object3D";
class NURBSObject extends Object3D{
    constructor(){
        super();
        this.type = 'NURBSObject';
        this.deg = 3;
        this.uknots = [];
        this.uweights = [];
        this.vknots = [];
        this.vweights = [];
        this.uControlNum = 0;
        this.vControlNum = 0;
        this.ControlLines = [];
        this.uSegments = 0.01;
        this.vSegment = 0.01;
        this.init();
    }
    init(){
        this.uControlNum = this.vControlNum = 20;
        for(let i=0;i<this.uControlNum;i++){
            let ControlLine = [];
            for(let j=0;j<this.vControlNum;j++){
                ControlLine.push([i/this.uControlNum,j/this.vControlNum,Math.sin(i/20*Math.PI)*Math.cos(j/20*Math.PI)])
            }
            this.ControlLines.push(ControlLine);
        }
        for(let i=0;i<this.uControlNum+this.deg;i++){
            this.uknots.push(i/(this.uControlNum+this.deg));
        }
        for(let i=0;i<this.vControlNum+this.deg;i++){
            this.vknots.push(i/(this.vControlNum+this.deg));
        }
        for(let i=0;i<this.uControlNum;i++){
            this.uweights.push(1);
        }
        for(let i=0;i<this.vControlNum;i++){
            this.vweights.push(1);
        }
        this.calculateSurface();
    }
     // 计算曲面
    calculateSurface(){
        // 计算v方向上的曲线
        let uLines = [];
        for(let i=0;i<this.uControlNum;i++){
            uLines.push(calculateNurbsCurve(this.ControlLines[i],this.vweights,this.vknots,this.vSegment))
        }
        let Lines = [];
        for(let i=0;i<uLines[0].length;i++){
            let tempControl = [];
            for(let j=0;j<uLines.length;j++){
                tempControl.push(uLines[j][i]);
            }
            Lines.push(calculateNurbsCurve(tempControl,this.uweights,this.uknots,this.uSegments));
        }
        // 整理计算得到的所有顶点
        for(let i=0;i<Lines.length-1;i++){
            let Line1 = Lines[i];
            // console.log(Line1)
            let Line2 = Lines[i+1];
            for(let j=0;j<Line1.length-1;j++){
                this.vertices.push(...Line1[j])
                this.vertices.push(...Line2[j])
                this.vertices.push(...Line1[j+1])

                this.vertices.push(...Line2[j])
                this.vertices.push(...Line2[j+1])
                this.vertices.push(...Line1[j+1])
            }
        }
        for(let i =0;i<this.vertices.length;i++){
            this.colors.push(0.8)
            this.colors.push(0.8)
            this.colors.push(0.8)
        }
    }

}
function calculateNurbsCurve(controlPoints,weights, knots, segment) {
    const degree = knots.length - controlPoints.length - 1; // 计算曲线的阶数
  
    // 计算节点向量的范围
    const uMin = knots[degree];
    const uMax = knots[knots.length - 1 - degree];
  
    const points = []; // 存储计算的曲线上的点
  
    // 计算每个参数u对应的曲线上的点
    for (let i = 0; i <= 1; i+=segment) {
      const u = uMin + (uMax - uMin) * i;
  
      // 初始化点的坐标
      let x = 0;
      let y = 0;
      let z = 0;
  
      // 计算每个控制点对应的基函数值和权重
      for (let j = 0; j < controlPoints.length; j++) {
        const basis = calculateBasis(j, degree, u, knots); // 计算基函数值
        const weight = weights[j];
  
        // 根据基函数值、权重和控制点位置计算点的坐标
        x += basis * weight * controlPoints[j][0];
        y += basis * weight * controlPoints[j][1];
        z += basis * weight * controlPoints[j][2];
      }
      
      // 将计算得到的点添加到结果数组中
      points.push([x, y, z]);
    }
    return points;
  }
  
  // 计算基函数值
  function calculateBasis(index, degree, u, knots) {
    if (degree === 0) {
      return (u >= knots[index] && u < knots[index + 1]) ? 1 : 0;
    }
  
    const denominator1 = knots[index + degree] - knots[index];
    const denominator2 = knots[index + degree + 1] - knots[index + 1];
  
    const numerator1 = u - knots[index];
    const numerator2 = knots[index + degree + 1] - u;
  
    const basis1 = (denominator1 !== 0) ? (numerator1 / denominator1) * calculateBasis(index, degree - 1, u, knots) : 0;
    const basis2 = (denominator2 !== 0) ? (numerator2 / denominator2) * calculateBasis(index + 1, degree - 1, u, knots) : 0;
  
    return basis1 + basis2;
  }
  export default NURBSObject;