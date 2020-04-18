function touchVertical($el, distanciaAlvo, distancia, funcao, ignoreQueryElements) {
    $el.addClass('touchElement');
    let el = $el[0],
        elPosition = {
            $el: $el,
            startLeft: 0,
            startUp: 0,
            maxDown: 0,
            minBound: 70,
            moviment: -1,
            tracking: !1,
            ignoreQueryElements: ignoreQueryElements || [],
            translateY: $el.css("transform") === "none" ? 0 : parseInt($el.css("transform").replace("matrix(1, 0, 0, 1, 0, ", "").replace(")", "")),
            translateYStart: null,
            distanciaAlvo: distanciaAlvo,
            funcao: funcao,
            lastMoviment: {
                up: -1,
                left: -1
            },
            setDistancia: d => {
                elPosition.distancia = d;
                return elPosition;
            },
            setDistanciaStart: d => {
                elPosition.translateYStart = d;
                if (!elPosition.$el.hasClass("touchOpen"))
                    touchElements.menu.moveToStart();
                return elPosition;
            },
            setDistanciaTarget: d => {
                elPosition.distanciaAlvo = d;
                if (elPosition.$el.hasClass("touchOpen"))
                    touchElements.menu.moveToTarget();
                return elPosition;
            },
            stopMove: () => {
                elPosition.tracking = !1;
                return elPosition.$el.removeClass('touching');
            },
            moveToStart: () => {
                elPosition.moviment = -1;
                if (elPosition.translateYStart === null) {
                    elPosition.translateYStart = elPosition.translateY;
                    elPosition.distanciaAlvo += elPosition.translateYStart;
                }
                elPosition.stopMove().removeClass("touchOpen").css({transform: "translateY(" + elPosition.translateYStart + "px)"});
                return elPosition;
            },
            moveToTarget: () => {
                elPosition.moviment = -1;
                if (elPosition.translateYStart === null) {
                    elPosition.translateYStart = elPosition.translateY;
                    elPosition.distanciaAlvo += elPosition.translateYStart;
                }
                elPosition.stopMove().addClass("touchOpen").css({transform: "translateY(" + elPosition.distanciaAlvo + "px)"});
                return elPosition;
            },
            setFuncao: f => {
                elPosition.funcao = f;
                return elPosition;
            }
        };

    el.addEventListener("touchstart", (evt) => {

        let ignore = !1;
        let $target = $(evt.target);
        for (let i in elPosition.ignoreQueryElements) {
            if ($target.closest(elPosition.ignoreQueryElements[i]).length) {
                ignore = !0;
                break;

            } else if (/^#/.test(elPosition.ignoreQueryElements[i])) {
                if ($target.attr("id") === elPosition.ignoreQueryElements[i].replace("#", "")) {
                    ignore = !0;
                    break;
                }
            } else if (/^\./.test(elPosition.ignoreQueryElements[i])) {
                if ($target.hasClass(elPosition.ignoreQueryElements[i].replace(".", ""))) {
                    ignore = !0;
                    break;
                }
            }
        }

        if (ignore)
            return;

        let touches = evt.changedTouches[0];
        elPosition.tracking = !0;
        elPosition.startLeft = touches.pageX;
        elPosition.startUp = touches.pageY;
        elPosition.maxDown = window.innerHeight - elPosition.minBound - elPosition.startUp;
        elPosition.moviment = -1;
        elPosition.translateY = elPosition.$el.css("transform");
        elPosition.translateY = elPosition.translateY === "none" ? 0 : parseInt(elPosition.translateY.replace("matrix(1, 0, 0, 1, 0, ", "").replace(")", ""));
        if (elPosition.translateYStart === null) {
            elPosition.translateYStart = elPosition.translateY;
            elPosition.distanciaAlvo += elPosition.translateYStart;
        }

        elPosition.lastMoviment = {
            up: -1,
            left: -1
        };

        elPosition.$el.addClass('touching');
    }, false);

    el.addEventListener("touchmove", evt => {
        if (elPosition.tracking) {
            evt.preventDefault();

            let touches = evt.changedTouches[0];

            if (elPosition.lastMoviment.up === -1) {
                elPosition.lastMoviment.up = touches.pageY;
                elPosition.lastMoviment.left = touches.pageX;
            } else if (elPosition.moviment === -1) {
                elPosition.moviment = (elPosition.lastMoviment.up === touches.pageY ? 'left' : 'up');
            } else {

                if (elPosition.moviment === 'up') {
                    let up = touches.pageY - elPosition.startUp;

                    if (elPosition.$el.hasClass("touchOpen") && up < -10)
                        up = -10;
                    else if (!elPosition.$el.hasClass("touchOpen") && up > 10)
                        up = 10;

                    if (up < 0 && up < ((elPosition.startUp - elPosition.minBound) * -1))
                        up = (elPosition.startUp - elPosition.minBound) * -1;
                    else if (up > 0 && up > elPosition.maxDown)
                        up = elPosition.maxDown;

                    elPosition.$el.css("transform", "translateY(" + (elPosition.translateY + up) + "px)");
                }
            }
        }
    }, false);

    el.addEventListener("touchend", evt => {
        if (elPosition.tracking) {
            let touches = evt.changedTouches[0];

            if (elPosition.moviment === 'up') {
                let up = elPosition.startUp - touches.pageY;

                if (!elPosition.$el.hasClass("touchOpen")) {

                    if (distancia < up) {
                        elPosition.moveToTarget();
                        if (typeof elPosition.funcao === "function")
                            elPosition.funcao();
                    } else {
                        elPosition.stopMove().css({transform: "translateY(" + elPosition.translateY + "px)"});
                    }

                } else {

                    if ((distancia * -1) > up)
                        elPosition.moveToStart();
                    else
                        elPosition.stopMove().css({transform: "translateY(" + elPosition.translateY + "px)"});
                }
            } else {
                elPosition.stopMove().css({transform: "translateY(" + elPosition.translateY + "px)"});
            }
        }
    }, false);

    el.addEventListener("touchcancel", () => {
        elPosition.stopMove();
    }, false);

    el.addEventListener("touchleave", () => {
        elPosition.stopMove();
    }, false);

    return elPosition;
}

var touchElements = {};
$(function ($) {
    $.fn.touchVertical = function (apelido, position, swipeDistance, funcao, ignoreQueryElements) {
        touchElements[apelido] = touchVertical(this, position, swipeDistance, funcao, ignoreQueryElements);
        return this;
    };
});

function startSwipe() {
    $(".menu-swipe-class").touchVertical("menu", -450, 100, null, ["#services", "#service-perfil-body"]);
    changeSwipeToSearch();
}