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

    var loginSwiper = $('.login-container').swiper({
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

    $(".tabs a").on('touchstart mousedown',function(e){
        e.preventDefault();
        $(".tabs .active").removeClass('active');
        $(this).addClass('active');
        mySwiper.swipeTo( $(this).index() );
      })
      $(".tabs a").click(function(e){
        e.preventDefault();
      });

//    /* Init Geolocation - first */
//    var options = { timeout: 30000 };
//    navigator.geolocation.getCurrentPosition(geoSuccess, geoError); /* Initiate maps from GEO location */

    /** Catch form ajax requests **/
    $("form.ajax").submit(function(e) {
        e.preventDefault();
    });
}
