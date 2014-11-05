var userOb = function() {
    this.id;
    this.username;
    this.password;
    this.profileImage;
    this.firstname;
    this.lastname;
    this.eggCount;
    this.isset = false;
    var that = this;

    this.init = function(id, username, password, profileImage, firstname, lastname, eggCount) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.profileImage = profileImage;
        this.firstname = firstname;
        this.lastname = lastname;
        this.eggCount = eggCount;
        this.isset = true;
    }

    this.login = function(user, pass) {
         $.ajax({ url: ajaxLocation+"login.php",
                 data: {
                    username: user,
                    password: pass
                    },
                 type: 'post',
                 success:
                 function(result) {
                      var result = $.parseJSON(result);
                      if(result.success === true) {
                        that.loginSuccess(result);
                      } else {
                        that.loginError();
                      }
                  }
            });

    }

    this.load = function() {
        var userSettings = JSON.parse(localStorage.getItem("user"));
        this.init(userSettings.id, userSettings.username, userSettings.password, userSettings.profileImage, userSettings.firstname, userSettings.lastname, userSettings.eggCount);
    }

    this.loginError = function() {
        toast("Error at login - try again");
    }

    this.create = function(email, username, password, passwordTest) {
        if(email == "" || username == "" || password == "" || passwordTest == "") {
            toast("Please fill out every field and try again");
        }
        if(password == passwordTest) {
            $.ajax({ url: ajaxLocation+"createUser.php",
                 data: {
                    email: email,
                    username: username,
                    password: password
                    },
                 type: 'post',
                 success:
                 function(result) {
                      var result = $.parseJSON(result);
                      if(result.success === true) {
                        toast("User has been created, please login");
                        loginSwiper.swipeTo(0);
                      } else {
                        toast("Username or Email already in use");
                      }
                  }
            });
        } else {
            toast("Passwords not matching");
        }
    }

    this.loginSuccess = function(result) {
    /** FETCH USER INFO **/
        $.ajax({ url: ajaxLocation+"getUserInfo.php",
             data: {
                id: result.id,
                hidden: 'xmp3f89e'
                },
             type: 'post',
             success:
             function(userData) {
                  userData = $.parseJSON(userData);
                  var userSettings = {"id": result.id,
                                      "username": result.username,
                                      "password": result.password,
                                      "profileImage": "data:image/jpeg;base64,"+userData.profileImage,
                                      "firstname": userData.firstname,
                                      "lastname": userData.lastname,
                                      "eggCount": userData.eggCount
                                    };
                  localStorage.setItem("user", JSON.stringify(userSettings));
                  that.load();
                  toast("Login success");
                  location.reload();
              }
        });
    }

    this.newProfileImage = function(imageData) {
        $.ajax({ url: ajaxLocation+"updateProfileImage.php",
             data: {
                id: this.id,
                image: imageData
                },
             type: 'post',
             success:
             function(userData) {

              }
        });

        var newSettings = {
            "id": this.id,
            "username": this.username,
            "password": this.password,
            "profileImage": "data:image/jpeg;base64,"+imageData,
            "firstname": this.firstname,
            "lastname": this.lastname,
            "eggCount": this.eggCount
        };
        localStorage.setItem("user", JSON.stringify(newSettings));
        this.load();
        this.refreshUser();
        toast("Profile image has been saved");
    }

    this.newFullName = function(firstname, lastname) {
        $.ajax({ url: ajaxLocation+"updateFullName.php",
             data: {
                id: this.id,
                firstname: firstname,
                lastname: lastname
                },
             type: 'post',
             success:
             function(userData) {

              }
        });
        var newSettings = {
            "id": this.id,
            "username": this.username,
            "password": this.password,
            "profileImage": this.profileImage,
            "firstname": firstname,
            "lastname": lastname,
            "eggCount": this.eggCount
        };
        localStorage.setItem("user", JSON.stringify(newSettings));
        this.load();
        this.refreshUser();
        toast("Your name has now changed");
    }

    this.refreshUser = function() {
        $(".profileImage").attr("style", "background-image: url('"+user.profileImage+"'); background-repeat: no-repeat; background-position: center center; background-size: cover;");
        $(".fullname").html(user.firstname + " " + user.lastname);
        $("div.username").html(user.username);
        $("div.firstname").html(user.firstname);
        $("div.lastname").html(user.lastname);
        $("input.firstname").val(user.firstname);
        $("input.lastname").val(user.lastname);
        $("input.username").val(user.username);
    }

    this.logout = function() {
        localStorage.clear();
        location.reload();
    }
}