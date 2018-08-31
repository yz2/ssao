import Renderer from './renderer.js';

import vertexShaderSource from '../../shaders/constantAmbient/diffuse-vert.js';
import fragmentShaderSource from '../../shaders/constantAmbient/phong-frag.js';

var numSamples = 512.0;

function onWindowResize() {
	this.sceneWidth = window.innerWidth/1.5;
	this.sceneHeight = window.innerHeight/1.5;
	this.depthStorageTarget.setSize(this.sceneWidth, this.sceneHeight);
	this.firstPassCamera.ascpect = this.sceneWidth / this.sceneHeight;
	this.effectsPassCamera.aspect = this.sceneWidth / this.sceneHeight;
	this.firstPassCamera.updateProjectionMatrix();
	this.effectsPassCamera.updateProjectionMatrix();
}
    	

function animate(renderer) {
	requestAnimationFrame( animate );
	
	basicRenderer.uniforms['cameraNear'] = {
		value: basicRenderer.effectsPassCamera.near
	}
	basicRenderer.uniforms['cameraFar'] = {
		value: basicRenderer.effectsPassCamera.far
	}
	basicRenderer.render();
}

function prepareUniforms(renderer) {
    
//     // For SSAO shaders
// 	var samples = [];
// 	for (var i = 0; i < numSamples; i++) {
// 		var newSample;
// 		do {
// 	    	newSample = [Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0];
// 		} while (newSample[0] * newSample[0] + newSample[1] * newSample[1] + newSample[2] * newSample[2] > 1.0);
		
// 	    // Normalize sample to direction on unit sphere
// 	    var sq_sum = 0.0;
// 	    var j;
// 	    for (j = 0; j < 3; j++) {
// 	        sq_sum += newSample[j] * newSample[j];
// 	    }
	    
// 	    // Choose r given theta to complete polar coords of sampled point
// 	    var radius = Math.random();
	    
// 	    // Later samples should tend to sample further away.
// 	    var scale = i / numSamples;
// 	    scale = 0.1 + scale * scale * 0.9;
// 	    for (var j = 0; j < 3; j++) {
// 	        newSample[j] /= Math.sqrt(sq_sum);
// 	        newSample[j] *= radius * scale;
// 	    }

// 	 	 samples.push(new THREE.Vector3(newSample[0], newSample[1], newSample[2]));
	    
// 	}
// 	console.log(samples);
// 	_uniforms['samples'] = {
// 	    t: 'v3v',
// 	    value: samples
// 	};
    return;
}

var basicRenderer = new Renderer("ConstCanvas");
var Detector = basicRenderer.initBrowserSupport();
if (Detector.webgl) {
    // Initiate function or other initializations here
    window.addEventListener('resize', onWindowResize);
    basicRenderer.loadScene('../src/lib/scenes/house2.obj', vertexShaderSource, fragmentShaderSource);
    
    prepareUniforms(basicRenderer);
    animate(basicRenderer);
} else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
