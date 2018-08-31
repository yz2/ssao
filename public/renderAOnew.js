import Renderer from '../src/lib/renderer/renderer.js';

import vertexShaderSource from '../src/shaders/constantAmbient/diffuse-vert.js';
import fragmentShaderSource from '../src/shaders/constantAmbient/phong-frag.js';


function animate(renderer) {
	requestAnimationFrame( function() { animate(renderer); } );
	
	renderer.uniforms['cameraNear'] = {
		value: renderer.effectsPassCamera.near
	}
	renderer.uniforms['cameraFar'] = {
		value: renderer.effectsPassCamera.far
	}
	renderer.render();
}

function onWindowResize(renderer) {
	renderer.sceneWidth = window.innerWidth/2;
	renderer.sceneHeight = window.innerHeight/3;
	renderer.renderer.setSize(renderer.sceneWidth, renderer.sceneHeight);
	renderer.depthStorageTarget.setSize(renderer.sceneWidth, renderer.sceneHeight);
	renderer.firstPassCamera.ascpect = renderer.sceneWidth / renderer.sceneHeight;
	renderer.effectsPassCamera.aspect = renderer.sceneWidth / renderer.sceneHeight;
	renderer.firstPassCamera.updateProjectionMatrix();
	renderer.effectsPassCamera.updateProjectionMatrix();
}

function renderMain() {
	// 'aoType' can be 'constant', 'cryEngine', or 'starCraft'
	
	var numSamples = 512.0;
	
	    	
	function prepareUniforms(renderer) {
	    return;
	}
	
	var basicRenderer = new Renderer();
	var Detector = basicRenderer.initBrowserSupport();
	if (Detector.webgl) {
	    // Initiate function or other initializations here
	    window.addEventListener('resize', function() { onWindowResize(this); } );
	    basicRenderer.loadScene('../src/lib/scenes/house2.obj', vertexShaderSource, fragmentShaderSource);
	    
	    prepareUniforms(basicRenderer);
	    animate(basicRenderer);
	} else {
	    var warning = Detector.getWebGLErrorMessage();
	    document.getElementById('container').appendChild(warning);
	}

}

renderMain();