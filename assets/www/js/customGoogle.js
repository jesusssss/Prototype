/******************* GOOGLE MAPS FUNCTIONS *********************/
/** Initiate the google maps (Build maps) **/
function initMaps(lat, lng) {
    var mapOptions = {
        zoom: 17, /* Define the zoom */
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

/** TODO RADIUS AND CIRCLES **/
      var circle = new google.maps.Circle({
        map: map,
        radius: 40,
        fillColor: '#AA0000'
      });
      circle.bindTo('center', marker, 'position');
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