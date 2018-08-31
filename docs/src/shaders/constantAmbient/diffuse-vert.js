var vertexShaderSource = `
    attribute vec3 position;
    attribute vec3 normal;
    
    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    varying vec3 fPosition;
    varying vec3 fNormal;
    
    void main() {
        fPosition = vec3(0.0);
        fNormal = vec3(0.0);
        gl_Position = vec4(vec3(0.0), 1.0);
        fPosition = vec3(modelMatrix * vec4(position, 1.0));
        fNormal = vec3(modelMatrix * vec4(normal, 0.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export { vertexShaderSource as default};