import Renderer from './renderer.js';

import vertexShaderSource from '../../shaders/constantAmbient/diffuse-vert.js';
import fragmentShaderSource from '../../shaders/constantAmbient/phong-frag.js';

class RenderInterface {
	constructor() {
		// 'aoType' can be 'constant', 'cryEngine', or 'starCraft'
		
		// var scripts = document.getElementsByTagName('script');
		// var wid = scripts[scripts.length-1].getAttribute('wid');
		
		this.numSamples = 512.0;
		
		this.basicRenderer = new Renderer("CECanvas");
		this.Detector = this.basicRenderer.initBrowserSupport();
		if (this.Detector.webgl) {
		    // Initiate function or other initializations here
		    // window.addEventListener('resize', this.onWindowResize );
		    this.basicRenderer.loadScene('../src/lib/scenes/house2.obj', vertexShaderSource, fragmentShaderSource);
		    
		    this.prepareUniforms();
		} else {
		    var warning = this.Detector.getWebGLErrorMessage();
		    document.getElementById('container').appendChild(warning);
		}
	
	}
	
	 animate(renderer=this.basicRenderer) {
		window.requestAnimationFrame( this.animate );
		
		this.basicRenderer.uniforms['cameraNear'] = {
			value: this.basicRenderer.effectsPassCamera.near
		}
		this.basicRenderer.uniforms['cameraFar'] = {
			value: this.basicRenderer.effectsPassCamera.far
		}
		this.basicRenderer.render();
	}
	
	 prepareUniforms(renderer=this.basicRenderer) {
		    
		    return;
		}
	
	 
}

export default RenderInterface;