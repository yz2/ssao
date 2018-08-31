import Renderer from './renderer.js';

import vertexShaderSource from '../../shaders/HBAO/diffuse-vert.js';
import fragmentShaderSource from '../../shaders/HBAO/HBAO-frag.js';

function onWindowResize() {
	this.sceneWidth = window.innerWidth/1.5;
	this.sceneHeight = window.innerHeight/1.5;
	this.renderer.setSize(this.sceneWidth, this.sceneHeight);
	this.depthStorageTarget.setSize(this.sceneWidth, this.sceneHeight);
	this.firstPassCamera.ascpect = this.sceneWidth / this.sceneHeight;
	this.effectsPassCamera.aspect = this.sceneWidth / this.sceneHeight;
	this.effectsPassCamera.updateProjectionMatrix();
	var inverseProjectionMatrix = new THREE.Matrix4();
	inverseProjectionMatrix.getInverse(basicRenderer.effectsPassCamera.projectionMatrix);
	basicRenderer.uniforms['inverseProjectionMatrix'] = {
	    t: 'mat4',
	    value: inverseProjectionMatrix
	};
}
    	

function animate(renderer) {
	requestAnimationFrame( animate );
	
	if (viewAnimate("HBAOCanvas")) {
		basicRenderer.uniforms['cameraNear'] = {
			value: basicRenderer.effectsPassCamera.near
		};
		basicRenderer.uniforms['cameraFar'] = {
			value: basicRenderer.effectsPassCamera.far
		};
		
		var inverseProjectionMatrix = new THREE.Matrix4();
		inverseProjectionMatrix.getInverse(basicRenderer.effectsPassCamera.projectionMatrix);
		basicRenderer.uniforms['inverseProjectionMatrix'] = {
		    t: 'mat4',
		    value: inverseProjectionMatrix
		};
		basicRenderer.render();
	} else {
		setTimeout(function() {return false;}, 1000);
	}
}

function prepareUniforms(renderer) {
	var inverseProjectionMatrix = new THREE.Matrix4();
	inverseProjectionMatrix.getInverse(basicRenderer.effectsPassCamera.projectionMatrix);
	basicRenderer.uniforms['inverseProjectionMatrix'] = {
	    t: 'mat4',
	    value: inverseProjectionMatrix
	};
}

var basicRenderer = new Renderer("HBAOCanvas");
var Detector = basicRenderer.initBrowserSupport();
if (Detector.webgl) {
    // Initiate function or other initializations here
    window.addEventListener('resize', onWindowResize);
    basicRenderer.loadScene('./src/lib/scenes/house2.obj', vertexShaderSource, fragmentShaderSource);
    
    prepareUniforms(basicRenderer);
    animate(basicRenderer);
} else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
