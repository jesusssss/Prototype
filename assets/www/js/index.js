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
    /* Set variables for Camera */
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

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

        $("#signup").on("click", function() {
            loginSwiper.swipeTo(1);
        });
        $("#forgotPassword").on("click", function() {
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

      $(".profileNav ul li").on("click", function() {
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

    $(".fixedProfile").on("click", function() {
        profileSwiper.swipeTo(0);
    });
}
