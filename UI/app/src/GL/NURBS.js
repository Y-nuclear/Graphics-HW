import Object3D from "../database/Object3D";
class NURBSObject extends Object3D{
    constructor(){
        super();
        this.type = 'NURBSObject';
        this.degree = 3;
        this.knots = [];
        this.controlPoints = [];
        this.weights = [];
        this.u = 0;
        this.v = 0;
        this.uMin = 0;
        this.uMax = 0;
        this.vMin = 0;
        this.vMax = 0;
        this.uSegments = 0;
        this.vSegments = 0;
        this.uClosed = false;
        this.vClosed = false;
    }
}