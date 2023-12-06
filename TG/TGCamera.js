
const TGCamera = {
    MouseCamera: function (canvas) {
        var isDragging = false;
        var lastMouseX;
        var lastMouseY;

        var cameraPosition = vec3.fromValues(0.2, 0.2, 1.5);
        var targetPosition = vec3.fromValues(0, 0, 0);

        canvas.addEventListener('mousedown', (event) => {
            isDragging = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        });
        canvas.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const deltaX = event.clientX - lastMouseX;
                const deltaY = event.clientY - lastMouseY;

                const sensitivity = 0.01;
                const yaw = deltaX * sensitivity;
                const pitch = deltaY * sensitivity;

                vec3.rotateY(cameraPosition, cameraPosition, targetPosition, -yaw);
                vec3.rotateX(cameraPosition, cameraPosition, targetPosition, -pitch);

                // updateViewMatrix();

                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }
        });
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        function camera(gl) {
            const modelViewMatrix = mat4.create();
            mat4.lookAt(modelViewMatrix, cameraPosition, targetPosition, [0, 1, 0]);

            const projectionMatrix = mat4.create();
            mat4.perspective(projectionMatrix, 90 * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.1, 100);

            return { modelViewMatrix, projectionMatrix };
        }

        return camera;
    },
}