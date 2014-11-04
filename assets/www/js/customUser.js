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
    alert(result.id);
        $.ajax({ url: ajaxLocation+"getUserInfo.php",
             data: {
                id: result.id,
                hidden: 'xmp3f89e'
                },
             type: 'post',
             success:
             function(userData) {
                  userData = $.parseJSON(userData);
                  alert(userData.firstname);
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

    this.logout = function() {
        localStorage.clear();
        location.reload();
    }
}