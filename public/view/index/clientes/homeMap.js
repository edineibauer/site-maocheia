function openMapPopup(marker) {
    if (marker.type === 2) {

        for (let i in markers) {
            if (markers[i].type > 1) {
                if (/serviceSelected$/.test(markers[i].icon.url))
                    markers[i].setIcon({
                        url: markers[i].service.perfil_profissional.categoriaImage + "?i=service" + (markers[i].service.online ? "Online" : ""),
                        scaledSize: new google.maps.Size(32, 32),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(16, 16)
                    });
            }
        }

        //open popup
        /*

        //Centraliza mapa entre o target e a posição atual
        let bounds = new google.maps.LatLngBounds();
        let latlng = new google.maps.LatLng(marker.latitude, marker.longitude);
        let latlngMy = new google.maps.LatLng(myMarker.latitude, myMarker.longitude);

        bounds.extend(latlng);
        bounds.extend(latlngMy);
        map.fitBounds(bounds, {top: 60, right: 50, left: 50, bottom: 230});*/

        marker.setAnimation(4);
        marker.setIcon({
            url: marker.service.perfil_profissional.categoriaImage + "?i=serviceSelected",
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16)
        });

        /*var request = {
            origin: latlngMy,
            destination: latlng,
            travelMode: google.maps.TravelMode.DRIVING
        };

        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        });*/
    }
}

function closeMapPopup() {
    for (let i in markers) {
        if (markers[i].type > 1) {
            if (/serviceSelected$/.test(markers[i].icon.url))
                markers[i].setIcon({
                    url: markers[i].service.perfil_profissional.categoriaImage + "?i=service" + (markers[i].service.online ? "Online" : ""),
                    scaledSize: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(16, 16)
                });
        }
    }

    $("#background-perfil").addClass("hiden-background");
    setTimeout(function () {
        changeSwipeToSearch();
        $("#background-perfil").removeClass("hiden-background");
    }, 300);
}

function closeAllMapPopupExceptThis(marker) {
    $.each($('.popup-bubble'), function (i, v) {
        let id = $(v).attr("id");
        if (marker.id != id)
            $(v).parent().parent().remove();
    })
}

function resetMap() {
    map.setZoom(12);
    centerMap();
}

function centerMap() {
    const center = new google.maps.LatLng(myMarker.latitude, myMarker.longitude);
    map.panTo(center);
}

function moveToLocation(lat, lng) {
    myMarker.latitude = lat;
    myMarker.longitude = lng;
    centerMap();
}

function addMarker(service, type, latitude, longitude) {
    let image = null;

    if (type === 1) {
        image = {
            url: HOME + 'public/assets/svg/circulo.svg?i=ignore',
            size: new google.maps.Size(20, 20),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 10)
        };
    } else {
        image = {
            url: service.perfil_profissional.categoriaImage + "?i=service" + (service.online ? "Online" : ""),
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16)
        };
    }

    let marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        zIndex: (type === 1 ? 100000 : service.distancia*100),
        map: map,
        draggable: !1,
        type: type,
        scrollwheel: true,
        service: service,
        id: service.id || 0,
        icon: image,
        width: 50,
        height: 56,
        latitude: latitude,
        longitude: longitude,
        animation: type === 1 || 1 === 1 ? null : google.maps.Animation.DROP
    });

    if (type > 1) {
        marker.addListener('click', toogleServicePerfil);
        // markerCluster.addMarker(marker);
        markers.push(marker);
    }

    return marker;
}

function getZoomToKm(zoom) {
    let maior = ((window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth) / 2);

    switch (zoom) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            return parseFloat((maior * 800) / 230).toFixed(2);
        case 6:
            return parseFloat((maior * 400) / 230).toFixed(2);
        case 7:
            return parseFloat((maior * 160) / 230).toFixed(2);
        case 8:
            return parseFloat((maior * 100) / 230).toFixed(2);
        case 9:
            return parseFloat((maior * 50) / 230).toFixed(2);
        case 10:
            return parseFloat((maior * 26) / 230).toFixed(2);
        case 11:
            return parseFloat((maior * 12.5) / 230).toFixed(2);
        case 12:
            return parseFloat((maior * 6.4) / 230).toFixed(2);
        case 13:
            return parseFloat((maior * 3.4) / 230).toFixed(2);
        case 14:
            return parseFloat((maior * 1.6) / 230).toFixed(2);
        case 15:
            return parseFloat((maior * .83) / 230).toFixed(2);
        case 16:
            return parseFloat((maior * .4) / 230).toFixed(2);
        case 17:
            return parseFloat((maior * .2) / 230).toFixed(2);
        case 18:
            return parseFloat((maior * .1) / 230).toFixed(2);
        case 19:
            return parseFloat((maior * .055) / 230).toFixed(2);
        case 20:
            return parseFloat((maior * .03) / 230).toFixed(2);
        case 21:
            return parseFloat((maior * .015) / 230).toFixed(2);
        case 22:
            return parseFloat((maior * .01) / 230).toFixed(2);
        default:
            return 10;
    }
}

