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
      initialSlide: 1,
      onSlideChangeStart: function(){
                /* TODO: Fix pile der kommer frem til navigation */
          }
    });

    loginSwiper = $('.login-container').swiper({
          mode:'vertical',
          loop: false,
          resistance: '100%',
          noSwiping: true
        });

        $("#signup").on("touchstart", function() {
            loginSwiper.swipeTo(1);
        });
        $("#forgotPassword").on("touchstart", function() {
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

      $(".profileNav ul li").on("touchstart", function() {
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

/****************************************************/

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
}
