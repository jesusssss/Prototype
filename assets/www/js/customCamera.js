
/************************ CAMREA ************************/
/* TODO */
//function capturePhoto() {
//  /* Take picture using device camera and retrieve image as base64-encoded string */
//  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
//    quality: 75,
//    destinationType: destinationType.DATA_URL,
//    correctOrientation: true,
//    targetWidth: 100,
//    targetHeight: 100,
//    saveToPhotoAlbum: false
//  });
//}
//
// function onPhotoDataSuccess(imageData) {
//      var smallImage = document.getElementById('smallImage');
//      $(".smallImage").show();
//      $(".smallImage").attr("src", "data:image/jpeg;base64," + imageData);
//}

//function onFail(message) {
//  alert('Failed because: ' + message);
//}

var cameraOb = function(DestinationType, PictureSourceType, MediaType) {
    this.destinationType = DestinationType;
    this.pictureSourceType = PictureSourceType;
    this.mediaType = MediaType;
    this.profileImage;
    this.cameraOptions = {
        quality: 100,
        destinationType: this.destinationType.DATA_URL,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
    }
    this.currentEgg;
    var that = this;

    this.captureProfile = function() {
        navigator.camera.getPicture(that.profileSuccess, that.profileFail, that.cameraOptions);
    }

    this.captureEgg = function() {
        navigator.camera.getPicture(that.eggSuccess, that.eggFail, that.cameraOptions);
    }

    this.eggSuccess = function(imageData) {
        eggSwiper.swipeTo(1);
        that.currentEgg = imageData;
        $(".currentBackground").css("background-image", "url('data:image/jpeg;base64," + imageData + "')");
    }

    this.eggFail = function() {
        toast("Error - please try again");
        maps.init();
    }

    this.galleryProfile = function() {
            navigator.camera.getPicture(that.profileSuccess, that.profileFail, {
                quality: 100,
                destinationType: this.destinationType.DATA_URL,
                targetWidth: 500,
                targetHeight: 500,
                correctOrientation: true,
                mediaType: this.mediaType.PICTURE,
                sourceType: this.pictureSourceType.SAVEDPHOTOALBUM
            });
        }

    this.profileSuccess = function(imageData) {
        that.profileImage = imageData;
        $("#changeProfileImage .profileImage").css("background-image", "url('data:image/jpeg;base64," + imageData + "')");
        if($("#changeProfileImage .green").is(":hidden")) {
            setTimeout(function() {
                $("#changeProfileImage .green").slideToggle();
            }, 1000);
        }
    }

    this.profileFail = function(message) {
        toast("Sorry, something went wrong. Please try again");
    }

}