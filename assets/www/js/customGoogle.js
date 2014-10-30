///******************* GOOGLE MAPS FUNCTIONS *********************/
///** Initiate the google maps (Build maps) **/
//function initMaps(lat, lng) {
//    var mapOptions = {
//        zoom: 17, /* Define the zoom */
//        center: new google.maps.LatLng(lat, lng), /* Define the center */
//        mapTypeId: 'hybrid',
//        disableDefaultUI: true /* Will disable UI, since it is not for the user to change */
//      };
//
//      var map = new google.maps.Map(document.getElementById('map'), mapOptions); /* Init the map object */
//
//     /** Set the Marker at center position **/
//      var marker = new google.maps.Marker({
//          position: new google.maps.LatLng(lat, lng),
//          map: map,
//          title: 'Your position!'
//      });
//
///** TODO RADIUS AND CIRCLES **/
//      var circle = new google.maps.Circle({
//        map: map,
//        radius: 40,
//        fillColor: '#AA0000'
//      });
//      circle.bindTo('center', marker, 'position');
//}
//
///* On getting GEO location we do run a success callback */
//function geoSuccess(position) {
//    /* We initaite the google maps according to our locations (Longitude, latitude) */
//    initMaps(position.coords.latitude, position.coords.longitude);
//}
//
//// onError Callback receives a PositionError object
//function geoError(error) {
//    /* Run Android Toast with error msg in the center of the screen */
//    /** NOTE: Toast is custom build in toast.custom.js */
//    toast('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n', 'center');
//}

var mapsOb = function() {
    this.zoom = 19;
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.radius = 20;
    this.fillColor = '#cccccc';
    this.disableDefaultUI = true;
    this.timeout = Infinity;
    this.enableHighAccuracy = true;
    this.element = document.getElementById('map');
    this.watchID = null;
    this.mapDrawn = false;
    this.map = null;
    this.me = null;
    this.circle = null;
    this.radiusToHit = null;
    this.eggs = {};
    var that = this;

    this.init = function() {
        var options = {
            enableHighAccuracy: this.enableHighAccuracy,
            timeout:            this.timeout,
            maximumAge          : 0
        }
        this.watchID = navigator.geolocation.watchPosition(this.success, this.error, options);
    }

    this.success = function(position) {
        var googleLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        if(that.mapDrawn === false) {
            var mapOptions = {
                zoom: that.zoom,
                center: googleLatLng,
                mapTypeId: that.mapTypeId,
//                draggable: false,
//                scrollwheel: false,
//                panControl: false,
                disableDefaultUI: that.disableDefaultUI
            }

            that.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            that.mapDrawn = true;

            that.me = new google.maps.Marker({
                position: googleLatLng,
                map: that.map,
                optimized: false,
                title: 'Your position!'
            });

            that.circle = new google.maps.Circle({
                map: that.map,
                radius: that.radius,
                fillColor: that.fillColor
            });
            that.circle.bindTo('center', that.me, 'position');

            var makerToFindLatLng = new google.maps.LatLng(57.047849, 9.965999);
            var markerToFind = new google.maps.Marker({
                position: makerToFindLatLng,
                map: that.map,
                optimized: false,
                title: 'FIND ME'
            });

            that.radiusToHit = new google.maps.Circle({
                map: that.map,
                radius: 20,
                fillColor: '#000000'
            });
            that.radiusToHit.bindTo('center', markerToFind, 'position');

            that.getEggs();
        }

        that.me.setPosition(googleLatLng);

        /* setVisible on and off fixes bug from Google API v3 */
        that.circle.setVisible(false);
        that.circle.setCenter(googleLatLng);
        that.circle.setVisible(true);

        that.map.panTo(googleLatLng);

        if (that.radiusToHit.getBounds().contains(googleLatLng)) {
            navigator.notification.beep(1);
            navigator.notification.vibrate(2000);
            alert("YOU FOUND ME");
        } else {
            toast("Im not here");
        }
    }

    this.error = function(error) {
        toast('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n', 'center');
    }

    this.getEggs = function() {
        alert(user.id);
        $.ajax({ url: ajaxLocation+"getEggs.php",
             data: {
                userid: user.id,
                },
             type: 'post',
             success:
             function(result) {
                  var result = $.parseJSON(result);
                  $.each(result, function(index, item) {
                    that.addEgg(item.lat, item.lng, item.radius, item.eggId);
                  });
              }
        });
    }

    this.addEgg = function(lat, lng, radius, eggId) {
        /* TODO Lav så der auto genereres "æg" ud fra DB */
        /* Funktionen er kaldt fra funktionen getEggs() oven over */
    }

}