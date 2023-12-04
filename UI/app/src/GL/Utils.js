    
//着色器初始化
const initShaders = (gl, vshader, fshader) => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vshader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fshader);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    gl.program = program;
    return true;
}
    function createShader(gl, type, source) {
        //根据着色类型创建着色对象
        const shader = gl.createShader(type);
        //将着色器源文件传入着色器对象中
        gl.shaderSource(shader, source);
        //编译着色器对象
        gl.compileShader(shader);
        //返回着色器对象
        return shader;
    }
    // 创建程序
    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        //程序对象和webgl上下文对象相关联 
        gl.linkProgram(program);
        return program;
    }
export { initShaders };