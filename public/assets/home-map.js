var popup, Popup;

function openMapPopup(marker) {
    if (marker.type === 2) {
        getTemplates().then(tpl => {
            //open popup
            let bounds = new google.maps.LatLngBounds();
            let latlng = new google.maps.LatLng(marker.latitude, marker.longitude);
            let latlngMy = new google.maps.LatLng(myMarker.latitude, myMarker.longitude);

            bounds.extend(latlng);
            bounds.extend(latlngMy);
            map.fitBounds(bounds, {top: 60, right: 50, left: 50, bottom: 230});

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
        });
    }
}

function closeMapPopup() {
    for (let i in markers) {
        if (markers[i].type > 1) {
            if (/serviceSelected$/.test(markers[i].icon.url))
                markers[i].setIcon({
                    url: markers[i].service.perfil_profissional.categoriaImage + "?i=service" + (markers[i].service.perfil_profissional.online ? "Online" : ""),
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

function moveToLocation(lat, lng) {
    myMarker.latitude = lat;
    myMarker.longitude = lng;
    const center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
}

function addMarker(service, type, latitude, longitude) {
    let image = null;

    if (type === 1) {
        image = {
            url: HOME + VENDOR + 'site-maocheia/public/assets/svg/circulo.svg?i=ignore',
            size: new google.maps.Size(28, 28),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(14, 14)
        };
    } else {
        image = {
            url: service.perfil_profissional.categoriaImage + "?i=service" + (service.perfil_profissional.online ? "Online" : ""),
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16)
        };
    }

    let marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
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
        markerCluster.addMarker(marker);
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

var myMarker, markers = [], markerCluster = null, map, mapMoveTrack;

function startMap() {

    /**
     * Minha posição
     */
    let latitude = -28.679831;
    let longitude = -49.350881;
    let myLatLng = {lat: latitude, lng: longitude};

    map = new google.maps.Map(document.getElementById('mapa-home'), {
        center: myLatLng,
        zoom: 13,
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
    markerCluster = new MarkerClusterer(map, [], {
        gridSize: 10,
        imagePath: HOME + VENDOR + 'site-maocheia/public/assets/maps/m'
    });

    map.addListener('zoom_changed', function () {
        $("#procura").blur();
        $(".menu-swipe").removeClass("touchOpen");
        readServices();
    });
    map.addListener('click', function () {
        $("#procura").blur();
        changeSwipeToSearch();
    });

    map.addListener('mousedown', function () {
        $(".menu-swipe").removeClass("touchOpen");
        if($("#location-box").hasClass("active"))
            $("#location-btn").trigger("click");
    });

    map.addListener('drag', function () {
        clearTimeout(mapMoveTrack);
        mapMoveTrack = setTimeout(function () {
            readServices();
        }, 200);
    });

    /**
     * Minha posição atual
     */
    myMarker = addMarker({}, 1, latitude, longitude);
    moveToLocation(latitude, longitude);

    if (navigator.geolocation) {
        navigator.permissions.query({name: 'geolocation'}).then(permissionGeo => {
            switch (permissionGeo.state) {
                case "granted":
                    navigator.geolocation.getCurrentPosition(position => {
                            myMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                            moveToLocation(position.coords.latitude, position.coords.longitude);
                            readAllServices();
                        },
                        () => {
                            toast("Erro ao obter localização", 2000, "toast-warning");
                            readAllServices(1);
                        }, {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                        });
                    break;
                default:
                    //não aceitou mostrar a localização
                    readAllServices(1);
            }
        });
    } else {
        readAllServices(1);
        toast("Seu endereço precisa ser informado manualmente, pois o aparelho não tem suporte para localização.", 3000, "toast-warning");
    }
    startSwipe();
}