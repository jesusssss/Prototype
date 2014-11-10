var mapsOb = function() {
    this.zoom = 17;
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.radius = 30;
    this.fillColor = '#f56f6c';
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
    this.lat;
    this.lng;
    this.recievers = [];
    this.savedLat;
    this.savedLng;
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

    this.pause = function() {
        toast("Pasued");
        navigator.geolocation.clearWatch(that.watchID);
    }

    this.success = function(position) {
        that.lat = position.coords.latitude;
        that.lng = position.coords.longitude;
        var googleLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        if(that.mapDrawn === false) {
            that.getEggs();

            function CoordMapType(tileSize) {
              this.tileSize = tileSize;
            }

            CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
              var div = ownerDocument.createElement('div');
              div.style.width = this.tileSize.width + 'px';
              div.style.height = this.tileSize.height + 'px';
              div.style.fontSize = '10';
              return div;
            };

            var mapOptions = {
                zoom: that.zoom,
                center: googleLatLng,
                mapTypeId: that.mapTypeId,
                draggable: false,
                scrollwheel: false,
                panControl: false,
                disableDefaultUI: that.disableDefaultUI
            }

            that.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            that.mapDrawn = true;

            that.me = new google.maps.Marker({
                position: googleLatLng,
                map: that.map,
                optimized: false,
                zIndex: 99999,
                icon: 'img/mapsIcon.png',
                title: 'Your position!'
            });

            that.circle = new google.maps.Circle({
                map: that.map,
                radius: that.radius,
                fillColor: '#354257',
                strokeOpacity: 0
            });
            that.circle.bindTo('center', that.me, 'position');

            that.map.overlayMapTypes.insertAt(
                  0, new CoordMapType(new google.maps.Size(256, 256)));
//            google.maps.event.addListenerOnce(that.map, 'idle', function(){
//                setTimeout(function() {
//                    $("#blueOverlay").fadeIn("slow");
//                }, 2500);
//            });
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

    this.setRadius = function(radius) {
        var radius = parseInt(radius);
        that.radius = radius;
        that.circle.setRadius(radius);
    }

    this.radiusAfter = function() {
        that.circle.setVisible(false);

        setTimeout(function() {
        that.circle.setVisible(true);
        }, 500);
    }

    this.saveCurrentPosition = function() {
        that.savedLat = that.lat;
        that.savedLng = that.lng;
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

    this.addReciever = function(id) {
        that.recievers.push(id);
        toast(that.recievers);
    }

    this.removeReciever = function(id) {
        that.recievers.splice($.inArray(id, that.recievers),1);
        toast(that.recievers);
    }

    this.doLayEgg = function() {
        $.ajax({ url: ajaxLocation+"createEgg.php",
             data: {
                userId: user.id,
                friendsIds: that.recievers,
                gift: camera.currentEgg,
                lat: that.savedLat,
                lng: that.savedLng,
                radius: that.radius
                },
             type: 'post',
             success:
             function(result) {
                  that.recievers = [];
                  camera.currentEgg = "";
                  that.savedLat = "";
                  that.savedLng = "";
                  eggSwiper.swipeTo(0);
                  maps.init();
              }
        });
    }

}