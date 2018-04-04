var picker = document.getElementById('picker');

// create a simple instance
// by default, it only adds horizontal recognizers
var manager = new Hammer.Manager(picker);

// Create a recognizer
var Press = new Hammer.Press({
  time: 500
});
var Tap = new Hammer.Tap();
manager.add(Press)
manager.add(Tap)
// listen to events...
manager.on("tap press", function(ev) {
    console.log(ev.type +" gesture detected.");   
     var t = document.getElementById("brand")
    t.innerHTML="test"});
 $(".navbar-nav li a").click(function (event) {
    // check if window is small enough so dropdown is created
    var toggle = $(".navbar-toggle").is(":visible");
    if (toggle) {
      $(".navbar-collapse").collapse('hide');
    }
  });
// manager.off("tap press", function(ev) {t.innerHTML="test2";})