function updateMyPosition(lat, lng) {
    myMarker.setPosition(new google.maps.LatLng(lat, lng));
    moveToLocation(lat, lng);
}

/**
 * Return a position lat, lng from the user
 */
function getPosition() {
    return [(!isEmpty(USER.setorData.latitude) ? parseFloat(USER.setorData.latitude) : -28.679831), (!isEmpty(USER.setorData.longitude) ? parseFloat(USER.setorData.longitude) : -49.350881)];
}

async function addService(data) {
    servicesOnMap.push(data);

    /**
     * Add on map
     */
    addMarker(data, 2, parseFloat(data.latitude), parseFloat(data.longitude));
}

async function updateService(service, data) {
    service = data;

    for(let m in markers) {
        if(typeof markers[m] === "object" && markers[m].service.id == service.id) {
            markers[m].service = service;
            markers[m].setPosition(new google.maps.LatLng(service.latitude, service.longitude));
            markers[m].setIcon({
                url: markers[m].service.perfil_profissional.categoriaImage + "?i=service" + (markers[m].service.online ? "Online" : ""),
                scaledSize: new google.maps.Size(32, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(16, 16)
            });
            break;
        }
    }
}

function removeService(i, id) {
    servicesOnMap.splice(i, 1);
    /**
     * Remove from map
     */
    for(let m in markers) {
        if(typeof markers[m] === "object" && markers[m].service.id == id) {
            markers[m].setMap(null);
            delete (markers[m]);
        }
    }
}

async function updateViewReal(data) {

    services = [];
    if(!isEmpty(data)) {
        let categories = await db.exeRead("categorias");
        let subcategorias = await db.exeRead("categorias_sub");
        let minhaLatlng = map.getCenter();

        for(let d of data) {
            d.distancia = getLatLngDistance(d.latitude, d.longitude, minhaLatlng.lat(), minhaLatlng.lng());
            services.push(getProfissionalMustache(d, categories.find(s => s.id == d.perfil_profissional.categoria), subcategorias));
        }
    }

    showServices();
}

async function startMap() {
    let myPosition = getPosition();
    let haveMapStartedBefore = !!map;

    /**
     * Minha posição
     */
    map = new google.maps.Map(document.getElementById('mapa-home'), {
        center: {lat: myPosition[0], lng: myPosition[1]},
        zoom: 12,
        gestureHandling: "greedy",
        styles: [
            {
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ],
        disableDefaultUI: true
    });
    // markerCluster = new MarkerClusterer(map, [], {
    //     gridSize: 5,
    //     imagePath: HOME + 'public/assets/maps/m'
    // });

    map.addListener('zoom_changed', function () {
        $("#procura").blur();
        touchElements.moveToStart();
    });
    map.addListener('click', function () {
        $("#procura").blur();
        changeSwipeToSearch();
    });

    map.addListener('drag', function () {
        $("#procura").blur();
        changeSwipeToSearch();
    });

    map.addListener('mousedown', function () {
        touchElements.moveToStart();
        if ($("#location-box").hasClass("active"))
            $("#location-btn").trigger("click");
    });

    /**
     * Seta meu marker no mapa
     */
    myMarker = addMarker({}, 1, myPosition[0], myPosition[1]);
    moveToLocation(myPosition[0], myPosition[1]);

    if(!haveMapStartedBefore) {
        sseAdd("realTimeInfo", updateViewReal);
    } else if(!isEmpty(services)) {
        servicesOnMap = [];
        showServices();
    }

    /**
     * Ações de arrate do menu
     * @type {TouchUp}
     */
    touchElements = new TouchUp($(".menu-swipe-class"), 450, 100, null, null, ["#profissionais", "#service-perfil-body", "#serviceMensagem", "#categorias", "#subcategorias", "#arrowback-perfil"]);
    touchElements.setFuncaoToStart(function (touch, $div) {
        $div.animate({
            scrollTop: 0
        }, 100);
    });

    changeSwipeToSearch();
}