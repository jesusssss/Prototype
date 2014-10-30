var userOb = function() {
    this.id;
    this.username;
    this.password;
    this.isset = false;
    var that = this;

    this.init = function(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
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
                        that.init(result.id, result.username, result.password);
                        that.loginSuccess(result);
                      } else {
                        that.loginError();
                      }
                  }
            });

    }

    this.load = function() {
        var userSettings = JSON.parse(localStorage.getItem("user"));
        this.init(userSettings.id, userSettings.username, userSettings.password);
    }

    this.loginError = function() {
        toast("Error at login - try again");
    }

    this.loginSuccess = function(result) {
        var userSettings = {"id": result.id, "username": result.username, "password": result.password};
        localStorage.setItem("user", JSON.stringify(userSettings));
        toast("Login success");
        location.reload();
    }

    this.logout = function() {
        localStorage.clear();
        location.reload();
    }
}