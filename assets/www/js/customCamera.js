
/************************ CAMREA ************************/
/* TODO */
function capturePhoto() {
  /* Take picture using device camera and retrieve image as base64-encoded string */
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 75,
    destinationType: destinationType.DATA_URL,
    correctOrientation: true,
    targetWidth: 100,
    targetHeight: 100,
    saveToPhotoAlbum: false
  });
}

 function onPhotoDataSuccess(imageData) {
      var smallImage = document.getElementById('smallImage');
      $(".smallImage").show();
      $(".smallImage").attr("src", "data:image/jpeg;base64," + imageData);
}

function onFail(message) {
  alert('Failed because: ' + message);
}