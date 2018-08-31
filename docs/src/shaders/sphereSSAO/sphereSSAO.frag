precision highp float;

uniform vec3 cameraPosition;
uniform vec3 lPosition;
uniform vec3 lIntensity;
uniform sampler2D uTexDepthBuffer;
uniform float cameraNear;
uniform float cameraFar;

uniform vec3 samples[512];
uniform mat4 projectionMatrix;

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
    return normalize(vec3(term1 - floor(term1), term2 - floor(term2), 0.0));
}
			
void main() {
    float radius = 2.0;
    float bias = 0.0000025;

    vec3 rotationVec = random(fPosition.xy);
    vec3 tangent = normalize(rotationVec - fNormal * dot(rotationVec, fNormal));
    vec3 bitangent = cross(fNormal, tangent);
    mat3 TBN       = mat3(tangent, bitangent, fNormal);
    float occlusion = 0.0;
    for(int i = 0; i < 512; ++i)
    {
        vec3 sample = TBN * samples[i];
        sample = fPosition + sample * radius; 
        vec4 offset = vec4(sample, 1.0); 
        offset = projectionMatrix * offset;
        offset.xyz /= offset.w;               
        offset.xyz  = offset.xyz * 0.5 + 0.5; 
        float sampleDepth = readDepth(uTexDepthBuffer, offset.xy);
        float rangeCheck = smoothstep(0.0, 1.0, radius / abs(viewZToOrthographicDepth(fPosition.z, cameraNear, cameraFar) - sampleDepth));
        float actual_depth = viewZToOrthographicDepth(sample.z, cameraNear, cameraFar);
        occlusion += (sampleDepth <= actual_depth + bias ? 1.0 : 0.0) * rangeCheck;
    }
    occlusion = 1.0 - (occlusion / 512.0);
    gl_FragColor = vec4(vec3(occlusion), 1.0);
}