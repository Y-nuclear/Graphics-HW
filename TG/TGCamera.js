
const TGCamera = {
    MouseCamera: function (canvas) {
        var isDragging = false;
        var lastMouseX;
        var lastMouseY;

        var cameraPosition = vec3.fromValues(0.2, 0.2, 2.5);
        var targetPosition = vec3.fromValues(0, 0, 0);
        var cameraZoom = 1.0;

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

                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }
        });
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
        canvas.addEventListener('wheel', (event) => {
            const zoomFactor = 0.0005;
            cameraZoom += event.deltaY * zoomFactor;
        });

        function camera(gl) {
            const modelViewMatrix = mat4.create();
            var cameraPositionZoomed = vec3.create();
            vec3.scale(cameraPositionZoomed, cameraPosition, cameraZoom);
            mat4.lookAt(modelViewMatrix, cameraPositionZoomed, targetPosition, [0, 1, 0]);

            const projectionMatrix = mat4.create();
            mat4.perspective(projectionMatrix, 90 * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.1, 100);

            return { modelViewMatrix, projectionMatrix };
        }

        return camera;
    },
}