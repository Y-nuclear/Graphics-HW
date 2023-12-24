
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
                0.0, 0.0, 0.0,  // 0 正方形左下角
                1.0, 0.0, 0.0,  // 1 正方形右下角
                1.0, 1.0, 0.0,  // 2 正方形右上角
                0.0, 1.0, 0.0,  // 3 正方形左上角
            ];
            var texCoords = [
                0.0, 1.0,  // 0 图片左下角
                1.0, 1.0,  // 1 图片右下角
                1.0, 0.0,  // 2 图片右上角
                0.0, 0.0,  // 3 图片左上角
            ];
            var indices = [
                0, 1, 2,
                0, 2, 3,
            ];

            tg.translate(0.2, 0.5, 0.2);
            tg.rotate(45, 0, 1, 0);
            var scale = 1 + Math.sin(frame / 50) / 5;
            tg.scale(scale, scale, scale);

            tg.translate(-0.5, -0.5, 0);
            tg.drawImageTextureFaces(vertices, texCoords, tg.goutouImage, indices);
            tg.drawText("狗头", [-0.2, -0.8, 0], "#ffff00", 0.1, 1);
        }
        tg.popModelMatrix();
    }
}

function case2Init(tg) {

}
function case2Animate(tg, frame) {
    tg.clear();
    tg.drawXYZ();

    tg.pushModelMatrix();
    {
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