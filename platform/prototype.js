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
var sh="a-box";
var clr;

function renderScene(d, r="VR") {
  scene = document.querySelector("a-scene")

  // loop through all objects
  var objKeys = Object.keys(d)
  for (x in objKeys) {

    // create a-frame element
    geo = d[objKeys[x]].geometry
    el = document.createElement(geo)
    scene.appendChild(el)

    // set a-frame element properties
    p = d[objKeys[x]].properties
    propKeys = Object.keys(p)
    // console.log(propKeys);
    for (y in propKeys) {
      if (propKeys[y] == "position" && r =="AR") {
          el.setAttribute("scale",".1 .1 .1")
          el.setAttribute("position", p["positionAR"])
      }
      else {
      el.setAttribute(propKeys[y], p[propKeys[y]])
      // el.setAttribute("scale",".1 .1 .1") for AR
      // console.log(propKeys[y])
      // console.log(p[propKeys[y]])
      if (el.tagName == "A-BOX") {

      addClickListener(el)
          }
        }
      }
    }
  }
// function renderScene(d) {
//   scene = document.querySelector("a-scene")
//
//   // loop through all objects
//   var objKeys = Object.keys(d)
//   for (x in objKeys) {
//
//     // create a-frame element
//     geo = d[objKeys[x]].geometry
//     el = document.createElement(geo)
//     scene.appendChild(el)
//
//     // set a-frame element properties
//     p = d[objKeys[x]].properties
//     propKeys = Object.keys(p)
//     // console.log(propKeys);
//     for (y in propKeys) {
//       el.setAttribute(propKeys[y], p[propKeys[y]])
//       // el.setAttribute("scale",".1 .1 .1") for AR
//       // console.log(propKeys[y])
//       // console.log(p[propKeys[y]])
//       if (el.tagName == "A-BOX") {
//
//       addClickListener(el)
//     }
//       }
//     }
//   }

// inits empty scene: plane and sky
function initEmptyScene() {
  scene= document.querySelector("a-scene")
  var sd = JSON.parse('{"user":"testing","projectID":"12345","sceneData":{"object1":{"name":"floor","geometry":"a-plane","properties":{"shadow":"true","src":"graph.jpg","position":"0 0 -4","rotation":"-90 0 0","width":"8","height":"8"}},"object2":{"name":"sky","geometry":"a-sky","properties":{"src":"../img/water.jpg"}}}}').sceneData;
  renderScene(sd)
}

// turn geometry into a-geometry notation for a-frame
// hopefully don't need this long term
function processGeo(geo) {
  return "a-"+geo
}
// add click Listener
function addClickListener(el) {
  el.setAttribute('event-set__leave','_event: mouseleave; color:'+ el.getAttribute('color'))
  el.setAttribute('event-set__enter','_event: mouseenter; color: #026fc9')
  el.addEventListener('mouseup', function (evt) {
      point = getNewPos(evt)
        // console.log(evt.detail.intersection.face.normal);
        // console.log(evt.detail.intersection.object.parent.position);
       //console.log(point)
      createBox(point, sh, clr);
    })

}
function setColor(hex) {
  if ( hex == "random" ) {
    clr="random";
  }
  else {
    clr = hex;
    console.log(clr)
    return clr;
  }
  }

//function to create new boxes on click
  function createBox(point, shape="a-box", color=getRandomColor()) {
    el = document.createElement(shape);
    scene.appendChild(el);
    el.setAttribute('position',point)
    el.setAttribute('scale','1 1 1')
    el.setAttribute('shadow','true')
    console.log(clr)
    if (color=="random") {
    el.setAttribute('color',getRandomColor());}
    else {
      el.setAttribute('color',hex())
    }
    addClickListener(el);

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

  return p;
}
// init AWS initAWScreds
var dynamodb;
function initAWScreds() {
  var user_credentials = {
          accessKeyId: 'AKIAIFJVJ7YGAFSVBL2Q',
          secretAccessKey: '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'
  };
  AWS.config.region = 'us-east-1';
  AWS.config.update(user_credentials);

  dynamodb = new AWS.DynamoDB.DocumentClient();
}
var newData;

// fetch scene from Wiskar DynamoDB by id #
function fetchSceneById(id) {
initAWScreds();
var id = id;
var newData;
var params = {
    TableName : "wiskar",
    KeyConditionExpression: "#projectId = :proj",
    ExpressionAttributeNames:{
       "#projectId": "projectId"
    },
    ExpressionAttributeValues: {
       ":proj":id
    }
 };
 dynamodb.query(params, function(err, data) {
if (err) {
  //output error message if query failed
  console.log('Unable to query');
}
else {
  newData = data;
  console.log(data)
  jsontovr(data)
}
})
}

// turn json into vr scene
function jsontovr(data) {
  renderScene(data.Items[0].data)
}

// attempting to save VR scene to json
function SaveMyScene() {

  scene = document.querySelector("a-scene")
  var s = new Object();
  s.user = "Tester"
  s.timestamp = new Date().toJSON();
  s.projectId = 1*document.getElementById("sceneID").value;
  s.projectName = document.getElementById("sceneName").value;
    s.data = new Object();
    for (i in scene.children) {
      if (scene.children[i].localName == "a-box" || scene.children[i].localName == "a-sphere" || scene.children[i].localName == "a-torus" || scene.children[i].localName == "a-cylinder") {
        s.data['object'+i] = new Object();
        s.data['object'+i].geometry = scene.children[i].localName;
        s.data['object'+i].properties = new Object();
          s.data['object'+i].properties.position = scene.children[i].object3D.position["x"] + " " + scene.children[i].object3D.position["y"] + " "+ scene.children[i].object3D.position["z"];
          s.data['object'+i].properties.positionAR = .1*scene.children[i].object3D.position["x"] + " " + .1*scene.children[i].object3D.position["y"] + " "+ .1*scene.children[i].object3D.position["z"];

          s.data['object'+i].properties.color = "#" + scene.children[i].outerHTML.match(/[A-Fa-f0-9]{6}/)
      }
      }
    initAWScreds();
    dynamodb = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName : "wiskar",
        Item: s
        }
    dynamodb.put(params, function(err, data) {
      if (err) {
        document.getElementById("save-confirm").value="Something went wrong, please try again"
        document.getElementById("save-confirm").setAttribute("style","display:block");
        document.getElementById("save-confirm").className+=" save-failed"

      } // an error occurred
      else   {
            document.getElementById("save-confirm").value="Save successful"
            document.getElementById("save-confirm").setAttribute("style","display:block");
            document.getElementById("save-confirm").className+=" save-success"

              }             // successful response
            });

}

// get hex for random color
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var clr = '#';
    for (var i = 0; i < 6; i++) {
      clr += letters[Math.floor(Math.random() * 16)];
      }
    return clr;
  }
