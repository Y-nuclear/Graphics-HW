const TGObject3D = {

    Set: class {
        constructor(obj3dList) {
            this.obj3dList = obj3dList;
        }
        display(tg) {
            this.obj3dList.forEach(obj3d => {
                obj3d.display(tg);
            });
        }
        apply(mat) {
            this.obj3dList.forEach(obj3d => {
                obj3d.apply(mat);
            });
        }
    },

    Line: class {
        constructor(tg, startPoint, endPoint, color) {
            var gl = tg.gl;
            this.startPoint = startPoint;
            this.endPoint = endPoint;
            this.color = color;

            this.positionData = [
                startPoint[0], startPoint[1], startPoint[2],
                endPoint[0], endPoint[1], endPoint[2]
            ];
            this.positionBuffer = gl.createBuffer();

            this.colorData = [
                color[0], color[1], color[2],
                color[0], color[1], color[2]
            ];
            this.colorBuffer = gl.createBuffer();

            this.normalData = [0, 0, 0, 0, 0, 0];
            this.normalBuffer = gl.createBuffer();
        }
        display(tg) {
            var gl = tg.gl;
            var shaderProgram = tg.shaderProgram;

            // 更新顶点缓冲区和颜色缓冲区的数据
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionData), gl.STATIC_DRAW);
            gl.vertexAttribPointer(shaderProgram.aPositionLocation, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorData), gl.STATIC_DRAW);
            gl.vertexAttribPointer(shaderProgram.aColorLocation, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
            gl.vertexAttribPointer(shaderProgram.aNormalLocation, 3, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.LINES, 0, 2);
        }
        apply(mat) {
            var point = vec3.fromValues(this.startPoint[0], this.startPoint[1], this.startPoint[2]);
            vec3.transformMat4(point, point, mat);
            this.startPoint = [point[0], point[1], point[2]];
            point = vec3.fromValues(this.endPoint[0], this.endPoint[1], this.endPoint[2]);
            vec3.transformMat4(point, point, mat);
            this.endPoint = [point[0], point[1], point[2]];
        }
    },
    XYZ: class {
        constructor(tg, Opoint) {
            this.Opoint = Opoint;
            this.x = new TGObject3D.Line(tg, Opoint, [1, 0, 0], [1, 0, 0]);
            this.y = new TGObject3D.Line(tg, Opoint, [0, 1, 0], [0, 1, 0]);
            this.z = new TGObject3D.Line(tg, Opoint, [0, 0, 1], [0, 0, 1]);
            this.obj3dList = [this.x, this.y, this.z];
            this.set = new TGObject3D.Set(this.obj3dList);
        }
        display(tg) {
            this.set.display(tg);
        }
        apply(mat) {
            this.set.apply(mat);
        }
    },

    Triangle: class {
        /**
        例如 \
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
        */
        constructor(tg, vertices, colors) {
            this.tg = tg;
            var gl = this.tg.gl;

            this.vertices = vertices;
            this.colors = colors;
            this.calNormal();

            this.triangleVertexPositionBuffer = gl.createBuffer();
            this.triangleVertexPositionBuffer.itemSize = 3;
            this.triangleVertexPositionBuffer.numItems = 3;

            this.triangleVertexColorBuffer = gl.createBuffer();
            this.triangleVertexColorBuffer.itemSize = 3;
            this.triangleVertexColorBuffer.numItems = 3;

            this.triangleNormalBuffer = gl.createBuffer();
            this.triangleNormalBuffer.itemSize = 3;
            this.triangleNormalBuffer.numItems = 3;
        }
        calNormal() {
            var vertices = this.vertices;
            this.normals = [];
            var v1 = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
            var v2 = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
            var v3 = vec3.fromValues(vertices[6], vertices[7], vertices[8]);
            var v12 = vec3.create();
            var v13 = vec3.create();
            vec3.subtract(v12, v2, v1);
            vec3.subtract(v13, v3, v1);
            var normal = vec3.create();
            vec3.cross(normal, v12, v13);
            vec3.normalize(normal, normal);
            this.normals.push(normal[0]);
            this.normals.push(normal[1]);
            this.normals.push(normal[2]);
            this.normals.push(normal[0]);
            this.normals.push(normal[1]);
            this.normals.push(normal[2]);
            this.normals.push(normal[0]);
            this.normals.push(normal[1]);
            this.normals.push(normal[2]);
        }
        display(tg) {
            var gl = tg.gl;
            var shaderProgram = tg.shaderProgram;

            this.calNormal();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.vertexAttribPointer(shaderProgram.aPositionLocation, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
            gl.vertexAttribPointer(shaderProgram.aColorLocation, this.triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
            gl.vertexAttribPointer(shaderProgram.aNormalLocation, this.triangleNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
        }
        apply(mat) {
            var vertices = [];
            var point = vec3.create();
            for (var i = 0; i < this.vertices.length; i += 3) {
                point = vec3.fromValues(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]);
                vec3.transformMat4(point, point, mat);
                vertices.push(point[0]);
                vertices.push(point[1]);
                vertices.push(point[2]);
            }
            this.vertices = vertices;
        }
    },
};