
function case1Init(tg) {
    tg.goutouImage = null;
    var image = new Image();
    image.onload = () => {
        tg.goutouImage = image;
    }
    image.src = './goutou.png';
}
function case1Animate(tg, frame) {
    tg.clear();
    tg.drawXYZ();

    if (tg.goutouImage) {
        tg.pushModelMatrix();
        {
            var vertices = [
                -0.5, 0.5, 0.0,  // 左上角
                -0.5, -0.5, 0.0,  // 左下角
                0.5, 0.5, 0.0,  // 右上角
                0.5, -0.5, 0.0,   // 右下角
            ];
            var texCoords = [
                0.0, 0.0,  // 左上角
                0.0, 1.0,  // 左下角
                1.0, 0.0,  // 右上角
                1.0, 1.0,   // 右下角
            ];

            tg.translate(0.2, 0.5, 0.2);
            tg.rotate(45, 0, 1, 0);
            var scale = 1 + Math.sin(frame / 50) / 5;
            tg.scale(scale, scale, scale);

            tg.drawImageTexture(vertices, texCoords, tg.goutouImage);
            tg.drawText("狗头", [-0.2, -0.8, 0], "#ffff00", 0.1, 1);
        }
        tg.popModelMatrix();
    }
}

function case2Init(tg) {
}
function case2Animate(tg, frame) {
    tg.clear();
    // tg.drawXYZ();

    var vertices = [
        0.0, 0.0, 0.0,  // 0
        1.0, 0.0, 0.0,  // 1
        1.0, 1.0, 0.0,  // 2
        0.0, 1.0, 0.0,  // 3
    ];
    var colors = [
        1.0, 0.0, 0.0,  // 0
        0.0, 1.0, 0.0,  // 1
        0.0, 0.0, 1.0,  // 2
        1.0, 1.0, 1.0,  // 3
    ];
    var indices = [
        0, 1, 2,
        0, 2, 3,
    ];

    tg.pushModelMatrix();
    {
        tg.translate(-0.5, -0.5, 0);
        tg.drawColorFaces(vertices, colors, indices);
    }
    tg.popModelMatrix();
}

function case3Init(tg) {
}
function case3Animate(tg, frame) {
}

export {
    case1Init, case1Animate,
    case2Init, case2Animate,
    case3Init, case3Animate,
};