var data = '{"user":"testing","projectID":"12345","sceneData":{"object1":{"name":"floor","geometry":"plane","properties":{"src":"graph.jpg","position":"0 0 -4","rotation":"-90 0 0","width":"6","height":"6"}},"object2":{"name":"sky","geometry":"sky","properties":{"color":"#dddddd"}}}}'
var json = JSON.parse(data)

// scene element
var scene = document.querySelector("a-scene")

// loop through all objects
var sd = json.sceneData
var objKeys = Object.keys(sd)
for (x in objKeys) {

  // create a-frame element
  geo = sd[objKeys[x]].geometry
  el = document.createElement(processGeo(geo))
  scene.appendChild(el)

  // set a-frame element properties
  p = sd[objKeys[x]].properties
  propKeys = Object.keys(p)
  console.log(propKeys);
  for (y in propKeys) {
    el.setAttribute(propKeys[y], p[propKeys[y]])
    console.log(propKeys[y])
    console.log(p[propKeys[y]])
}
}


function processGeo(geo) {
  return "a-"+geo
}
