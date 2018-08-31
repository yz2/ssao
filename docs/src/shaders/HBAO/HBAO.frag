precision highp float;

#define M_PI 3.1415926535897932384626433832795
#define NUM_SAMPLE_DIRS 1.0
#define NUM_SAMPLE_STEPS 1.0
#define STEP_SIZE 0.2

uniform sampler2D uTexDepthBuffer;
uniform float cameraNear;
uniform float cameraFar;

uniform mat4 projectionMatrix;
uniform mat4 inverseProjectionMatrix;

varying vec3 fPosition;
varying vec3 fNormal;

float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}

float readDepth( sampler2D depthSampler, vec2 coord ) {
	float fragCoordZ = texture2D( depthSampler, coord ).x;
 	float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
 	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

vec3 random (vec2 st) {
    float term1 = sin(dot(st.xy, vec2(12.9898,78.233)))*43765.769;
    float term2 = sin(dot(st.xy, vec2(12.9898,78.233)))*57593.023850;
    float term3 = sin(dot(st.xy, vec2(12.9898,78.233)))*78464.36792;
    return normalize(vec3(term1 - floor(term1), term2 - floor(term2), term3 - floor(term3)));
}
			
void main() {
    float twoPi = 2.0 * M_PI;
    float fractionalAngle = twoPi / NUM_SAMPLE_DIRS;
    vec3 viewVector = normalize(fPosition);
    vec3 randomVector = random(fPosition.xy);
    vec3 initialSampleDir = randomVector - viewVector * dot(viewVector, randomVector);
    gl_FragColor = vec4(fNormal, 1.0);
    float avgTheta = 0.0;
    for (float i = 0.0; i < NUM_SAMPLE_DIRS; i += 1.0) {
        vec3 sampleDir = initialSampleDir * cos(i * fractionalAngle) + 
                         cross(viewVector, initialSampleDir) * sin(i * fractionalAngle) +
                         viewVector * dot(viewVector, initialSampleDir) * (1.0 - cos(i * fractionalAngle));
        // if (rVector.x >= 0.0) {
            // gl_FragColor = vec4(vec3(0.5), 1.0);
            // gl_FragColor = vec4(vec3(sampleDir.x), 1.0);
        // }
        float currentTheta = M_PI;
        for (float j = 0.0; j < NUM_SAMPLE_STEPS; j += 1.0) {
            vec3 samplePosition = fPosition + (j * STEP_SIZE * sampleDir);
            vec4 offset = vec4(samplePosition, 1.0); 
            offset = projectionMatrix * offset;
            offset.xyz /= offset.w;               
            offset.xyz  = offset.xyz * 0.5 + 0.5; 
            float sampleDepth = readDepth(uTexDepthBuffer, offset.xy);
            offset = inverseProjectionMatrix * vec4(offset.x, offset.y, sampleDepth, 1.0);
            vec3 horizonPosition = offset.xyz / offset.w;
            vec3 horizonVector = normalize(horizonPosition - fPosition);
            float theta = acos(dot(fNormal, horizonVector));
            // if (theta > M_PI / 4.0) {
                // gl_FragColor = vec4(sampleDir, 1.0);
            // }
            if (theta < currentTheta) {
                currentTheta = theta;
            }
        }
        avgTheta += currentTheta;
    }
    avgTheta /= NUM_SAMPLE_DIRS;
    float occlusion = cos(avgTheta);
    float brightness = 1.0 - occlusion;
    // gl_FragColor = vec4(vec3(brightness), 1.0);
}