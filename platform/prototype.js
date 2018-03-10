// Wiskar prototype.js my first attempt at building a library
// Assorted functions to help the Wiskar platform run smoothly


// load necessary scripts
function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); // Make a script DOM node
    script.src = url; // Set it's src to the provided URL
    document.head.appendChild(script); // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}
// A word about event set component...
// The event-set component gives you a quick way to add events
// to elements (like click, mouseenter, mouseleave, mousedown, mouseup, and fusing)
// without having to write Javascript for each event.
//
// For exmample if you want to give the user feedback when they hover over the element,
// you can do event-set__enter="_event: mouseenter; material.color: blue"

// Potentially useful scripts below for reference

// dynamicallyLoadScript("https://unpkg.com/aframe-event-set-component@^4.0.0/dist/aframe-event-set-component.min.js")
// dynamicallyLoadScript("//cdn.rawgit.com/donmccurdy/aframe-extras/v3.13.1/dist/aframe-extras.min.js")

// render a-frame scene from json data
var scene;

function renderScene(d) {
    var scene = document.querySelector("a-scene")

    // loop through all objects
    var objKeys = Object.keys(d)
    for (x in objKeys) {

      // create a-frame element
      geo = d[objKeys[x]].geometry
      el = document.createElement(processGeo(geo))
      scene.appendChild(el)

      // set a-frame element properties
      p = d[objKeys[x]].properties
      propKeys = Object.keys(p)
      // console.log(propKeys);
      for (y in propKeys) {
        el.setAttribute(propKeys[y], p[propKeys[y]])
        // console.log(propKeys[y])
        // console.log(p[propKeys[y]])
        }
      }
    }

// inits empty scene: plane and sky

function initEmptyScene() {
  scene= document.querySelector("a-scene")
  var sd = JSON.parse('{"user":"testing","projectID":"12345","sceneData":{"object1":{"name":"floor","geometry":"plane","properties":{"src":"graph.jpg","position":"0 0 -4","rotation":"-90 0 0","width":"8","height":"8"}},"object2":{"name":"sky","geometry":"sky","properties":{"color":"#dddddd"}}}}').sceneData;
  renderScene(sd)
}

// turn geometry into a-geometry notation for a-frame
// hopefully don't need this long term
function processGeo(geo) {
  return "a-"+geo
}

//function to create new boxes on click

  function createBox(point) {
    el = document.createElement("a-box");
    scene.appendChild(el);
    el.setAttribute('position',point)
    el.setAttribute('scale','1 1 1')
    el.setAttribute('color',getRandomColor());
    el.setAttribute('event-set__leave','_event: mouseleave; color:'+getRandomColor())
    el.setAttribute('event-set__enter','_event: mouseenter; color: #026fc9')
    el.addEventListener('mousedown', function (evt) {
        point = getNewPos(evt)
          console.log(evt.detail.intersection.face.normal);
          console.log(evt.detail.intersection.object.parent.position);
         //console.log(point)
        createBox(point);
      })
  }
// get new position for side by side block
function getNewPos(evt) {
  p =
  norm = evt.detail.intersection.face.normal;
  position = evt.detail.intersection.object.parent.position;

  x = (1*norm["x"] + 1*position["x"]).toString();
  y = (1*norm["y"] + 1*position["y"]).toString();
  z = (1*norm["z"] + 1*position["z"]).toString();

  p = x + " " + y + " " + z
  console.log(p)

  return p;
}
// get hex for random color
  function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
