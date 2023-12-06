const TGObject3D = {
    Line: class {
        constructor(startPoint, endPoint, color) {
            this.startPoint = startPoint;
            this.endPoint = endPoint;
            this.color = color;
        }
        display(tg) {
           var startPoint = this.startPoint;
           var endPoint = this.endPoint;
           var color = this.color;

            // 更新顶点坐标数据和颜色数据
            const positionData = [
                startPoint[0], startPoint[1], startPoint[2],
                endPoint[0], endPoint[1], endPoint[2]
            ];

            const colorData = [
                color[0], color[1], color[2],
                color[0], color[1], color[2]
            ];

            // 更新顶点缓冲区和颜色缓冲区的数据
            tg.gl.bindBuffer(tg.gl.ARRAY_BUFFER, tg.buffers.position);
            tg.gl.bufferData(tg.gl.ARRAY_BUFFER, new Float32Array(positionData), tg.gl.STATIC_DRAW);
            tg.gl.vertexAttribPointer(tg.shaderProgram.aPositionLocation, 3, tg.gl.FLOAT, false, 0, 0);

            tg.gl.bindBuffer(tg.gl.ARRAY_BUFFER, tg.buffers.color);
            tg.gl.bufferData(tg.gl.ARRAY_BUFFER, new Float32Array(colorData), tg.gl.STATIC_DRAW);
            tg.gl.vertexAttribPointer(tg.shaderProgram.aColorLocation, 3, tg.gl.FLOAT, false, 0, 0);

            tg.gl.drawArrays(tg.gl.LINES, 0, 2);
        }
        
        /** 绕指定轴旋转 */
        rotate(axis, angle) {
            // TODO
            // const startPoint = this.startPoint;
            // const endPoint = this.endPoint;

            // const rotateMatrix = mat4.create();
            // mat4.fromRotation(rotateMatrix, angle, axis);

            // vec3.transformMat4(startPoint, startPoint, rotateMatrix);
            // vec3.transformMat4(endPoint, endPoint, rotateMatrix);
            
            // this.startPoint = startPoint;
            // this.endPoint = endPoint;
        }
    }
};