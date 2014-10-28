/****************** GLOBAL VARS *********************/
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var watchID; //Current pos

/****************** DEVICE READY FUNCTIONS *****************/
/** Called on <body> tag **/
function onLoad() {
    /* When device is ready, run callbacks */
    document.addEventListener("deviceready", onReady, false);
}

/** When device is loaded, this wil run **/
function onReady() {
    /* Set variables for Camera */
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

    var mySwiper = $('.swiper-container').swiper({
      mode:'horizontal',
      loop: false,
      onSlideChangeStart: function(){
            $(".tabs .active").removeClass('active');
            $(".tabs a").eq(mySwiper.activeIndex).addClass('active');
          }
    });
    $(".tabs a").on('touchstart mousedown',function(e){
        e.preventDefault();
        $(".tabs .active").removeClass('active');
        $(this).addClass('active');
        mySwiper.swipeTo( $(this).index() );
      })
      $(".tabs a").click(function(e){
        e.preventDefault();
      });

    /* Init Geolocation - first */
    var options = { timeout: 30000 };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError); /* Initiate maps from GEO location */
}


/******************* GOOGLE MAPS FUNCTIONS *********************/
/** Initiate the google maps (Build maps) **/
function initMaps(lat, lng) {
    var mapOptions = {
        zoom: 15, /* Define the zoom */
        center: new google.maps.LatLng(lat, lng), /* Define the center */
        mapTypeId: 'hybrid',
        disableDefaultUI: true /* Will disable UI, since it is not for the user to change */
      };

      var map = new google.maps.Map(document.getElementById('map'), mapOptions); /* Init the map object */

     /** Set the Marker at center position **/
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          title: 'Your position!'
      });
}

/* On getting GEO location we do run a success callback */
function geoSuccess(position) {
    /* We initaite the google maps according to our locations (Longitude, latitude) */
    initMaps(position.coords.latitude, position.coords.longitude);
}

// onError Callback receives a PositionError object
function geoError(error) {
    /* Run Android Toast with error msg in the center of the screen */
    /** NOTE: Toast is custom build in toast.custom.js */
    toast('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n', 'center');
}



/************************ CAMREA ************************/
/* TODO */
function capturePhoto() {
  /* Take picture using device camera and retrieve image as base64-encoded string */
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 75,
    destinationType: destinationType.DATA_URL,
    correctOrientation: true,
    targetWidth: 100,
    targetHeight: 100,
    saveToPhotoAlbum: false
  });
}

 function onPhotoDataSuccess(imageData) {
      var smallImage = document.getElementById('smallImage');
      $(".smallImage").show();
      $(".smallImage").attr("src", "data:image/jpeg;base64," + imageData);
}

function onFail(message) {
  alert('Failed because: ' + message);
}