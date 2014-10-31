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
    this.zoom = 18;
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
    this.bounds = {};
    this.markers = [];
    this.circles = [];
    var that = this;

    this.init = function() {
        var options = {
            enableHighAccuracy: this.enableHighAccuracy,
            timeout:            this.timeout,
            frequency:          5000,
            maximumAge:         0
        }
        this.watchID = navigator.geolocation.watchPosition(this.success, this.error, options);
    }

    this.success = function(position) {
        var googleLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        if(that.mapDrawn === false) {
            that.getEggs();

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
        }

        that.map.panTo(googleLatLng);
        that.me.setPosition(googleLatLng);

        /* setVisible on and off fixes bug from Google API v3 */
        that.circle.setVisible(false);
        that.circle.setCenter(googleLatLng);
        that.circle.setVisible(true);



        $.each(that.circles, function(eggId, item) {
            if(item.getBounds().contains(googleLatLng)) {
                toast("Found egg");
                that.showGift(item.id);
            }
        });
    }

    this.showGift = function(id) {
        $.ajax({ url: ajaxLocation+"getGift.php",
             data: {
                eggid: id,
                },
             type: 'post',
             success:
             function(result) {
                  var result = $.parseJSON(result);
                  $.each(result, function(index, item) {
                    /* Show egg prompt */
                  for (var i = 0; i < that.markers.length; i++) {
                        if (that.markers[i].id == id) {
                            that.markers[i].setVisible(false);
                            /* Remove the marker from Map */
                            that.markers[i].setMap(null);

                            /* Remove the marker from array. */
                            that.markers.splice(i, 1);
                        }
                    }
                    for (var i = 0; i < that.circles.length; i++) {
                        if (that.circles[i].id == id) {
                            that.circles[i].setVisible(false);
                            /* Remove the marker from Map */
                            that.circles[i].setMap(null);

                            /* Remove the marker from array. */
                            that.circles.splice(i, 1);
                        }
                    }
//                    navigator.notification.confirm(
//                        'You found an egg!',  // message
//                        that.onFoundEgg,              // callback to invoke with index of button pressed
//                        'New egg',            // title
//                        'Show me, Hide'          // buttonLabels
//                    );
                  });
              }
        });
    }

    this.onFoundEgg = function(buttonIndex) {
        alert(buttonIndex);
        $("#showEgg img").attr("src",item.data);
        $("#showEgg").show();
    }

    this.error = function(error) {
        toast('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n', 'center');
    }

    this.getEggs = function() {
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

    this.alertEggs = function() {
//        $("#eggs").html(JSON.stringify(this.bounds));
        $.each(this.bounds, function(index, item) {
            $("#eggs").append(JSON.stringify(item));
        });
    }

    this.addEgg = function(lat, lng, radius, eggId) {
        var radius = parseInt(radius);
        var visible = false; /* Change for visiblity of eggs */

        var eggLatLng = new google.maps.LatLng(lat, lng);
        var markEgg = new google.maps.Marker({
            position: eggLatLng,
            map: that.map,
            optimized: false,
            title: 'Egg',
            visible: visible
        });
        markEgg.id = eggId;
        that.markers.push(markEgg);

        var eggCircle = new google.maps.Circle({
            map: that.map,
            radius: radius,
            fillColor: '#000000',
            visible: visible
        });
        eggCircle.id = eggId;
        that.circles.push(eggCircle);
        eggCircle.bindTo('center', markEgg, 'position');

        that.bounds[eggId] = eggCircle.getBounds();
    }

}