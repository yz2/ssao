import Renderer from './renderer.js';

import constantVert from '../../shaders/constantAmbient/diffuse-vert.js';
import constantFrag from '../../shaders/constantAmbient/phong-frag.js';
import sphereVert from '../../shaders/cryEngineSSAO/diffuse-vert.js';
import sphereFrag from '../../shaders/cryEngineSSAO/cryEngineSSAO-frag.js';


function onWindowResize(widthRatio, heightRatio) {
	this.sceneWidth = window.innerWidth * widthRatio;
	this.sceneHeight = window.innerHeight * heightRatio;
	this.renderer.setSize(this.sceneWidth, this.sceneHeight);
	this.depthStorageTarget.setSize(this.sceneWidth, this.sceneHeight);
	this.firstPassCamera.ascpect = this.sceneWidth / this.sceneHeight;
	this.effectsPassCamera.aspect = this.sceneWidth / this.sceneHeight;
	this.firstPassCamera.updateProjectionMatrix();
	this.effectsPassCamera.updateProjectionMatrix();
}


function animate(renderer) {
	requestAnimationFrame( animate );
	
	renderer.uniforms['cameraNear'] = {
		value: renderer.effectsPassCamera.near
	}
	renderer.uniforms['cameraFar'] = {
		value: renderer.effectsPassCamera.far
	}
	renderer.render();
}


function prepareUniforms(renderer, numSamples, hemisphere = false) {
	var samples = [];
	var randomZ = hemisphere ? function() { return Math.random(); } 
							 : function() { return Math.random() * 2.0 - 1.0; };
	for (var i = 0; i < numSamples; i++) {
		var newSample;
		do {
	    	newSample = [Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, randomZ()];
		} while (newSample[0] * newSample[0] + newSample[1] * newSample[1] + newSample[2] * newSample[2] > 1.0);
		
	    // Normalize sample to direction on unit sphere
	    var sq_sum = 0.0;
	    var j;
	    for (j = 0; j < 3; j++) {
	        sq_sum += newSample[j] * newSample[j];
	    }
	    
	    // Choose r given theta to complete polar coords of sampled point
	    var radius = Math.random();
	    
	    // Later samples should tend to sample further away.
	    var scale = i / numSamples;
	    scale = 0.1 + scale * scale * 0.9;
	    for (var j = 0; j < 3; j++) {
	        newSample[j] /= Math.sqrt(sq_sum);
	        newSample[j] *= radius * scale;
	    }

	 	 samples.push(new THREE.Vector3(newSample[0], newSample[1], newSample[2]));
	    
	}
	renderer.uniforms['samples'] = {
	    t: 'v3v',
	    value: samples
	};
}


function renderMain(widthRatio = 1.0, heightRatio = 0.8, numSamples = 512.0, 
					aoType = 'constant', fileAddr = '../scenes/house2.obj') {
	// 'aoType' can be 'constant', 'cryEngine', or 'starCraft'
	
	var vertexShaderSource = aoType == 'constant' ? constantVert : sphereVert;
	var fragmentShaderSource = aoType == 'constant' ? constantFrag : sphereFrag;
	
	var basicRenderer = new Renderer();
	var Detector = basicRenderer.initBrowserSupport();
	if (Detector.webgl) {
	    // Initiate function or other initializations here
	    window.addEventListener('resize', function() {
	    	onWindowResize(widthRatio, heightRatio);
	    });
	    basicRenderer.loadScene(fileAddr, vertexShaderSource, fragmentShaderSource);
	    
	    prepareUniforms(basicRenderer, numSamples);
	    animate(basicRenderer);
	} else {
	    var warning = Detector.getWebGLErrorMessage();
	    document.getElementById('container').appendChild(warning);
	}
}

renderMain();