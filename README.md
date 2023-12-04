# Graphics-HW
ZJU Graphics Homework in 2023

1. UI/app/src/component/Utils.js

   封装 了着色器初始化

   使用：

   ```js
   import {initShaders} from '../Utils.js';        
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
   ```

   
