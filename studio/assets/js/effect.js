// outline effect
function createOutline(data) {
  el = document.createElement(data.geometry)
  el.setAttribute('position',data.position)
  el.setAttribute('rotation',data.rotation)
  if (data.height) {
    el.setAttribute('height',data.height)
  }
  if (data.width) {
    el.setAttribute('width',data.width)
  }
  if (data.radius) {
    el.setAttribute('radius',data.radius)
  }
  el.setAttribute('scale',"1.05 1.05 1.05")
  el.setAttribute('material','shader:flat;side:back; depthTest:false"; color:' + attributes.color)
  scene = document.querySelector("a-scene")
  scene.appendChild(el)
}
AFRAME.registerComponent('outline', {
  schema: {
     color: {type: 'string', default: '#00ff00'}
   },
  init: function () {
    att = this.el.object3D.el.attributes
    attributes = {}
    for (i in att) {
      if ( att[i].name == "geometry") {
        attributes.geometry = att[i].ownerElement.nodeName
      }
      if ( att[i].name == "radius") {
        if (att[i].value != "") {
          attributes.radius = att[i].value
        }
      }
      if ( att[i].name == "height") {
        if (att[i].value != "") {
          attributes.height = att[i].value
        }
      }
      if ( att[i].name == "width") {
        if (att[i].value != "") {
          attributes.width = att[i].value
        }
      }
      if ( att[i].name == "position") {
        if (att[i].value != "") {
          attributes.position = att[i].value
        }
        else {
          attributes.position = "0 0 0"

        }
      }
      if ( att[i].name == "rotation") {
        if (att[i].value != "") {
          attributes.rotation = att[i].value
        }
        else {
          attributes.rotation = "0 0 0"

        }
      }
      attributes.color = this.data.color
    }
    createOutline(attributes)

    }
  }
);


// mirror from https://github.com/alfa256/aframe-mirror-component/blob/b0ac026f67dc1fec29c7d71cd611fedbc77ebe08/dist/aframe-mirror-component.js
AFRAME.registerComponent('mirror', {
	  schema: {
	    resolution: { type:'number', default: 128},
	    refraction: { type:'number', default: 0.95},
	    color: {type:'color', default: 0xffffff},
	    distance: {type:'number', default: 3000},
	    interval: { type:'number', default: 1000},
	    repeat: { type:'boolean', default: false}
	  },


	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function(){
	          this.counter = this.data.interval;
	          this.cam = new THREE.CubeCamera( 0.5, this.data.distance, this.data.resolution);
	          this.el.object3D.add( this.cam );
	          this.mirrorMaterial = new THREE.MeshBasicMaterial( { color: this.data.color, refractionRatio: this.data.refraction, envMap: this.cam.renderTarget.texture } );
	          this.done = false;
	          var mirrormat = this.mirrorMaterial;
	          this.mesh = this.el.getObject3D('mesh');
	          if(this.mesh){
	            this.mesh.traverse( function( child ) {
	                if ( child instanceof THREE.Mesh ) child.material = mirrormat;
	            });
	          }
	  },

	  tick: function(t,dt){
	    if(!this.done){
	      if( this.counter > 0){
	        this.counter-=dt;
	      }else{
	        this.mesh = this.el.getObject3D('mesh');

	        if(this.mesh){
	            this.mesh.visible = false;
	            AFRAME.scenes[0].renderer.autoClear = true;
	            this.cam.position.copy(this.el.object3D.worldToLocal(this.el.object3D.getWorldPosition()));
	            this.cam.updateCubeMap( AFRAME.scenes[0].renderer, this.el.sceneEl.object3D );

	            var mirrormat = this.mirrorMaterial;
	            this.mesh.traverse( function( child ) {
	                if ( child instanceof THREE.Mesh ) child.material = mirrormat;
	            });
	            this.mesh.visible = true;

	            if(!this.data.repeat){
	              this.done = true;
	              this.counter = this.data.interval;
	            }
	        }
	      }
	    }
	  },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function (oldData) {},


	});

//utilities
function xyzToString(data,m=1) {
  str = m*data.x + " "+ m*data.y + " " + m*data.z
  return str
}
