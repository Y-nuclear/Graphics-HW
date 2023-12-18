const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

const canvas = document.getElementById("canvas0");

var tg = new TG();
var triangle;


function addCube(tg) {
    var colors = [
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
    ];

    // 底部
    tg.addObject3D(new TGObject3D.Triangle(tg, [
        1, -1, 1,
        -1, -1, 1,
        -1, -1, -1,
    ], colors));
    tg.addObject3D(new TGObject3D.Triangle(tg, [
        -1, -1, -1,
        1, -1, -1,
        1, -1, 1,
    ], colors));
    // 顶部
    tg.addObject3D(new TGObject3D.Triangle(tg, [
        1, 1, 1,
        -1, 1, -1,
        -1, 1, 1,
    ], colors));
    tg.addObject3D(new TGObject3D.Triangle(tg, [
        -1, 1, -1,
        1, 1, 1,
        1, 1, -1,
    ], colors));

}

var loopCount = 0;
function loop() {
    requestAnimationFrame(loop);
    loopCount++;

    var mat = mat4.create();
    mat4.rotateY(mat, mat, 0.02);
    // mat4.translate(mat, mat, [0.005, 0, 0]);
    // mat4.scale(mat, mat, [1.001, 1.001, 1.001]);
    triangle.apply(mat);

    tg.rander();
}

// 页面加载完成后初始化
window.onload = function () {
    tg.init(canvas);
    tg.camera = TGCamera.MouseCamera(canvas);
    tg.addObject3D(new TGObject3D.XYZ(tg, [0, 0, 0]));

    var vertices = [
        0.0, 0.0, 0.0,
        0.7, 0.3, 0.0,
        -0.6, 0.3, 0.4
    ];
    var colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
    ];
    triangle = new TGObject3D.Triangle(tg, vertices, colors);
    tg.addObject3D(triangle);

    addCube(tg);

    tg.gl.uniform1i(tg.shaderProgram.uLightModel, 1);
    tg.gl.uniform3fv(tg.shaderProgram.uLightDir, [-1, -1, 0]);

    loop();
};
