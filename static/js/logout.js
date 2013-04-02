/*=============================================
     self loading logout manager

=============================================*/

window.addEventListener('load', function(){
    (function(){

        var g = {
            handleLogoutResult: function(err, result){
                window.location = '/';
            }
        }

        //==================
        //  API
        //==================

        window.LogoutManager = {
            setHangleLogoutResult: function(callback){
                g.handleLogoutResult = callback;
            },
        }

        //==================
        //  DOM
        //==================

        var logoutButton = $('#logoutButton');

        logoutButton.onButtonTap(function(){
            var request = $.ajax({ type: 'post', url: '/logout'});
            setupCallback(request, g.handleLogoutResult);
        });

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

