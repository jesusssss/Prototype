var user = new userOb();
var maps = new mapsOb();

if(localStorage.getItem("user") === null) {
    $("#content").load("view/login.html");
} else {
    $("#content").load("view/home.html");
    user.load();
    maps.init();
}

$(document).ajaxStart(function () {
    $("#loading").fadeIn("slow");
});

$(document).ajaxComplete(function () {
    $("#loading").fadeOut("slow");
});