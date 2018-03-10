var data = '{"user":"testing","projectID":"12345","sceneData":{"object1":{"name":"floor","geometry":"plane","properties":{"src":"graph.jpg","position":"0 0 -4","rotation":"-90 0 0","width":"8","height":"8"}},"object2":{"name":"sky","geometry":"sky","properties":{"color":"#dddddd"}}}}'
var json = JSON.parse(data)
var sd = json.sceneData

// scene element
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
  console.log(propKeys);
  for (y in propKeys) {
    el.setAttribute(propKeys[y], p[propKeys[y]])
    console.log(propKeys[y])
    console.log(p[propKeys[y]])
}
}
}
renderScene(sd);


function processGeo(geo) {
  return "a-"+geo
}
