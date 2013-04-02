/*=============================================
     self loading login manager

=============================================*/

window.addEventListener('load', function(){
    (function(){

        var g = {
            onLoginSuccess: function(){
                window.location = '/';
            },
            onRegisterSuccess: function(){
                var username = usernameInput.val();
                var password = passwordInput.val();

                login(username, password);
            },
            onRegisterFail: function(msg){
                alert(msg);
            },
            onLoginFail: function(msg){
                alert(msg);
            }
        }

        //==================
        //  API
        //==================

        window.LoginManager = {
            setLoginSuccess: function(callback){
                g.onLoginSuccess = callback;
            },
            setRegisterSuccess: function(callback){
                g.onRegisterSuccess = callback;
            },
            setRegisterFail: function(callback){
                g.onRegisterFail = callback;
            },
            setLoginFail: function(callback){
                g.onLoginFail = callback;
            }
        }

        //==================
        //  DOM
        //==================

        var loginButton = $('#loginButton');
        var registerButton = $('#registerButton');

        var usernameInput = $('#usernameInput');
        var passwordInput = $('#passwordInput');

        loginButton.onButtonTap(function(){
            var username = usernameInput.val();
            var password = passwordInput.val();

            login(username, password);
        });

        registerButton.onButtonTap(function(){
            var username = usernameInput.val();
            var password = passwordInput.val();

            register(username, password);
        });

        //==================
        //  server API
        //==================

        function login(username, password, done){
            var request = $.ajax({
                type: 'post',
                url: '/login',
                data: {
                    username: username, 
                    password: password 
                }
            });
            setupCallback(request, handleLoginResult);
        }

        function register(username, password, done){
            var request = $.ajax({
                type: 'post',
                url: '/register',
                data: {
                    username: username, 
                    password: password 
                }
            });
            setupCallback(request, handleRegisterResult);
        }

        function handleRegisterResult(err, result){
            if (err)
                throw err;
            if (result === 'ok'){
                g.onRegisterSuccess();
            }
            else
                g.onRegisterFail(result);
        }

        function handleLoginResult(err, result){
            if (err)
                throw err;
            if (result === 'ok')
                g.onLoginSuccess();
            else
                g.onLoginFail(result);
        }

        function setupCallback(request, done){
            request.done(function(data) {
                if (data.err !== undefined)
                    done(data.err, null);
                else
                    done(null, data);
            });
            request.fail(function(jqXHR, textStatus, err){
                done(err, null);
            });
        }
    })();
});

