precision highp float;

uniform vec3 cameraPosition;
uniform vec3 lPosition;
uniform vec3 lIntensity;

varying vec3 fPosition;
varying vec3 fNormal;

void main() {
    // TODO: Part 5.2
    gl_FragColor = vec4(vec3(0.0), 1.0);
    float ambientCoeff = 0.2;
    vec3 ambientIntensity = vec3(1.0);
    float diffuseCoeff = 0.8;
    float specularCoeff = 0.25;
    float p = 64.0;
    vec4 ambientColor = ambientCoeff * vec4(ambientIntensity, 1.0);
    float rSquared = pow(distance(lPosition, fPosition), 2.0);
    vec4 diffuseColor = diffuseCoeff * vec4(lIntensity / rSquared * max(dot(fNormal, normalize(lPosition - fPosition)), 0.0), 1.0);
    vec3 h = normalize(normalize(cameraPosition - fPosition) + normalize(lPosition - fPosition)); 
    vec4 specularColor = specularCoeff * vec4(lIntensity / rSquared * max(pow(dot(fNormal, h), p), 0.0), 1.0);
    gl_FragColor = ambientColor + diffuseColor + specularColor;
}