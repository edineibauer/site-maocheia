function touchUp($el, distancia, distanciaAlvo, funcao) {
    let el = $el[0];
    distanciaAlvo*=-1;

    let elPosition = {
        startLeft: 0,
        startUp: 0,
        maxDown: 0,
        minBound: 70,
        moviment: -1,
        translateYStart: null,
        translateY: 0,
        lastMoviment: {
            up: -1,
            left: -1
        },
        allow: {
            up: !0,
            down: !0,
            left: !1,
            right: !1
        }
    };

    el.addEventListener("touchstart", (evt) => {
        let touches = evt.changedTouches[0];
        elPosition.startLeft = touches.pageX;
        elPosition.startUp = touches.pageY;
        elPosition.maxDown = window.innerHeight - elPosition.minBound - elPosition.startUp;
        elPosition.moviment = -1;
        elPosition.translateY = $el.css("transform");
        elPosition.translateY = elPosition.translateY === "none" ? 0 : parseInt(elPosition.translateY.replace("matrix(1, 0, 0, 1, 0, ", "").replace(")", ""));
        if(elPosition.translateYStart === null)
            elPosition.translateYStart = elPosition.translateY;

        elPosition.lastMoviment = {
            up: -1,
            left: -1
        };

        $el.addClass('touchElement touching');
    }, false);

    el.addEventListener("touchmove", evt => {
        evt.preventDefault();

        let touches = evt.changedTouches[0];

        if (elPosition.lastMoviment.up === -1) {
            elPosition.lastMoviment.up = touches.pageY;
            elPosition.lastMoviment.left = touches.pageX;
        } else if (elPosition.moviment === -1) {
            elPosition.moviment = (elPosition.lastMoviment.up === touches.pageY ? 'left' : 'up');
        } else {

            if (elPosition.moviment === 'up' && elPosition.allow.up) {
                let up = touches.pageY - elPosition.startUp;

                if ($el.hasClass("touchOpen") && up < -10)
                    up = -10;
                else if (!$el.hasClass("touchOpen") && up > 10)
                    up = 10;

                if (up < 0 && up < ((elPosition.startUp - elPosition.minBound) * -1))
                    up = (elPosition.startUp - elPosition.minBound) * -1;
                else if (up > 0 && up > elPosition.maxDown)
                    up = elPosition.maxDown;

                $el.css("transform", "translateY(" + (elPosition.translateY + up) + "px)");
            }

            if (elPosition.moviment === 'left' && elPosition.allow.left) {
                let left = touches.pageX - elPosition.startLeft;
                $el.css("transform", "translateX(" + left + "px)");
            }
        }
    }, false);

    el.addEventListener("touchend", evt => {
        let touches = evt.changedTouches[0];

        if (elPosition.moviment === 'up' && elPosition.allow.up) {
            let up = elPosition.startUp - touches.pageY;

            if (!$el.hasClass("touchOpen")) {

                if(distancia < up) {
                    $el.removeClass("touching").addClass("touchOpen").css({transform: "translateY(" + distanciaAlvo + "px)"});
                    if (typeof funcao === "function")
                        funcao();
                } else {
                    $el.removeClass("touching").css({transform: "translateY(" + elPosition.translateYStart + "px)"});
                }

            } else {

                if((distancia * -1) > up)
                    $el.removeClass("touching touchOpen").css({transform: "translateY(" + elPosition.translateYStart + "px)"});
                else
                    $el.removeClass("touching").css({transform: "translateY(" + distanciaAlvo + "px)"});
            }
        } else {
            $el.removeClass('touching').css({transform: "translateY(" + elPosition.translateY + "px)"});
        }
    }, false);

    el.addEventListener("touchcancel", () => {
        $el.removeClass('touching');
    }, false);

    el.addEventListener("touchleave", () => {
        $el.removeClass('touching');
    }, false);
}

$(function ($) {
    $.fn.touchUp = function (distancia, classe, funcao) {
        touchUp(this, distancia, classe, funcao);
        return this;
    };
});

function startSwipe() {
    $(".menu-swipe-class").touchUp(100, 450);

    changeSwipeToSearch();
}