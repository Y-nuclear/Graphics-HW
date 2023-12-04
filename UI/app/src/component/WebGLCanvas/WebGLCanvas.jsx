import React, { useRef, useEffect } from 'react';
import {initShaders} from '../Utils.js';
function WebGLCanvas() {
    const canvasRef = useRef(null);
    // 创建着色器
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');

        if (gl === null) {
            alert('Unable to initialize WebGL. Your browser may not support it.');
            return;
        } else {
            console.log('WebGL initialized.');
        }

        // WebGL 初始化代码...
        // 设置清除颜色为黑色，不透明
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 清除颜色缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 顶点着色器和片段着色器的源代码
        const vertexShaderSource = `
    attribute vec4 aVertexPosition;

    void main() {
        gl_Position = aVertexPosition;
    }
`;

        const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uFragmentColor;

    void main() {
        gl_FragColor = uFragmentColor;
    }
`;

        initShaders(gl, vertexShaderSource, fragmentShaderSource)
        

        const positionAttributeLocation = gl.getAttribLocation(gl.program, "aVertexPosition");//获取attribute变量的存储位置
        const positionBuffer = gl.createBuffer();//创建缓冲区
        //定义几何体数据
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);//绑定缓冲区

        // 例子：一个三角形的顶点数据
        const positions = [
            0.0, 0.5, 
            -0.5, -0.5, 
            0.5, -0.5
        ]; 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);//将数据写入缓冲区
        gl.enableVertexAttribArray(positionAttributeLocation);//开启attribute变量
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);//将缓冲区绑定到attribute变量上
        //设置视口（Viewport）
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        //启用程序对象
        
        gl.drawArrays(gl.TRIANGLES, 0, 3); // 假设绘制的是一个三角形


    }, []);

    return (
        <canvas ref={canvasRef} width="640" height="480" />
    );
}

export default WebGLCanvas;
