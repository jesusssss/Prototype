/****************** GLOBAL VARS *********************/
//var pictureSource;   // picture source
//var destinationType; // sets the format of returned value

/****************** DEVICE READY FUNCTIONS *****************/
/** Called on <body> tag **/
function onLoad() {
    /* When device is ready, run callbacks */
    document.addEventListener("deviceready", onReady, false);
}

/** When device is loaded, this wil run **/
function onReady() {
    $.toggle3DByDefault();



/* Global vars */
camera = new cameraOb(navigator.camera.DestinationType, navigator.camera.PictureSourceType, navigator.camera.MediaType);

    mySwiper = $('.swiper-container').swiper({
      mode:'horizontal',
      loop: false,
      resistance: '100%',
      noSwiping: true,
      onSlideChangeStart: function(){
        var index = mySwiper.activeIndex;
        if(index == 0) {
            /* If map slide active, initiate */
            maps.init();
        } else {
            /* Else pause tracking for battery and memory */
            maps.pause();
        }
        if(index == 1) {
            user.getFriendList();
        }
      }
    });

    menuSwiper = $(".menu-swiper").swiper({
        mode: 'vertical',
        loop: false,
        resistance: '100%',
        noSwiping: true,
        onSlideChangeStart: function() {
        }
    });

    eggSwiper = $(".swiper-layegg").swiper({
        mode: 'vertical',
        onlyExternal: true,
        resistance: '100%',
        noSwiping: true,
        onSlideChangeStart: function() {
            var index = eggSwiper.activeIndex;
            if(index == 1) {
                user.getFriendList();
            }
        }
    });

    loginSwiper = $('.login-container').swiper({
          mode:'vertical',
          loop: false,
          resistance: '100%',
          noSwiping: true
    });

        $("#signup").on("touchend", function() {
            loginSwiper.swipeTo(1);
        });
        $("#forgotPassword").on("touchend", function() {
            loginSwiper.swipeTo(2);
        });

        profileSwiper = $(".swiper-container-profile").swiper({
            mode: 'vertical',
            loop: false,
            resistance: '100%',
            noSwiping: true,
            onSlideChangeStart: function() {
                var index = profileSwiper.activeIndex;
                if(index == 0) {
                    $(".fixedProfile").stop().animate({top: '-80px'});
                    $(".fixedProfile").addClass("hidden");
                }
                if(index == 1 && $(".fixedProfile").hasClass("hidden")) {
                    $(".fixedProfile").stop().animate({top: '0px'});
                    $(".fixedProfile").removeClass("hidden");
                }
            }
        });

      $(".profileNav ul li").on("touchend", function() {
          $(".profileNav ul li").removeClass("active");
          $(this).addClass("active");
      });

//    /* Init Geolocation - first */
//    var options = { timeout: 30000 };
//    navigator.geolocation.getCurrentPosition(geoSuccess, geoError); /* Initiate maps from GEO location */

    /** Catch form ajax requests **/
    $("form.ajax").submit(function(e) {
        e.preventDefault();
    });

    var animSpeed = 500;
    var menuWrapperWidth = $(".menuWrapper").width();

    $('input[type="range"]').rangeslider({
    });

    $("input[type='range']").on("change", function() {
        $("#radiusValue").html($(this).val()+"m");
        maps.setRadius($(this).val());
    });

    $("input[type='range']").on("touchend", function() {
        maps.radiusAfter();
    });

    $(".swiper-slide").on("touchstart", function() {
        if($(".menuWrapper").hasClass("visible")) {
            $(".menuWrapper").animate({left: '-'+menuWrapperWidth+'px'}, animSpeed);
            $(".menuWrapper").removeClass("visible");
        }
    });

/****************************************************/

    $("#menuIcon").on("touchend", function() {
        if($(".menuWrapper").hasClass("visible")) {
            $(".menuWrapper").animate({left: '-'+menuWrapperWidth+'px'}, animSpeed);
            $(".menuWrapper").removeClass("visible");
        } else {
            $(".menuWrapper").animate({left: '0'}, animSpeed);
            $(".menuWrapper").addClass("visible");
        }
    });

    /* Click events as touch events */

    $(".fixedProfile").on("touchend", function() {
        profileSwiper.swipeTo(0);
    });

    $("#changeProfileImage .green").on("touchend", function() {
        user.newProfileImage(camera.profileImage);
        $(this).slideToggle();
    });

    $("#changeProfileImage .pink").on("touchend", function() {
        camera.captureProfile();
    });

    $("#changeProfileImage .blue").on("touchend", function() {
        camera.galleryProfile();
    });

    $("form.login .loginSubmit").on("touchend", function() {
        user.login($("#username").val(), $("#password").val());
    });

    $("form.signup .loginSubmit").on("touchend", function() {
        user.create($('#createEmail').val(), $('#createUsername').val(), $('#createPassword').val(), $('#createPasswordTest').val());
    });

    $("form.forgotpassword .loginSubmit").on("touchend", function() {
        user.forgotPassword($('#forgotusername').val());
    });

    $(".profileNav #logout").on("touchend", function() {
        user.logout();
    });

    $("#changeName .toggle").on("touchend", function() {
        if($("#changeProfileImage .showChanger").is(":visible")) {
            $($("#changeProfileImage .showChanger")).animate({height: "toggle"}, "slow", function() {
                $("#changeName .showChanger").animate({height: "toggle"}, "slow");
            });
        } else {
            $("#changeName .showChanger").animate({height: "toggle"}, "slow");
        }
    });

    $("#changeProfileImage .toggle").on("touchend", function() {
        if($("#changeName .showChanger").is(":visible")) {
            $("#changeName .showChanger").animate({height: "toggle"}, "slow", function() {
                $("#changeProfileImage .showChanger").animate({height: "toggle"}, "slow");
            });
        } else {
            $("#changeProfileImage .showChanger").animate({height: "toggle"}, "slow");
        }
    });

    $("#changeName .green").on("touchend", function() {
        if($("#changeName .firstname").val().length > 0 && $("#changeName .lastname").val().length > 0) {
            user.newFullName($("#changeName .firstname").val(), $("#changeName .lastname").val());
        } else {
            toast("No empty fields, please");
        }
    });

    $(".absoluteLayEgg").on("touchend", function() {
        maps.pause();
        maps.saveCurrentPosition();
        camera.captureEgg();
    });

    $(".absoluteBottom .backEgg").on("touchend", function() {
        eggSwiper.swipeTo(0);
    });

    $("#start").on("touchend", function() {
        maps.init();
    });

    $("#stop").on("touchend", function() {
        maps.pause();
    });

    $(document).on("touchend", ".currentBackground .singleFriend", function(event) {
        if($(this).hasClass("active")) {
            $(this).attr("style", "");
            $(this).removeClass("active");
            maps.removeReciever($(this).attr("data-id"));
        } else {
            maps.addReciever($(this).attr("data-id"));
            $(this).attr("style","background: #f56f6c; opacity: 0.8;").addClass("active");
        }
    });

    $(".doLayEgg").on("touchend", function() {
        maps.doLayEgg();
    });
}
