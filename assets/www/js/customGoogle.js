var mapsOb = function() {
    this.zoom = 16;
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.radius = 110;
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
    this.drawnCollection = false;
    this.lng;
    this.recievers = [];
    this.savedLat;
    this.savedLng;
    var that = this;

    /* Initiate google maps on front and start tracking */
    this.init = function() {
        var options = {
            enableHighAccuracy: this.enableHighAccuracy,
            timeout:            this.timeout,
            frequency:          5000,
            maximumAge:         0
        }
        this.watchID = navigator.geolocation.watchPosition(this.success, this.error, options);
    }

    /* Pause tracking for battery */
    this.pause = function() {
        toast("Pasued");
        navigator.geolocation.clearWatch(that.watchID);
    }

    /* When an successfull tracking position is made form init function, this success funtion runs */
    this.success = function(position) {
        that.lat = position.coords.latitude;
        that.lng = position.coords.longitude;
        var googleLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        /* If maps is already drawn, skip this. Else: Draw the map */
        if(that.mapDrawn === false) {
            that.getEggs();
            var mapOptions = {
                zoom: that.zoom,
                center: googleLatLng,
                mapTypeId: that.mapTypeId,
                draggable: false,
                scrollwheel: false,
                panControl: false,
                disableDefaultUI: that.disableDefaultUI
            }

            /* The global map */
            that.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            that.mapDrawn = true;

            /* The global marker showing your position */
            that.me = new google.maps.Marker({
                position: googleLatLng,
                map: that.map,
                optimized: false,
                zIndex: 99999,
                icon: 'img/mapsIcon.png',
                title: 'Your position!'
            });

            /* The global radius around your position */
            that.circle = new google.maps.Circle({
                map: that.map,
                radius: that.radius,
                fillColor: '#354257',
                strokeOpacity: 0
            });

            /* Bind the circle to the marker */
            that.circle.bindTo('center', that.me, 'position');
        }

        /* Pan to / animate to the new position revieced from the tracker */
        that.map.panTo(googleLatLng);

        /* Save the position we are currently at in global variables */
        that.me.setPosition(googleLatLng);

        /* setVisible on and off fixes bug from Google API v3 */
        /**** THIS IS NOT AN v3 API BUG! THIS WAS MY OWN PHONE NOT RENDERING FAST ENOUGH ****/
        /******** OTHER PHONES ARE WORKING FINE! ******/
        that.circle.setVisible(false);
        that.circle.setCenter(googleLatLng);
        that.circle.setVisible(true);

        /* For each egg for your user, is a marker on the map */
        /* Each of these markers, got a radius */
        /* In this $.each function we run over all of them, to see if our current location is within one of them */
        $.each(that.circles, function(eggId, item) {
            var bounds = item.getBounds();
            if(bounds.contains(googleLatLng) === true) {
                that.showGift(item.id);
                alert("Found radius bound");
                maps.pause();
                that.foundEgg(item.id);
            }
        });
    }

    /* If we find an egg for us on our position, we run this foundegg function */
    this.foundEgg = function(eggId) {
        $.ajax({
            url: ajaxLocation+"foundEgg.php",
            data: {
                userId: user.id,
                eggId: eggId
            },
            type: "post",
            success: function() {
                alert("Some shit that tells you you found an egg!");
                that.getEggsToMe();
            }
        });
    }

    /* When laying new egg, we draw the position on a map when we hit the egg button */
    this.drawPreLocation = function() {
        var preLocation = new google.maps.LatLng(that.lat, that.lng);
        var preOptions = {
            zoom: 15,
            center: preLocation,
            mapTypeId: that.mapTypeId,
            draggable: false,
            scrollwheel: false,
            panControl: false,
            disableDefaultUI: that.disableDefaultUI
        }

        var preMap = new google.maps.Map(document.getElementById('preLocation'), preOptions);
        var preMe = new google.maps.Marker({
            position: preLocation,
            map: preMap,
            optimized: false,
            zIndex: 99999,
            icon: 'img/smallMapsIcon.png',
            title: 'Your position!'
        });
    }

    /* Sets the current radius to global variable */
    this.setRadius = function(radius) {
        var radius = parseInt(radius);
        that.radius = radius;
        that.circle.setRadius(radius);
    }

    /* When changing radius value, we are doing fix of visible errors for slow phones */
    this.radiusAfter = function() {
        that.circle.setVisible(false);

        setTimeout(function() {
        that.circle.setVisible(true);
        }, 500);
    }

    /* Saves current location lat lng coordinates in global variables */
    this.saveCurrentPosition = function() {
        that.savedLat = that.lat;
        that.savedLng = that.lng;
    }

    /* When wanting to show an egg, we run script to get picture and location of that egg from DB on server */
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
                            that.markers[i].setMap(null);
                            that.markers.splice(i, 1);
                        }
                    }
                    for (var i = 0; i < that.circles.length; i++) {
                        if (that.circles[i].id == id) {
                            /* Remove the marker from Map */
                            that.circles[i].setMap(null);
                            /* Remove the marker from array. */
                            that.circles.splice(i, 1);
                        }
                    }
                  });
              }
        });
    }

    /* Will not be used */
    this.onFoundEgg = function(buttonIndex) {
        $("#showEgg img").attr("src",item.data);
        $("#showEgg").show();
    }

    /* If tracking fails, this will run */
    this.error = function(error) {
        toast('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n', 'center');
    }

    /* This will get all eggs for the current logged in user */
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

    /* Will not be used */
    this.alertEggs = function() {
        $.each(this.bounds, function(index, item) {
            $("#eggs").append(JSON.stringify(item));
        });
    }

    /* Adds the single found egg to the map as hidden for user to find */
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
    }

    /* Adds recievers to global variable */
    this.addReciever = function(id) {
        that.recievers.push(parseInt(id));
    }

    /* Removes reciever from global variables */
    this.removeReciever = function(id) {
        that.recievers.splice($.inArray(id, that.recievers),1);
    }

    /* When laying egg, this function will run to run DB */
    this.doLayEgg = function() {
        $.ajax({ url: ajaxLocation+"createEgg.php",
             data: {
                userId: user.id,
                friendIds: that.recievers,
                gift: camera.currentEgg,
                radius: that.radius,
                lat: that.savedLat,
                lng: that.savedLng,
                },
             type: 'post',
             success:
             function(result) {
                  that.getEggsByMe();
                  that.recievers.length = 0;
                  camera.currentEgg = "";
                  that.savedLat = "";
                  that.savedLng = "";
                  eggSwiper.swipeTo(0);
                  maps.init();
                  $("#preFriendSelect .friendList .singleFriend").each(function() {
                    $(this).attr("style", "");
                    $(this).removeClass("active");
                  });
              }
        });
    }

    /* When clicking to view an egg, this will run to render the items */
    this.viewEgg = function(lat, lng, eggId) {
        var gift;
        $.ajax({
            url: ajaxLocation+"getGift.php",
            data: {
                eggid: eggId
            },
            type: "post",
            success: function(result) {
                var result = $.parseJSON(result);
                $.each(result, function(index, item) {
                    gift = item.gift;
                    viewSuccess(lat, lng);
                });
            }
        });

        /* On render success, this will run to set it all up */
        function viewSuccess(lat, lng) {
            $(".tabs").hide();
            $(".eggViewer .eggViewerGift").attr("style","background-image: url('data:image/jpeg;base64,"+gift+"');");
            var viewLocation = new google.maps.LatLng(lat, lng);
            var viewOptions = {
                zoom: 16,
                center: viewLocation,
                mapTypeId: that.mapTypeId,
                draggable: false,
                scrollwheel: false,
                panControl: false,
                disableDefaultUI: that.disableDefaultUI
            }
            var viewMap = new google.maps.Map(document.getElementById('eggViewerMap'), viewOptions);
            var viewMe = new google.maps.Marker({
                position: viewLocation,
                map: viewMap,
                optimized: false,
                zIndex: 99999,
                icon: 'img/smallMapsIcon.png',
                title: 'Your position!'
            });
            collectionSwiper.swipeTo(2);
        }
    }

    /* Get eggs, that was made by this user, from DB */
    this.getEggsByMe = function() {
            $(".eggsByMe").html("");
            $.ajax({
            url: ajaxLocation+"getEggsByMe.php",
            data: {
                userId: user.id
            },
            type: 'post',
            success: function(result) {
                  var result = $.parseJSON(result);
                  if(result.length == 0) {
                      $(".eggsByMe").html("<h4 style='margin-left: 10px;'>Go lay some eggs!</h4>");
                  } else {
                    $.each(result, function(index, item) {
                        that.drawEggsByMe(item.lat, item.lng, item.radius, item.eggId, item.userImage, item.firstname, item.lastname, item.status);
                      });
                      that.drawnCollection = true;
                  }
            }
        });
    }

    /* Get eggs, that this user has already found */
    this.getEggsToMe = function() {
        $(".eggsToMe").html("");
        $.ajax({
            url: ajaxLocation+"getEggsToMe.php",
            data: {
                userId: user.id
            },
            type: 'post',
            success: function(result) {
                var result = $.parseJSON(result);
                if(result.length == 0) {
                    $(".eggsToMe").html("<h4 style='margin-left: 10px;'>You have no eastereggs yet</h4>");
                } else {
                    $.each(result, function(index, item) {
                        that.drawEggsToMe(item.lat, item.lng, item.radius, item.eggId, item.userImage, item.firstname, item.lastname);
                    });
                    /* Tjek egg status */
                    that.drawnCollection = true;
                }

            }
        });
    }

    /* One function to get all eggs (By me - to me) */
    this.getAllEggs = function() {
        maps.getEggsByMe();
        maps.getEggsToMe();
    }

    /* Render the eggs by me in DOM */
    this.drawEggsByMe = function(lat, lng, radius, eggId, profileImage, firstname, lastname, status) {
        $(".eggsByMe").append(
            "<div class='singleEgg' data-lat='"+lat+"' data-lng='"+lng+"' data-radius='"+radius+"' data-eggid='"+eggId+"' data-status='"+status+"'> "
            +"<div class='collectProfileImage' style='background-image: url(data:image/jpeg;base64,"+profileImage+");'>"
            +"</div>"
            +"<div class='collectName'>"
            +firstname + " " + lastname
            +"</div>"
            +"<div class='"+status+"'></div>"
            +"</div>"
        );
    }

    /* Render the eggs to me in DOM */
    this.drawEggsToMe = function(lat, lng, radius, eggId, profileImage, firstname, lastname) {
        alert(profileImage);
        $(".eggsToMe").append(
            "<div class='singleEgg' data-lat='"+lat+"' data-lng='"+lng+"' data-radius='"+radius+"' data-eggid='"+eggId+"'>"
            +"<div class='collectProfileImage' style='background-image: url(data:image/jpeg;base64,"+profileImage+");'>"
            +"</div>"
            +"<div class='collectName'>"
            +firstname + " " + lastname
            +"<div class='"+status+"'></div>"
            +"</div>"
            +"</div>"
        );
    }
}