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
                        var userSettings = {"id": result.id, "username": result.username, "password": result.password};
                        localStorage.setItem("user", JSON.stringify(userSettings));
                        that.loginSuccess();
                      } else {
                        that.loginError();
                      }
                  }
            });

    }

    this.loginError = function() {
        toast("Error at login - try again");
    }

    this.loginSuccess = function() {
        toast("Login success");
        location.reload();
    }

    this.getUsername = function() {
        return this.username;
    }

    this.getPassword = function() {
        return this.password;
    }

    this.logout = function() {
        localStorage.clear();
        location.reload();
    }
}