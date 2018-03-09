var data = '{"user":"testing","projectID":"12345","sceneData":{"object1":{"name":"floor","geometry":"plane","properties":{"color":"#7BC8A4","position":"0 0 -4","width":"4","height":"4"}},"object2":{"name":"sky","geometry":"sky","properties":{"src":"../test/mountains.jpg"}}}}'
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
