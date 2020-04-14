function touchUp($el, distancia, classe, funcao) {
    let el = $el[0];

    let elPosition = {
        startLeft: 0,
        startUp: 0,
        maxDown: 0,
        minBound: 70,
        allow: {
            up: !0,
            down: !0,
            left: !1,
            right: !1
        }
    };

    el.addEventListener("touchstart", (evt) => {
        evt.preventDefault();

        let touches = evt.changedTouches[0];
        elPosition.startLeft = touches.pageX;
        elPosition.startUp = touches.pageY;
        elPosition.maxDown = window.innerHeight - elPosition.minBound - elPosition.startUp;

        $el.addClass('touching');
    }, false);

    el.addEventListener("touchmove", evt => {
        let touches = evt.changedTouches[0];

        if (elPosition.allow.up) {
            let up = touches.pageY - elPosition.startUp;

            if($el.hasClass(classe) && up < -10)
                up = -10;
            else if(!$el.hasClass(classe) && up > 10)
                up = 10;

            if(up < 0 && up < ((elPosition.startUp - elPosition.minBound) * -1))
                up = (elPosition.startUp - elPosition.minBound) * -1;
            else if(up > 0 && up > elPosition.maxDown)
                up = elPosition.maxDown;

            $el.css("transform", "translateY(" + up + "px)");
        }

        if (elPosition.allow.left) {
            let left = touches.pageX - elPosition.startLeft;
            $el.css("transform", "translateX(" + left + "px)");
        }
    }, false);

    el.addEventListener("touchend", evt => {
        $el.removeClass('touching').css({transform: "translate(0, 0)", transition: "all ease .2s"});
        let touches = evt.changedTouches[0];

        if (elPosition.allow.up) {
            let up = elPosition.startUp - touches.pageY;

            if (distancia < up && !$el.hasClass(classe)) {
                $el.addClass(classe);
                if(typeof funcao === "function")
                    funcao();

            } else if ((distancia*-1) > up && $el.hasClass(classe)) {
                $el.removeClass(classe);
            }
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
    $(".menu-swipe-class").touchUp(100, "openFull");

    changeSwipeToSearch();
}