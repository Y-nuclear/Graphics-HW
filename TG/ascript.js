const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

const canvas = document.getElementById("canvas0");

var tg = new TG();

var loopCount = 0;


function addXYZ(tg) {
    tg.addObject3D(new TGObject3D.Line([0, 0, 0], [1, 0, 0], [1, 0, 0])); // X 轴，红色
    tg.addObject3D(new TGObject3D.Line([0, 0, 0], [0, 1, 0], [0, 1, 0])); // Y 轴，绿色
    tg.addObject3D(new TGObject3D.Line([0, 0, 0], [0, 0, 1], [0, 0, 1])); // Z 轴，蓝色
}


function loop() {
    requestAnimationFrame(loop);
    loopCount++;
    tg.rander();
    // console.log(loopCount);
}

// 页面加载完成后初始化
window.onload = function () {
    tg.init(canvas);
    tg.camera = TGCamera.MouseCamera(canvas);
    addXYZ(tg);
    loop();
};
