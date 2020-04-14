function touchUp($el, classOrigem, classDestino, activationDistance) {
    let el = $el[0];

    let elPosition = {
        "startLeft": 0,
        "startUp": 0,
        "allow": {
            "up": !0,
            "down": !0,
            "left": !1,
            "right": !1
        },
        "position": $el.css("position"),
        "positionLeft": $el.css("left"),
        "positionTop": $el.css("top"),
        "top": 0,
        "left": 0
    };

    el.addEventListener("touchmove", evt => {
        let touches = evt.changedTouches[0];

        if (elPosition.allow.up) {
            let up = touches.pageY - elPosition.startUp;
            $el.css("transform", "translateY(" + up + "px)");
        }
        if (elPosition.allow.left) {
            let left = touches.pageX - elPosition.startLeft;
            $el.css("transform", "translateX(" + left + "px)");
        }
    }, false);
    el.addEventListener("touchstart", (evt) => {
        evt.preventDefault();

        let touches = evt.changedTouches[0];
        elPosition.startLeft = touches.pageX;
        elPosition.startUp = touches.pageY;
        elPosition.top = $el.offset().top;
        elPosition.left = $el.offset().left;

        $el.addClass('touching');
    }, false);

    el.addEventListener("touchend", evt => {
        $el.removeClass('touching').css({transform: "translate(0, 0)", transition: "all ease .2s"});
        let touches = evt.changedTouches[0];

        if (elPosition.allow.up) {
            let up = elPosition.startUp - touches.pageY;
            if (activationDistance < up && $el.hasClass(classOrigem) && !$el.hasClass(classDestino))
                $el.addClass(classDestino).removeClass(classOrigem);
            else if (activationDistance > up && $el.hasClass(classDestino) && !$el.hasClass(classOrigem))
                $el.addClass(classOrigem).removeClass(classDestino);
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
    $.fn.touchUp = function (classOrigem, classDestino, actionDistance) {
        touchUp(this, classOrigem, classDestino, actionDistance);
        return this;
    };
});

function startSwipe() {
    if (window.innerWidth < 900)
        $(".menu-swipe-class").touchUp("open", "openFull", 100);

    if (typeof history.state.param.service !== "undefined" && history.state.param.service !== null && !isEmpty(history.state.param.service)) {
        changeSwipeToService(history.state.param.service);
        openFullPerfil();
    } else {
        changeSwipeToSearch();
    }
}