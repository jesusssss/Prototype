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
        if(index == 1) {
            if(maps.drawnCollection === false) {
                maps.getAllEggs();
            }
        }
        if(index == 0) {
            /* If map slide active, initiate */
            maps.init();
        } else {
            /* Else pause tracking for battery and memory */
            maps.pause();
        }
      }
    });

    menuSwiper = $(".menu-swiper").swiper({
        mode: 'vertical',
        loop: false,
        resistance: '100%',
        noSwiping: true
    });

    eggSwiper = $(".swiper-layegg").swiper({
        mode: 'vertical',
        onlyExternal: true,
        resistance: '100%',
        noSwiping: true,
        onSlideChangeStart: function() {
            var index = eggSwiper.activeIndex;
        }
    });

    collectionSwiper = new Swiper('.swiper-collection',{
        onlyExternal: true,
        noSwiping: true,
        onSlideChangeStart: function(){
            var index = collectionSwiper.activeIndex;
        }
      });

      $(".tab").on('touchend',function(e){
          $(".tab").removeClass('active');
          $(this).addClass('active');
          collectionSwiper.swipeTo($(this).index());
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

    $(".swiper-container .swiper-slide").on("touchstart", function() {
        if($(".menuWrapper").hasClass("visible")) {
            $(".menuWrapper").animate({left: '-'+menuWrapperWidth+'px'}, animSpeed);
            $(".menuWrapper").removeClass("visible");
            maps.init();
        }
    });

    $(".gotoUserInformation").on("touchend", function() {
        menuSwiper.swipeTo(1);
    });

    $(".gotoFriendInvites").on("touchend", function() {
        menuSwiper.swipeTo(2);
    });

    $(".gotoProfilePicture").on("touchend", function() {
        menuSwiper.swipeTo(3);
    });

    $(".gotoSettings").on("touchend", function() {
        menuSwiper.swipeTo(4);
    });

    $(".gotoAddFriend").on("touchend", function() {
        menuSwiper.swipeTo(5);
    });

    $(".logout").on("touchend", function() {
        user.logout();
    });

    $(".menuBack").on("touchend", function() {
        menuSwiper.swipeTo(0);
    });

    $("#menuIcon").on("touchend", function() {
        if($(".menuWrapper").hasClass("visible")) {
            $(".menuWrapper").animate({left: '-'+menuWrapperWidth+'px'}, animSpeed);
            $(".menuWrapper").removeClass("visible");
            maps.init()
        } else {
            $(".menuWrapper").animate({left: '0'}, animSpeed);
            $(".menuWrapper").addClass("visible");
            maps.pause();
        }
    });

    $("#close").on("touchend", function() {
        $(".menuWrapper").animate({left: '-'+menuWrapperWidth+'px'}, animSpeed);
        $(".menuWrapper").removeClass("visible");
        maps.init();
    });

    $(".friends").on("touchend", function() {
        user.getFriendList();
    });
/****************************************************/
//    /* Click events as touch events */
//
//    $(".fixedProfile").on("touchend", function() {
//        profileSwiper.swipeTo(0);
//    });
//
    $("#savePicture").on("touchend", function() {
        user.newProfileImage(camera.profileImage);
        $(this).hide();
    });

    $("#capturePicture").on("touchend", function() {
        camera.captureProfile();
    });

    $("#fromGallery").on("touchend", function() {
        camera.galleryProfile();
    });
//
    $("#doLogin").on("touchend", function() {
        user.login($("#loginUsername").val(), $("#loginPassword").val());
    });

    $('#firstname, #loginUsername, #lastname, #loginPassword').keydown(function(e){
        if (e.which === 32) {
            e.preventDefault();
        }
    }).blur(function() {
        $(this).val(function(i,oldVal){ return oldVal.replace(/\s/g,''); });
    });

    $("#layEgg").on("touchend", function() {
        maps.pause();
        maps.saveCurrentPosition();
        camera.captureEgg();
    });

    $("#preBack").on("touchend", function() {
        maps.init();
        eggSwiper.swipeTo(0);
    });

    var dragging = false;

    $(".eggsByMe, .eggsToMe").on("touchstart", ".singleEgg", function() {
        dragging = false;
    });

    $(".eggsByMe, .eggsToMe").on("touchend", ".singleEgg", function() {
        if(dragging) {
            return;
        }
        var lat = $(this).data("lat");
        var lng = $(this).data("lng");
        var eggId = $(this).data("eggid");
        maps.viewEgg(lat, lng, eggId);
    });

    $(".eggsByMe, .eggsToMe").on("touchmove", function() {
        dragging = true;
    });

    $(".closeButton").on("touchend", function() {
        $(".tabs").show();
        collectionSwiper.swipeTo(1);
        $("#eggViewerMap").removeAttr("style");
        $(".eggViewerGift").removeAttr("style");
    });

    $("#eggViewerMap").on("touchend", function() {
        $(this).hide();
        $(".eggViewerGift").show();
    });

    $(".eggViewerGift").on("touchend", function() {
        $(this).hide();
        $("#eggViewerMap").show();
    });

    $(".pendingList").on("touchend", ".accept", function() {
        user.acceptFriend($(this).data("friendid"));
    });

    $(".pendingList").on("touchend", ".deny", function() {
        user.denyFriend($(this).data("friendid"));
    });

    $("#addFriend").on("touchend", function() {
        user.addFriend($("#requestFriend").val());
    });
//
//    $("form.signup .loginSubmit").on("touchend", function() {
//        user.create($('#createEmail').val(), $('#createUsername').val(), $('#createPassword').val(), $('#createPasswordTest').val());
//    });
//
//    $("form.forgotpassword .loginSubmit").on("touchend", function() {
//        user.forgotPassword($('#forgotusername').val());
//    });
//
//    $(".profileNav #logout").on("touchend", function() {
//        user.logout();
//    });
//
//    $("#changeName .toggle").on("touchend", function() {
//        if($("#changeProfileImage .showChanger").is(":visible")) {
//            $($("#changeProfileImage .showChanger")).animate({height: "toggle"}, "slow", function() {
//                $("#changeName .showChanger").animate({height: "toggle"}, "slow");
//            });
//        } else {
//            $("#changeName .showChanger").animate({height: "toggle"}, "slow");
//        }
//    });
//
//    $("#changeProfileImage .toggle").on("touchend", function() {
//        if($("#changeName .showChanger").is(":visible")) {
//            $("#changeName .showChanger").animate({height: "toggle"}, "slow", function() {
//                $("#changeProfileImage .showChanger").animate({height: "toggle"}, "slow");
//            });
//        } else {
//            $("#changeProfileImage .showChanger").animate({height: "toggle"}, "slow");
//        }
//    });
//
//    $("#changeName .green").on("touchend", function() {
//        if($("#changeName .firstname").val().length > 0 && $("#changeName .lastname").val().length > 0) {
//            user.newFullName($("#changeName .firstname").val(), $("#changeName .lastname").val());
//        } else {
//            toast("No empty fields, please");
//        }
//    });
//
//    $(".absoluteLayEgg").on("touchend", function() {
//        maps.pause();
//        maps.saveCurrentPosition();
//        camera.captureEgg();
//    });
//
//    $(".absoluteBottom .backEgg").on("touchend", function() {
//        eggSwiper.swipeTo(0);
//    });
//
//    $("#start").on("touchend", function() {
//        maps.init();
//    });
//
//    $("#stop").on("touchend", function() {
//        maps.pause();
//    });
//
    $(document).on("touchend", "#preFriendSelect .friendList .singleFriend", function(event) {
        if($(this).hasClass("active")) {
            $(this).attr("style", "");
            $(this).removeClass("active");
            maps.removeReciever($(this).attr("data-id"));
        } else {
            maps.addReciever($(this).attr("data-id"));
            $(this).attr("style","background: #6e7488;").addClass("active");
        }
    });
//
    $("#doLeyEgg").on("touchend", function() {
        maps.doLayEgg();
    });
}