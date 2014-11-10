user = new userOb();
maps = new mapsOb();

if(localStorage.getItem("user") === null) {
    $("#content").load("view/login.html");
} else {
    $("#content").load("view/myhome.html");
    user.load();
    maps.init();
}

$(document).ajaxStart(function () {
    $("#loading").show();
});

$(document).ajaxComplete(function () {
    $("#loading").hide();
});
