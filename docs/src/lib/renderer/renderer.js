class Renderer {
	constructor(canvasId) {
		this.sceneWidth = document.getElementById( canvasId ).getBoundingClientRect().width;
		this.sceneHeight = this.sceneWidth / 1.6;
		
		var drawingSurface = document.getElementById( canvasId );
		console.log(drawingSurface);
		this.renderer = new THREE.WebGLRenderer({canvas: drawingSurface});
		this.renderer.setPixelRatio(0.7);
		this.renderer.setSize(this.sceneWidth, this.sceneHeight);
		// document.body.appendChild( this.renderer.domElement );
		
		this.firstPassScene = new THREE.Scene();
		this.effectsPassScene = new THREE.Scene();
		this.depthStorageTarget = new THREE.WebGLRenderTarget(this.sceneWidth, this.sceneHeight);
		this.depthStorageTarget.depthTexture = new THREE.DepthTexture();
		
		this.firstPassCamera = new THREE.PerspectiveCamera(45, this.sceneWidth / this.sceneHeight, 1, 500);
		this.effectsPassCamera = new THREE.PerspectiveCamera(45, this.sceneWidth / this.sceneHeight, 1, 500);
		
		this.uniforms = {};
	}
	
	
	loadScene(scene, vertexShaderSource, fragmentShaderSource) {
		this.firstPassCamera.position.set( 0, 10, 20);
    	this.firstPassCamera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    	this.effectsPassCamera.position.set( 0, 10, 20);
    	this.effectsPassCamera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    	
    	var firstPassControls = new THREE.OrbitControls( this.firstPassCamera, this.renderer.domElement );
		firstPassControls.enableDamping = true;
		firstPassControls.dampingFactor = 0.25;
		firstPassControls.rotateSpeed = 0.35;
		
		var effectsPassControls = new THREE.OrbitControls( this.effectsPassCamera, this.renderer.domElement );
		effectsPassControls.enableDamping = true;
		effectsPassControls.dampingFactor = 0.25;
		effectsPassControls.rotateSpeed = 0.35;
		
		var basicMaterial = new THREE.MeshBasicMaterial({color: 'gray', side: THREE.DoubleSide});
		
		var SSAOMaterial = new THREE.RawShaderMaterial( {
	    	uniforms: this.uniforms,
			vertexShader: vertexShaderSource,
			fragmentShader: fragmentShaderSource
		});
		
		var firstPassScene = this.firstPassScene;
		var effectsPassScene = this.effectsPassScene;
		var loader = new THREE.OBJLoader2();
	    loader.load(scene,
	    	function (event) {
	    		var clone = new THREE.Group();
	    		event.detail.loaderRootNode.traverse(function (child) {
	    			if (child instanceof THREE.Mesh) {
	    				child.material = basicMaterial;
	    				clone.add(child.clone());
	    			}
	    		});
	    		firstPassScene.add( event.detail.loaderRootNode );
	    		
	    		clone.traverse(function (child) {
	    			if (child instanceof THREE.Mesh) {
	    				child.material = SSAOMaterial;
	    			}
	    		});
	    		effectsPassScene.add(clone);
	    	},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
		);
		this.firstPassScene = firstPassScene;
		this.effectsPassScene = effectsPassScene;
	}
	
	
	
	
	render() {
		this.renderer.render(this.firstPassScene, this.firstPassCamera, this.depthStorageTarget, false);
		this.uniforms['uTexDepthBuffer'] = {
			t: 't',
			value: this.depthStorageTarget.depthTexture
		}
		this.renderer.render(this.effectsPassScene, this.effectsPassCamera);
	}
	
	initBrowserSupport() {
		/**
		 * Detects if browser can run webGL
		 * @author alteredq / http://alteredqualia.com/
		 * @author mr.doob / http://mrdoob.com/
		 */
		var Detector = {
			canvas: !! window.CanvasRenderingContext2D,
			webgl: ( function () {
				try {
					var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
				} catch ( e ) {
					return false;
				}
			} )(),
			workers: !! window.Worker,
			fileapi: window.File && window.FileReader && window.FileList && window.Blob,
			
			getWebGLErrorMessage: function () {
				var element = document.createElement( 'div' );
				element.id = 'webgl-error-message';
				element.style.fontFamily = 'monospace';
				element.style.fontSize = '13px';
				element.style.fontWeight = 'normal';
				element.style.textAlign = 'center';
				element.style.background = '#fff';
				element.style.color = '#000';
				element.style.padding = '1.5em';
				element.style.width = '400px';
				element.style.margin = '5em auto 0';
				if ( ! this.webgl ) {
					element.innerHTML = window.WebGLRenderingContext ? [
						'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
						'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
					].join( '\n' ) : [
						'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
						'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
					].join( '\n' );
				}
				return element;
			},
			addGetWebGLMessage: function ( parameters ) {
				var parent, id, element;
				parameters = parameters || {};
				parent = parameters.parent !== undefined ? parameters.parent : document.body;
				id = parameters.id !== undefined ? parameters.id : 'oldie';
				element = Detector.getWebGLErrorMessage();
				element.id = id;
				parent.appendChild( element );
			}
		};
		
		// browserify support
		if ( typeof module === 'object' ) {
			module.exports = Detector;
		}
		return Detector;
	}
}

export default Renderer;