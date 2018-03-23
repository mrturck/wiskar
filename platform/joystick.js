function createJoystick() {
//joystick
// create mobile joystick
var options= {
  mode: 'dynamic',
  zone: document.getElementById('np'),
  color: "#000000"
}

 var manager = nipplejs.create(options);
 bindNipple();

 function bindNipple () {
             manager.on('move', function (evt, data) {
                 debug(data);
             });
           }
var f; var ang; var x_vec; var y_vec; var cam;
function debug(data) {

  f = data.force;
  ang = data.angle.radian
  cam = document.getElementById("camera");

  x_vec = Math.cos(ang + 3.14/180*cam.getAttribute('rotation')['y']) ;
  y_vec = Math.sin(ang + 3.14/180*cam.getAttribute('rotation')['y']) ;

  x = cam.getAttribute("position")["x"] + f/15*(x_vec ) ;
  y = cam.getAttribute("position")["z"] - f/15*(y_vec ) ;

  cam.setAttribute("position",x + " " + "1.6 " + y)


}
}
