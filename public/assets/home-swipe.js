/**
 * Returns the Popup class.
 *
 * Unfortunately, the Popup class can only be defined after
 * google.maps.OverlayView is defined, when the Maps API is loaded.
 * This function should be called by initMap.
 */
function createPopupClass() {
    /**
     * A customized popup on the map.
     * @param {!google.maps.LatLng} position
     * @param {!Element} content The bubble div.
     * @constructor
     * @extends {google.maps.OverlayView}
     */
    function Popup(position, content) {
        this.position = position;

        content.classList.add('popup-bubble');

        // This zero-height div is positioned at the bottom of the bubble.
        var bubbleAnchor = document.createElement('div');
        bubbleAnchor.classList.add('popup-bubble-anchor');
        bubbleAnchor.appendChild(content);

        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('popup-container');
        this.containerDiv.appendChild(bubbleAnchor);

        // Optionally stop clicks, etc., from bubbling up to the map.
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
    }

    // ES5 magic to extend google.maps.OverlayView.
    Popup.prototype = Object.create(google.maps.OverlayView.prototype);

    /** Called when the popup is added to the map. */
    Popup.prototype.onAdd = function () {
        this.getPanes().floatPane.appendChild(this.containerDiv);
    };

    /** Called when the popup is removed from the map. */
    Popup.prototype.onRemove = function () {
        if (this.containerDiv.parentElement) {
            this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
    };

    /** Called each frame when the popup needs to draw itself. */
    Popup.prototype.draw = function () {
        var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

        // Hide the popup when it is far out of view.
        var display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
                'block' :
                'none';

        if (display === 'block') {
            this.containerDiv.style.left = divPosition.x + 'px';
            this.containerDiv.style.top = divPosition.y + 'px';
        }
        if (this.containerDiv.style.display !== display) {
            this.containerDiv.style.display = display;
        }
    };

    return Popup;
}

/**
 * swipeContent
 * @param $menu
 */
function swipeContent($menu) {
    if (window.innerWidth < 900) {
        let $menuparent = $menu.closest(".menu-swipe-class");

        $menu.swipe({
            swipeStatus: function (event, phase, direction, distance) {
                if (typeof event.targetTouches === "undefined")
                    return;

                if (event.targetTouches.length === 1 && !$(event.targetTouches[0].target).hasClass("form-control") && $(".form-control").is(":focus"))
                    $(".form-control").blur();

                if (phase == 'start')
                    $menuparent.addClass('moving');

                if (phase == 'move') {
                    if (direction == 'up') {

                        if($menuparent.scrollTop() === 0 && $menuparent.hasClass("openFull")) {
                            $menu.swipe("disable");
                            setTimeout(function () {
                                $menuparent.removeClass("moving").css({bottom: 50});
                            },1);
                        }

                        let up = Math.abs(distance);
                        up = ($menuparent.hasClass("openFull") && up > 20 ? 20 : ($menuparent.hasClass("open") && up > 320 ? 320 : (up > 500 ? 500 : up)));
                        $menuparent.css({bottom: up + 50});
                    } else if (direction === "down") {
                        $menuparent.css({bottom: -Math.abs(distance) + 50})
                    }
                }

                if ($menuparent.hasClass("moving") && (phase == 'end' || phase == 'cancel')) {
                    let bottom = parseInt($menuparent.css('bottom'));
                    $menuparent.removeClass('moving close').addClass('open').css({bottom: "50px"});

                    if (direction == 'down') {
                        if (bottom < 20) {
                            if (bottom > -290 && $menuparent.hasClass("openFull")) {
                                if ($menuparent.hasClass("servicePerfil"))
                                    closeFullPerfil();
                                else
                                    $menuparent.removeClass("openFull");
                            } else {
                                if ($menuparent.hasClass("servicePerfil"))
                                    closeFullPerfil();

                                swipe.close($menuparent.attr("id"));
                            }
                        }
                    } else {
                        if (bottom > 75) {
                            if ($menuparent.hasClass("servicePerfil"))
                                openFullPerfil();
                            else
                                $menuparent.addClass("openFull");
                        }
                    }
                }
            }
        });
    }
}

/**
 * Controle do swipe move
 * @param $menu
 */
function swipeMenuEvent($menu) {
    if (window.innerWidth < 900) {
        $menu.find(".swipe-line").swipe({
            swipeStatus: function (event, phase, direction, distance) {
                if (typeof event.targetTouches === "undefined")
                    return;

                if (event.targetTouches.length === 1 && !$(event.targetTouches[0].target).hasClass("form-control") && $(".form-control").is(":focus"))
                    $(".form-control").blur();

                if (phase == 'start')
                    $menu.addClass('moving');

                if (phase == 'move') {
                    if (direction == 'up') {
                        let up = Math.abs(distance);
                        up = ($menu.hasClass("openFull") && up > 20 ? 20 : ($menu.hasClass("open") && up > 320 ? 320 : (up > 500 ? 500 : up)));
                        $menu.css({bottom: up + 50});
                    } else if (direction === "down") {
                        $menu.css({bottom: -Math.abs(distance) + 50})
                    }
                }

                if ($menu.hasClass("moving") && (phase == 'end' || phase == 'cancel')) {
                    let bottom = parseInt($menu.css('bottom'));
                    $menu.removeClass('moving close').addClass('open').css({bottom: "50px"});

                    if (direction == 'down') {
                        if (bottom < 20) {
                            if (bottom > -290 && $menu.hasClass("openFull")) {
                                if ($menu.hasClass("servicePerfil"))
                                    closeFullPerfil();
                                else
                                    $menu.removeClass("openFull");
                            } else {
                                if ($menu.hasClass("servicePerfil"))
                                    closeFullPerfil();

                                swipe.close($menu.attr("id"));
                            }
                        }
                    } else {
                        if (bottom > 75) {
                            if ($menu.hasClass("servicePerfil"))
                                openFullPerfil();
                            else
                                $menu.addClass("openFull");
                        }
                    }
                }
            }
        });
    } else {
        $(".swipe-line").off("click").on("click", function () {
            swipe.close($(this).attr("rel"));
        });
    }
}

function startSwipe() {
    swipe = new Swipe();
    swipe.setFunctionClose("closeMapPopup");

    if (typeof history.state.param.service !== "undefined" && history.state.param.service !== null && !isEmpty(history.state.param.service)) {
        changeSwipeToService(history.state.param.service);
        openFullPerfil();
    } else {
        changeSwipeToSearch();
        swipe.open();
    }
}

var Swipe = class {
    constructor() {
        this.functionClose = "";
        this.functionOpen = "";
        let $swipe = $('.menu-swipe');
        $swipe.addClass('close');
        $.each($swipe, function (i, v) {
            swipeMenuEvent($(v))
        });
    }

    setFunctionClose(funcao) {
        if (typeof funcao === "string")
            this.functionClose = window[funcao];
        else if (typeof funcao === "function")
            this.functionClose = funcao;
    }

    setFunctionOpen(funcao) {
        if (typeof funcao === "string")
            this.functionOpen = window[funcao];
        else if (typeof funcao === "function")
            this.functionOpen = funcao;
    }

    open(idMenu) {
        let $swipe = typeof idMenu !== "undefined" ? $("#" + idMenu + ".menu-swipe") : $(".menu-swipe");
        $swipe.removeClass('close openFull').addClass('open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
            $swipe.removeClass('moving close')
        });

        if (typeof this.functionOpen === "function")
            this.functionOpen();
    }

    close(idMenu) {
        let $swipe = typeof idMenu !== "undefined" ? $("#" + idMenu + ".menu-swipe") : $(".menu-swipe");
        $swipe.removeClass('moving open openFull').addClass('close');

        if (typeof this.functionClose === "function")
            this.functionClose();
    }
}, swipe;