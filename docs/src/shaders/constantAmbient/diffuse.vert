attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 fPosition;
varying vec3 fNormal;

varying vec2 fUv;

void main() {
	// TODO: Part 5.1
	fUv = uv;
    fPosition = vec3(0.0);
    fNormal = vec3(0.0);
    gl_Position = vec4(vec3(0.0), 1.0);
    fPosition = vec3(modelMatrix * vec4(position, 1.0));
    fNormal = vec3(modelMatrix * vec4(normal, 0.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}