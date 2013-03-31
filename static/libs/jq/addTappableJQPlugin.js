function addTappableJQPlugin(){

    $.fn.onButtonTap = function(tapCB, longCB){
        var down = function (){
            this.addClass('buttonDown');
        };
        var up = function (){
            this.removeClass('buttonDown');
        };
        this.ontap(down, up, tapCB, longCB);
    }

    $.fn.ontap = function(downCB, upCB, tapCB, longCB){
        if (downCB)
            downCB = downCB.bind(this);
        if (upCB)
            upCB = upCB.bind(this);
        if (tapCB)
            tapCB = tapCB.bind(this);

        var startx;
        var starty;
        
        var potentialTap;

        var down = function(x, y){
            startx = x;
            starty = y;
            potentialTap = true;
            if (downCB)
                downCB();

            if (longCB !== undefined)
                setTimeout(checkLong, 500);
        }

        var checkLong = function(){
            if (potentialTap){
                potentialTap = false;
                if (upCB)
                    upCB();
                setTimeout(downCB, 50);
                setTimeout(upCB, 100);
                setTimeout(longCB, 120);
            }
        }

        var move = function(x, y){
            if (potentialTap &&
                (window.Math.abs(x - startx) > 10 || 
                window.Math.abs(y - starty) > 10)){
                potentialTap = false;
                if (upCB)
                    upCB();
            }
        }

        var exit = function(){
            if (potentialTap){
                potentialTap = false;
                if (upCB)
                    upCB();
            }
        }

        var up = function(){
            if (potentialTap){
                if (upCB)
                    upCB();
                tapCB();
                potentialTap = false;
            }
        }

        if ('ontouchstart' in document.documentElement){

            this.on('touchstart', function(event){
                var x = event.originalEvent.touches[0].clientX;
                var y = event.originalEvent.touches[0].clientY;
                down(x, y);
            });
            this.on('touchend', function(event){
                up();
            });
            this.on('touchleave', function(event){
                exit();
            });
            this.on('touchmove', function(event){
                var x = event.originalEvent.touches[0].clientX;
                var y = event.originalEvent.touches[0].clientY;
                move(x, y);
            });
        }
        else {
            this.on('mousedown', function(event){
                down(event.clientX, event.clientY);
            });
            this.on('mouseout', function(event){
                exit();
            });
            this.on('mouseup', function(event){
                up();
            });
        }
    }
}


window.addEventListener('load', function(){
    addTappableJQPlugin();
});
