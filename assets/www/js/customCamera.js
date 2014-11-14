
/************************ CAMREA ************************/
var cameraOb = function(DestinationType, PictureSourceType, MediaType) {
    this.destinationType = DestinationType;
    this.pictureSourceType = PictureSourceType;
    this.mediaType = MediaType;
    this.profileImage;

    /* Global camera options - will not be used */
    this.cameraOptions = {
        quality: 30,
        destinationType : this.destinationType.DATA_URI,
          sourceType : this.pictureSourceType.CAMERA,
          targetWidth: 100,
          targetHeight: 100
    }
    this.currentEgg;
    var that = this;

    /* When capturing new profile image this function will run */
    this.captureProfile = function() {
        navigator.camera.getPicture(that.profileSuccess, that.profileFail, { quality: 50,
           destinationType: Camera.DestinationType.DATA_URL,
           targetHeight: 400,
           targetWidth: 400,
           correctOrientation: true
           });
    }

    /* When capturing new egg this function will run */
    this.captureEgg = function() {
        navigator.camera.getPicture(that.eggSuccess, that.eggFail, { quality: 100,
              destinationType: Camera.DestinationType.DATA_URL,
              targetHeight: 800,
              targetWidth: 800,
              correctOrientation: true
          });
    }

    /* On success from camera on laying egg */
    this.eggSuccess = function(imageData) {
        eggSwiper.swipeTo(1);
        that.currentEgg = imageData;
        maps.drawPreLocation();
        that.drawPreImage();
    }

    /* Drawing preview of camera image to DOM */
    this.drawPreImage = function() {
        $("#preImage").css("background-image", "url('data:image/jpeg;base64," + that.currentEgg + "')");
    }

    /* Will run if camera is shutdown or cancelled */
    this.eggFail = function() {
        toast("Error - please try again");
        maps.init();
    }

    /* When trying to get picture from gallery */
    this.galleryProfile = function() {
            navigator.camera.getPicture(that.profileSuccess, that.profileFail, {
                quality: 50,
                destinationType: this.destinationType.DATA_URL,
                correctOrientation: true,
                targetHeight: 300,
                targetWidth: 300,
                mediaType: this.mediaType.PICTURE,
                sourceType: this.pictureSourceType.SAVEDPHOTOALBUM
            });
        }

    /* When successfully getting image to profile image */
    this.profileSuccess = function(imageData) {
        that.profileImage = imageData;
        $(".picturePreview").css("background-image", "url('data:image/jpeg;base64,"+ imageData + "')");
        if($("#savePicture").is(":hidden")) {
            $("#savePicture").show();
        }
    }

    /* Whill run if camera is shutdown or cancelled */
    this.profileFail = function(message) {
        toast("Sorry, something went wrong. Please try again");
    }

}