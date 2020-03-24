var popup, Popup;

function openMapPopup(marker) {
    if (marker.type === 2) {
        getTemplates().then(tpl => {
            //open popup
            Popup = createPopupClass();
            popup = new Popup(new google.maps.LatLng(marker.latitude, marker.longitude), $(Mustache.render(tpl.marker, marker)).appendTo("body")[0]);
            popup.setMap(map);
        });
    }
}

function closeMapPopup() {
    $('.popup-bubble').parent().parent().remove();
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

function moveToLocation(lat, lng){
    const center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
}

function addMarker(service, type, latitude, longitude) {
    let image = type === 1 ? "circulo" : "map-marker";
    let marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        map: map,
        draggable: !1,
        type: type,
        scrollwheel: true,
        service: service,
        id: service.id || 0,
        icon: HOME + VENDOR + 'site-maocheia/public/assets/svg/' + image + '.svg',
        latitude: latitude,
        longitude: longitude,
        animation: type === 1 ? null : google.maps.Animation.DROP
    });
    if(type > 1)
        marker.addListener('click', toogleServicePerfil);

    markers.push(marker);

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

var myMarker, markers = [], map;
function startMap() {

    /**
     * Minha posição
     */
    let latitude = -28.698626;
    let longitude = -49.403945;
    let myLatLng = {lat: latitude, lng: longitude};

    map = new google.maps.Map(document.getElementById('mapa-home'), {
        center: myLatLng,
        zoom: 14,
        styles: [
            {
                featureType: 'transit',
                elementType: 'labels.icon',
                stylers: [{visibility: 'off'}]
            },
            {
                featureType: 'poi',
                stylers: [{visibility: 'off'}]
            }
        ],
        disableDefaultUI: true
    });

    map.addListener('zoom_changed', function() {
        $("#procura").blur();
        $(".menu-swipe").removeClass("openFull");
        readServices();
    });
    map.addListener('click', function() {
        $("#procura").blur();
        changeSwipeToSearch();
    });
    map.addListener('mouseup', function() {
        $(".menu-swipe").removeClass("openFull");
        readServices();
    });

    /**
     * Minha posição atual
     */
    myMarker = addMarker({}, 1, latitude, longitude);
    moveToLocation(latitude, longitude);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
                if(position.coords.accuracy < 100) {
                    myMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    moveToLocation(position.coords.latitude, position.coords.longitude);
                }
            },
            function (error) { // callback de erro
                toast('Erro ao obter localização!', 3000, "toast-warning");
                console.log('Erro ao obter localização.', error);
            },{
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
    } else {
        console.log('Navegador não suporta Geolocalização!');
    }

    startSwipe();
}
